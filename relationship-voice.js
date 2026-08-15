/* SHEEHY SALES HQ - warm-confidence voice for After Sale and Sister Store. */
(function(g){
'use strict';
var page=(location.pathname.split('/').pop()||'').toLowerCase(),timer=null;
var GOOGLE='https://maps.app.goo.gl/5cVXhw1VefmqZtwW6';
function $(id){return document.getElementById(id);}
function val(sel,fb){var e=document.querySelector(sel);return e&&e.value&&String(e.value).trim()?String(e.value).trim():fb;}
function N(){return val('[data-f="name"]','[Name]');}
function V(){return val('[data-f="vehicle"]','[vehicle]');}
function A(){return val('[data-f="agent"]','[agent]');}
function P(){return val('[data-f="number"]','[number]');}
function clean(s){return String(s||'').replace(/\bjust checking in\b/gi,'checking in with a purpose').replace(/\bjust following up\b/gi,'following up with a clear next step').replace(/\bcircling back\b/gi,'following up').replace(/\bno pressure(?: at all)?[,.]?\s*/gi,'').replace(/[ \t]{2,}/g,' ');}
function copied(btn){var o=btn.textContent;btn.textContent='Copied';setTimeout(function(){btn.textContent=o;},850);}
function fallback(text){var ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}catch(e){}ta.remove();}
function copy(text,btn){if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(function(){copied(btn);}).catch(function(){fallback(text);copied(btn);});else{fallback(text);copied(btn);}}

function afterText(title,kind){
  var n=N(),v=V(),a=A(),p=P(),m={
    'Issue recovery first':{
      call:'Hi '+n+', '+a+' at Sheehy Nissan. Thank you for telling me something is still open on the '+v+'. I want to get the issue handled, not explain around it. Walk me through exactly what is unresolved and I will get the right next step moving.',
      vm:'Hi '+n+', '+a+' at Sheehy Nissan. I am following up on the open item with your '+v+'. I want to understand it clearly and get it to the right person. Call or text me at '+p+'.',
      sms:'Hi '+n+', '+a+' at Sheehy Nissan. I want to get the open item on your '+v+' handled. What is the one part that is still unresolved?',
      email:'Hi '+n+',\n\nThank you for telling me something is still open on your '+v+'. I want to get the actual issue handled.\n\nReply with the one part that is still unresolved and I will get the correct next step moving.\n\n'+a
    },
    'First-night check':{
      sms:'Hi '+n+', '+a+' here. First night with the '+v+'. What already feels great and what is the one thing you want me to clear up while it is still fresh?',
      email:'Hi '+n+',\n\nFirst night with the '+v+'. I wanted to check the handoff while everything is still fresh.\n\nWhat already feels great and what is the one thing you want me to clear up?\n\n'+a
    },
    '24-hour ownership call':{
      call:'Hi '+n+', '+a+' at Sheehy Nissan. You have had your first real day with the '+v+'. Give me the real read: what is better than expected and what still needs an explanation?',
      vm:'Hi '+n+', '+a+' at Sheehy Nissan. I wanted to catch you after your first real day with the '+v+' and make sure the vehicle and the handoff feel right. Call or text me at '+p+'.',
      sms:'Hi '+n+', first real day with the '+v+'. What is better than expected and what still needs an explanation? I want anything unclear handled while it is fresh.'
    },
    'Experience cleanup':{
      sms:'Hi '+n+', you should be settling into the '+v+' now. What is the one thing with features, controls, paperwork or delivery that still feels unfinished? Tell me and I will work the next step.',
      email:'Hi '+n+',\n\nYou have had a few days with the '+v+'. I want the purchase to feel finished, not just the paperwork.\n\nWhat is the one thing with features, controls, paperwork or delivery that still needs attention? Tell me and I will work it.\n\n'+a
    },
    'Google experience review':{
      sms:'Hi '+n+', you have had real time with the '+v+' now, so I would value your honest take on working with us. If you have a minute, share the experience here: '+GOOGLE+' Your words help the next shopper know what to expect.',
      email:'Hi '+n+',\n\nYou have had real time with the '+v+' now, so I would value your honest take on working with us.\n\nIf you have a minute, share the experience on Google here:\n'+GOOGLE+'\n\nA genuine review helps the next shopper know what working with us is actually like.\n\nThank you again,\n'+a
    },
    'Referral conversation':{
      call:'Hi '+n+', you have had the '+v+' about a month now and I want to ask you one direct favor. If I earned your trust, who is the first person you would feel comfortable introducing me to when they need a vehicle? You make the introduction. I will take care of the rest.',
      vm:'Hi '+n+', '+a+' at Sheehy Nissan. I wanted to check on the '+v+' and ask you one quick favor. Call or text me at '+p+' when you have a second.',
      sms:'Quick favor, '+n+'. If I earned your trust, who is the first person you would feel comfortable introducing me to when they need a vehicle? You make the introduction and I will take care of the rest.',
      email:'Hi '+n+',\n\nYou have had the '+v+' about a month now. If I earned your trust, who is the first person you would feel comfortable introducing me to when they need a vehicle?\n\nYou do not have to sell them on me. Make the introduction and I will take care of the rest.\n\n'+a
    },
    '90-day ownership check':{
      call:'Hi '+n+', you have had the '+v+' long enough for the honeymoon period to wear off. Give me the real ownership answer now: what is one thing you love and one thing you would change?',
      vm:'Hi '+n+', '+a+' at Sheehy Nissan. I am checking in around the 90-day mark on the '+v+'. I want the real ownership read now. Call or text me at '+p+'.',
      sms:'About 90 days with the '+v+' now. Give me the real ownership read: one thing you love and one thing you would change?'
    },
    'Six-month relationship check':{
      call:'Hi '+n+', '+a+' at Sheehy Nissan. Six months already. I am not manufacturing a sales reason. I am checking whether there is anything automotive I can make easier right now with the '+v+', service or a question.',
      sms:'Hi '+n+', six-month check from '+a+'. Anything automotive I can make easier right now with the '+v+', service or a question?',
      email:'Hi '+n+',\n\nSix months with the '+v+' already. I am not reaching out to manufacture a sales reason. I want to stay useful.\n\nAnything automotive I can make easier right now with the vehicle, service or a question?\n\n'+a
    }
  };
  return m[title]&&m[title][kind]||'';
}
function patchAfterSale(){
  var title=$('workTitle')?$('workTitle').textContent.trim():'';
  document.querySelectorAll('#scripts .script-card').forEach(function(card){
    var kind=['call','vm','sms','email','mail','gift'].filter(function(k){return card.classList.contains(k);})[0]||'',body=card.querySelector('.body'),sub=card.querySelector('.subject'),txt=afterText(title,kind);
    if(body){var next=txt||clean(body.textContent);if(body.textContent!==next)body.textContent=next;}
    var b=card.querySelector('.copy-btn');if(b)b.onclick=function(){copy((sub&&sub.textContent?'Subject: '+sub.textContent+'\n\n':'')+(body?body.textContent:''),b);};
  });
}
function patchSister(){
  document.querySelectorAll('#scripts .card').forEach(function(card){
    var body=card.querySelector('.body');if(!body)return;var t=clean(body.textContent);
    if(card.classList.contains('call')&&!/wanted you to hear|appreciate|you are right/i.test(t))t=t.replace(/^(Hi [^.]+\.)\s*/,'$1 I wanted you to hear the update from me directly. ');
    if(card.classList.contains('sms')&&!/wanted to give you|you are right/i.test(t))t=t.replace(/^(Hi [^.]+\.)\s*/,'$1 I wanted to give you the clean update directly. ');
    if(body.textContent!==t)body.textContent=t;
    var b=card.querySelector('.copy'),sub=card.querySelector('.subject');if(b)b.onclick=function(){copy((sub&&sub.textContent?'Subject: '+sub.textContent+'\n\n':'')+body.textContent,b);};
  });
}
function schedule(fn){clearTimeout(timer);timer=setTimeout(fn,0);}
function bind(fn){
  fn();
  document.addEventListener('change',function(){schedule(fn);});
  document.addEventListener('input',function(){schedule(fn);});
  document.addEventListener('click',function(){schedule(fn);});
}
if(page==='after-sale.html')bind(patchAfterSale);
else if(page==='sister-store.html')bind(patchSister);
})(window);
