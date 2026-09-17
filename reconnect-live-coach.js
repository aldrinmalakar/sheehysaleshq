/* Reconnect live-call branch coach. The opener starts the call; customer answers drive the next line. */
(function(){
'use strict';
if((location.pathname.split('/').pop()||'').toLowerCase()!=='reconnect.html')return;
function $(id){return document.getElementById(id);}function f(k,fb){var e=document.querySelector('[data-f="'+k+'"]');return e&&e.value&&String(e.value).trim()?String(e.value).trim():fb;}function V(){return f('vehicle','the vehicle');}
var FLOW={
 shopping:{label:'Still shopping',say:function(){return 'Good. What has to be different this time for the '+V()+' conversation to be worth reopening?';},next:['price','payment','trade','vehicle','timing','decision']},
 bought:{label:'Already bought',say:function(){return 'Got it. What did you end up buying?';},after:'Listen. If they are happy, close the sales pursuit cleanly. Do not drag them back into the old deal.'},
 price:{label:'Price',say:function(){return 'Sounds like the number was the part you could not justify. Compared with what—another exact offer or the target you had in mind?';},after:'Mirror the number/comparison. Then: “Other than price, what else would still stop you?” If price is isolated, work the real gap and re-close.'},
 payment:{label:'Payment',say:function(){return 'Sounds like the payment was the hinge. What range actually works for you, and is the cash down fixed?';},after:'After they answer: “If the structure fits that range and the vehicle is right, what else would stop you?”'},
 trade:{label:'Trade',say:function(){return 'Sounds like the trade value is where we lost the deal. What did you expect it to be worth, and what are you basing that on?';},after:'Do not defend the appraisal. Isolate: “If we solve the trade side, what else would still stop you?”'},
 vehicle:{label:'Vehicle fit',say:function(){return 'Sounds like the vehicle itself missed something important. What specifically did it fail to give you?';},after:'Mirror the missing requirement. Then decide whether the original vehicle can solve it or whether you need a better-fit alternative.'},
 timing:{label:'Timing changed',say:function(){return 'Understood. What has to happen before this becomes a real decision again?';},after:'Get a real trigger/date. Close on a specific callback or appointment tied to that trigger, not “I’ll check back sometime.”'},
 decision:{label:'Other decision-maker',say:function(){return 'Sounds like the decision was never fully aligned. What does the other person need to see or hear before they could be comfortable moving forward?';},after:'Then ask: “And if they are comfortable, what would still be holding you back?” Bring everyone into the same conversation when useful.'},
 maybe:{label:'Vague / “maybe”',say:function(){return 'It sounds like something is still unresolved. What is the one thing keeping this from becoming a real yes or no?';},after:'Mirror the answer. Do not solve until it is specific. Then isolate and re-close.'},
 no:{label:'Not interested',say:function(){return 'Understood. Is that because you already solved the vehicle need, or because this deal stopped making sense?';},after:'If the need is gone, stop. If the deal stopped making sense, identify the exact blocker once; do not argue with a firm no.'}
};
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function choices(keys){return '<div class="rc-buttons">'+keys.map(function(k){return '<button type="button" data-rc="'+k+'">'+esc(FLOW[k].label)+'</button>';}).join('')+'</div>';}
function show(k){var x=FLOW[k],box=$('reconnectLiveCoach');if(!x||!box)return;box.innerHTML='<div class="rc-kicker">Customer said: '+esc(x.label)+'</div><div class="rc-line">'+esc(x.say())+'</div>'+(x.next?'<div class="rc-mini">What did they mean?</div>'+choices(x.next):'')+(x.after?'<div class="rc-after">'+esc(x.after)+'</div>':'')+'<button type="button" class="rc-reset" id="rcReset">Back to answers</button>';bind();}
function home(){var box=$('reconnectLiveCoach');if(!box)return;box.innerHTML='<div class="rc-kicker">They answered. What did you hear?</div>'+choices(['shopping','bought','price','payment','trade','vehicle','timing','decision','maybe','no']);bind();}
function bind(){document.querySelectorAll('[data-rc]').forEach(function(b){b.onclick=function(){show(b.getAttribute('data-rc'));};});var r=$('rcReset');if(r)r.onclick=home;}
function install(){
 var call=$('callOut');if(!call||$('reconnectLiveCoach'))return;
 var cp=$('cpCall');if(cp)cp.style.display='none';
 var block=call.closest('.block')||call.parentNode;
 var box=document.createElement('div');box.id='reconnectLiveCoach';box.className='rc-coach';block.appendChild(box);
 var style=document.createElement('style');style.textContent='.rc-coach{margin-top:10px;border:1px solid #cfd9ee;background:#f7f9ff;border-radius:10px;padding:11px}.rc-kicker{font-family:"Space Grotesk",sans-serif;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:#596983;margin-bottom:8px}.rc-buttons{display:flex;gap:7px;flex-wrap:wrap}.rc-buttons button,.rc-reset{border:1px solid #cbd5e5;background:#fff;border-radius:8px;padding:7px 10px;font:inherit;font-size:12px;font-weight:700;cursor:pointer}.rc-buttons button:hover{border-color:#2f5fe0;color:#2f5fe0}.rc-line{font-size:15px;line-height:1.55;font-weight:650;margin:5px 0 9px}.rc-after{border-left:3px solid #2f5fe0;padding:8px 10px;background:#fff;border-radius:7px;font-size:12.5px;line-height:1.5;color:#4f5f75;margin-top:9px}.rc-mini{font-size:11px;font-weight:750;color:#6b7889;margin:9px 0 6px}.rc-reset{margin-top:10px;color:#596983}';document.head.appendChild(style);home();
 }
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(install,100);});else setTimeout(install,100);
})();