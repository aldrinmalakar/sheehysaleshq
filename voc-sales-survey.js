/* SHEEHY SALES HQ - Nissan VOC Sales survey reference layer
   Source basis: Nissan VOC Sales survey structure provided by Aldrin.
   No scoring weights are inferred or displayed. */
(function(){
'use strict';
var here=(location.pathname.split('/').pop()||'').toLowerCase();
var VOC=[
  {n:'01',title:'Overall purchase / lease experience',q:'Overall, how satisfied were you with your recent purchase/lease experience at the dealership?',protect:'The entire handoff: expectations, communication, paperwork, delivery and whether the customer feels taken care of.'},
  {n:'02',title:'Recommend the dealership',q:'How likely are you to recommend the dealership to your family or friends?',protect:'Trust. A customer can like the vehicle and still hesitate to recommend the experience.'},
  {n:'03',title:'Why they gave that recommendation score',q:'Nissan asks the customer to explain the recommendation score they gave.',protect:'The open text matters. Nissan uses AI Active Listening insights on this feedback, so unresolved friction can become visible in the customer\'s own words.'},
  {n:'04',title:'Your Sales Consultant',q:'How would you rate your experience regarding your Sales Consultant?',protect:'Listening, clarity, follow-through, respect and whether you did what you said you would do.'},
  {n:'05',title:'Financing paperwork process',q:'How would you rate your experience regarding the financing paperwork process?',protect:'Surface confusion early. Do not guess or promise finance outcomes. Route real paperwork or finance issues correctly.'},
  {n:'06',title:'Features, controls and delivery condition',q:'Nissan also asks about explanation of features and controls and the condition of the vehicle at delivery.',protect:'Do a real delivery. Pair the phone, demonstrate the important controls and correct delivery-condition issues instead of assuming they are fine.'}
];
function cards(){return VOC.map(function(x){return '<div class="weight"><div class="weight-top"><b>'+x.n+' · '+x.title+'</b></div><div style="font-size:13px;line-height:1.5;color:#334155">'+x.q+'</div><div class="weight-note"><b>Protect it by:</b> '+x.protect+'</div></div>';}).join('');}
function surveyPage(){
  if(here!=='survey.html')return;
  var panels=document.querySelectorAll('.panel'),target=null;
  for(var i=0;i<panels.length;i++){var h=panels[i].querySelector('h2');if(h&&/sample survey is weighted/i.test(h.textContent)){target=panels[i];break;}}
  if(!target)return;
  target.innerHTML='<h2>Nissan VOC Sales survey flow</h2><div class="callout"><b>Use this as an experience checklist, not a score script.</b> Nissan is asking whether the customer was satisfied, whether they would recommend the dealership, why they gave that recommendation score and how the experience landed in the specific areas below. The recommendation-feedback text uses AI Active Listening insights, so the cleanest strategy is to remove real friction before the survey arrives.</div><div class="weights">'+cards()+'</div><div class="weight-note">Source basis: Nissan VOC Sales survey structure supplied by Aldrin. No scoring weights were provided in that source, so Sales HQ does not infer or display percentages.</div>';
}
function afterSalePage(){
  if(here!=='after-sale.html')return;
  var panel=document.getElementById('kpiPanel');if(!panel)return;
  var badge=document.getElementById('surveyBadge'),status=badge?badge.textContent:'Survey not established';
  panel.innerHTML='<div class="panel-title"><div><div class="kicker">New Nissan</div><h2>Nissan VOC experience checkpoints</h2></div><a class="link-btn survey" href="survey.html">Open Nissan Survey</a></div><div class="kpi-grid voc-grid">'+VOC.map(function(x){return '<div class="kpi voc"><b>'+x.n+' · '+x.title+'</b><small>'+x.protect+'</small></div>';}).join('')+'</div><div class="kpi-foot"><span>The job is to create an experience the customer can describe positively in their own words. Nissan\'s recommendation follow-up includes open feedback with AI Active Listening insights.</span><span id="surveyBadge" class="pill blue">'+status+'</span></div>';
}
function addCss(){
  var s=document.createElement('style');s.textContent='.voc-grid .kpi{display:block}.voc-grid .kpi b{display:block;margin-bottom:5px}.voc-grid .kpi small{display:block;font-size:11.5px;line-height:1.45;color:#64748b;font-weight:500}.voc-grid{grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}';document.head.appendChild(s);
}
function init(){addCss();surveyPage();afterSalePage();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
