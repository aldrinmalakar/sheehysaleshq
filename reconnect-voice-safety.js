/* SHEEHY SALES HQ - Reconnect spoken-commercial voice.
   Reopen the decision. Isolate what changed. Earn the next commitment. */
(function(){
'use strict';
if((location.pathname.split('/').pop()||'').toLowerCase()!=='reconnect.html')return;
var timer=null,applying=false;
function $(id){return document.getElementById(id);}
function v(sel,fb){var e=document.querySelector(sel);return e&&e.value&&String(e.value).trim()?String(e.value).trim():fb;}
function N(){return v('[data-f="name"]','[Name]');}
function V(){return v('[data-f="vehicle"]','[vehicle]');}
function A(){return v('[data-f="agent"]','[agent]');}
function P(){return v('[data-f="number"]','[number]');}
function sc(){return $('scenario')?$('scenario').value:'noresponse';}
function cold(){var e=$('agePill');return !!(e&&e.classList.contains('cold'));}
function slot(){try{return typeof window.slotPhrase==='function'&&window.slotPhrase()?window.slotPhrase():'today';}catch(e){return 'today';}}
function alt(){try{return typeof window.altPhrase==='function'&&window.altPhrase()?window.altPhrase():'tomorrow';}catch(e){return 'tomorrow';}}
function vmIntro(){return cold()&&String(A()).toLowerCase()==='aldrin'?'Hi '+N()+', this is '+A()+', like Buzz Aldrin, at Sheehy Nissan of Manassas.':'Hi '+N()+', this is '+A()+' at Sheehy Nissan of Manassas.';}
function standard(){if($('reconnectSpokenStandard'))return;var sub=document.querySelector('.sub');if(!sub||!sub.parentNode)return;var box=document.createElement('div');box.id='reconnectSpokenStandard';box.style.cssText='margin:0 0 12px;padding:9px 11px;border:1px solid #c9dbff;border-radius:10px;background:#eef4ff;font-size:12.5px;line-height:1.5;color:#31435a';box.innerHTML='<b>Spoken standard:</b> identify → where the deal stopped → one isolation question → next commitment → stop. Do not resell the whole car.';sub.parentNode.insertBefore(box,sub.nextSibling);}
function call(){
  var n=N(),veh=V(),a=A(),s=sc(),x=slot(),y=alt(),open=n+'? '+a+' at Sheehy Nissan. ';
  if(s==='pencil')return open+'You saw the numbers on the '+veh+'. Which part kept it from being a yes: the selling price, the payment, the trade or the timing?\n\n[Let them answer. Isolate that one issue.]\n\nIf we solve that piece, is there anything else keeping you from moving forward?\n\n[If no] Good. Let us put the current picture in front of you. '+x+' or '+y+'?';
  if(s==='testdrive')return open+'You drove the '+veh+'. What kept it from becoming the next step: the vehicle itself, the numbers, the trade or the timing?\n\n[Let them answer. Do not defend anything yet.]\n\nIf we get that one piece right, are you ready to pick this back up?';
  if(s==='visit')return open+'You came by on the '+veh+' but we never got to the drive. Was the vehicle not clicking, or did the visit just get cut short?\n\n[If the visit got cut short] Got it. Let us finish the part that actually tells you something. '+x+' or '+y+'?';
  if(s==='video')return open+'I sent you the video on the '+veh+'. Did it answer what you were looking for, or did I miss the part that actually matters to you?\n\n[If still interested] What do you need next: a specific answer, the numbers or a time to see it?';
  if(s==='quiet')return open+'We had a real conversation on the '+veh+' and then it went quiet. Did the plan change, or is one thing still unresolved?\n\n[Let them answer.]\n\nIf it is still active, what is the one thing we need to solve next?';
  if(s==='novm')return open+'I tried you on the '+veh+' and never caught you live. Are you still shopping for one, or did you already handle it?\n\n[If still shopping] What do you need next: the vehicle, the numbers or a time to see it?';
  return open+'You had asked about the '+veh+' and I never caught you live. Are you still shopping for one, or did you already handle it?\n\n[If still shopping] What matters next: the vehicle itself, the numbers or a time to see it?';
}
function vm(){
  var veh=V(),s=sc(),lead=vmIntro()+' ';
  if(s==='pencil')return lead+'You saw the numbers on the '+veh+' and I want to finish one part of that conversation. What kept it from being a yes? Call or text me at '+P()+'. Again, '+A()+' at '+P()+'.';
  if(s==='testdrive')return lead+'You drove the '+veh+' and I want to finish one part of that conversation. What kept it from becoming the next step? Call or text me at '+P()+'.';
  if(s==='visit')return lead+'You came by on the '+veh+' but we never got to the drive. Was it the vehicle, or did the visit just get cut short? Call or text me at '+P()+'.';
  if(s==='video')return lead+'I sent you the video on the '+veh+'. Did it answer what you were looking for, or did I miss the part that matters? Call or text me at '+P()+'.';
  if(s==='quiet')return lead+'We had a real conversation on the '+veh+' and then it went quiet. Did the plan change, or is one thing still unresolved? Call or text me at '+P()+'.';
  return lead+'I am calling about the '+veh+' you had asked about. Are you still shopping, or did you already handle it? Call or text me at '+P()+'.';
}
function sms(){
  var n=N(),veh=V(),a=A(),s=sc();
  if(s==='pencil')return 'Hi '+n+', '+a+' at Sheehy Nissan. You saw the numbers on the '+veh+'. What kept it from being a yes: price, payment, trade or timing?';
  if(s==='testdrive')return 'Hi '+n+', '+a+' here. You drove the '+veh+'. What kept it from the next step: the vehicle, numbers, trade or timing?';
  if(s==='visit')return 'Hi '+n+', '+a+' at Sheehy Nissan. You came by on the '+veh+' but never drove it. Was the vehicle not clicking, or did the visit just get cut short?';
  if(s==='video')return 'Hi '+n+', '+a+' here. I sent you the video on the '+veh+'. Did it answer what you needed, or did I miss the part that matters?';
  if(s==='quiet')return 'Hi '+n+', '+a+' at Sheehy Nissan. We had a real conversation on the '+veh+' and then it went quiet. Did the plan change, or is one thing still unresolved?';
  return 'Hi '+n+', '+a+' at Sheehy Nissan. You had asked about the '+veh+'. Are you still shopping for one, or did you already handle it?';
}
function subject(){var s=sc(),veh=V(),n=N();if(s==='pencil')return n+', What Stopped the '+veh+' Deal?';if(s==='testdrive')return n+', One Question After the '+veh+' Drive';if(s==='visit')return n+', We Never Got to the '+veh+' Drive';if(s==='video')return n+', Did the '+veh+' Video Answer It?';if(s==='quiet')return n+', Did the '+veh+' Plan Change?';return n+', Still Shopping for the '+veh+'?';}
function email(){
  var n=N(),veh=V(),a=A(),s=sc(),q='';
  if(s==='pencil')q='You saw the numbers on the '+veh+'. What kept it from being a yes: selling price, payment, trade or timing?';
  else if(s==='testdrive')q='You drove the '+veh+'. What kept it from the next step: the vehicle itself, the numbers, the trade or the timing?';
  else if(s==='visit')q='You came by on the '+veh+' but we never got to the drive. Was the vehicle not clicking, or did the visit just get cut short?';
  else if(s==='video')q='I sent you the video on the '+veh+'. Did it answer what you needed, or did I miss the part that matters?';
  else if(s==='quiet')q='We had a real conversation on the '+veh+' and then it went quiet. Did the plan change, or is one thing still unresolved?';
  else q='You had asked about the '+veh+'. Are you still shopping for one, or did you already handle it?';
  return 'Hi '+n+',\n\n'+q+'\n\nReply with the one thing that is true now and I will work from there.\n\n'+a;
}
function apply(){if(applying)return;applying=true;standard();var map={callOut:call(),vmOut:vm(),smsOut:sms(),subjOut:subject(),bodyOut:email()};Object.keys(map).forEach(function(id){var e=$(id);if(e&&e.value!==map[id])e.value=map[id];});applying=false;}
function schedule(){clearTimeout(timer);timer=setTimeout(apply,0);}
function bind(){apply();document.addEventListener('input',schedule);document.addEventListener('change',schedule);document.addEventListener('click',schedule);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();