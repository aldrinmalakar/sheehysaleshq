/* ============================================================
   SHEEHY SALES HQ - negotiation-driven Funnel voice

   Uses tactical-empathy / calibrated-question principles and a controlled
   straight-line sales sequence without imitating any individual trainer.

   Pattern:
   label -> clarify -> isolate -> build certainty -> next commitment -> stop.
============================================================ */
(function(g){
'use strict';
var F=g.SHQFunnel;if(!F||typeof F.resolveScenario!=='function'||F.resolveScenario.__shqNegotiation)return;
var prior=F.resolveScenario;
function clone(o){var x={};Object.keys(o||{}).forEach(function(k){x[k]=o[k];});return x;}
function idOf(raw,o){return (raw&&raw.id)||(o&&o.id)||(document.getElementById('behavior')||{}).value||'';}
function stageOf(ctx){return (ctx&&ctx.stage)||(document.getElementById('stageSelect')||{}).value||'';}
function customerFacing(s){var x=String(s||'').trim();return !!x&&!/^(STOP|No active follow-up|Not a |No voicemail|No live-call|Email-only lead|Text-only lead|Do not)/i.test(x);}
function keep(base,patch){var o=clone(base);Object.keys(patch||{}).forEach(function(k){if(patch[k])o[k]=patch[k];});o.negotiationPattern='label-clarify-isolate-certainty-close';return o;}
function fresh(o){return keep(o,{
  call:'[Name]? [agent] at Sheehy Nissan. You asked about the [vehicle]. Before I start throwing information at you, what has to be right for this to be worth your time: the vehicle itself, the numbers or the setup?\n\n[Listen. Mirror the key phrase if it matters.]\n\nWhat makes that the priority for you?\n\n[After they answer]\nGood. I will work that first. If I can line it up, I have [day/time] or [alt time]. Which works better?',
  vm:'Hi [Name], this is [agent] at Sheehy Nissan of Manassas. I’m calling about the [vehicle] you asked about. What has to be right first for this to be worth your time: the vehicle, the numbers or the setup? Call or text me at [number]. Again, [agent] at [number].',
  sms:'Hi [Name], [agent] at Sheehy Nissan. You asked about the [vehicle]. What has to be right first for it to be worth your time: vehicle, numbers or setup?',
  email:'Hi [Name],\n\nYou asked about the [vehicle]. Before I send you a pile of information, what has to be right first for this to be worth your time: the vehicle itself, the numbers or the setup?\n\nOnce I know that, I can work the part that actually affects your decision.\n\n[agent]'
});}
function price(o){return keep(o,{
  call:'[Name]? [agent] at Sheehy Nissan. It sounds like the number is the part you need to get comfortable with first. What are you comparing our price to: the same exact vehicle, a written offer or a target you set?\n\n[Listen. If they name a competitor or figure, mirror the key detail.]\n\nOther than price, what else would have to be right for you to move forward?\n\n[Isolate it.]\nIf the comparison is truly apples-to-apples and the number makes sense, is there anything else that would stop you?',
  sms:'Hi [Name], [agent] at Sheehy Nissan. On the [vehicle], what are you comparing the price to: the same exact vehicle, a written offer or a target you set?',
  email:'Hi [Name],\n\nIt sounds like price is the piece you want clear first. What are you comparing us to: the same exact vehicle, a written offer or a target you are trying to hit?\n\nIf you send me the exact comparison, I can work the real gap instead of guessing.\n\n[agent]'
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
  call:'[Name]? [agent] at Sheehy Nissan. It sounds like you do not want to make the call without everyone who matters in the decision. What do they need to see or hear before they would be comfortable moving forward?\n\n[Listen.]\n\nWould it be a bad idea to get them into the same conversation now, or set a time when everyone can look at the same information together?',
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
  call:finalOne?'[Name]? [agent] at Sheehy Nissan. I do not want to keep working the wrong direction. Would it be wrong to assume you already handled the vehicle search?':'[Name]? [agent] at Sheehy Nissan. I have not been able to catch you on the [vehicle]. Would it be wrong to assume the timing changed?',
  vm:finalOne?'Hi [Name], this is [agent] at Sheehy Nissan. I do not want to keep working the wrong direction on the [vehicle]. Would it be wrong to assume you already handled the search? Call or text me at [number].':'Hi [Name], this is [agent] at Sheehy Nissan. I have not been able to catch you on the [vehicle]. Would it be wrong to assume the timing changed? Call or text me at [number].',
  sms:finalOne?'Hi [Name], [agent] at Sheehy Nissan. Would it be wrong to assume you already handled the [vehicle] search?':'Hi [Name], [agent] at Sheehy Nissan. Would it be wrong to assume the timing changed on the [vehicle]?',
  email:finalOne?'Hi [Name],\n\nWould it be wrong to assume you already handled the [vehicle] search?\n\nIf not, reply with the one thing still unresolved and I will pick it up from there.\n\n[agent]':'Hi [Name],\n\nI have not been able to catch you on the [vehicle]. Would it be wrong to assume the timing changed?\n\nIf it is still active, tell me the one thing that matters next and I will work from there.\n\n[agent]'
});}
function apply(base,ctx,raw){var o=clone(base),id=idOf(raw,o),st=stageOf(ctx);if(st==='outbound'||id==='unit-gone'||id==='booked'||id==='day-of'||!customerFacing(o.call||o.sms||o.email))return o;
  if(id==='fresh-standard')return fresh(o);
  if(id==='price-first')return price(o);
  if(id==='payment-apr')return payment(o);
  if(id==='trade-value'||id==='owner-wants-value')return trade(o);
  if(id==='competitor-shop')return competitor(o);
  if(id==='decision-maker'||id==='decision-maker-absent')return decision(o);
  if(id==='test-drive-request')return testDrive(o);
  if(id==='credit-concern')return credit(o);
  if(id==='wants-details')return details(o);
  if(id==='no-response-day1')return noResponse(o,false);
  if(id==='final-nudge')return noResponse(o,true);
  o.negotiationPattern='preserve-specialized';return o;
}
var wrapped=function(raw,ctx){return apply(prior(raw,ctx),ctx||{},raw);};wrapped.__shqNegotiation=true;F.resolveScenario=wrapped;
function refresh(){var b=document.getElementById('behavior');if(b)try{b.dispatchEvent(new Event('change',{bubbles:true}));}catch(e){}try{g.dispatchEvent(new CustomEvent('shq:funnel-context-change'));}catch(e){}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(refresh,0);});else setTimeout(refresh,0);
})(window);
