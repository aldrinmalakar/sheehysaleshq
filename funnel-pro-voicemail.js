/* Final Funnel voicemail pass: short, memorable, specific. */
(function(g){
'use strict';
var F=g.SHQFunnel;if(!F||typeof F.resolveScenario!=='function'||F.resolveScenario.__shqProVm)return;
var prior=F.resolveScenario;
function clone(o){var x={};Object.keys(o||{}).forEach(function(k){x[k]=o[k];});return x;}
function id(raw,o){return (raw&&raw.id)||(o&&o.id)||(document.getElementById('behavior')||{}).value||'';}
function attempt(){var e=document.getElementById('attemptScriptView');if(e&&e.value&&e.value!=='auto'){var n=parseInt(e.value,10);return isNaN(n)?1:n;}var m=document.getElementById('metricNextCall'),n=m?parseInt(m.textContent,10):1;return isNaN(n)?1:n;}
function agent(){var e=document.querySelector('[data-f="agent"]'),v=e&&e.value?String(e.value).trim():'';return v;}
function intro(a){if(a===1&&agent().toLowerCase()==='aldrin')return 'Hi [Name], this is [agent], like Buzz Aldrin, at Sheehy Nissan.';return 'Hi [Name], this is [agent] at Sheehy Nissan.';}
function customerVm(s){var x=String(s||'').trim();return !!x&&!/^(STOP|No active follow-up|Not a |No voicemail|No live-call|Email-only lead|Text-only lead|Do not|No phone number)/i.test(x);}
var TOPICS={
  'fresh-standard':'the [vehicle] you asked about','availability-first':'the [vehicle]','price-first':'your pricing question on the [vehicle]','payment-apr':'your payment question on the [vehicle]','trade-value':'your [current] trade','owner-wants-value':'your [current]','competitor-shop':'the comparison on the [vehicle]','test-drive-request':'driving the [vehicle]','wants-details':'the [vehicle] detail you asked about','credit-concern':'the finance question on the [vehicle]','decision-maker':'the [vehicle]','unit-gone':'the [vehicle] you asked about','no-response-day1':'the [vehicle]','final-nudge':'the vehicle search'
};
function first(i){var t=TOPICS[i];if(i==='fresh-standard'||i==='availability-first')return intro(1)+' I’m calling about '+t+'. Give me a call at [number] when you get a second. Again, [agent], [number].';if(i==='price-first')return intro(1)+' I’m calling about your pricing question on the [vehicle]. I have the comparison in front of me. Call me at [number].';if(i==='test-drive-request')return intro(1)+' I’m calling about driving the [vehicle]. Call me at [number] and we’ll put a real time on it.';return intro(1)+' I’m calling about '+t+'. Call me at [number] when you get a second.';}
function later(i,a){var t=TOPICS[i];if(a>=5)return intro(a)+' I’m closing the loop on '+t+'. Did you already handle it, or is it still active? Call me at [number].';if(a===4)return intro(a)+' Quick status check on '+t+'. Did the timing change? Call me at [number].';if(a===3)return intro(a)+' I’m following up on '+t+'. If there is one thing still unresolved, call me at [number].';return intro(a)+' I tried you earlier about '+t+'. Call me at [number] when you get a second.';}
function vmFor(i,a){return a===1?first(i):later(i,a);}
function cleanEmail(s){return g.SHQCleanEmailSignature?g.SHQCleanEmailSignature(s):String(s||'').replace(/\n\s*\[agent\]\s*$/,'');}
var wrapped=function(raw,ctx){var o=clone(prior(raw,ctx)),i=id(raw,o);if(TOPICS[i]&&customerVm(o.vm))o.vm=vmFor(i,attempt());if(o.email)o.email=cleanEmail(o.email);return o;};wrapped.__shqProVm=true;F.resolveScenario=wrapped;
})(window);
