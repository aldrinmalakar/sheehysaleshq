/* ============================================================
   SHEEHY SALES HQ - Funnel live-call + voicemail voice

   Purpose:
   - Make phone scripts sound spoken, memorable and commercially useful.
   - Keep the actual customer question in the voicemail instead of teasing it.
   - Use "Aldrin, like Buzz Aldrin" as a first-voicemail memory hook only when
     the agent field is actually Aldrin.
   - Preserve behavior, attempt cadence, verification and DNC controls created
     by the earlier Funnel layers.

   Spoken pattern:
   identify -> exact reason -> actual question -> next step -> stop.
============================================================ */
(function(g){
'use strict';
var F=g.SHQFunnel;if(!F||!Array.isArray(F.scenarios))return;
var priorResolve=typeof F.resolveScenario==='function'?F.resolveScenario:null;

function clone(o){var x={};Object.keys(o||{}).forEach(function(k){x[k]=o[k];});return x;}
function stage(ctx){return ctx&&ctx.stage?ctx.stage:(document.getElementById('stageSelect')||{}).value||'';}
function behavior(raw){return raw&&raw.id?raw.id:(document.getElementById('behavior')||{}).value||'';}
function agentIsAldrin(){var e=document.querySelector('[data-f="agent"]'),v=e&&e.value?e.value.trim().toLowerCase():'';return !v||v==='aldrin';}
function customerFacing(s){var x=String(s||'').trim();return !!x&&!/^(STOP|No active follow-up|Not a |No voicemail|No live-call|Email-only lead|Text-only lead)/i.test(x);}
function laterAttempt(s){return /tried you earlier|trying to get the status right|last clean try|last try|i will leave the|one clean question so i stop guessing|one quick ownership question/i.test(String(s||''));}
function phoneStage(s){return ['new','attempting','engaged','appointment','outbound','longterm'].indexOf(s)>-1;}

function liveIntro(text){
  var s=String(text||'');
  if(!customerFacing(s))return s;
  if(/^\[Name\]\?\s*\[agent\]/i.test(s)||/^Hi \[Name\],\s*(?:this is )?\[agent\]/i.test(s))return s;
  return '[Name]? [agent] at Sheehy Nissan. '+s;
}
function cleanCall(text){
  var s=String(text||'');
  s=s.replace(/Quick question so I do not waste your time:/gi,"I’ll keep this simple.");
  s=s.replace(/I have one quick question before I work the wrong thing for you\.?/gi,'');
  s=s.replace(/I tried you earlier about ([^.]+)\. Quick one: is this still active, or did the plan move\?/gi,'I tried you earlier about $1. Is this still active, or did the plan change?');
  s=s.replace(/I do not need a long conversation on ([^.]+)\. What do you still need from me:/gi,'On $1, what do you still need from me:');
  s=s.replace(/I do not want to keep guessing on ([^.]+)\. Which is true now:/gi,'Let me get the status right on $1. Which is true now:');
  s=s.replace(/Last clean try from me on/gi,'Last try on');
  s=s.replace(/One clean question so I stop guessing on your \[current\]:/gi,'Let me get the status right on your [current]:');
  return s.replace(/\s{2,}/g,' ').trim();
}
function firstVmIntro(){
  return agentIsAldrin()
    ? 'Hi [Name], this is [agent], like Buzz Aldrin, at Sheehy Nissan of Manassas.'
    : 'Hi [Name], this is [agent] at Sheehy Nissan of Manassas.';
}
function repeatVmIntro(){return 'Hi [Name], this is [agent] at Sheehy Nissan of Manassas.';}
function stripVmIntro(text){
  return String(text||'')
    .replace(/^Hi \[Name\],\s*(?:this is )?\[agent\](?:, like Buzz Aldrin,)? at Sheehy Nissan(?: of Manassas)?\.\s*/i,'')
    .trim();
}
function ensureFirstRepeat(text){
  var s=String(text||'').trim();
  if(!/\[number\]/.test(s)||/Again,\s*\[agent\]/i.test(s))return s;
  return s+' Again, [agent] at [number].';
}
function cleanVmBody(text){
  var s=stripVmIntro(text);
  s=s.replace(/I have one quick question before I work the wrong thing for you\.?/gi,'');
  s=s.replace(/I only need to know whether this is still active\.?/gi,'Is this still active, or did the plan change?');
  s=s.replace(/I only need to know what is still unresolved\.?/gi,'What is still unresolved?');
  s=s.replace(/I am not calling to repeat the same message\.?/gi,'');
  s=s.replace(/One quick question\.\s*Call or text me at \[number\]\.?/gi,'Are you still driving it? Call or text me at [number].');
  s=s.replace(/I have one quick ownership question on your \[current\]\.\s*Call or text me at \[number\]\.?/gi,'Are you keeping the [current], curious what it is worth or open to changing it? Call or text me at [number].');
  s=s.replace(/Last clean try from me on/gi,'Last try on');
  s=s.replace(/\s{2,}/g,' ').trim();
  return s;
}
function polishFreshStandard(o,isLater){
  if(isLater)return o;
  o.call='[Name]? [agent] at Sheehy Nissan. You asked about the [vehicle]. I’ll keep this simple. What matters first: the vehicle itself, the numbers or making sure it is the right fit?';
  o.vm=firstVmIntro()+' I’m calling about the [vehicle] you asked about. When you get a second, tell me which direction matters first: the vehicle itself, the numbers or finding the right setup. Call or text me at [number]. Again, [agent] at [number].';
  return o;
}
function polish(base,ctx,raw){
  var o=clone(base),st=stage(ctx),id=behavior(raw||base);
  if(!phoneStage(st))return o;
  if(customerFacing(o.call))o.call=cleanCall(liveIntro(o.call));
  var late=laterAttempt(o.vm)||laterAttempt(o.call);
  if(id==='fresh-standard')o=polishFreshStandard(o,late);
  if(customerFacing(o.vm)&&id!=='fresh-standard'){
    var body=cleanVmBody(o.vm),intro=late?repeatVmIntro():firstVmIntro();
    o.vm=(intro+(body?' '+body:'')).replace(/\s{2,}/g,' ').trim();
    if(!late)o.vm=ensureFirstRepeat(o.vm);
  }else if(customerFacing(o.vm)&&id==='fresh-standard'&&late){
    var laterBody=cleanVmBody(o.vm);
    o.vm=(repeatVmIntro()+(laterBody?' '+laterBody:'')).replace(/\s{2,}/g,' ').trim();
  }
  o.phoneVoiceStandard='spoken-specific-memory-hook';
  return o;
}
F.resolveScenario=function(raw,ctx){var base=priorResolve?priorResolve(raw,ctx):clone(raw);return polish(base,ctx||{},raw);};

/* The Funnel may have rendered once before this late voice layer loads via nav.js. */
function refresh(){
  var b=document.getElementById('behavior');
  if(b)try{b.dispatchEvent(new Event('change',{bubbles:true}));}catch(e){}
  try{g.dispatchEvent(new CustomEvent('shq:funnel-context-change'));}catch(e){}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(refresh,0);});else setTimeout(refresh,0);
})(window);
