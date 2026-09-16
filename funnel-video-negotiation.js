/* ============================================================
   SHEEHY SALES HQ - decision-focused Funnel video layer

   A walkaround is not a feature dump. It should prove the buyer's priority,
   reduce one source of uncertainty and close the next decision.
============================================================ */
(function(g){
'use strict';
function $(id){return document.getElementById(id);}
function val(sel,fb){var e=document.querySelector(sel);return e&&e.value&&String(e.value).trim()?String(e.value).trim():fb;}
function name(){return val('[data-f="name"]','[Name]');}
function vehicle(){return val('[data-f="vehicle"]','[vehicle]');}
function agent(){return val('[data-f="agent"]','[agent]');}
function time1(){return val('[data-f="daytime"]','[day/time]');}
function time2(){return val('[data-f="alttime"]','[alt time]');}
function priority(){return ($('buyingPriority')||{}).value||'unknown';}
function stage(){return ($('stageSelect')||{}).value||'';}
function behavior(){return ($('behavior')||{}).value||'';}
function ptext(){return {value:'price and overall value',comfort:'comfort and how it fits you',reliability:'ownership confidence',safety:'the safety equipment that matters to you',technology:'the technology you will actually use',space:'space and utility',ownership:'ownership cost'}[priority()]||'the part of the vehicle that matters most to you';}
function longDistance(){try{var c=g.SHQFunnelExecution&&g.SHQFunnelExecution.getContext?g.SHQFunnelExecution.getContext():{};return !!(c.distanceLong||c.distanceFar);}catch(e){return false;}}
function signature(){return [name(),vehicle(),agent(),time1(),time2(),priority(),stage(),behavior(),longDistance()?'remote':'local'].join('|');}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function point(n,title,text){return '<div class="po" data-negotiation-video="1"><div class="po-num">'+n+'</div><div><b>'+esc(title)+'</b><span>'+esc(text)+'</span></div></div>';}
function plan(){var p=ptext(),n=name(),v=vehicle(),a=agent(),remote=longDistance();return [
  ['Open on their decision','“Hi '+n+', '+a+' at Sheehy Nissan. This is the actual '+v+' you asked about. You mentioned '+p+', so I’m starting there.”'],
  ['Prove the priority first','Show the exact feature, condition point or configuration that answers '+p+'. Do not make them wait through a generic exterior tour.'],
  ['Build certainty with 2–3 proof points','Show only the strongest relevant details. Translate each feature into the customer’s use instead of reading equipment aloud.'],
  ['Show the decision-changing detail','If there is a condition point, meaningful difference, missing feature or likely concern, put it on camera now. A surprise later kills more deals than a material detail now.'],
  ['Summarize what you heard','“From what you told me, it sounds like '+p+' is the part that has to be right.” Then show the final proof point and stop presenting.'],
  ['Close the next decision',remote?'“If this checks that box, what else do you need verified before we structure the next step remotely?”':'“If this checks that box, what else would you need to see before we put a time on it? I have '+time1()+' or '+time2()+'. Which works better?”']
];}
function companion(){var p=ptext();return 'Hi '+name()+',\n\nYou mentioned '+p+' mattered, so that is what I focused on in this video.\n\nIf that checks out, tell me what is still missing and I’ll work that next.\n\n'+agent();}
function apply(){var six=$('sixpo'),box=$('videoCompanion'),panel=$('videoPanel');if(!six||!box||!panel||panel.hidden||stage()==='outbound'||behavior()==='unit-gone')return;var sig=signature();if(six.dataset.negotiationVideoSignature===sig&&six.querySelector('[data-negotiation-video="1"]'))return;var html='',pts=plan();pts.forEach(function(p,i){html+=point(i+1,p[0],p[1]);});six.innerHTML=html;six.dataset.negotiationVideoSignature=sig;box.innerHTML='<h3>Send with the video</h3><div class="notice" style="margin-top:0;white-space:pre-wrap">'+esc(companion())+'</div><div class="quiet" style="margin-top:8px">Video rule: identify the customer’s priority, prove it, show the detail that could change the decision, then ask what is still missing. Stop presenting once you have earned the decision question.</div>';}
var timer=null;function schedule(){clearTimeout(timer);timer=setTimeout(apply,0);}
function bind(){schedule();['change','input'].forEach(function(ev){document.addEventListener(ev,schedule);});g.addEventListener('shq:funnel-context-change',schedule);g.addEventListener('shq:funnel-state-change',schedule);var six=$('sixpo');if(six&&g.MutationObserver)new MutationObserver(function(){if(!six.querySelector('[data-negotiation-video="1"]'))schedule();}).observe(six,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})(window);
