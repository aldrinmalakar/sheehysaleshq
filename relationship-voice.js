/* SHEEHY SALES HQ - After Sale spoken-commercial voice.
   Relationship first. Specific reason. One real question. Next step. Stop. */
(function(){
'use strict';
if((location.pathname.split('/').pop()||'').toLowerCase()!=='after-sale.html')return;
var GOOGLE='https://maps.app.goo.gl/5cVXhw1VefmqZtwW6',timer=null,applying=false;
function $(id){return document.getElementById(id);}
function val(sel,fb){var e=document.querySelector(sel);return e&&e.value&&String(e.value).trim()?String(e.value).trim():fb;}
function N(){return val('[data-f="name"]','[Name]');}
function V(){return val('[data-f="vehicle"]','[vehicle]');}
function A(){return val('[data-f="agent"]','[agent]');}
function P(){return val('[data-f="number"]','[number]');}
function copied(btn){var o=btn.textContent;btn.textContent='Copied';setTimeout(function(){btn.textContent=o;},850);}
function fallback(text){var ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}catch(e){}ta.remove();}
function copy(text,btn){if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(function(){copied(btn);}).catch(function(){fallback(text);copied(btn);});else{fallback(text);copied(btn);}}
function standard(){
  if($('afterSaleSpokenStandard'))return;
  var host=$('scripts');if(!host||!host.parentNode)return;
  var box=document.createElement('div');box.id='afterSaleSpokenStandard';box.setAttribute('role','note');
  box.style.cssText='margin:0 0 12px;padding:9px 11px;border:1px solid #c9dbff;border-radius:10px;background:#eef4ff;font-size:12.5px;line-height:1.5;color:#31435a';
  box.innerHTML='<b>Spoken standard:</b> identify → specific ownership reason → one real question → next step → stop. Do not read a paragraph at the customer.';
  host.parentNode.insertBefore(box,host);
}
function scripts(title){
  var n=N(),v=V(),a=A(),p=P();
  var m={
    'Issue recovery first':{
      call:n+'? '+a+' here. I want to get the open issue on the '+v+' handled. Tell me what is still unresolved right now.\n\n[Let them finish.]\n\nAnything else, or is that the whole issue?',
      vm:'Hi '+n+', '+a+' here. I am calling about the open issue on your '+v+'. Tell me what is still unresolved so I can get the right next step moving. Call or text me at '+p+'.',
      sms:'Hi '+n+', '+a+' here. What is still unresolved on the '+v+' right now? Give me the one issue and I will work the next step.',
      email:'Hi '+n+',\n\nWhat is still unresolved on the '+v+' right now?\n\nSend me the one issue and I will get the right next step moving.\n\n'+a
    },
    'First-night check':{
      sms:'Hi '+n+', '+a+' here. First night with the '+v+'. Anything from delivery or setup you want me to clear up while it is still fresh?',
      email:'Hi '+n+',\n\nFirst night with the '+v+'. Anything from delivery or setup you want me to clear up while it is still fresh?\n\n'+a
    },
    '24-hour ownership call':{
      call:n+'? '+a+' here. You have had a full day with the '+v+'. What is the one thing you like most so far, and is anything still unclear?',
      vm:'Hi '+n+', '+a+' here. Quick day-one check on the '+v+'. Is anything from the vehicle, setup or delivery still unclear? Call or text me at '+p+'.',
      sms:'Hi '+n+', day-one check on the '+v+'. Anything with the vehicle, setup or delivery still unclear?'
    },
    'Experience cleanup':{
      sms:'Hi '+n+', you have had a few days with the '+v+'. Anything with the features, paperwork or delivery still unfinished? Tell me the one thing and I will work it.',
      email:'Hi '+n+',\n\nYou have had a few days with the '+v+'. Anything with the features, paperwork or delivery still unfinished?\n\nTell me the one thing and I will work it.\n\n'+a
    },
    'Nissan survey check':{
      call:n+'? '+a+' here. How is the '+v+' treating you? Anything from the purchase, setup or delivery still bugging you or not quite clear?\n\n[Let them answer.]\n\nGood. Nissan may send a short purchase survey. If you see it, give them your real experience.',
      vm:'Hi '+n+', '+a+' here. Quick ownership check on the '+v+'. Anything from delivery or setup still unresolved? Call or text me at '+p+'.',
      sms:'Hi '+n+', '+a+' here. How is the '+v+' treating you? Anything from the purchase, setup or delivery still unresolved? Nissan may send a short survey too. If you see it, give them your real experience.',
      email:'Hi '+n+',\n\nHow is the '+v+' treating you? Anything from the purchase, setup or delivery still unresolved?\n\nNissan may send a short purchase survey too. If you see it, give them your real experience.\n\n'+a
    },
    'Google experience review':{
      sms:'Hi '+n+', you have had some real time with the '+v+' now. If you are willing, I would appreciate an honest Google review of what it was like working with me: '+GOOGLE,
      email:'Hi '+n+',\n\nYou have had some real time with the '+v+' now. If you are willing, I would appreciate an honest Google review of what it was like working with me.\n\n'+GOOGLE+'\n\nThank you,\n'+a
    },
    'Referral conversation':{
      call:n+'? '+a+' here. You have had the '+v+' about a month, so I am going to ask you one direct favor. If I earned your trust, who is the first person you would feel comfortable introducing me to when they need a vehicle?\n\n[Let them answer.]\n\nYou make the introduction. I will take it from there.',
      vm:'Hi '+n+', '+a+' here. I wanted to check on the '+v+' and ask you one quick favor. Call or text me at '+p+' when you get a second.',
      sms:'Quick favor, '+n+'. If I earned your trust, who is the first person you would feel comfortable introducing me to when they need a vehicle? You make the introduction. I will take it from there.',
      email:'Hi '+n+',\n\nIf I earned your trust, who is the first person you would feel comfortable introducing me to when they need a vehicle?\n\nYou make the introduction. I will take it from there.\n\n'+a
    },
    '90-day ownership check':{
      call:n+'? '+a+' here. You have had the '+v+' long enough to know it now. What is one thing you really like and one thing you would change?',
      vm:'Hi '+n+', '+a+' here. Ninety-day check on the '+v+'. I want the real ownership read when you get a second. Call or text me at '+p+'.',
      sms:'About 90 days with the '+v+' now. What is one thing you really like and one thing you would change?'
    },
    'Six-month relationship check':{
      call:n+'? '+a+' here. Six months with the '+v+' already. Anything changed with the way you use it, or is it still doing exactly what you bought it to do?',
      sms:'Hi '+n+', six months with the '+v+' already. Still doing the job you bought it for, or has anything changed?',
      email:'Hi '+n+',\n\nSix months with the '+v+' already. Is it still doing the job you bought it for, or has anything changed?\n\nIf something automotive comes up, send it my way.\n\n'+a
    },
    'Ownership anniversary':{
      sms:'One year with the '+v+', '+n+'. How has it treated you? If you need anything automotive this year, send it my way. '+a,
      mail:n+',\n\nOne year with the '+v+' already. Thank you again for trusting me with it. I hope it has treated you well.\n\nIf you need anything automotive, I am still here.\n\n'+a
    }
  };
  return m[title]||null;
}
function apply(){
  if(applying)return;applying=true;standard();
  var title=$('workTitle')?$('workTitle').textContent.trim():'',set=scripts(title);
  document.querySelectorAll('#scripts .script-card').forEach(function(card){
    var kind=['call','vm','sms','email','mail','gift'].filter(function(k){return card.classList.contains(k);})[0]||'',body=card.querySelector('.body'),sub=card.querySelector('.subject');
    if(set&&set[kind]&&body&&body.textContent!==set[kind])body.textContent=set[kind];
    var b=card.querySelector('.copy-btn');if(b)b.onclick=function(){copy((sub&&sub.textContent?'Subject: '+sub.textContent+'\n\n':'')+(body?body.textContent:''),b);};
  });
  applying=false;
}
function schedule(){clearTimeout(timer);timer=setTimeout(apply,0);}
function bind(){apply();document.addEventListener('change',schedule);document.addEventListener('input',schedule);document.addEventListener('click',schedule);var host=$('scripts');if(host&&window.MutationObserver)new MutationObserver(function(){if(!applying)schedule();}).observe(host,{childList:true,subtree:true,characterData:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();