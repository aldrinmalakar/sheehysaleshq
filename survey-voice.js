/* SHEEHY SALES HQ - dedicated Nissan VOC follow-up voice.
   Ownership first. Survey second. No score coaching. */
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
function scripts(){
  var n=N(),veh=V(),a=A(),p=P(),issue=concern();
  if(scenario()==='arrived')return {
    call:'Hi '+n+', '+a+' here. Quick check on the '+veh+'. Is there anything about the purchase, paperwork, setup or delivery you wish had gone differently?\n\n[Let them answer.]\n\nGood. Nissan may have sent the purchase survey by now. If you see it, give them your real experience.',
    cue:'Do not lead with the survey. Ask the question that could uncover a real problem first.',
    vm:'Hi '+n+', '+a+' here. Quick check on the '+veh+'. I want to make sure nothing from the purchase or delivery is still hanging out there. Call or text me at '+p+' when you get a second.',
    sms:'Hi '+n+', '+a+' here. Quick check on the '+veh+': anything from the purchase, paperwork, setup or delivery still feel unfinished? Nissan may have sent the survey by now too. If you see it, give them your real experience.',
    subject:'Quick Check on Your '+veh,
    email:'Hi '+n+',\n\nQuick check on the '+veh+'. Is there anything about the purchase, paperwork, setup or delivery you wish had gone differently?\n\nIf everything is good, great. Nissan may have sent the purchase survey by now. If you see it, give them your real experience.\n\n'+a,
    route:'If they name a problem, stop the survey conversation and work that problem. If nothing is wrong, do not keep selling the survey.'
  };
  if(scenario()==='notreceived')return {
    call:'No problem. Do not chase the survey. If Nissan sends it, it will show up. More important, how is the '+veh+' treating you and is there anything you still need from me?',
    cue:'The missing survey is not a sales problem. Return to ownership care.',
    vm:'Hi '+n+', '+a+' here. No need to hunt for the Nissan survey. I mainly wanted to make sure the '+veh+' is treating you well and nothing from delivery still needs attention. Call or text me at '+p+'.',
    sms:'No worries on the Nissan survey, '+n+'. Do not chase it. How is the '+veh+' treating you? Anything you still need from me?',
    subject:'How Is the '+veh+' Treating You?',
    email:'Hi '+n+',\n\nNo need to hunt for the Nissan survey. If it comes through, it comes through.\n\nMore important, how is the '+veh+' treating you? Anything from the purchase, setup or delivery you still want me to clear up?\n\n'+a,
    route:'Do not repeatedly remind a customer who cannot find the survey. Go back to normal ownership follow-up.'
  };
  if(scenario()==='issue')return {
    call:'Okay. Forget the survey for a second. Tell me exactly what happened with '+issue+'. What is still unresolved right now?\n\n[Let them finish.]\n\nAnything else, or is that the whole issue?',
    cue:'Get the whole problem before trying to solve it. Then involve the right person and give one clear next step.',
    vm:'Hi '+n+', '+a+' here. I am following up on the open issue with your '+veh+'. I want to get the actual problem clear and work the right next step. Call or text me at '+p+'.',
    sms:'Hi '+n+', '+a+' here. Let us get the open issue on the '+veh+' handled. What is still unresolved with '+issue+' right now?',
    subject:'Let’s Get the '+veh+' Issue Clear',
    email:'Hi '+n+',\n\nLet us get the open issue handled.\n\nWhat is still unresolved with '+issue+' right now? Give me the full version so I can work the right next step instead of guessing.\n\n'+a,
    route:'Write down the issue exactly as the customer describes it and isolate whether anything else is wrong. Financing, paperwork, payment, APR, approval or protection questions go to Bob, Daniel or Jack. Anything outside your authority gets the appropriate manager. Do not promise an outcome you have not verified.'
  };
  if(scenario()==='completed')return {
    call:'Got it. Thanks for taking the time. Now back to the '+veh+': how is it treating you? Anything you still want me to clear up?',
    cue:'Do not ask what they scored. The survey is finished. Go back to being their salesperson after the sale.',
    vm:'Hi '+n+', '+a+' here. Thanks for taking the time on the Nissan survey. I am checking on the '+veh+' itself now. Call or text me at '+p+' if anything still needs an explanation.',
    sms:'Thanks for taking the time on the Nissan survey, '+n+'. Now back to the '+veh+': how is it treating you? Anything you still want me to clear up?',
    subject:'How Is the '+veh+' Going?',
    email:'Hi '+n+',\n\nThanks for taking the time on the Nissan survey.\n\nNow back to the '+veh+': how is it treating you? If anything still needs an explanation, send it to me and I will help get it sorted.\n\n'+a,
    route:'Survey is done. Do not ask for the score or try to decode the response. Return the customer to the normal ownership relationship.'
  };
  return {
    call:'Hi '+n+', '+a+' here. How is the '+veh+' treating you so far?\n\n[Let them answer.]\n\nAnything from the purchase, setup or delivery still bugging you or not quite clear?\n\n[Let them answer.]\n\nGood. Nissan may send you a short purchase survey. If you see it, give them your real experience.',
    cue:'This should feel like an ownership call. The survey gets one sentence, not a speech.',
    vm:'Hi '+n+', '+a+' here. Quick check on the '+veh+'. I want to make sure nothing from delivery or setup is still hanging out there. Call or text me at '+p+' when you get a second.',
    sms:'Hi '+n+', '+a+' here. How is the '+veh+' treating you? Anything from the purchase, setup or delivery still feel unfinished? Nissan may send a short survey too. If you see it, give them your real experience.',
    subject:'How Is the '+veh+' Treating You?',
    email:'Hi '+n+',\n\nHow is the '+veh+' treating you so far?\n\nAnything from the purchase, setup or delivery still feel unfinished or unclear? If so, tell me and I will work it.\n\nNissan may send a short purchase survey too. If you see it, give them your real experience.\n\n'+a,
    route:'If they raise anything unresolved, move immediately to issue recovery. If everything is good, leave it alone and continue normal ownership follow-up.'
  };
}
function apply(){if(applying)return;applying=true;var s=scripts(),map={callOut:s.call,vmOut:s.vm,smsOut:s.sms,subjOut:s.subject,emailOut:s.email,callCue:s.cue,routeOut:s.route};Object.keys(map).forEach(function(id){var e=$(id);if(e&&e.textContent!==map[id])e.textContent=map[id];});document.querySelectorAll('[data-copy]').forEach(function(btn){btn.onclick=function(){var target=$(this.getAttribute('data-copy'));copyText(target?target.textContent:'',this);};});applying=false;}
function schedule(){clearTimeout(timer);timer=setTimeout(apply,0);}
function bind(){apply();document.addEventListener('change',schedule);document.addEventListener('input',schedule);if(window.MutationObserver&&document.body)new MutationObserver(function(){if(!applying)schedule();}).observe(document.body,{childList:true,subtree:true,characterData:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();
