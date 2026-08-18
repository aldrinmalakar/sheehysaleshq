/* ============================================================
   SHEEHY SALES HQ - Funnel contact control

   Purpose:
   - Track lead day, call attempts and meaningful contact touches per customer.
   - Advance call / voicemail / SMS / email language by attempt when the customer
     has not responded.
   - Turn one-tap outcomes into a clear next-step recommendation.
   - Keep DriveCentric as the dealership system of record.
============================================================ */
(function(g){
'use strict';
var F=g.SHQFunnel;if(!F||!Array.isArray(F.scenarios))return;
var STATE_KEY='shq_funnel_contact_v2',LEGACY_LOG_KEY='shq_lead_log_v1';
var priorResolve=typeof F.resolveScenario==='function'?F.resolveScenario:null;
var applying=false;
function $(id){return document.getElementById(id);}
function field(name){var e=document.querySelector('[data-f="'+name+'"]');return e&&typeof e.value==='string'?e.value.trim():'';}
function norm(s){return String(s||'').toLowerCase().replace(/\s+/g,' ').trim();}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function clone(o){var x={};Object.keys(o||{}).forEach(function(k){x[k]=o[k];});return x;}
function loadState(){try{var x=JSON.parse(localStorage.getItem(STATE_KEY)||'{}');if(!Array.isArray(x.records))x.records=[];return x;}catch(e){return {records:[]};}}
function saveState(x){try{if(x.records.length>120)x.records=x.records.slice(-120);localStorage.setItem(STATE_KEY,JSON.stringify(x));}catch(e){}}
function fingerprint(){var n=norm(field('name')),v=norm(field('vehicle')),c=norm(field('current'));return [n,v,c].join('|');}
function identity(){return {name:field('name'),vehicle:field('vehicle'),current:field('current')};}
function hasIdentity(){var x=identity();return !!(x.name||x.vehicle||x.current);}
function recordForCurrent(create){
  var st=loadState(),fp=fingerprint(),id=identity(),found=null,i,r;
  for(i=0;i<st.records.length;i++){r=st.records[i];if(Array.isArray(r.aliases)&&r.aliases.indexOf(fp)>-1){found=r;break;}}
  if(!found&&id.name){
    var same=st.records.filter(function(q){if(norm(q.name)!==norm(id.name))return false;var vehicleMatch=id.vehicle&&q.vehicle&&norm(q.vehicle)===norm(id.vehicle);var currentMatch=id.current&&q.current&&norm(q.current)===norm(id.current);return vehicleMatch||currentMatch||(!id.vehicle&&!id.current);});
    if(same.length===1)found=same[0];
  }
  if(!found&&!create)return null;
  if(!found){found={id:'fc'+Date.now()+Math.floor(Math.random()*9999),aliases:[],name:id.name,vehicle:id.vehicle,current:id.current,startedAt:'',updatedAt:'',events:[]};st.records.push(found);}
  found.aliases=Array.isArray(found.aliases)?found.aliases:[];if(found.aliases.indexOf(fp)<0&&hasIdentity())found.aliases.push(fp);
  found.name=id.name||found.name||'';found.vehicle=id.vehicle||found.vehicle||'';found.current=id.current||found.current||'';found.updatedAt=new Date().toISOString();
  saveState(st);return found;
}
function saveRecord(rec){var st=loadState(),i=-1;for(var j=0;j<st.records.length;j++)if(st.records[j].id===rec.id){i=j;break;}if(i<0)st.records.push(rec);else st.records[i]=rec;rec.updatedAt=new Date().toISOString();saveState(st);}
function calls(rec){return (rec&&rec.events||[]).filter(function(e){return ['answered','noanswer','voicemail'].indexOf(e.type)>-1;}).length;}
function touches(rec){return rec&&rec.events?rec.events.length:0;}
function day(rec){if(!rec||!rec.startedAt)return 0;var d=new Date(rec.startedAt);if(isNaN(d))return 0;return Math.max(1,Math.floor((Date.now()-d.getTime())/86400000)+1);}
function lastEvent(rec){return rec&&rec.events&&rec.events.length?rec.events[rec.events.length-1]:null;}
function hasOutcome(rec,type){return !!(rec&&rec.events&&rec.events.some(function(e){return e.type===type;}));}
function manualAttempt(){var e=$('attemptScriptView');if(!e||e.value==='auto')return 0;var n=parseInt(e.value,10);return isNaN(n)?0:n;}
function shownAttempt(rec){var m=manualAttempt();return m||Math.min(5,calls(rec)+1);}
function startedFromLeadAt(rec){var at=$('leadAt');if(!rec||rec.startedAt||!at||!at.value)return rec;var d=new Date(at.value);if(!isNaN(d)){rec.startedAt=d.toISOString();saveRecord(rec);}return rec;}
function ensureStarted(rec){if(!rec)return rec;startedFromLeadAt(rec);if(!rec.startedAt){rec.startedAt=new Date().toISOString();saveRecord(rec);}return rec;}
function stage(){var e=$('stageSelect');return e?e.value:'';}
function behavior(){var e=$('behavior');return e?e.value:'';}
function topicFor(id,st){
  if(st==='outbound')return 'your [current]';
  var m={
    'availability-first':'the status on the [vehicle]',
    'price-first':'the numbers on the [vehicle]',
    'test-drive-request':'driving the [vehicle]',
    'unit-gone':'the replacement direction for the [vehicle]',
    'wants-details':'the [vehicle] detail you asked about',
    'payment-apr':'the finance question on the [vehicle]',
    'trade-value':'the [current] trade',
    'owner-wants-value':'your [current]',
    'credit-concern':'the private next step on the [vehicle]',
    'competitor-shop':'the [vehicle] comparison',
    'decision-maker':'the [vehicle] decision',
    'no-response-day1':'the [vehicle]',
    'final-nudge':'the [vehicle]'
  };return m[id]||'the [vehicle]';
}
function choiceFor(id){
  if(id==='price-first')return 'the verified comparison, a different vehicle or the timing';
  if(id==='availability-first'||id==='test-drive-request')return 'vehicle status, a time to see it or a different option';
  if(id==='unit-gone')return 'another option, one exact must-have or the timing';
  if(id==='payment-apr'||id==='credit-concern')return 'vehicle fit, purchase numbers or the finance review';
  if(id==='trade-value'||id==='owner-wants-value')return 'trade value, the replacement vehicle or the timing';
  if(id==='competitor-shop')return 'the comparison, the numbers or the timing';
  return 'the vehicle, the numbers or the timing';
}
function generalCadence(base,n,id){
  if(n<=1)return base;var o=clone(base),topic=topicFor(id,stage()),choices=choiceFor(id);
  if(n===2){
    o.call='Hi [Name], [agent] at Sheehy Nissan. I tried you earlier about '+topic+'. Quick one: is this still active, or did the plan move?';
    o.vm='Hi [Name], [agent] at Sheehy Nissan. I tried you earlier about '+topic+'. I only need to know whether this is still active. Call or text me at [number].';
    o.sms='I tried you earlier about '+topic+'. Still active, or did the plan move?';
    o.subject='👋 [Name], Still Working on the [vehicle]?';
    o.email='Hi [Name],\n\nI tried you earlier about '+topic+'. One quick question: is this still active, or did the plan move?\n\nIf it is active, tell me the one thing you need next and I will work that first.\n\n[agent]';
  }else if(n===3){
    o.call='Hi [Name], [agent] at Sheehy Nissan. I do not need a long conversation on '+topic+'. What do you still need from me: '+choices+'?';
    o.vm='Hi [Name], [agent] at Sheehy Nissan. On '+topic+', I only need to know what is still unresolved. Call or text me at [number].';
    o.sms='Quick one on '+topic+': what do you still need from me, '+choices+'?';
    o.subject='👋 [Name], What Do You Still Need on the [vehicle]?';
    o.email='Hi [Name],\n\nI do not need a long reply. On '+topic+', what do you still need from me: '+choices+'?\n\nGive me the one that matters and I will work that next.\n\n[agent]';
  }else if(n===4){
    o.call='Hi [Name], [agent] at Sheehy Nissan. I do not want to keep guessing on '+topic+'. Which is true now: still shopping, already bought or the timing changed?';
    o.vm='Hi [Name], [agent] at Sheehy Nissan. I am trying to get the status right on '+topic+'. Still shopping, already bought or timing changed? Call or text me at [number].';
    o.sms='I do not want to keep guessing on '+topic+'. Still shopping, already bought or timing changed?';
    o.subject='👋 [Name], Still Shopping, Bought or Timing Changed?';
    o.email='Hi [Name],\n\nI do not want to keep guessing on '+topic+'. Which is true now?\n\n1. Still shopping\n2. Already bought\n3. Timing changed\n\nReply with the number and I will handle it correctly.\n\n[agent]';
  }else{
    o.call='Hi [Name], [agent] at Sheehy Nissan. Last clean try from me on '+topic+'. If it is still active, tell me the one thing you need and I will work it. If not, I will leave it alone.';
    o.vm='Hi [Name], [agent] at Sheehy Nissan. Last clean try from me on '+topic+'. If it is still active, call or text me at [number]. If not, I will leave it alone.';
    o.sms='Last clean try from me on '+topic+'. If it is still active, tell me the one thing you need. If not, I will leave it alone.';
    o.subject='👋 [Name], Last Clean Try on the [vehicle]';
    o.email='Hi [Name],\n\nLast clean try from me on '+topic+'.\n\nIf it is still active, tell me the one thing you need and I will work it. If you already handled it or the timing moved, tell me that and I will leave it alone.\n\n[agent]';
  }
  return o;
}
function outboundCadence(base,n){
  if(n<=1)return base;var o=clone(base);
  if(n===2){
    o.call='Hi [Name], [agent] at Sheehy Nissan. I tried you earlier about your [current]. Are you still driving it?';
    o.vm='Hi [Name], [agent] at Sheehy Nissan. I tried you earlier about your [current]. One quick question. Call or text me at [number].';
    o.sms='I tried you earlier about your [current]. Are you still driving it?';
    o.subject='👋 [Name], Quick Question on Your [current]';
    o.email='Hi [Name],\n\nI tried you earlier about your [current]. Are you still driving it?\n\nOne word back is enough.\n\n[agent]';
  }else if(n===3){
    o.call='Hi [Name], [agent] at Sheehy Nissan. I do not need a long conversation. On your [current], are you keeping it, curious what it is worth or open to changing it if there is a real reason?';
    o.vm='Hi [Name], [agent] at Sheehy Nissan. I have one quick ownership question on your [current]. Call or text me at [number].';
    o.sms='Quick ownership question on your [current]: keeping it, curious what it is worth or open to changing it if there is a real reason?';
    o.subject='👋 [Name], One Question on Your [current]';
    o.email='Hi [Name],\n\nOne quick ownership question on your [current]:\n\n1. Keeping it\n2. Curious what it is worth\n3. Open to changing it if there is a real reason\n\nWhich is closest?\n\n[agent]';
  }else if(n===4){
    o.call='Hi [Name], [agent] at Sheehy Nissan. One clean question so I stop guessing on your [current]: keep it, sell it or replace it if the right vehicle and numbers made sense?';
    o.vm='Hi [Name], [agent] at Sheehy Nissan. I am trying to get the status right on your [current]. Keep it, sell it or open to replacing it? Call or text me at [number].';
    o.sms='One clean question on your [current]: keep it, sell it or replace it if the right vehicle and numbers made sense?';
    o.subject='👋 [Name], Keep, Sell or Replace the [current]?';
    o.email='Hi [Name],\n\nOne clean question so I stop guessing on your [current]: keep it, sell it or replace it if the right vehicle and numbers made sense?\n\n[agent]';
  }else{
    o.call='Hi [Name], [agent] at Sheehy Nissan. I will leave the [current] alone after this. If you want me to work its value or replacement options, tell me which one and I will take it from there.';
    o.vm='Hi [Name], [agent] at Sheehy Nissan. I will leave the [current] alone after this. If you want value or replacement options, call or text me at [number].';
    o.sms='I will leave the [current] alone after this. If you want me to work value or replacement options, tell me which one.';
    o.subject='👋 [Name], Last Question on Your [current]';
    o.email='Hi [Name],\n\nI will leave the [current] alone after this. If you want me to work its value or replacement options, tell me which one and I will take it from there.\n\n[agent]';
  }
  return o;
}
function stopScripts(base,msg){var o=clone(base);o.call=msg;o.vm=msg;o.sms=msg;o.subject='Stop outreach';o.email=msg;return o;}
function applyAttempt(base,ctx){
  var rec=recordForCurrent(false),last=lastEvent(rec),st=(ctx&&ctx.stage)||stage(),id=base&&base.id?base.id:behavior();
  if(hasOutcome(rec,'optout'))return stopScripts(base,'STOP: customer opted out. Do not call, text or email. Update DriveCentric / DNC before doing anything else.');
  if(last&&last.type==='badnumber'){
    var bad=clone(base);bad.call='STOP PHONE: the number was marked bad. Do not call it again.';bad.vm='STOP PHONE: the number was marked bad. Do not leave another voicemail.';bad.sms='STOP TEXT: the number was marked bad. Do not text it again.';return bad;
  }
  if(last&&last.type==='notinterested')return stopScripts(base,'No active follow-up script. The customer said they are not interested. Respect the answer and any DNC request.');
  if(['new','attempting','engaged','outbound','longterm'].indexOf(st)<0)return base;
  if(last&&['answered','callback','appointment'].indexOf(last.type)>-1&&!manualAttempt())return base;
  var n=shownAttempt(rec);return st==='outbound'?outboundCadence(base,n):generalCadence(base,n,id);
}
F.resolveScenario=function(raw,ctx){var base=priorResolve?priorResolve(raw,ctx):clone(raw);return applyAttempt(base,ctx||{});};

function legacyLog(type,label,res,rec){
  try{var a=JSON.parse(localStorage.getItem(LEGACY_LOG_KEY)||'[]');if(!Array.isArray(a))a=[];a.push({id:'l'+Date.now()+Math.floor(Math.random()*999),who:field('name'),vehicle:field('vehicle'),leadKey:rec.id,what:label,res:res||'No response yet',at:new Date().toISOString()});if(a.length>100)a=a.slice(-100);localStorage.setItem(LEGACY_LOG_KEY,JSON.stringify(a));}catch(e){}
}
var LABELS={answered:'Called, connected',noanswer:'Called, no answer',voicemail:'Called, left voicemail',text:'Text sent',email:'Email sent',callback:'Callback scheduled',badnumber:'Bad number',notinterested:'Not interested',optout:'Opt-out / DNC',appointment:'Appointment set',video:'Video sent',activity:'Activity logged'};
function addEvent(type,label,mirror){
  var rec=ensureStarted(recordForCurrent(true)),e={id:'ce'+Date.now()+Math.floor(Math.random()*999),type:type,label:label||LABELS[type]||type,at:new Date().toISOString()};rec.events=Array.isArray(rec.events)?rec.events:[];rec.events.push(e);if(rec.events.length>60)rec.events=rec.events.slice(-60);saveRecord(rec);if(mirror!==false)legacyLog(type,e.label,type==='appointment'?'Appointment set':type==='callback'?'Callback scheduled':type==='badnumber'?'Bad contact info':type==='notinterested'?'Not interested':type==='answered'?'Replied':'No response yet',rec);applyAutomation(type);render();notify();}
function setChannelsOff(names){names.forEach(function(n){var b=document.querySelector('[data-channel="'+n+'"]');if(b&&b.classList.contains('on'))b.click();});}
function setFunnel(st,id){var s=$('stageSelect'),b=$('behavior');if(!s||!b)return;s.value=st;s.dispatchEvent(new Event('change',{bubbles:true}));setTimeout(function(){if(id&&Array.from(b.options).some(function(o){return o.value===id;})){b.value=id;b.dispatchEvent(new Event('change',{bubbles:true}));}},0);}
function applyAutomation(type){
  if(type==='badnumber'){setChannelsOff(['phone','text']);setFunnel('attempting','bad-contact');}
  if(type==='optout')setChannelsOff(['phone','text','email']);
  if(type==='appointment')setFunnel('appointment','booked');
  if(type==='callback'&&stage()==='outbound')setFunnel('outbound','owner-callback');
  if(type==='notinterested'&&stage()==='outbound')setFunnel('outbound','owner-not-interested');
}
function channels(){if(g.SHQFunnelExecution&&typeof g.SHQFunnelExecution.getContext==='function')return g.SHQFunnelExecution.getContext();return {phone:true,text:false,email:true};}
function recommendation(rec){
  var last=lastEvent(rec),c=channels(),n=calls(rec)+1;
  if(hasOutcome(rec,'optout'))return {title:'STOP outreach',body:'The customer opted out. Do not call, text or email. Update DriveCentric / DNC before any future outreach.'};
  if(last&&last.type==='appointment')return {title:'Protect the appointment',body:'Confirm the exact time, vehicle or reason for the visit and who is coming. Funnel moved to Appointment. Send the confirmation, then stop selling until the next appointment touch.'};
  if(last&&last.type==='badnumber')return {title:'Phone path is closed',body:'The number is bad. Do not call or text it again. Use a valid permitted channel only and mark the bad contact information in DriveCentric.'};
  if(last&&last.type==='callback')return {title:'Honor the callback',body:'Call at the promised time. Do not stack extra touches before then unless the customer reaches out first.'};
  if(last&&last.type==='notinterested')return {title:'Stop the active pursuit',body:'The customer said no. Respect it. If they also asked not to be contacted, record the DNC / opt-out immediately.'};
  if(last&&last.type==='answered')return {title:'Behavior beats cadence now',body:'You made contact. Select what the customer actually said or asked in Behavior, solve that issue and close the next clear decision. Do not keep reading attempt scripts.'};
  if(last&&last.type==='voicemail')return {title:'Change channel, do not redial',body:(c.text?'Use the current SMS script once. ':c.email?'Use the current email script once. ':'No alternate digital channel is enabled. ')+'Then wait for the next approved touch. Your next call is Attempt '+n+'.'};
  if(last&&last.type==='noanswer')return {title:'Finish this attempt cleanly',body:'If voicemail is available, leave it once. '+(c.text?'Then use the current SMS once. ':c.email?'Then use the current email once. ':'')+'Do not immediately redial. Your next call is Attempt '+n+'.'};
  if(last&&last.type==='text')return {title:'Do not stack another text',body:'You already sent the written touch. Give it room. On the next approved call, Funnel will use Attempt '+n+' language instead of repeating the first script.'};
  if(last&&last.type==='email')return {title:'Do not stack another email',body:'The email is out. Use the next approved call as Attempt '+n+'. If the customer answers first, abandon cadence and work their actual behavior.'};
  if(last&&last.type==='video')return {title:'Follow the video with one question',body:'Use the existing video follow-up once, then wait. If they respond, move to the actual behavior. If they do not, the next call remains Attempt '+n+'.'};
  if(rec&&calls(rec)>=4)return {title:'Use final-clarity language',body:'You have already made '+calls(rec)+' calls. Stop recycling the same opener. Ask for status: still shopping, already bought or timing changed.'};
  return {title:'Start with the call',body:'Use the current Call script. If they answer, switch to their actual behavior. If they do not, tap No Answer or Voicemail so Funnel advances the next attempt automatically.'};
}
function notify(){try{g.dispatchEvent(new CustomEvent('shq:funnel-context-change'));g.dispatchEvent(new CustomEvent('shq:funnel-contact-change'));}catch(e){}}
function fmtDate(x){var d=new Date(x);if(isNaN(d))return '';return d.toLocaleDateString('en-US',{month:'short',day:'numeric'})+' '+d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});}
function renderHistory(rec){var box=$('contactHistory');if(!box)return;var a=rec&&rec.events?rec.events.slice().reverse().slice(0,10):[];if(!a.length){box.innerHTML='<div class="quiet">No contact outcomes logged for this customer yet.</div>';return;}box.innerHTML=a.map(function(e){return '<div class="contact-history-item"><div><b>'+esc(e.label||LABELS[e.type]||e.type)+'</b><span>'+esc(fmtDate(e.at))+'</span></div></div>';}).join('');}
function render(){
  if(applying)return;applying=true;var rec=startedFromLeadAt(recordForCurrent(false)),d=day(rec),cc=calls(rec),tt=touches(rec),next=Math.min(5,cc+1),m=manualAttempt(),last=lastEvent(rec),stop=hasOutcome(rec,'optout');
  if($('metricDay'))$('metricDay').textContent=d?'Day '+d:'Not started';
  if($('metricCalls'))$('metricCalls').textContent=String(cc);
  if($('metricTouches'))$('metricTouches').textContent=String(tt);
  if($('metricNextCall'))$('metricNextCall').textContent=cc>=4?'5+':String(cc+1);
  if($('attemptScriptStatus'))$('attemptScriptStatus').textContent=m?'Showing manual Attempt '+(m>=5?'5+':m)+' scripts. This does not change the log.':'Auto: showing Attempt '+(next>=5?'5+':next)+' scripts from '+cc+' completed call'+(cc===1?'':'s')+'.';
  var r=recommendation(rec);if($('nextActionTitle'))$('nextActionTitle').textContent=r.title;if($('nextActionBody'))$('nextActionBody').textContent=r.body;
  var c=channels();document.querySelectorAll('[data-outcome]').forEach(function(b){var t=b.getAttribute('data-outcome'),disabled=stop;if(['answered','noanswer','voicemail','badnumber'].indexOf(t)>-1&&!c.phone)disabled=true;if(t==='text'&&!c.text)disabled=true;if(t==='email'&&!c.email)disabled=true;if(t==='optout')disabled=stop;b.disabled=!!disabled;});
  var status=$('contactState');if(status){status.className='status-pill'+(stop?' bad':last&&last.type==='appointment'?' good':last&&last.type==='answered'?' blue':'');status.textContent=stop?'Outreach stopped':last?(last.label||LABELS[last.type]||'Logged'):'No outcome yet';}
  renderHistory(rec);applying=false;
}
function resetTracking(){var rec=recordForCurrent(false);if(!rec)return;if(!confirm('Reset Funnel tracking for this customer on this browser? DriveCentric is not changed.'))return;var st=loadState();st.records=st.records.filter(function(r){return r.id!==rec.id;});saveState(st);render();notify();}
function inferLegacy(){var w=$('logWhat')?$('logWhat').value:'',r=$('logResult')?$('logResult').value:'';if(r==='Appointment set')return 'appointment';if(r==='Callback scheduled')return 'callback';if(r==='Not interested')return 'notinterested';if(r==='Bad contact info')return 'badnumber';if(/Called, connected/i.test(w))return 'answered';if(/left voicemail/i.test(w))return 'voicemail';if(/Called, no answer/i.test(w))return 'noanswer';if(/Texted/i.test(w))return 'text';if(/Emailed/i.test(w))return 'email';if(/video/i.test(w))return 'video';return 'activity';}
function bindLegacyButtons(){
  var lv=$('logVideo');if(lv)lv.addEventListener('click',function(){addEvent('video','Video sent',false);});
  var ln=$('logNotice');if(ln)ln.addEventListener('click',function(){addEvent(currentNotifyType(),'Video follow-up sent',false);});
  var la=$('logAdd');if(la)la.addEventListener('click',function(){var t=inferLegacy();addEvent(t,LABELS[t]||($('logWhat')?$('logWhat').value:'Activity logged'),false);});
}
function currentNotifyType(){var e=$('notifyVia');return e&&e.value==='sms'?'text':'email';}
function localDateTime(iso){var d=new Date(iso);if(isNaN(d))return '';var z=d.getTimezoneOffset()*60000;return new Date(d-z).toISOString().slice(0,16);}
function bind(){
  document.querySelectorAll('[data-outcome]').forEach(function(b){b.addEventListener('click',function(){var t=this.getAttribute('data-outcome');addEvent(t,LABELS[t],true);});});
  if($('attemptScriptView'))$('attemptScriptView').addEventListener('change',function(){render();notify();});
  if($('resetContactTracking'))$('resetContactTracking').addEventListener('click',resetTracking);
  var at=$('leadAt'),rec=recordForCurrent(false);if(at&&rec&&rec.startedAt&&!at.value){at.value=localDateTime(rec.startedAt);at.dispatchEvent(new Event('input',{bubbles:true}));}
  if(at)at.addEventListener('change',function(){var r=recordForCurrent(true),d=new Date(this.value);if(!isNaN(d)){r.startedAt=d.toISOString();saveRecord(r);render();notify();}});
  if($('leadNow'))$('leadNow').addEventListener('click',function(){setTimeout(function(){var r=recordForCurrent(true),a=$('leadAt'),d=a&&a.value?new Date(a.value):new Date();r.startedAt=d.toISOString();saveRecord(r);render();notify();},0);});
  ['stageSelect','behavior','interactionStyle','decisionStructure','buyingPriority'].forEach(function(id){var e=$(id);if(e)e.addEventListener('change',function(){setTimeout(render,0);});});
  document.querySelectorAll('[data-f]').forEach(function(e){e.addEventListener('input',function(){setTimeout(render,0);});});
  g.addEventListener('shq:funnel-customer-cleared',function(){setTimeout(render,0);});
  bindLegacyButtons();render();setInterval(render,60000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})(window);
