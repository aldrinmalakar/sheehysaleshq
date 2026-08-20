/* SHEEHY SALES HQ - Nissan Survey spoken-commercial voice.
   Ownership first. One issue question. Survey one sentence. Stop. */
(function(){
'use strict';
var timer=null,applying=false;
function $(id){return document.getElementById(id);}
function v(sel,fb){var e=document.querySelector(sel);return e&&e.value&&String(e.value).trim()?String(e.value).trim():fb;}
function N(){return v('[data-f="name"]','[Name]');}
function V(){return v('[data-f="vehicle"]','[vehicle]');}
function A(){return v('[data-f="agent"]','[agent]');}
function P(){return v('[data-f="number"]','[number]');}
function scenario(){return $('scenario')?$('scenario').value:'pre';}
function concern(){var c=$('concern')?$('concern').value:'sales';if(c==='finance')return 'the financing or paperwork';if(c==='features')return 'the features or controls';if(c==='condition')return 'the condition of the vehicle at delivery';if(c==='other')return 'what happened';return 'the purchase experience';}
function copyText(text,btn){function done(){var old=btn.textContent;btn.textContent='Copied';setTimeout(function(){btn.textContent=old;},850);}function fallback(){var ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}catch(e){}ta.remove();done();}if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(done).catch(fallback);else fallback();}
function standard(){if($('surveySpokenStandard'))return;var sub=document.querySelector('.sub');if(!sub||!sub.parentNode)return;var box=document.createElement('div');box.id='surveySpokenStandard';box.setAttribute('role','note');box.style.cssText='margin:0 0 12px;padding:9px 11px;border:1px solid #c9dbff;border-radius:10px;background:#eef4ff;font-size:12.5px;line-height:1.5;color:#31435a';box.innerHTML='<b>Spoken standard:</b> ownership first → one issue question → survey gets one sentence → stop. If there is a problem, the survey disappears from the conversation.';sub.parentNode.insertBefore(box,sub.nextSibling);}
function scripts(){
  var n=N(),veh=V(),a=A(),p=P(),issue=concern();
  if(scenario()==='arrived')return {
    call:n+'? '+a+' here. How is the '+veh+' treating you? Anything about the purchase, paperwork, setup or delivery still bugging you or not quite clear?\n\n[Let them answer.]\n\nGood. Nissan may have sent the purchase survey by now. If you see it, give them your real experience.',
    cue:'Ask about the ownership experience first. Survey gets one sentence only after they answer.',
    vm:'Hi '+n+', '+a+' here. Quick ownership check on the '+veh+'. Anything from the purchase or delivery still unresolved? Call or text me at '+p+'.',
    sms:'Hi '+n+', '+a+' here. How is the '+veh+' treating you? Anything from the purchase, paperwork, setup or delivery still unresolved? Nissan may have sent the survey too. If you see it, give them your real experience.',
    subject:'Quick Check on Your '+veh,
    email:'Hi '+n+',\n\nHow is the '+veh+' treating you? Anything from the purchase, paperwork, setup or delivery still unresolved?\n\nNissan may have sent the purchase survey too. If you see it, give them your real experience.\n\n'+a,
    route:'If they name a problem, stop discussing the survey and work the problem. If nothing is wrong, leave the survey alone.'
  };
  if(scenario()==='notreceived')return {
    call:'No problem. Do not chase it. How is the '+veh+' treating you, and is there anything you still need from me?',
    cue:'The missing survey is not the issue. Return to ownership care.',
    vm:'Hi '+n+', '+a+' here. No need to hunt for the Nissan survey. I mainly want to know whether the '+veh+' is treating you well and whether anything still needs attention. Call or text me at '+p+'.',
    sms:'No need to chase the Nissan survey, '+n+'. How is the '+veh+' treating you? Anything you still need from me?',
    subject:'How Is the '+veh+' Treating You?',
    email:'Hi '+n+',\n\nNo need to hunt for the Nissan survey.\n\nHow is the '+veh+' treating you? Anything from the purchase, setup or delivery you still want me to clear up?\n\n'+a,
    route:'Do not keep reminding someone who cannot find the survey. Return to normal ownership follow-up.'
  };
  if(scenario()==='issue')return {
    call:n+'? '+a+' here. Got it. Put the survey aside. Tell me exactly what happened with '+issue+'. What is still unresolved right now?\n\n[Let them finish.]\n\nAnything else, or is that the whole issue?',
    cue:'Get the complete issue before trying to solve it. Then route it to the right person.',
    vm:'Hi '+n+', '+a+' here. I am calling about the open issue with your '+veh+'. Tell me what is still unresolved so I can get the right next step moving. Call or text me at '+p+'.',
    sms:'Hi '+n+', '+a+' here. Put the survey aside. What is still unresolved with '+issue+' right now?',
    subject:'Let’s Get the '+veh+' Issue Handled',
    email:'Hi '+n+',\n\nPut the survey aside for now. What is still unresolved with '+issue+'?\n\nGive me the full issue and I will get the right next step moving.\n\n'+a,
    route:'Write down the issue exactly as the customer describes it and isolate whether anything else is wrong. Financing, paperwork, payment, APR, approval or protection questions go to Bob, Daniel or Jack. Anything outside your authority gets the appropriate manager. Do not promise an outcome you have not verified.'
  };
  if(scenario()==='completed')return {
    call:n+'? '+a+' here. Thanks for taking the time on the Nissan survey. More important, how is the '+veh+' treating you? Anything still unresolved?',
    cue:'Do not ask for the score. The survey is finished. Go back to ownership care.',
    vm:'Hi '+n+', '+a+' here. Thanks for taking the time on the Nissan survey. I am checking on the '+veh+' itself now. If anything still needs attention, call or text me at '+p+'.',
    sms:'Thanks for taking the time on the Nissan survey, '+n+'. How is the '+veh+' treating you? Anything still unresolved?',
    subject:'How Is the '+veh+' Going?',
    email:'Hi '+n+',\n\nThanks for taking the time on the Nissan survey.\n\nHow is the '+veh+' treating you? If anything is still unresolved, send it to me and I will work the next step.\n\n'+a,
    route:'Survey is done. Do not ask for the score or try to decode it. Return to normal ownership follow-up.'
  };
  return {
    call:n+'? '+a+' here. How is the '+veh+' treating you so far? Anything from the purchase, setup or delivery still bugging you or not quite clear?\n\n[Let them answer.]\n\nGood. Nissan may send a short purchase survey. If you see it, give them your real experience.',
    cue:'This is an ownership call, not a survey call. One real question first. Survey gets one sentence.',
    vm:'Hi '+n+', '+a+' here. Quick ownership check on the '+veh+'. Anything from delivery or setup still unresolved? Call or text me at '+p+'.',
    sms:'Hi '+n+', '+a+' here. How is the '+veh+' treating you? Anything from the purchase, setup or delivery still unresolved? Nissan may send a short survey too. If you see it, give them your real experience.',
    subject:'How Is the '+veh+' Treating You?',
    email:'Hi '+n+',\n\nHow is the '+veh+' treating you? Anything from the purchase, setup or delivery still unresolved?\n\nNissan may send a short purchase survey too. If you see it, give them your real experience.\n\n'+a,
    route:'If they raise anything unresolved, move immediately to issue recovery. If everything is good, leave the survey alone and continue normal ownership follow-up.'
  };
}
function apply(){if(applying)return;applying=true;standard();var s=scripts(),map={callOut:s.call,vmOut:s.vm,smsOut:s.sms,subjOut:s.subject,emailOut:s.email,callCue:s.cue,routeOut:s.route};Object.keys(map).forEach(function(id){var e=$(id);if(e&&e.textContent!==map[id])e.textContent=map[id];});document.querySelectorAll('[data-copy]').forEach(function(btn){btn.onclick=function(){var target=$(this.getAttribute('data-copy'));copyText(target?target.textContent:'',this);};});applying=false;}
function schedule(){clearTimeout(timer);timer=setTimeout(apply,0);}
function bind(){apply();document.addEventListener('change',schedule);document.addEventListener('input',schedule);if(window.MutationObserver&&document.body)new MutationObserver(function(){if(!applying)schedule();}).observe(document.body,{childList:true,subtree:true,characterData:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();