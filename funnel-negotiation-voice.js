/* ============================================================
   SHEEHY SALES HQ - source-informed Funnel voice

   Method:
   rapport/echo -> tactical empathy -> clarify -> isolate ->
   build the weakest certainty -> next commitment -> silence.

   The final customer language stays short. Coaching cues are bracketed.
   Contact Control's later-attempt cadence remains authoritative while unanswered.
============================================================ */
(function(g){
'use strict';
var F=g.SHQFunnel;if(!F||typeof F.resolveScenario!=='function'||F.resolveScenario.__shqNegotiation)return;
var prior=F.resolveScenario;
function clone(o){var x={};Object.keys(o||{}).forEach(function(k){x[k]=o[k];});return x;}
function idOf(raw,o){return (raw&&raw.id)||(o&&o.id)||(document.getElementById('behavior')||{}).value||'';}
function stageOf(ctx){return (ctx&&ctx.stage)||(document.getElementById('stageSelect')||{}).value||'';}
function field(name){var e=document.querySelector('[data-f="'+name+'"]');return e&&e.value?String(e.value).trim():'';}
function value(id){var e=document.getElementById(id);return e&&e.value?String(e.value).trim():'';}
function customerFacing(s){var x=String(s||'').trim();return !!x&&!/^(STOP|No active follow-up|Not a |No voicemail|No live-call|Email-only lead|Text-only lead|Do not|No phone number)/i.test(x);}
function anyCustomerFacing(o){return [o&&o.call,o&&o.vm,o&&o.sms,o&&o.email].some(customerFacing);}
function keep(base,patch){var o=clone(base);Object.keys(patch||{}).forEach(function(k){if(typeof patch[k]!=='undefined'&&patch[k]!==null)o[k]=patch[k];});o.negotiationPattern='echo-label-clarify-isolate-certainty-close';return o;}
function shownAttempt(){var v=document.getElementById('attemptScriptView');if(v&&v.value&&v.value!=='auto'){var n=parseInt(v.value,10);return isNaN(n)?1:n;}var m=document.getElementById('metricNextCall'),x=m?parseInt(m.textContent,10):1;return isNaN(x)?1:x;}
function activeConversation(){var e=document.getElementById('contactState'),s=e?String(e.textContent||'').toLowerCase():'';return /answered|callback|appointment/.test(s);}
function preserveAttemptCadence(){return shownAttempt()>1&&!activeConversation();}
function phrase(){return field('customerphrase');}
function echoCue(){var p=phrase();return p?'[Echo their words once: “'+p+'” Then pause.]':'[Listen. Mirror one meaningful word or the last 1–3 important words once. Then pause.]';}
function deliveryCue(){var s=value('interactionStyle');if(s==='direct')return '[Delivery: match their brisk pace. Short sentences. Downward inflection on the close.]';if(s==='warm')return '[Delivery: warm voice, use their name naturally, let them finish, then guide.]';if(s==='formal')return '[Delivery: measured, respectful, precise. No filler.]';if(s==='analytical')return '[Delivery: slow down, stay factual, let the comparison do the work.]';return '[Delivery: positive, relaxed voice. Match their pace for the first sentence or two.]';}
function num(key){var n=parseInt(field(key),10);return isNaN(n)?0:n;}
function certaintyGap(){var a=[{k:'vehicle',n:num('certvehicle')},{k:'you',n:num('certyou')},{k:'store',n:num('certstore')}].filter(function(x){return x.n>0;});if(!a.length)return null;a.sort(function(a,b){return a.n-b.n;});return a[0];}
function certaintyCue(){var g0=certaintyGap();if(!g0)return '[Certainty check: if they resist, find the weakest link - vehicle, you/trust, or dealership/process - and loop only that gap.]';if(g0.n>=8)return '[All scored certainties are strong. Ask for the commitment, then stop talking.]';if(g0.k==='vehicle')return '[Loop vehicle certainty '+g0.n+'/10: ask what about the vehicle itself is still not fully there for them. Prove only that point, then re-close.]';if(g0.k==='you')return '[Loop trust in you '+g0.n+'/10: slow down, use their words, answer the exact concern and demonstrate expertise before asking again.]';return '[Loop dealership/process certainty '+g0.n+'/10: ask what about doing business with us or the process still makes them hesitate. Solve that point, then re-close.]';}
function summaryCue(issue){var p=phrase();return '[Summary before the close: “So '+(p?p:'the '+issue)+' is the piece that still has to work, and everything else is close. Did I get that right?” Correct it if they say no.]';}
function coach(body,issue){return deliveryCue()+'\n\n'+body+'\n\n'+certaintyCue()+(issue?'\n\n'+summaryCue(issue):'');}
function fresh(o){return keep(o,{
  call:coach('[Name]? [agent] at Sheehy Nissan. You were looking at the [vehicle]. What caught your attention about that one?\n\n'+echoCue()+'\n\nWhat would the [vehicle] have to prove for you to feel good about the next step?\n\n[If the answer is clear and the certainties are strong]\nGood. I can have it ready [day/time] or [alt time]. Which works better?','decision'),
  sms:'Hi [Name], [agent] at Sheehy Nissan. You were looking at the [vehicle]. What is the one thing that has to be right for it to make sense for you?',
  email:'Hi [Name],\n\nYou were looking at the [vehicle]. What is the one thing that has to be right for it to make sense for you?\n\nTell me that first and I will send the useful part instead of a generic pile of information.'
});}
function freshEmail(o){return keep(o,{email:'Hi [Name],\n\nYou were looking at the [vehicle]. What is the one thing that has to be right for it to make sense for you?\n\nReply with that one thing and I will work it first.'});}
function availability(o){return keep(o,{
  call:coach('[Name]? [agent] at Sheehy Nissan. I verified the [vehicle] for you. What do you still need to know about it before it is worth your time to come see it?\n\n'+echoCue()+'\n\n[Answer that point first.]\nIf that checks out, I have [day/time] or [alt time]. Which works better?','vehicle'),
  sms:'Hi [Name], [agent] at Sheehy Nissan. I verified the [vehicle]. What do you still need to know about it before it is worth your time to come see it?',
  email:'Hi [Name],\n\nI verified the [vehicle]. What do you still need to know about it before it is worth your time to come see it?\n\nI will handle that point first.'
});}
function price(o){return keep(o,{
  call:coach('[Name]? [agent] at Sheehy Nissan. It sounds like the number is the first thing you want settled. What are you comparing us to - another exact vehicle, a written offer, or a target you have in mind?\n\n'+echoCue()+'\n\nWhat about that comparison matters most to you?\n\nOther than price, what else has to be right before you would move forward?','price'),
  sms:'Hi [Name], [agent] at Sheehy Nissan. On the [vehicle], what are you comparing the price to - another exact vehicle, a written offer, or a target?',
  email:'Hi [Name],\n\nIt sounds like price is the first piece you want clear. What are you comparing us to - another exact vehicle, a written offer, or a target you are trying to hit?\n\nSend me the real comparison and I will work the actual gap.'
});}
function payment(o){return keep(o,{
  call:coach('[Name]? [agent] at Sheehy Nissan. It sounds like the payment has to fit before the rest of the deal matters. What monthly range are you trying to stay inside?\n\n'+echoCue()+'\n\nHow much cash, if any, do you actually want to use?\n\nIf the structure fits and the [vehicle] is right, what else would stop you?','payment'),
  sms:'Hi [Name], [agent] at Sheehy Nissan. If payment is the hinge on the [vehicle], what monthly range are you trying to stay inside and how much cash do you want to use?',
  email:'Hi [Name],\n\nIt sounds like payment is the part that has to work first. What monthly range are you trying to stay inside, and how much cash do you actually want to use?\n\nThat gives us a real structure to work instead of a guess.'
});}
function trade(o){return keep(o,{
  call:coach('[Name]? [agent] at Sheehy Nissan. It sounds like the trade is where the deal has to make sense. What did you expect the [current] to be worth, and what are you basing that on?\n\n'+echoCue()+'\n\nIf we solve the trade side, what else would still have to be right for you to move forward on the [vehicle]?','trade'),
  sms:'Hi [Name], [agent] at Sheehy Nissan. On the [current], what value were you expecting and what are you basing it on?',
  email:'Hi [Name],\n\nIt sounds like the trade value is the part that needs to make sense first. What were you expecting for the [current], and what are you basing that on?\n\nIf that is the only gap, I can take one clean issue back for review.'
});}
function competitor(o){return keep(o,{
  call:coach('[Name]? [agent] at Sheehy Nissan. It sounds like the other option is real. What is winning for you over there right now - price, equipment, trade, convenience, or something else?\n\n'+echoCue()+'\n\nHow are you comparing the two deals?\n\nIf we win the real comparison, what would still keep you from doing business with us?','comparison'),
  sms:'Hi [Name], [agent] at Sheehy Nissan. What is the other option doing better for you right now - price, equipment, trade, convenience, or something else?',
  email:'Hi [Name],\n\nIt sounds like the other option is real. What is it doing better for you right now - price, equipment, trade, convenience, or something else?\n\nSend me the actual comparison and I will work the part that matters.'
});}
function decision(o){return keep(o,{
  call:coach('[Name]? [agent] at Sheehy Nissan. It sounds like the decision is not fully lined up yet. What does the other person need to see or hear before they could be comfortable moving forward?\n\n'+echoCue()+'\n\nAnd if they are comfortable with it, what would still be holding you back?\n\nWould it be a bad idea to get everyone into the same conversation instead of relaying it back and forth?','decision'),
  sms:'Hi [Name], [agent] at Sheehy Nissan. What does the other person need to see or hear before they could be comfortable moving forward on the [vehicle]?',
  email:'Hi [Name],\n\nIt sounds like the decision needs everyone working from the same information. What would the other person need to see or hear before they could be comfortable moving forward?\n\nWe can get everyone into the same conversation and make it easier.'
});}
function testDrive(o){return keep(o,{
  call:coach('[Name]? [agent] at Sheehy Nissan. You want to drive the [vehicle]. What does the drive need to prove for you?\n\n'+echoCue()+'\n\nGood. I will set the drive up around that. I have [day/time] or [alt time]. Which works better?','vehicle'),
  sms:'Hi [Name], [agent] at Sheehy Nissan. What does the drive on the [vehicle] need to prove for you?',
  email:'Hi [Name],\n\nYou want to drive the [vehicle]. What does the drive need to prove for you?\n\nTell me the one thing that matters most and I will have it ready around that. I have [day/time] or [alt time].'
});}
function credit(o){return keep(o,{
  call:coach('[Name]? [agent] at Sheehy Nissan. It sounds like you want to know whether the finance side is realistic before you go deeper. What outcome matters most first - cash down, monthly payment, or simply knowing what options are available?\n\n'+echoCue()+'\n\nIf the finance structure is workable, is the [vehicle] itself the direction you want?','finance'),
  sms:'Hi [Name], [agent] at Sheehy Nissan. On financing, what matters most first - cash down, monthly payment, or knowing what options are available?',
  email:'Hi [Name],\n\nIt sounds like you want to know whether the finance side is realistic before going too far. What matters most first - cash down, monthly payment, or knowing what options are available?\n\nThat tells me which part we need to solve first.'
});}
function details(o){return keep(o,{
  call:coach('[Name]? [agent] at Sheehy Nissan. You want more detail on the [vehicle]. What is the one fact or feature that could actually change your decision?\n\n'+echoCue()+'\n\nGood. I will verify that exact point first. If it checks out, what would the next step need to be?','vehicle'),
  sms:'Hi [Name], [agent] at Sheehy Nissan. What is the one fact or feature on the [vehicle] that could actually change your decision?',
  email:'Hi [Name],\n\nWhat is the one fact or feature on the [vehicle] that could actually change your decision?\n\nI will verify that point first instead of sending a generic feature list.'
});}
function noResponse(o,finalOne){return keep(o,{
  call:finalOne?'[Name]? [agent] at Sheehy Nissan. Would it be wrong to assume you already handled the vehicle search?':'[Name]? [agent] at Sheehy Nissan. I have not been able to catch you on the [vehicle]. Did the timing change, or is there still something you need from me?',
  sms:finalOne?'Hi [Name], [agent] at Sheehy Nissan. Would it be wrong to assume you already handled the [vehicle] search?':'Hi [Name], [agent] at Sheehy Nissan. Did the timing change on the [vehicle], or is there still one thing you need from me?',
  email:finalOne?'Hi [Name],\n\nWould it be wrong to assume you already handled the [vehicle] search?\n\nIf not, reply with the one thing still unresolved and I will pick it up from there.':'Hi [Name],\n\nI have not been able to catch you on the [vehicle]. Did the timing change, or is there still one thing you need from me?'
});}
function priceHigh(o){return keep(o,{
  call:coach('You may be expecting me to defend our number. I would rather understand the comparison first. When you say the [vehicle] is too high, compared with what?\n\n'+echoCue()+'\n\nOther than price, what else about the vehicle or deal would stop you?\n\n[If price is isolated]\nWhat would the gap have to look like for this to make sense?','price'),
  sms:'It sounds like price is the gap on the [vehicle]. Compared with what - another exact offer or a target you have in mind?',
  email:'Hi [Name],\n\nIt sounds like price is the remaining issue on the [vehicle]. What are you comparing our number to?\n\nIf price is the only gap, send me the real comparison or target and I will work that one issue.'
});}
function paymentHigh(o){return keep(o,{
  call:coach('It sounds like the payment is what is breaking the deal. Is payment the only thing between us and a yes on the [vehicle]?\n\n'+echoCue()+'\n\nHow far apart are we from where you need to be?\n\nIf the structure lands in a range you can live with, what else would stop you?','payment'),
  sms:'Is payment the only thing keeping the [vehicle] from being a yes? If it is, how far apart are we from where you need to be?',
  email:'Hi [Name],\n\nIs payment the only thing keeping the [vehicle] from being a yes? If it is, tell me how far apart we are from where you need to be.\n\nThat gives finance a real problem to solve instead of a vague one.'
});}
function tradeLow(o){return keep(o,{
  call:coach('It sounds like the appraisal missed your expectation by enough to stop the deal. What did you expect the [current] to be worth, and what are you basing that on?\n\n'+echoCue()+'\n\nOther than the trade, is everything else right enough for you to move forward?','trade'),
  sms:'On the [current], what value were you expecting and what are you basing that on? If the trade is the only gap, I want to work the real gap.',
  email:'Hi [Name],\n\nIt sounds like the trade appraisal is the piece that stopped the deal. What value were you expecting for the [current], and what are you basing that on?\n\nIf everything else is right, I can take one clean trade gap back for review.'
});}
function fees(o){return keep(o,{
  call:coach('It sounds like that fee is making you question the deal. Which line specifically do you want broken down?\n\n[Answer that line directly.]\n\nIf that line is clear, what else in the figures still does not sit right?','figures'),
  sms:'Which fee or line on the proposal do you want broken down? I will answer that exact line first.',
  email:'Hi [Name],\n\nWhich fee or line on the proposal do you want broken down? I will answer that exact line first.\n\nOnce that is clear, tell me if anything else in the figures still does not sit right.'
});}
function think(o){return keep(o,{
  call:coach('It sounds like something is still unsettled. What specifically do you need to think through?\n\n'+echoCue()+'\n\n[Stay quiet.]\n\nIf we resolve that one issue, what else would still keep you from moving forward?','decision'),
  sms:'What specifically do you still need to think through on the [vehicle] - the vehicle, the numbers, or the timing?',
  email:'Hi [Name],\n\nWhat specifically do you still need to think through on the [vehicle]?\n\nIf there is one unresolved issue, give me that one and I will work it instead of adding more information.'
});}
function apply(base,ctx,raw){var o=clone(base),id=idOf(raw,o),st=stageOf(ctx);if(st==='outbound'||id==='unit-gone'||id==='booked'||id==='day-of'||!anyCustomerFacing(o))return o;if(preserveAttemptCadence())return o;
  if(id==='fresh-standard')return fresh(o);if(id==='fresh-email-only')return freshEmail(o);if(id==='availability-first')return availability(o);if(id==='price-first')return price(o);if(id==='payment-apr')return payment(o);if(id==='trade-value'||id==='owner-wants-value')return trade(o);if(id==='competitor-shop')return competitor(o);if(id==='decision-maker'||id==='decision-maker-absent'||id==='sleep-spouse')return decision(o);if(id==='test-drive-request')return testDrive(o);if(id==='credit-concern')return credit(o);if(id==='wants-details')return details(o);if(id==='no-response-day1')return noResponse(o,false);if(id==='final-nudge')return noResponse(o,true);if(id==='price-high')return priceHigh(o);if(id==='payment-high')return paymentHigh(o);if(id==='trade-low')return tradeLow(o);if(id==='fees')return fees(o);if(id==='think-about-it')return think(o);o.negotiationPattern='preserve-specialized';return o;
}
var wrapped=function(raw,ctx){return apply(prior(raw,ctx),ctx||{},raw);};wrapped.__shqNegotiation=true;F.resolveScenario=wrapped;
function refresh(){var b=document.getElementById('behavior');if(b)try{b.dispatchEvent(new Event('change',{bubbles:true}));}catch(e){}try{g.dispatchEvent(new CustomEvent('shq:funnel-context-change'));}catch(e){}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(refresh,0);});else setTimeout(refresh,0);
})(window);
