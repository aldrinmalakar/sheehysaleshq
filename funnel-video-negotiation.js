/* Decision-focused Funnel video layer informed by customer language, tactical empathy and certainty. */
(function(g){
'use strict';
function $(id){return document.getElementById(id);}
function val(sel,fb){var e=document.querySelector(sel);return e&&e.value&&String(e.value).trim()?String(e.value).trim():fb;}
function name(){return val('[data-f="name"]','[Name]');}function vehicle(){return val('[data-f="vehicle"]','[vehicle]');}function agent(){return val('[data-f="agent"]','[agent]');}function time1(){return val('[data-f="daytime"]','[day/time]');}function time2(){return val('[data-f="alttime"]','[alt time]');}
function phrase(){return val('[data-f="customerphrase"]','');}
function priority(){return ($('buyingPriority')||{}).value||'unknown';}function stage(){return ($('stageSelect')||{}).value||'';}function behavior(){return ($('behavior')||{}).value||'';}
function score(key){var e=document.querySelector('[data-f="'+key+'"]'),n=e?parseInt(e.value,10):0;return isNaN(n)?0:n;}
function gap(){var a=[{k:'vehicle',n:score('certvehicle')},{k:'you',n:score('certyou')},{k:'store',n:score('certstore')}].filter(function(x){return x.n>0;});if(!a.length)return null;a.sort(function(a,b){return a.n-b.n;});return a[0];}
function ptext(){return {value:'price and overall value',comfort:'comfort and how it fits you',reliability:'ownership confidence',safety:'the safety equipment that matters to you',technology:'the technology you will actually use',space:'space and utility',ownership:'ownership cost'}[priority()]||'the part of the vehicle that matters most to you';}
function longDistance(){try{var c=g.SHQFunnelExecution&&g.SHQFunnelExecution.getContext?g.SHQFunnelExecution.getContext():{};return !!(c.distanceLong||c.distanceFar);}catch(e){return false;}}
function signature(){return [name(),vehicle(),agent(),time1(),time2(),priority(),stage(),behavior(),phrase(),score('certvehicle'),score('certyou'),score('certstore'),longDistance()?'remote':'local'].join('|');}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function point(n,title,text){return '<div class="po" data-negotiation-video="1"><div class="po-num">'+n+'</div><div><b>'+esc(title)+'</b><span>'+esc(text)+'</span></div></div>';}
function certaintyLine(){var g0=gap();if(!g0)return 'Use the video to raise certainty on the one thing the customer still doubts. Do not add features just because they are available.';if(g0.k==='vehicle')return 'Vehicle certainty is the weakest score ('+g0.n+'/10). Prove the exact fit, feature or condition point that is still uncertain.';if(g0.k==='you')return 'Trust in you is the weakest score ('+g0.n+'/10). Be precise, verify what you say, use their wording and let the proof do the selling.';return 'Dealership/process certainty is the weakest score ('+g0.n+'/10). Reduce surprise: show the actual unit, state the process clearly and answer the concern without hype.';}
function opening(){var base='“Hi '+name()+', '+agent()+' at Sheehy Nissan. This is the actual '+vehicle()+'.';if(phrase())return base+' You said, ‘'+phrase()+'’ - so that is what I’m starting with.”';return base+' You mentioned '+ptext()+', so that is what I’m starting with.”';}
function closeLine(){var g0=gap(),remote=longDistance();if(g0&&g0.n<8)return '“What, if anything, is still missing before this feels like the right next step?” Then stop talking.';return remote?'“If this checks the boxes, what else do you need verified before we structure the deal remotely?”':'“If this checks the boxes, I can have it ready '+time1()+' or '+time2()+'. Which works better?” Then stop talking.';}
function plan(){return [
  ['Open in their world',opening()],
  ['Prove the weakest certainty first',certaintyLine()],
  ['Use 2–3 proof points only','Show the strongest relevant details. Translate each one into the customer’s stated use or concern.'],
  ['Show the decision-changing detail','Put any material condition, meaningful difference or missing feature on camera before it becomes a surprise.'],
  ['Summarize their decision','“So you need '+ptext()+(phrase()?', and the way you put it was: '+phrase():'')+'. That is what I wanted to prove here.”'],
  ['Close one next decision',closeLine()]
];}
function companion(){var focus=phrase()?phrase():ptext();return 'Hi '+name()+',\n\nYou said '+focus+' was the part that mattered, so that is what I focused on in the video.\n\nTake a look and tell me what, if anything, is still missing before we take the next step.';}
function apply(){var six=$('sixpo'),box=$('videoCompanion'),panel=$('videoPanel');if(!six||!box||!panel||panel.hidden||stage()==='outbound'||behavior()==='unit-gone')return;var sig=signature();if(six.dataset.negotiationVideoSignature===sig&&six.querySelector('[data-negotiation-video="1"]'))return;var html='',pts=plan();pts.forEach(function(p,i){html+=point(i+1,p[0],p[1]);});six.innerHTML=html;six.dataset.negotiationVideoSignature=sig;box.innerHTML='<h3>Send with the video</h3><div class="notice" style="margin-top:0;white-space:pre-wrap">'+esc(companion())+'</div><div class="quiet" style="margin-top:8px">Delivery: warm and slightly more animated than normal conversation, match the customer’s pace, slow down on the key point, and leave silence after the closing question.</div>';}
var timer=null;function schedule(){clearTimeout(timer);timer=setTimeout(apply,0);}function bind(){schedule();['change','input'].forEach(function(ev){document.addEventListener(ev,schedule);});g.addEventListener('shq:funnel-context-change',schedule);g.addEventListener('shq:funnel-state-change',schedule);var six=$('sixpo');if(six&&g.MutationObserver)new MutationObserver(function(){if(!six.querySelector('[data-negotiation-video="1"]'))schedule();}).observe(six,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})(window);
