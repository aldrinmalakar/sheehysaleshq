/* ============================================================
   SHEEHY SALES HQ - negotiation-driven Funnel voice

   Pattern:
   label -> clarify -> mirror/listen -> isolate -> build certainty
   -> next commitment -> stop.

   This layer deliberately preserves Contact Control's Attempt 2+ cadence
   while a customer is still unanswered.
============================================================ */
(function(g){
'use strict';
var F=g.SHQFunnel;if(!F||typeof F.resolveScenario!=='function'||F.resolveScenario.__shqNegotiation)return;
var prior=F.resolveScenario;
function clone(o){var x={};Object.keys(o||{}).forEach(function(k){x[k]=o[k];});return x;}
function idOf(raw,o){return (raw&&raw.id)||(o&&o.id)||(document.getElementById('behavior')||{}).value||'';}
function stageOf(ctx){return (ctx&&ctx.stage)||(document.getElementById('stageSelect')||{}).value||'';}
function field(name){var e=document.querySelector('[data-f="'+name+'"]');return e&&e.value?String(e.value).trim():'';}
function customerFacing(s){var x=String(s||'').trim();return !!x&&!/^(STOP|No active follow-up|Not a |No voicemail|No live-call|Email-only lead|Text-only lead|Do not)/i.test(x);}
function anyCustomerFacing(o){return [o&&o.call,o&&o.vm,o&&o.sms,o&&o.email].some(customerFacing);}
function keep(base,patch){var o=clone(base);Object.keys(patch||{}).forEach(function(k){if(typeof patch[k]!=='undefined'&&patch[k]!==null)o[k]=patch[k];});o.negotiationPattern='label-clarify-listen-isolate-certainty-close';return o;}
function shownAttempt(){var v=document.getElementById('attemptScriptView');if(v&&v.value&&v.value!=='auto'){var n=parseInt(v.value,10);return isNaN(n)?1:n;}var m=document.getElementById('metricNextCall'),x=m?parseInt(m.textContent,10):1;return isNaN(x)?1:x;}
function activeConversation(){var e=document.getElementById('contactState'),s=e?String(e.textContent||'').toLowerCase():'';return /answered|callback|appointment/.test(s);}
function preserveAttemptCadence(){return shownAttempt()>1&&!activeConversation();}
function buzzVm(){return field('agent').toLowerCase()==='aldrin'?'Hi [Name], this is [agent], like Buzz Aldrin, at Sheehy Nissan of Manassas.':'Hi [Name], this is [agent] at Sheehy Nissan of Manassas.';}

function fresh(o){return keep(o,{
  call:'[Name]? [agent] at Sheehy Nissan. You asked about the [vehicle]. Before I start throwing information at you, what has to be right for this to be worth your time: the vehicle itself, the numbers or the setup?\n\n[Listen. Mirror the key phrase if it matters.]\n\nWhat makes that the priority for you?\n\n[After they answer]\nGood. I will work that first. If I can line it up, I have [day/time] or [alt time]. Which works better?',
  vm:buzzVm()+' I’m calling about the [vehicle] you asked about. What has to be right first for this to be worth your time: the vehicle, the numbers or the setup? Call or text me at [number]. Again, [agent] at [number].',
  sms:'Hi [Name], [agent] at Sheehy Nissan. You asked about the [vehicle]. What has to be right first for it to be worth your time: vehicle, numbers or setup?',
  email:'Hi [Name],\n\nYou asked about the [vehicle]. Before I send you a pile of information, what has to be right first for this to be worth your time: the vehicle itself, the numbers or the setup?\n\nOnce I know that, I can work the part that actually affects your decision.\n\n[agent]'
});}
function freshEmail(o){return keep(o,{
  email:'Hi [Name],\n\nYou asked about the [vehicle]. What has to be right first for this to be worth your time: the vehicle itself, the numbers or making sure it is the right fit?\n\nReply with the one that matters most and I will work that first.\n\n[agent]'
});}
function availability(o){return keep(o,{
  call:'[Name]? [agent] at Sheehy Nissan. I verified the [vehicle] for you. It sounds like you wanted to know the car is real before you spend time on it. What would you need to know next before it becomes worth seeing in person?\n\n[Listen.]\n\nGood. I will handle that first. If it checks out, I have [day/time] or [alt time]. Which works better?',
  sms:'Hi [Name], [agent] at Sheehy Nissan. I verified the [vehicle]. What would you need to know next before it becomes worth seeing in person?',
  email:'Hi [Name],\n\nI verified the [vehicle] for you. What would you need to know next before it becomes worth seeing in person?\n\nI will handle that first. If it checks out, I have [day/time] or [alt time].\n\n[agent]'
});}
function price(o){return keep(o,{
  call:'[Name]? [agent] at Sheehy Nissan. It sounds like the number is the part you need to get comfortable with first. What are you comparing our price to: the same exact vehicle, a written offer or a target you set?\n\n[Listen. Mirror the key detail and let them expand it.]\n\nOther than price, what else would have to be right for you to move forward?\n\n[Isolate it.]\nIf the comparison is truly apples-to-apples and the number makes sense, is there anything else that would stop you?',
  sms:'Hi [Name], [agent] at Sheehy Nissan. On the [vehicle], what are you comparing the price to: the same exact vehicle, a written offer or a target you set?',
  email:'Hi [Name],\n\nIt sounds like price is the piece you want clear first. What are you comparing us to: the same exact vehicle, a written offer or a target you are trying to hit?\n\nSend me the exact comparison and I can work the real gap instead of guessing.\n\n[agent]'
});}
function payment(o){return keep(o,{
  call:'[Name]? [agent] at Sheehy Nissan. It sounds like the payment has to fit before anything else matters. What monthly range are you trying to stay inside?\n\n[Listen.]\n\nIs the cash down fixed, or do you have some flexibility there?\n\n[After answer]\nIf the structure fits that range and the [vehicle] is right, what else would stop you from moving forward?',
  sms:'Hi [Name], [agent] at Sheehy Nissan. If payment is the hinge on the [vehicle], what monthly range are you trying to stay inside?',
  email:'Hi [Name],\n\nIt sounds like the payment is the part that has to work first. What monthly range are you trying to stay inside?\n\nOnce I know that and whether cash down is fixed, we can work the real structure instead of guessing.\n\n[agent]'
});}
function trade(o){return keep(o,{
  call:'[Name]? [agent] at Sheehy Nissan. It sounds like the trade number is the hinge. What did you expect the [current] to be worth, and what are you basing that on?\n\n[Listen. Do not defend the appraisal.]\n\nIf we get the trade side resolved, what else would still have to be right for you to move forward on the [vehicle]?',
  sms:'Hi [Name], [agent] at Sheehy Nissan. On the [current], what value were you expecting and what are you basing it on?',
  email:'Hi [Name],\n\nIt sounds like the trade value is the part that needs to make sense first. What were you expecting for the [current], and what are you basing that expectation on?\n\nIf that is the only gap, I can take one clean question to the appraisal side instead of arguing around it.\n\n[agent]'
});}
function competitor(o){return keep(o,{
  call:'[Name]? [agent] at Sheehy Nissan. It sounds like you have another real option on the table. What does their deal do better for you right now: price, equipment, trade or convenience?\n\n[Listen. Get the exact comparison.]\n\nIf we win the real apples-to-apples comparison, what would still keep you from doing business with us?',
  sms:'Hi [Name], [agent] at Sheehy Nissan. What does the other offer do better for you right now: price, equipment, trade or convenience?',
  email:'Hi [Name],\n\nIt sounds like the other offer is a real option. What is it doing better for you: price, equipment, trade or convenience?\n\nSend me the exact comparison and I will work the part that actually matters instead of guessing at their deal.\n\n[agent]'
});}
function decision(o){return keep(o,{
  call:'[Name]? [agent] at Sheehy Nissan. It sounds like you do not want to make the call without everyone who matters in the decision. What do they need to see or hear before they would be comfortable moving forward?\n\n[Listen.]\n\nAnd if they were comfortable with it, what would still be holding you back?\n\nWould it be a bad idea to get them into the same conversation now, or set a time when everyone can look at the same information together?',
  sms:'Hi [Name], [agent] at Sheehy Nissan. What does the other decision-maker need to see or hear before they would be comfortable moving forward on the [vehicle]?',
  email:'Hi [Name],\n\nIt sounds like the decision needs everyone working from the same information. What would the other decision-maker need to see or hear before they could be comfortable moving forward?\n\nWe can either get them into the conversation now or set a time when everyone can look at the same facts together.\n\n[agent]'
});}
function testDrive(o){return keep(o,{
  call:'[Name]? [agent] at Sheehy Nissan. You want to drive the [vehicle]. What does the drive need to prove for you: comfort, power, visibility, technology or something else?\n\n[Listen.]\n\nGood. I will set the drive up around that. I have [day/time] or [alt time]. Which works better?',
  sms:'Hi [Name], [agent] at Sheehy Nissan. What does the drive on the [vehicle] need to prove for you: comfort, power, visibility, technology or something else?',
  email:'Hi [Name],\n\nYou want to drive the [vehicle]. What does the drive need to prove for you?\n\nTell me the one thing that matters most and I will have the vehicle ready around that. I have [day/time] or [alt time].\n\n[agent]'
});}
function credit(o){return keep(o,{
  call:'[Name]? [agent] at Sheehy Nissan. It sounds like you want to know whether this is realistic before you get too deep into the vehicle. What matters most to you in the finance outcome: cash down, monthly payment or simply knowing what you can qualify for?\n\n[Listen.]\n\nGood. We will solve that piece with the right information instead of guessing. If the finance structure is workable, is the [vehicle] itself the direction you want?',
  sms:'Hi [Name], [agent] at Sheehy Nissan. On financing, what matters most first: cash down, monthly payment or simply knowing what you can qualify for?',
  email:'Hi [Name],\n\nIt sounds like you want to know whether the finance side is realistic before going too far. What matters most first: cash down, monthly payment or simply knowing what you can qualify for?\n\nThat tells me which part we need to solve first.\n\n[agent]'
});}
function details(o){return keep(o,{
  call:'[Name]? [agent] at Sheehy Nissan. You want more detail on the [vehicle]. What is the one fact or feature that could actually change your decision?\n\n[Listen.]\n\nGood. I will verify that exact point first. If it checks out, what would the next step need to be?',
  sms:'Hi [Name], [agent] at Sheehy Nissan. What is the one fact or feature on the [vehicle] that could actually change your decision?',
  email:'Hi [Name],\n\nWhat is the one fact or feature on the [vehicle] that could actually change your decision?\n\nI will verify that point first instead of sending you a generic feature list.\n\n[agent]'
});}
function noResponse(o,finalOne){return keep(o,{
  call:finalOne?'[Name]? [agent] at Sheehy Nissan. Would it be wrong to assume you already handled the vehicle search?':'[Name]? [agent] at Sheehy Nissan. I have not been able to catch you on the [vehicle]. Would it be wrong to assume the timing changed?',
  vm:finalOne?'Hi [Name], this is [agent] at Sheehy Nissan. Would it be wrong to assume you already handled the [vehicle] search? Call or text me at [number].':'Hi [Name], this is [agent] at Sheehy Nissan. I have not been able to catch you on the [vehicle]. Would it be wrong to assume the timing changed? Call or text me at [number].',
  sms:finalOne?'Hi [Name], [agent] at Sheehy Nissan. Would it be wrong to assume you already handled the [vehicle] search?':'Hi [Name], [agent] at Sheehy Nissan. Would it be wrong to assume the timing changed on the [vehicle]?',
  email:finalOne?'Hi [Name],\n\nWould it be wrong to assume you already handled the [vehicle] search?\n\nIf not, reply with the one thing still unresolved and I will pick it up from there.\n\n[agent]':'Hi [Name],\n\nI have not been able to catch you on the [vehicle]. Would it be wrong to assume the timing changed?\n\nIf it is still active, tell me the one thing that matters next and I will work from there.\n\n[agent]'
});}

function priceHigh(o){return keep(o,{
  call:'It sounds like the price is the one thing keeping the [vehicle] from being a yes. When you say it is high, compared with what?\n\n[Mirror the number or comparison they give you. Let them explain it.]\n\nOther than price, is there anything else about the vehicle or deal that would stop you?\n\n[If price is isolated]\nWhat would the gap have to look like for this to make sense?\n\n[Take the real gap to the desk. Re-close after the answer.]',
  sms:'It sounds like price is the only gap on the [vehicle]. Compared with what: another exact offer or a target you had in mind?',
  email:'Hi [Name],\n\nIt sounds like price is the remaining issue on the [vehicle]. What are you comparing our number to?\n\nIf price is the only gap, send me the real comparison or target and I will work that one issue.\n\n[agent]'
});}
function paymentHigh(o){return keep(o,{
  call:'It sounds like the payment is what is breaking the deal. Is payment the only thing between us and a yes on the [vehicle]?\n\n[If yes]\nHow far apart are we from where you need to be?\n\n[Listen.]\n\nIf finance can structure it in a range you can live with, what else would stop you?',
  sms:'Is payment the only thing keeping the [vehicle] from being a yes? If it is, how far apart are we from where you need to be?',
  email:'Hi [Name],\n\nIs payment the only thing keeping the [vehicle] from being a yes? If it is, tell me how far apart we are from where you need to be.\n\nThat gives finance a real problem to solve instead of a vague one.\n\n[agent]'
});}
function tradeLow(o){return keep(o,{
  call:'It sounds like the appraisal missed your expectation by enough to stop the deal. What did you expect the [current] to be worth, and what are you basing that on?\n\n[Listen.]\n\nOther than the trade, is everything else right enough for you to move forward?\n\n[If yes]\nGood. Then the trade is the only issue. Let me take the actual gap back instead of arguing around it.',
  sms:'On the [current], what value were you expecting and what are you basing it on? If the trade is the only gap, I want to work the real gap.',
  email:'Hi [Name],\n\nIt sounds like the trade appraisal is the piece that stopped the deal. What value were you expecting for the [current], and what are you basing that on?\n\nIf everything else is right, I can take one clean trade gap back for review.\n\n[agent]'
});}
function fees(o){return keep(o,{
  call:'It sounds like that fee is making you question the deal. Which line specifically do you want broken down?\n\n[Answer the exact line.]\n\nIf that line is clear, is there anything else in the figures that still does not sit right?',
  sms:'Which fee or line on the proposal do you want broken down? I will answer that exact line first.',
  email:'Hi [Name],\n\nWhich fee or line on the proposal do you want broken down? I will answer that exact line first.\n\nOnce that is clear, tell me if anything else in the figures still does not sit right.\n\n[agent]'
});}
function think(o){return keep(o,{
  call:'It sounds like there is still something you are not comfortable deciding on yet. What specifically do you need to think through?\n\n[Mirror the key phrase they give you. Then stay quiet.]\n\nIf we resolve that one issue, what else would still keep you from moving forward?',
  sms:'What specifically do you still need to think through on the [vehicle]: the vehicle, the numbers or the timing?',
  email:'Hi [Name],\n\nWhat specifically do you still need to think through on the [vehicle]?\n\nIf there is one unresolved issue, give me that one and I will work it instead of adding more information.\n\n[agent]'
});}

function apply(base,ctx,raw){var o=clone(base),id=idOf(raw,o),st=stageOf(ctx);if(st==='outbound'||id==='unit-gone'||id==='booked'||id==='day-of'||!anyCustomerFacing(o))return o;if(preserveAttemptCadence())return o;
  if(id==='fresh-standard')return fresh(o);
  if(id==='fresh-email-only')return freshEmail(o);
  if(id==='availability-first')return availability(o);
  if(id==='price-first')return price(o);
  if(id==='payment-apr')return payment(o);
  if(id==='trade-value'||id==='owner-wants-value')return trade(o);
  if(id==='competitor-shop')return competitor(o);
  if(id==='decision-maker'||id==='decision-maker-absent'||id==='sleep-spouse')return decision(o);
  if(id==='test-drive-request')return testDrive(o);
  if(id==='credit-concern')return credit(o);
  if(id==='wants-details')return details(o);
  if(id==='no-response-day1')return noResponse(o,false);
  if(id==='final-nudge')return noResponse(o,true);
  if(id==='price-high')return priceHigh(o);
  if(id==='payment-high')return paymentHigh(o);
  if(id==='trade-low')return tradeLow(o);
  if(id==='fees')return fees(o);
  if(id==='think-about-it')return think(o);
  o.negotiationPattern='preserve-specialized';return o;
}
var wrapped=function(raw,ctx){return apply(prior(raw,ctx),ctx||{},raw);};wrapped.__shqNegotiation=true;F.resolveScenario=wrapped;
function refresh(){var b=document.getElementById('behavior');if(b)try{b.dispatchEvent(new Event('change',{bubbles:true}));}catch(e){}try{g.dispatchEvent(new CustomEvent('shq:funnel-context-change'));}catch(e){}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(refresh,0);});else setTimeout(refresh,0);
})(window);
