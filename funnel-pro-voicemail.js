/* Final Funnel voicemail pass: short enough to be heard, specific enough to earn a callback. */
(function(g){
'use strict';
var F=g.SHQFunnel;if(!F||typeof F.resolveScenario!=='function'||F.resolveScenario.__shqProVm)return;
var prior=F.resolveScenario;
function clone(o){var x={};Object.keys(o||{}).forEach(function(k){x[k]=o[k];});return x;}
function id(raw,o){return (raw&&raw.id)||(o&&o.id)||(document.getElementById('behavior')||{}).value||'';}
function attempt(){var e=document.getElementById('attemptScriptView');if(e&&e.value&&e.value!=='auto'){var n=parseInt(e.value,10);return isNaN(n)?1:n;}var m=document.getElementById('metricNextCall'),n=m?parseInt(m.textContent,10):1;return isNaN(n)?1:n;}
function intro(a){var e=document.querySelector('[data-f="agent"]'),v=e&&e.value?String(e.value).trim():'';if(a===1&&v.toLowerCase()==='aldrin')return 'Hi [Name], this is [agent], like Buzz Aldrin, at Sheehy Nissan.';return 'Hi [Name], this is [agent] at Sheehy Nissan.';}
function customerVm(s){var x=String(s||'').trim();return !!x&&!/^(STOP|No active follow-up|Not a |No voicemail|No live-call|Email-only lead|Text-only lead|Do not|No phone number)/i.test(x);}
var TOPICS={
  'fresh-standard':'the [vehicle] you asked about',
  'availability-first':'the [vehicle] you asked about',
  'price-first':'your pricing question on the [vehicle]',
  'payment-apr':'your payment question on the [vehicle]',
  'trade-value':'your [current] trade',
  'owner-wants-value':'your [current]',
  'competitor-shop':'the comparison on the [vehicle]',
  'test-drive-request':'driving the [vehicle]',
  'wants-details':'the [vehicle] detail you asked about',
  'credit-concern':'the finance question on the [vehicle]',
  'decision-maker':'the [vehicle]',
  'unit-gone':'the [vehicle] you asked about',
  'no-response-day1':'the [vehicle] you asked about',
  'final-nudge':'the [vehicle] search'
};
function question(i){
  if(i==='price-first')return 'Are you comparing an exact written offer, or setting the budget first?';
  if(i==='availability-first'||i==='fresh-standard')return 'Is the next thing you need the vehicle itself or the numbers?';
  if(i==='payment-apr'||i==='credit-concern')return 'Is payment the main thing you need solved first?';
  if(i==='trade-value'||i==='owner-wants-value')return 'Are you trying to value the trade, replace it, or both?';
  if(i==='competitor-shop')return 'Is their advantage price, equipment, trade, or convenience?';
  if(i==='test-drive-request')return 'What does the drive need to prove for you?';
  if(i==='wants-details')return 'What is the one detail that could change your decision?';
  if(i==='unit-gone')return 'What is the one thing about that vehicle you do not want to lose?';
  if(i==='decision-maker')return 'What does everyone involved still need to be comfortable moving forward?';
  return 'Did the timing change, or is this still active?';
}
function vmFor(i,a){var lead=intro(a),t=TOPICS[i];if(a>=5)return lead+' I’m closing the loop on '+t+'. Did you already buy, or is this still in play? Call me at [number].';if(a===4)return lead+' Quick status check on '+t+'. Did the timing change, or is this still active? Call me at [number].';if(a===3)return lead+' I’m trying to get '+t+' right. '+question(i)+' Call me at [number].';if(a===2)return lead+' I tried you earlier about '+t+'. '+question(i)+' Call me at [number].';return lead+' I’m calling about '+t+'. '+question(i)+' Call me at [number].';}
function cleanEmail(s){return g.SHQCleanEmailSignature?g.SHQCleanEmailSignature(s):String(s||'').replace(/\n\s*\[agent\]\s*$/,'');}
var wrapped=function(raw,ctx){var o=clone(prior(raw,ctx)),i=id(raw,o);if(TOPICS[i]&&customerVm(o.vm))o.vm=vmFor(i,attempt());if(o.email)o.email=cleanEmail(o.email);return o;};
wrapped.__shqProVm=true;F.resolveScenario=wrapped;
})(window);
