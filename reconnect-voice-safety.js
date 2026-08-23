/* SHEEHY SALES HQ - Reconnect commercial voice.
   Re-establish relevance. Give one credible reason to respond. Isolate the real hesitation. Earn the next step. */
(function(){
'use strict';
if((location.pathname.split('/').pop()||'').toLowerCase()!=='reconnect.html')return;

var KEY='shq_reconnect_strategy_v2';
var timer=null,applying=false;
function $(id){return document.getElementById(id);}
function field(sel,fb){var e=document.querySelector(sel);return e&&e.value&&String(e.value).trim()?String(e.value).trim():fb;}
function N(){return field('[data-f="name"]','[Name]');}
function V(){return field('[data-f="vehicle"]','[vehicle]');}
function A(){return field('[data-f="agent"]','[agent]');}
function P(){return field('[data-f="number"]','[number]');}
function sc(){return $('scenario')?$('scenario').value:'noresponse';}
function read(){try{return Object.assign({reason:'status',blocker:'unknown',detail:''},JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){return {reason:'status',blocker:'unknown',detail:''};}}
function save(s){try{localStorage.setItem(KEY,JSON.stringify(s));}catch(e){}}
function strategy(){return {reason:$('reconnectReason')?$('reconnectReason').value:'status',blocker:$('reconnectBlocker')?$('reconnectBlocker').value:'unknown',detail:$('reconnectDetail')?$('reconnectDetail').value.trim():''};}
function tier(){var e=$('agePill');if(!e)return 'warm';if(e.classList.contains('cold'))return 'cold';if(e.classList.contains('cooling'))return 'cooling';if(e.classList.contains('fresh'))return 'fresh';return 'warm';}
function cold(){return tier()==='cold';}
function slot(){try{return typeof window.slotPhrase==='function'?(window.slotPhrase()||''):'';}catch(e){return '';}}
function alt(){try{return typeof window.altPhrase==='function'?(window.altPhrase()||''):'';}catch(e){return '';}}
function apptAsk(){var a=slot(),b=alt();if(a&&b)return 'Which is easier for you, '+a+' or '+b+'?';if(a)return 'Would '+a+' work for you?';return 'What time would be easiest for you to pick this back up?';}
function sentence(s){s=String(s||'').trim();if(!s)return '';return /[.!?]$/.test(s)?s:s+'.';}
function copyText(text,btn){function done(){var old=btn.textContent;btn.textContent='Copied';setTimeout(function(){btn.textContent=old;},850);}function fallback(){var ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}catch(e){}ta.remove();done();}if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(done).catch(fallback);else fallback();}

function installStyle(){
  if($('reconnectCommercialStyle'))return;
  var s=document.createElement('style');s.id='reconnectCommercialStyle';s.textContent=[
    '.reconnect-strategy-note{margin:8px 0 0;font-size:11.5px;line-height:1.5;color:var(--muted)}',
    '.reconnect-strategy-note b{color:var(--ink)}',
    '.reconnect-standard{margin:0 0 12px;padding:9px 11px;border:1px solid #c9dbff;border-radius:10px;background:#eef4ff;font-size:12.5px;line-height:1.5;color:#31435a}',
    'html[data-shq-theme="monokai"] .reconnect-standard{background:#253239!important;border-color:#3f6872!important;color:#dff9ff!important}',
    '#reconnectStrategy .grid{grid-template-columns:repeat(auto-fit,minmax(210px,1fr))}',
    '#reconnectStrategy .wide{grid-column:1/-1}',
    '#reconnectStrategy input,#reconnectStrategy select{width:100%;border:1px solid var(--line);border-radius:8px;padding:9px 10px;font-family:inherit;font-size:14px;background:var(--paper);color:var(--ink);text-transform:none;letter-spacing:normal;font-weight:400}',
    '#reconnectDetailHelp{display:block;margin-top:5px;font-size:11.5px;color:var(--muted);font-weight:400;text-transform:none;letter-spacing:normal}'
  ].join('');
  (document.head||document.documentElement).appendChild(s);
}

function installUI(){
  installStyle();
  var sub=document.querySelector('.sub');
  if(sub)sub.textContent='Re-open a real buying conversation. Give them one relevant reason to respond, solve the real hesitation, then earn the next step.';
  if(!$('reconnectSpokenStandard')&&sub&&sub.parentNode){
    var std=document.createElement('div');std.id='reconnectSpokenStandard';std.className='reconnect-standard';std.setAttribute('role','note');
    std.innerHTML='<b>Reconnect standard:</b> context → relevant reason → one answerable question → listen → next step. No guilt, no “checking in,” no manufactured urgency.';
    sub.parentNode.insertBefore(std,sub.nextSibling);
  }else if($('reconnectSpokenStandard')){
    $('reconnectSpokenStandard').className='reconnect-standard';
    $('reconnectSpokenStandard').innerHTML='<b>Reconnect standard:</b> context → relevant reason → one answerable question → listen → next step. No guilt, no “checking in,” no manufactured urgency.';
  }
  if($('reconnectStrategy'))return;
  var first=document.querySelector('.panel');if(!first||!first.parentNode)return;
  var state=read();
  var p=document.createElement('div');p.className='panel';p.id='reconnectStrategy';
  p.innerHTML='<h2>Why this follow-up is worth answering</h2><div class="grid">'+
    '<label>Reason to reconnect<select id="reconnectReason">'+
      '<option value="status">No new development — sincere status check</option>'+
      '<option value="update">I have a verified update or answer</option>'+
      '<option value="better">I found a better-fit vehicle</option>'+
      '<option value="numbers">Desk reviewed the numbers again</option>'+
      '<option value="requested">Customer asked me to reconnect around now</option>'+
    '</select></label>'+
    '<label>Known reason they paused<select id="reconnectBlocker">'+
      '<option value="unknown">They never clearly told me</option>'+
      '<option value="price">Selling price / value</option>'+
      '<option value="payment">Payment / budget</option>'+
      '<option value="trade">Trade value</option>'+
      '<option value="vehicle">Vehicle / configuration</option>'+
      '<option value="timing">Timing</option>'+
      '<option value="decision">Another decision-maker was involved</option>'+
      '<option value="info">A question or missing information</option>'+
    '</select></label>'+
    '<label class="wide">Actual verified update or useful detail<input id="reconnectDetail" autocomplete="off" placeholder="Example: I found a Platinum in the color you wanted"><span id="reconnectDetailHelp">Use the real reason this contact is worth their attention. If nothing changed, leave Reason to reconnect on Status check.</span></label>'+
    '</div><div class="reconnect-strategy-note"><b>Rule:</b> the update has to be true. The page will never invent a price change, approval, trade value, availability claim or manager decision for you.</div>';
  first.parentNode.insertBefore(p,first.nextSibling);
  $('reconnectReason').value=state.reason||'status';$('reconnectBlocker').value=state.blocker||'unknown';$('reconnectDetail').value=state.detail||'';
  ['reconnectReason','reconnectBlocker','reconnectDetail'].forEach(function(id){var e=$(id);if(!e)return;e.addEventListener('input',function(){save(strategy());schedule();});e.addEventListener('change',function(){save(strategy());schedule();});});
}

function contextLine(s,isCold){
  var v=V();
  if(isCold){
    if(s==='pencil')return 'We got as far as numbers on the '+v+' a while back.';
    if(s==='testdrive')return 'You drove the '+v+' a while back.';
    if(s==='visit')return 'You came in on the '+v+' a while back, but we never got to the drive.';
    if(s==='video')return 'I sent you the video on the '+v+' a while back.';
    return 'We spoke a while back about the '+v+'.';
  }
  if(s==='pencil')return 'We got as far as numbers on the '+v+' before you left.';
  if(s==='testdrive')return 'You drove the '+v+', but we never finished the conversation.';
  if(s==='visit')return 'You came in on the '+v+', but we never got to the drive.';
  if(s==='video')return 'I sent you the video on the '+v+' and wanted to pick up from there.';
  if(s==='quiet')return 'We had a couple of conversations about the '+v+' and then paused.';
  if(s==='novm')return 'You had asked about the '+v+' and I never caught you live.';
  return 'You had asked about the '+v+' and we never really got a conversation going.';
}

function hook(st){
  var d=sentence(st.detail);
  if(st.reason==='requested')return 'You had asked me to reconnect around now.';
  if(st.reason==='update')return d?'I have an update for you: '+d:'';
  if(st.reason==='better')return d?'I found another option that may fit what you wanted better: '+d:'I found another option that may fit what you wanted better.';
  if(st.reason==='numbers')return d?'I had the numbers reviewed again. '+d:'I had the numbers reviewed again.';
  return '';
}

function blockerRecall(b){
  if(b==='price')return 'Last time, the selling price was the part that did not work for you.';
  if(b==='payment')return 'Last time, the payment was the part that did not work for you.';
  if(b==='trade')return 'Last time, the trade value was the part that did not work for you.';
  if(b==='vehicle')return 'Last time, the vehicle itself was not quite right.';
  if(b==='timing')return 'Last time, the timing was not right.';
  if(b==='decision')return 'Last time, you needed someone else involved before making the decision.';
  if(b==='info')return 'Last time, there was still a question you needed answered.';
  return '';
}
function blockerQuestion(b){
  if(b==='price'||b==='payment'||b==='trade')return 'Is that still the part that would need to change for you to reconsider it?';
  if(b==='vehicle')return 'What would need to be different about the vehicle for you to reconsider?';
  if(b==='timing')return 'Has the timing changed enough to revisit it?';
  if(b==='decision')return 'Is the decision still open, or has the plan changed?';
  if(b==='info')return 'Is that question still unresolved?';
  return '';
}
function scenarioQuestion(s){
  var v=V();
  if(s==='pencil')return 'When you left, what was the main thing that did not work for you: selling price, payment, trade, or timing?';
  if(s==='testdrive')return 'After the drive, what kept it from moving forward: the vehicle itself, the numbers, or timing?';
  if(s==='visit')return 'When you left, was it a fit issue, or did we simply run out of time before the drive?';
  if(s==='video')return 'Did the video answer what you needed, or is there something specific you still want to see?';
  if(s==='quiet')return 'Did your plan change, or is there still one part of this we have not solved?';
  if(s==='novm')return 'Are you still looking for a '+v+', or has your plan changed?';
  return 'Are you still looking for a '+v+', or has your plan changed?';
}
function primaryQuestion(st,s){
  var known=blockerQuestion(st.blocker);
  if(st.reason==='better')return 'Is that closer to what you were trying to accomplish, or is there still something missing?';
  if(st.reason==='update'&&st.detail)return 'Does that update make it worth another look, or has your plan changed?';
  if(st.reason==='numbers'&&st.blocker==='unknown')return 'Is there one part of the deal you would need to see differently for it to make sense?';
  return known||scenarioQuestion(s);
}
function nextStep(st,s){
  var ask=apptAsk();
  if(st.reason==='better')return '[If it is closer]\nGood. I can have the right vehicle ready so you can compare it properly. '+ask;
  if(s==='pencil')return '[After they answer]\nIf we can address that one part, is there anything else that would keep you from moving forward?\n\n[If no]\nGood. Let us revisit it properly. '+ask;
  if(s==='testdrive')return '[After they answer]\nIf we can address that one issue, are you open to picking this back up?\n\n[If yes]\n'+ask;
  if(s==='visit')return '[If the vehicle is still in play]\nLet us finish the part we never got to. I will have it ready for the drive. '+ask;
  if(s==='video')return '[If they are still interested]\nTell me the one thing you need next. I will get that handled first, then we can decide whether a visit makes sense.';
  if(s==='quiet')return '[If it is still active]\nLet us solve the one thing that is still open. If we can address it, '+ask.charAt(0).toLowerCase()+ask.slice(1);
  return '[If they are still shopping]\nWhat matters most now: the vehicle itself, the numbers, or timing?\n\n[After they answer]\nGood. Let me work from that. If the fit is right, '+ask.charAt(0).toLowerCase()+ask.slice(1);
}

function callScript(){
  var st=strategy(),s=sc(),intro=N()+'? '+A()+' at Sheehy Nissan. '+contextLine(s,cold()),h=hook(st),q=primaryQuestion(st,s),parts=[intro];
  if(h)parts.push(h);
  if(cold())parts.push('Before I assume the search is still active, did you end up buying something else, or are you still looking?','[If still looking]\n'+(blockerRecall(st.blocker)?blockerRecall(st.blocker)+' ':'')+q);
  else parts.push((blockerRecall(st.blocker)?blockerRecall(st.blocker)+' ':'')+q);
  parts.push('[Listen. Do not explain over their answer.]\n'+nextStep(st,s));
  return parts.join('\n\n');
}
function vmIntro(){return cold()&&String(A()).toLowerCase()==='aldrin'?'Hi '+N()+', this is '+A()+', like Buzz Aldrin, at Sheehy Nissan of Manassas.':'Hi '+N()+', this is '+A()+' at Sheehy Nissan of Manassas.';}
function vmScript(){
  var st=strategy(),s=sc(),h=hook(st),base=vmIntro()+' '+contextLine(s,cold()),why='';
  if(h)why=' '+h;
  if(st.reason==='better')why+=' I wanted to see if it is closer to what you had in mind.';
  else if(st.reason==='update'||st.reason==='numbers')why+=' I wanted to see if that changes the conversation for you.';
  else if(s==='pencil')why+=' I wanted to see whether the deal is still worth revisiting or if your plans changed.';
  else why+=' I wanted to see if you are still considering it or if your plans changed.';
  return base+why+' Call or text me at '+P()+'. Again, '+A()+' at '+P()+'.';
}
function smsScript(){
  var st=strategy(),s=sc(),n=N(),a=A(),v=V(),d=sentence(st.detail),prefix='Hi '+n+', '+a+' at Sheehy Nissan. ';
  if(st.reason==='better')return prefix+(d?'I found another option that may fit what you wanted better: '+d+' ':'I found another option that may fit what you wanted better. ')+'Want me to send it over?';
  if(st.reason==='update'&&d)return prefix+'Quick update on the '+v+': '+d+' Does that make it worth another look?';
  if(st.reason==='numbers')return prefix+'I had the numbers on the '+v+' reviewed again.'+(d?' '+d:'')+' Is it worth reopening the conversation?';
  if(st.reason==='requested')return prefix+'You asked me to reconnect around now about the '+v+'. Are you still looking, or did your plans change?';
  if(cold())return prefix+'We spoke a while back about the '+v+'. Did you end up buying something else, or are you still looking?';
  if(st.blocker!=='unknown')return prefix+blockerRecall(st.blocker)+' '+blockerQuestion(st.blocker);
  if(s==='pencil')return prefix+'We got as far as numbers on the '+v+'. Is the same part of the deal still the issue, or are you open to revisiting it?';
  if(s==='testdrive')return prefix+'You drove the '+v+'. Are you still considering it, or did something about the vehicle or deal take it off the list?';
  if(s==='visit')return prefix+'You stopped in on the '+v+' but never got to the drive. Is it still in the running, or did you go another direction?';
  if(s==='video')return prefix+'I sent you the video on the '+v+'. Did it answer what you needed, or is there something I missed?';
  if(s==='quiet')return prefix+'We talked about the '+v+' and then paused. Is it still on your list, or did you go another direction?';
  return prefix+'You had asked about the '+v+'. Are you still looking, or did your plans change?';
}
function subject(){
  var st=strategy(),s=sc(),n=N(),v=V();
  if(st.reason==='better')return n+', I Found Another Option Worth a Look';
  if(st.reason==='update')return n+', An Update on the '+v;
  if(st.reason==='numbers')return n+', Revisiting the '+v+' Numbers';
  if(st.reason==='requested')return n+', Following Up on the '+v+' as Promised';
  if(s==='pencil')return n+', Is the '+v+' Deal Still Worth Revisiting?';
  if(s==='video')return n+', Did the '+v+' Video Answer It?';
  return n+', Are You Still Considering the '+v+'?';
}
function emailScript(){
  var st=strategy(),s=sc(),n=N(),a=A(),h=hook(st),rec=blockerRecall(st.blocker),q=primaryQuestion(st,s),lines=['Hi '+n+',','',contextLine(s,cold())];
  if(h)lines.push('',h);
  if(cold())lines.push('','Before I assume the search is still active, did you end up buying something else, or are you still looking?');
  else lines.push('',(rec?rec+' ':'')+q);
  if(!cold()&&(st.reason==='better'||st.reason==='update'||st.reason==='numbers'||s==='pencil'||s==='testdrive'||s==='visit')){
    var ask=apptAsk();lines.push('','If it is worth picking back up, '+ask.charAt(0).toLowerCase()+ask.slice(1));
  }else if(cold())lines.push('','If you are still looking, reply with what matters most now and I will pick it up from there.');
  else lines.push('','Reply with where things stand and I will work from there.');
  lines.push('',a+(P()&&P()!=='[number]'?' · '+P():''));
  return lines.join('\n');
}

function patchAge(){
  var hint=$('ageHint'),e=$('agePill');if(!hint||!e)return;
  if(e.classList.contains('fresh'))hint.textContent='Continue the conversation. Do not recap the whole lead. Ask the unresolved question and move.';
  else if(e.classList.contains('warm'))hint.textContent='Give one sentence of context and one reason to respond. If they are still active, isolate the real hesitation.';
  else if(e.classList.contains('cooling'))hint.textContent='Re-establish relevance before asking for time. A real update beats a generic follow-up.';
  else if(e.classList.contains('cold'))hint.textContent='Reset status first. Find out whether they already bought or are still looking before trying to revive the old deal.';
  else hint.textContent='Set the lead date so Reconnect can adjust how directly you pick the conversation back up.';
}
function patchConfirmation(){
  var out=$('confText');if(!out||!out.textContent)return;
  var raw=out.textContent,match=raw.match(/down for\s+(.+?)\.\s+I will have/i);if(!match)return;
  var when=match[1];
  out.textContent='Perfect, '+N()+'. I have you set for '+when+'. I will have the '+V()+' ready so we can pick up where we left off. If anything changes, call or text me at '+P()+'.';
}
function bindCopy(){
  var map={cpCall:'callOut',cpVM:'vmOut',cpSMS:'smsOut',cpSubj:'subjOut',cpBody:'bodyOut'};
  Object.keys(map).forEach(function(btnId){var btn=$(btnId),target=$(map[btnId]);if(!btn||!target)return;btn.onclick=function(){copyText(target.value||target.textContent||'',btn);};});
}
function apply(){
  if(applying)return;applying=true;
  installUI();patchAge();
  var map={callOut:callScript(),vmOut:vmScript(),smsOut:smsScript(),subjOut:subject(),bodyOut:emailScript()};
  Object.keys(map).forEach(function(id){var e=$(id);if(e&&e.value!==map[id])e.value=map[id];});
  patchConfirmation();bindCopy();
  applying=false;
}
function schedule(){clearTimeout(timer);timer=setTimeout(apply,0);}
function bind(){
  installUI();apply();
  document.addEventListener('input',schedule);
  document.addEventListener('change',schedule);
  document.addEventListener('click',schedule);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();
