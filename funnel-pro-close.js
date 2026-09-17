/* SHEEHY SALES HQ - concise voicemail + stronger next-step Funnel close. */
(function(g){
'use strict';
if((location.pathname.split('/').pop()||'').toLowerCase()!=='funnel.html')return;
function $(id){return document.getElementById(id);}
function field(k){var e=document.querySelector('[data-f="'+k+'"]');return e&&e.value?String(e.value).trim():'';}
function attempt(){var v=$('attemptScriptView');if(v&&v.value&&v.value!=='auto'){var n=parseInt(v.value,10);return isNaN(n)?1:n;}var m=$('metricNextCall'),n=m?parseInt(m.textContent,10):1;return isNaN(n)?1:n;}
function active(){var s=(($('contactState')||{}).textContent||'').toLowerCase();return /answered|callback|appointment/.test(s);}
function behavior(o){return (o&&o.id)||(($('behavior')||{}).value)||'';}
function stopped(o){var t=String((o&&o.call)||'');return /^(STOP|No active follow-up)/i.test(t);}
function intro(){return field('agent').toLowerCase()==='aldrin'&&attempt()===1?'Hi [Name], this is [agent], like Buzz Aldrin, at Sheehy Nissan.':'Hi [Name], this is [agent] at Sheehy Nissan.';}
function vmFor(id){var a=attempt();if(a>=5)return intro()+' I do not want to keep guessing on the [vehicle]. If you are still working the search, call or text me at [number]. If you already handled it, no problem.';if(a===4)return intro()+' Quick status on the [vehicle]: are you still shopping, did you buy, or did the timing change? Call or text me at [number].';if(a===3)return intro()+' I am calling on the [vehicle]. If it is still active, tell me the one thing that still needs to be solved. Call or text me at [number].';if(a===2)return intro()+' I tried you earlier on the [vehicle]. Did the timing change, or are you still working this one? Call or text me at [number].';var map={
'fresh-standard':' You asked about the [vehicle]. What matters first to you right now: the vehicle itself or the numbers? Call or text me at [number].',
'fresh-email-only':' I received your request on the [vehicle]. I only have email for you, so I will keep the details there.',
'availability-first':' I checked the [vehicle] you asked about and I have the status for you. Call or text me at [number].',
'price-first':' I saw your price question on the [vehicle]. I can work the comparison; I just need to know what you are comparing it to. Call or text me at [number].',
'test-drive-request':' I am calling about driving the [vehicle]. I can set the drive up around what matters to you. Call or text me at [number].',
'wants-details':' I have the answer to the detail you asked about on the [vehicle]. Call or text me at [number] and I will give you the clean answer.',
'payment-apr':' I saw the payment or finance question on the [vehicle]. I need one detail from you before I point you in the wrong direction. Call or text me at [number].',
'credit-concern':' I received your note on the [vehicle]. We can handle the finance side privately. Call me at [number].',
'trade-value':' I am calling about your [current] and the [vehicle]. I need to know what value you were expecting on the trade. Call or text me at [number].',
'owner-wants-value':' I am calling about your [current]. I need one quick ownership detail before I work the value. Call or text me at [number].',
'competitor-shop':' I am calling about the other offer you mentioned on the [vehicle]. I can compare it, but I need the exact point they beat us on. Call or text me at [number].',
'decision-maker':' I am calling about the [vehicle]. I want to get everyone making the decision the same information once. Call or text me at [number].',
'decision-maker-absent':' I am calling about the [vehicle]. I want to make the next conversation useful for both decision-makers. Call or text me at [number].',
'unit-gone':' I have an update on the exact [vehicle] you asked about and a next direction worth discussing. Call or text me at [number].',
'no-response-day1':' I have not caught you yet on the [vehicle]. Did the timing change? Call or text me at [number].',
'final-nudge':' Would I be wrong to assume you already handled the [vehicle] search? If not, call or text me at [number].'};return intro()+(map[id]||' I am calling about the [vehicle] you asked about. What still needs to be solved before the next step? Call or text me at [number].');}
function strengthen(id,o){var x=Object.assign({},o);if(stopped(x))return x;x.vm=vmFor(id);if(attempt()>1&&!active())return x;
if(id==='price-first')x.call='[Name]? [agent] at Sheehy Nissan. It sounds like the number is what you need clear first. What are you comparing us to: the same exact vehicle, a written offer, or a target you set?\n\n[Listen. Mirror the real comparison.]\n\nOther than price, what else would have to be right?\n\n[If price is isolated]\nIf I can make the apples-to-apples comparison make sense, are you ready to move forward on this [vehicle]?';
if(id==='availability-first')x.call='[Name]? [agent] at Sheehy Nissan. I verified the [vehicle] for you. What is the one thing you still need to know before it becomes worth seeing?\n\n[Answer it.]\n\nIf that checks out, I have [day/time] or [alt time]. Which one should I put you down for?';
if(id==='wants-details')x.call='[Name]? [agent] at Sheehy Nissan. I have the answer to the detail you asked about. What would that answer need to be for the [vehicle] to stay in the running?\n\n[Answer and prove it.]\n\nIf it checks out, what else is stopping the next step? I have [day/time] or [alt time].';
if(id==='test-drive-request')x.call='[Name]? [agent] at Sheehy Nissan. You want to drive the [vehicle]. What does the drive need to prove for you?\n\n[Listen.]\n\nGood. I will set the drive up around that. I have [day/time] or [alt time]. Which one works better?';
if(id==='competitor-shop')x.call='[Name]? [agent] at Sheehy Nissan. It sounds like the other offer is a real option. What exactly do they beat us on: price, equipment, trade, or convenience?\n\n[Get the exact comparison.]\n\nIf we win the real apples-to-apples comparison, is there anything else keeping you from doing business with us?';
if(id==='price-high')x.call='It sounds like price is the remaining issue. Compared with what?\n\n[Mirror the comparison. Let them explain.]\n\nOther than price, is there anything else stopping the deal?\n\n[If no]\nGood. Give me the real gap. If I can get this into a range you can justify, are you ready to wrap it up?';
if(id==='payment-high')x.call='It sounds like the payment is what is stopping the deal. Is payment the only thing between us and a yes?\n\n[If yes]\nHow far apart are we from where you need to be?\n\n[Listen.]\n\nIf finance can structure it in a range you can live with, are you ready to move forward on the [vehicle]?';
if(id==='trade-low')x.call='It sounds like the trade appraisal is the part that stopped the deal. What did you expect the [current] to be worth, and what are you basing that on?\n\n[Listen.]\n\nOther than the trade, is everything else right?\n\n[If yes]\nGood. Then the trade is the problem to solve. If we can resolve that gap, are you ready to finish the deal?';return x;}
function install(){var F=g.SHQFunnel;if(!F||typeof F.resolveScenario!=='function'||!F.resolveScenario.__shqStopGuard)return false;if(F.resolveScenario.__shqProClose)return true;var prior=F.resolveScenario;var wrapped=function(raw,ctx){var o=prior(raw,ctx);return strengthen(behavior(o||raw),o||raw);};wrapped.__shqProClose=true;F.resolveScenario=wrapped;try{var b=$('behavior');if(b)b.dispatchEvent(new Event('change',{bubbles:true}));}catch(e){}return true;}
var tries=0,t=setInterval(function(){tries++;if(install()||tries>120)clearInterval(t);},50);
})(window);
