/* SHEEHY SALES HQ - Nissan VOC Sales survey reference layer
   Source basis: Nissan VOC Sales survey structure provided by Aldrin.
   No scoring weights are inferred or displayed. */
(function(){
'use strict';
var here=(location.pathname.split('/').pop()||'').toLowerCase();
var CORE=[
  {label:'Overall satisfaction',q:'Overall, how satisfied were you with your recent purchase/lease experience at the dealership?',protect:'The whole experience: expectations, communication, paperwork, delivery and whether the customer feels taken care of.'},
  {label:'Recommend the dealership',q:'How likely are you to recommend the dealership to your family or friends?',protect:'Trust. A customer can like the vehicle and still hesitate to recommend the buying experience.'},
  {label:'Recommendation feedback',q:'Nissan asks the customer to explain the recommendation score they gave.',protect:'The text box uses AI Active Listening insights. Resolve real friction early because the customer can describe it in their own words.'}
];
var EXPERIENCE=[
  {label:'Your Sales Consultant',protect:'Listen, communicate clearly, follow through and do what you said you would do.'},
  {label:'Financing paperwork process',protect:'Surface confusion early. Do not guess or promise finance outcomes. Route real paperwork or finance issues correctly.'},
  {label:'Explanation of features and controls',protect:'Do a real delivery. Pair the phone and demonstrate the controls that matter to this customer.'},
  {label:'Condition of vehicle at delivery',protect:'Inspect the vehicle with the customer and correct visible delivery-condition issues instead of assuming they are fine.'}
];
function coreCards(){return CORE.map(function(x){return '<div class="weight"><div class="weight-top"><b>'+x.label+'</b></div><div class="voc-question">'+x.q+'</div><div class="weight-note"><b>Protect it by:</b> '+x.protect+'</div></div>';}).join('');}
function experienceCards(){return EXPERIENCE.map(function(x){return '<div class="weight"><div class="weight-top"><b>'+x.label+'</b></div><div class="weight-note"><b>Protect it by:</b> '+x.protect+'</div></div>';}).join('');}
function surveyPage(){
  if(here!=='survey.html')return;
  var panels=document.querySelectorAll('.panel'),target=null;
  for(var i=0;i<panels.length;i++){var h=panels[i].querySelector('h2');if(h&&/sample survey is weighted/i.test(h.textContent)){target=panels[i];break;}}
  if(!target)return;
  target.innerHTML='<h2>Nissan VOC Sales survey flow</h2><div class="callout"><b>Use this as an experience checklist, not a score script.</b> Nissan asks about overall satisfaction, willingness to recommend and why the customer gave that recommendation score. The recommendation-feedback text box uses AI Active Listening insights. Nissan also asks the customer to rate the four experience areas shown below.</div><div class="weights voc-core">'+coreCards()+'</div><div class="voc-subhead">How would you rate your experience regarding:</div><div class="weights">'+experienceCards()+'</div><div class="weight-note">Source basis: Nissan VOC Sales survey structure supplied by Aldrin. No scoring weights were provided in that source, so Sales HQ does not infer or display percentages.</div>';
}
function afterSalePage(){
  if(here!=='after-sale.html')return;
  var panel=document.getElementById('kpiPanel');if(!panel)return;
  var badge=document.getElementById('surveyBadge'),status=badge?badge.textContent:'Survey not established';
  panel.innerHTML='<div class="panel-title"><div><div class="kicker">New Nissan</div><h2>Nissan VOC experience checkpoints</h2></div><a class="link-btn survey" href="survey.html">Open Nissan Survey</a></div><div class="kpi-grid voc-grid">'+CORE.map(function(x){return '<div class="kpi voc"><b>'+x.label+'</b><small>'+x.protect+'</small></div>';}).join('')+EXPERIENCE.map(function(x){return '<div class="kpi voc"><b>'+x.label+'</b><small>'+x.protect+'</small></div>';}).join('')+'</div><div class="kpi-foot"><span>The goal is an experience the customer can describe positively in their own words. The recommendation follow-up contains open feedback with AI Active Listening insights.</span><span id="surveyBadge" class="pill blue">'+status+'</span></div>';
  addTimelineCoverage();
}
function addTimelineCoverage(){
  if(here!=='after-sale.html')return;
  var map={
    'First-night check':'VOC focus: overall experience · features / controls · delivery condition',
    '24-hour ownership call':'VOC focus: overall experience · sales consultant',
    'Experience cleanup':'VOC focus: financing / paperwork · features / controls · delivery condition · recommendation hesitation',
    'Nissan survey check':'VOC focus: recognize the survey · honest recommendation feedback · unresolved issues',
    'Handwritten thank-you':'Relationship touch only. No survey ask.',
    'Google experience review':'Public review ask is separate from Nissan VOC.',
    'Referral conversation':'Earned relationship ask, separate from Nissan VOC.'
  };
  document.querySelectorAll('#timeline .timeline-card').forEach(function(card){var h=card.querySelector('h3');if(!h)return;var text=map[h.textContent.trim()];if(!text||card.querySelector('.voc-coverage'))return;var d=document.createElement('div');d.className='voc-coverage';d.textContent=text;card.appendChild(d);});
}
function watchTimeline(){if(here!=='after-sale.html')return;var t=document.getElementById('timeline');if(!t||!window.MutationObserver)return;var pending=false;new MutationObserver(function(){if(pending)return;pending=true;setTimeout(function(){pending=false;addTimelineCoverage();},0);}).observe(t,{childList:true,subtree:true});}
function addCss(){
  var s=document.createElement('style');s.textContent='.voc-grid .kpi{display:block}.voc-grid .kpi b{display:block;margin-bottom:5px}.voc-grid .kpi small{display:block;font-size:11.5px;line-height:1.45;color:#64748b;font-weight:500}.voc-grid{grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}.voc-question{font-size:13px;line-height:1.5;color:#334155}.voc-subhead{font-size:12px;font-weight:800;color:#334155;margin:13px 0 7px}.voc-coverage{margin-top:8px;padding-top:7px;border-top:1px dashed #dfe7f1;color:#526174;font-size:11px;font-weight:700;line-height:1.4}';document.head.appendChild(s);
}
function init(){addCss();surveyPage();afterSalePage();watchTimeline();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
