/* ============================================================
   SHEEHY SALES HQ - program / owner outbound final layer

   Programs support the conversation. They do not become the opener.
   This layer expands Owner / Outbound into the actual branches a rep
   hears on the phone and supplies final commercially usable wording.
============================================================ */
(function(g){
'use strict';
var F=g.SHQFunnel;
if(!F||!Array.isArray(F.scenarios))return;
var PROFILE_KEY='shq_fill_v1';
var priorResolve=typeof F.resolveScenario==='function'?F.resolveScenario:null;

function clone(o){var x={};Object.keys(o||{}).forEach(function(k){x[k]=o[k];});return x;}
function find(id){for(var i=0;i<F.scenarios.length;i++)if(F.scenarios[i].id===id)return F.scenarios[i];return null;}
function patch(id,data){var s=find(id);if(!s)return;Object.keys(data).forEach(function(k){s[k]=data[k];});}
function add(id,label,when,goal,next,call,vm,sms,subject,email,video){
  if(find(id))return;
  F.scenarios.push({stage:'outbound',id:id,label:label,when:when,goal:goal,next:next,call:call,vm:vm,sms:sms,subject:subject,email:email,video:video});
}
function profile(){try{return JSON.parse(localStorage.getItem(PROFILE_KEY)||'{}');}catch(e){return {};}}
function saveProfile(p){try{localStorage.setItem(PROFILE_KEY,JSON.stringify(p));}catch(e){}}
function programName(){var p=profile();return p.program&&String(p.program).trim()?String(p.program).trim():'the program tied to this outreach';}
function programDesc(){var p=profile();return p.programdesc&&String(p.programdesc).trim()?String(p.programdesc).trim():'the current program rules and eligibility';}
function programTokens(s){return String(s||'').split('[program]').join(programName()).split('[program description]').join(programDesc());}

/* ----- existing five, rewritten after the global confidence / warmth layers ----- */
patch('owner-first-contact',{
  label:'First Contact, Verify the Owner',
  when:'First outbound attempt from an approved owner/program list.',
  goal:'Earn 30 seconds and verify the person still owns or drives the vehicle before pitching anything.',
  next:'Confirm the current vehicle first. If yes, move to Still Owns It / Start Discovery.',
  call:`Hi [Name], [agent] at Sheehy Nissan. Did I catch you for thirty seconds? I am calling about your [current]. Are you still driving it?`,
  vm:`Hi [Name], [agent] at Sheehy Nissan of Manassas. I have one quick question about your [current]. Call or text me at [number]. Again, [agent] at [number].`,
  sms:`Hi [Name], [agent] at Sheehy Nissan. Quick question about your [current]: are you still driving it?`,
  subject:`👋 [Name], Quick Question About Your [current]`,
  email:`Hi [Name],\n\nQuick question about your [current]: are you still driving it?\n\nIf yes, I have one follow-up and I will keep it simple.\n\n[agent]`,
  video:`Hi [Name], [agent] at Sheehy Nissan. I am reaching out about your [current]. First thing I need to know is simple: are you still driving it?`
});

patch('owner-no-answer',{
  label:'No Answer / First Follow-Up',
  when:'You called the owner and did not connect.',
  goal:'Make the outreach recognizable and earn one easy reply.',
  next:'Use one permitted follow-up channel. Do not stack generic attempts.',
  call:`When you connect: Hi [Name], [agent] at Sheehy Nissan. I tried you earlier about your [current]. Are you still driving it?`,
  vm:`Hi [Name], [agent] at Sheehy Nissan of Manassas. I am calling with one quick question about your [current]. Call or text me at [number]. Again, [agent] at [number].`,
  sms:`Hi [Name], [agent] at Sheehy Nissan. I just tried you about your [current]. Are you still driving it? One word back is enough.`,
  subject:`👋 [Name], I Tried You About Your [current]`,
  email:`Hi [Name],\n\nI just tried you by phone about your [current]. I only need to know whether you still have it.\n\nIf yes, reply YES and I will keep the next question short.\n\n[agent]`,
  video:`A second video usually adds noise here. If you use one, keep it face-to-name and ask only whether they still have the [current].`
});

patch('owner-wants-value',{
  label:'Asks, “What Is Mine Worth?”',
  when:'The owner wants a value on the current vehicle.',
  goal:'Turn value curiosity into a real appraisal path without guessing.',
  next:'Get approximate mileage and material condition first. Then line up the correct appraisal step.',
  call:`Absolutely. I can help with that. Give me the approximate miles and anything material about condition on the [current]. I will get the appraisal path lined up instead of guessing. What are the miles roughly?`,
  vm:`Hi [Name], [agent] at Sheehy Nissan. I am following up on the value question for your [current]. I need the approximate miles and condition so I can line up a real appraisal instead of guessing. Call or text me at [number].`,
  sms:`I can help get a real value on the [current]. What are the approximate miles, and is there anything material about condition I should know before I line up the appraisal?`,
  subject:`🚗 [Name], Let’s Get a Real Read on Your [current]`,
  email:`Hi [Name],\n\nI can help get a real value on your [current]. I do not want to invent a number without the basics.\n\nSend me the approximate mileage and anything material about condition. I will line up the right appraisal step from there.\n\n[agent]`,
  video:`Hi [Name], [agent] at Sheehy Nissan. On your [current], I am not going to guess a value on camera. Give me the approximate miles and condition and I will line up the real appraisal path.`
});

patch('owner-callback',{
  label:'Says, “Call Me Later”',
  call:`Absolutely. What is better for a two-minute callback, [day/time] or [alt time]?`,
  vm:`Hi [Name], [agent] at Sheehy Nissan. I am following the callback timing we discussed on your [current]. Call or text me at [number] if your timing changed.`,
  sms:`No problem. I can call [day/time] or [alt time]. Which is better?`,
  subject:`📅 [Name], Your Callback on the [current]`,
  email:`Hi [Name],\n\nI will keep the callback short. Which works better, [day/time] or [alt time]?\n\n[agent]`,
  video:`No video needed. Respect the callback time and call when promised.`
});

patch('owner-not-interested',{
  label:'Not Interested / Stop',
  call:`Understood. Thanks for giving me a straight answer. I will leave it there.`,
  vm:`Not a voicemail scenario.`,
  sms:`Understood, [Name]. Thanks for the straight answer. I will leave it there.`,
  subject:`Thanks for the Straight Answer, [Name]`,
  email:`Hi [Name],\n\nThanks for giving me a straight answer. I will leave it there.\n\n[agent]`,
  video:`No video. End the outreach cleanly and follow the store DNC/opt-out process when applicable.`
});

/* ----- missing real-world branches ----- */
add('owner-why-calling','Asks, “Why Are You Calling Me?”','The owner challenges the reason for the outreach.','Answer in one sentence, remove mystery and earn the next question.','Do not explain the campaign mechanics. Verify whether a vehicle change is even relevant.',
`Fair question. I am calling because we have you associated with a [current], and I am trying to find out whether it is still doing the job or whether a change is even worth discussing. Are you planning to keep it, or would the right reason make you consider changing it?`,
`Hi [Name], [agent] at Sheehy Nissan. I am calling about your [current]. Nothing complicated. I want to know whether you are keeping it or whether a change is worth a conversation. Call or text me at [number].`,
`Fair question. I am reaching out about your [current]. Are you planning to keep it, or would the right reason make you consider changing it?`,
`[Name], Why I Reached Out About the [current]`,
`Hi [Name],\n\nThe reason I reached out is simple: we have you associated with a [current], and I wanted to find out whether you are keeping it or whether a change is worth discussing.\n\nWhich is closer to where you are right now?\n\n[agent]`,
`Hi [Name], [agent] at Sheehy Nissan. The reason for the outreach is simple: I want to know whether your [current] is still the right vehicle for you or whether a change is worth discussing.`);

add('owner-still-driving','Still Owns It, Start Discovery','The owner confirms they still drive the current vehicle.','Get one useful ownership truth instead of pitching a replacement.','Ask what they like and what they would change. Route their answer to the next behavior.',
`Perfect. How is the [current] treating you? What is one thing you still like about it and one thing you would change if you could?`,
`Hi [Name], [agent] at Sheehy Nissan. Thanks for confirming you still have the [current]. I have one ownership question for you. Call or text me at [number].`,
`Good to know. What is one thing you still like about the [current] and one thing you would change if you could?`,
`[Name], One Question About Your [current]`,
`Hi [Name],\n\nGood to know you still have the [current]. I have one useful question:\n\nWhat is one thing you still like about it and one thing you would change if you could?\n\nThat answer tells me whether there is anything worth working on at all.\n\n[agent]`,
`Hi [Name], [agent] at Sheehy Nissan. You still have the [current], so I am not going to pitch you blind. Tell me one thing you like about it and one thing you wish were better.`);

add('owner-keeping','Happy With It / Plans to Keep It','The owner says they are happy and plan to keep the vehicle.','Separate true satisfaction from a timing or money objection without creating pressure.','Ask one isolation question. If they simply love it, exit. If timing or money is the issue, route accordingly.',
`Good. If the [current] is doing the job, I am not going to manufacture a reason to replace it. One thing before I let you go: are you keeping it because you love the vehicle, or because the timing and numbers do not make sense right now?`,
`Hi [Name], [agent] at Sheehy Nissan. I heard you on keeping the [current]. I have one quick follow-up so I do not read the situation wrong. Call or text me at [number].`,
`If the [current] is doing the job, keeping it can be the right move. Quick distinction: do you love the vehicle, or is it mainly that the timing/numbers do not make sense right now?`,
`[Name], One Last Question on the [current]`,
`Hi [Name],\n\nIf the [current] is doing the job, keeping it can absolutely be the right move.\n\nI only want to separate two things: do you genuinely want to keep the vehicle, or is the real issue that the timing or numbers do not make sense right now?\n\n[agent]`,
`No walkaround needed. This is an isolation conversation. Find out whether “keeping it” means satisfied, bad timing or bad numbers.`);

add('owner-open-change','Open to Changing Vehicles','The owner says they would consider replacing or upgrading the current vehicle.','Turn vague openness into a concrete buying motive.','Find the one improvement that would make changing vehicles worth it, then select the right vehicle.',
`Perfect. Then I do not want to show you “newer” just for the sake of newer. What would have to improve over your [current] for a change to be worth it: space, comfort, technology, reliability, ownership cost or something else?`,
`Hi [Name], [agent] at Sheehy Nissan. You said you would consider a change from the [current]. I need one thing from you so I narrow it correctly. Call or text me at [number].`,
`If you are open to changing the [current], what has to improve for the move to be worth it: space, comfort, tech, reliability, ownership cost or something else?`,
`🚙 [Name], What Has to Improve From the [current]?`,
`Hi [Name],\n\nIf you are open to changing the [current], I do not want to throw vehicles at you.\n\nWhat has to improve for the move to be worth it: space, comfort, technology, reliability, ownership cost or something else?\n\nGive me the top one and I will narrow the direction.\n\n[agent]`,
`Hi [Name], [agent] at Sheehy Nissan. If you are open to changing the [current], the question is not “what is newer?” It is “what actually needs to be better?” Tell me that and I can narrow the right direction.`);

add('owner-same-model-newer','Wants a Newer Version of the Same Model','The owner likes the current model and mainly wants a newer version.','Use brand/model loyalty to define the comparison instead of feature dumping.','Find what they refuse to lose and what they want improved, then line up the closest current match.',
`That makes this easier. If you like the [current], I need two things: what do you refuse to lose from yours, and what do you want the newer one to improve?`,
`Hi [Name], [agent] at Sheehy Nissan. Since you like the [current] and are thinking newer, I have two quick comparison questions. Call or text me at [number].`,
`If you want a newer version of the [current], what is one thing you refuse to lose from yours and one thing you want improved?`,
`🚙 [Name], Let’s Compare Your [current] the Right Way`,
`Hi [Name],\n\nSince you already like the [current], the comparison is simple.\n\nWhat is one thing you refuse to lose from yours, and what is one thing you want the newer vehicle to improve?\n\nI will use that to line up the closest current match.\n\n[agent]`,
`Show the current-generation vehicle only after you know what they want to preserve and improve. Prove those two points, not the whole brochure.`);

add('owner-needs-different-fit','Current Vehicle No Longer Fits','The owner says their needs changed or the current vehicle no longer fits.','Turn the ownership problem into a selection problem.','Identify the non-negotiable need, then move into vehicle selection.',
`That is the reason to look, then. What changed in your life or use of the vehicle that the [current] is not handling well anymore?`,
`Hi [Name], [agent] at Sheehy Nissan. You mentioned the [current] is not fitting the job the way it used to. I want to narrow the replacement around the actual need. Call or text me at [number].`,
`What changed that the [current] is not handling well anymore: space, commute, comfort, family use, towing, fuel cost or something else?`,
`🚙 [Name], Let’s Solve What the [current] Is Missing`,
`Hi [Name],\n\nIf the [current] no longer fits, that gives us a real reason to look.\n\nWhat changed: space, commute, comfort, family use, towing, fuel cost or something else?\n\nOnce I know the actual problem, I can narrow the right vehicle instead of sending random options.\n\n[agent]`,
`Make the video about the need they named. If they need space, prove space. If they need comfort, prove seating and ride-related features. Do not make a generic walkaround.`);

add('owner-wants-offer','Asks, “What Are You Offering Me?”','The owner wants to know the point of the outreach or expects a concrete offer.','Separate trade value, replacement numbers and program eligibility instead of throwing out a hook.','Ask which number/problem they actually want solved, then route correctly.',
`Fair question. There are three different things people usually mean by that: what your [current] is worth, what a replacement would look like or whether there is a current program worth using. Which one are you asking me to solve?`,
`Hi [Name], [agent] at Sheehy Nissan. I got your question about what we are offering. I want to answer the right one: trade value, replacement numbers or a current program. Call or text me at [number].`,
`Fair question. Are you asking what the [current] is worth, what a replacement would look like or whether there is a current program worth using?`,
`[Name], Which Number Do You Want Me to Solve?`,
`Hi [Name],\n\nFair question. “What are you offering?” can mean three different things:\n\n1. What your [current] is worth\n2. What a replacement would look like\n3. Whether there is a current program worth using\n\nWhich one do you want me to solve first?\n\n[agent]`,
`Do not make an “offer” video. Use video only if you have a verified vehicle or program detail worth proving.`);

add('owner-program-question','Asks About the Program / Letter / Email','The owner asks what the campaign, letter, email or program means.','Explain enough to answer the question, then determine whether there is actual replacement intent.','Name the selected program when available, keep eligibility unpromised and ask whether they are actually considering a change.',
`Absolutely. The program tied to this outreach is [program]. I can explain what it is, but I do not want to turn it into a promise before I verify the current vehicle and eligibility rules. Are you actually considering replacing the [current], or are you mainly trying to understand what the program means?`,
`Hi [Name], [agent] at Sheehy Nissan. I can explain the [program] outreach you received and verify the current rules before we count anything into a deal. Call or text me at [number].`,
`The program tied to the outreach is [program]. I can verify the current rules before we count anything into a deal. Are you considering replacing the [current], or mainly checking what the program means?`,
`[Name], About the [program] Outreach`,
`Hi [Name],\n\nThe program tied to the outreach is [program].\n\nI can explain it, but I do not want to imply eligibility or savings before I verify the current rules. Are you actually considering replacing the [current], or are you mainly trying to understand what the program means?\n\n[agent]`,
`Keep the video on you unless there is a verified program document or vehicle worth showing. Name the program, state that details must be verified and ask whether a vehicle change is actually in play.`);

add('owner-eligibility-question','Asks, “Do I Qualify?”','The owner asks whether they qualify for the program.', 'Protect trust by separating interest from verified eligibility.', 'Do not assume qualification. Ask whether they want the program rules verified first or are already choosing a replacement vehicle.',
`Possibly, but I am not going to tell you yes before I verify it. I can check the current rules for [program]. Are you already looking at a replacement vehicle, or do you want me to verify the program requirements first?`,
`Hi [Name], [agent] at Sheehy Nissan. I can verify the current requirements for [program]. I do not want to guess at eligibility. Call or text me at [number] and I will get the right question answered.`,
`I can verify the current requirements for [program], but I do not want to guess at eligibility. Are you already looking at a replacement, or should I verify the program rules first?`,
`[Name], Let’s Verify the [program] Requirements`,
`Hi [Name],\n\nI can verify the current requirements for [program]. I do not want to tell you that you qualify until the actual rules and your situation are checked.\n\nAre you already looking at a replacement vehicle, or should I verify the program requirements first?\n\n[agent]`,
`No eligibility claims on video. State that the current rules have to be verified and keep the next step specific.`);

add('owner-payoff-equity','Has a Payoff / Equity Concern','The owner says they still owe on the current vehicle, mentions negative equity or asks whether they can trade with a loan.', 'Separate payoff from vehicle value and avoid guessing equity.', 'Get the two real inputs in the correct order: vehicle value and payoff.',
`Having a payoff by itself does not tell us whether the [current] has equity or negative equity. We need the real vehicle value and the actual payoff. Do you know the approximate payoff, or should we start with the vehicle value first?`,
`Hi [Name], [agent] at Sheehy Nissan. On the payoff question, I do not want to guess at your equity position. We need the vehicle value and the payoff. Call or text me at [number] and we will work the right piece first.`,
`A payoff does not automatically mean you are upside down. We need the real [current] value and the payoff. Do you know the approximate payoff, or should we start with the vehicle value?`,
`[Name], Let’s Separate the [current] Value From the Payoff`,
`Hi [Name],\n\nHaving a payoff does not automatically tell us whether the [current] has equity or negative equity. We need two real inputs: the vehicle value and the payoff.\n\nDo you know the approximate payoff, or should we start with the vehicle value first?\n\n[agent]`,
`Do not discuss guessed equity on video. Explain that vehicle value and payoff are separate inputs and move to the one the customer can provide first.`);

add('owner-wants-numbers','Wants Numbers Before Coming In','The owner is interested but does not want to visit without seeing real purchase figures first.', 'Do real remote work before asking for a trip.', 'Identify the replacement vehicle and whether the current vehicle is part of the deal, then get verified purchase figures worked.',
`That is reasonable. I am not asking you to come in just to hear basic numbers. First I need the replacement vehicle and whether the [current] is part of the deal. Which do you want to solve first: the vehicle choice or the trade position?`,
`Hi [Name], [agent] at Sheehy Nissan. I can do real work on the purchase figures before I ask you to come in. I need to know the replacement vehicle and whether the [current] is part of the deal. Call or text me at [number].`,
`I can work verified purchase figures before I ask you to come in. First, are we solving the replacement vehicle or the [current] trade position?`,
`💬 [Name], Let’s Work the Real Numbers First`,
`Hi [Name],\n\nI can work verified purchase figures before I ask you to come in. I do not need you driving here just to get basic answers.\n\nFirst I need two things: the replacement vehicle and whether the [current] is part of the deal. Which do you want to solve first?\n\n[agent]`,
`If you have a verified replacement vehicle, show it. Do not state a payment, APR, approval or invented purchase figure on video. Explain what you are working remotely and ask which piece matters first.`);

add('owner-sell-only','Wants to Sell, Not Replace','The owner says they may sell the current vehicle but are not shopping for a replacement.', 'Do not force a purchase conversation. Route the vehicle to the proper used-car appraisal path.', 'Confirm the basic vehicle facts and get the used-car side to determine the next appraisal step.',
`Understood. If you are talking about selling the [current] without replacing it, I will not turn that into a fake shopping conversation. Give me the approximate miles and condition and I will confirm the right appraisal path from there.`,
`Hi [Name], [agent] at Sheehy Nissan. I heard you on selling the [current] without replacing it. I need the approximate miles and condition so I can confirm the right appraisal path. Call or text me at [number].`,
`If you are looking to sell the [current] without replacing it, send me the approximate miles and any material condition notes. I will confirm the right appraisal path from there.`,
`🚗 [Name], About Selling the [current]`,
`Hi [Name],\n\nIf you are looking to sell the [current] without replacing it, I will keep the conversation on that.\n\nSend me the approximate mileage and anything material about condition. I will confirm the right appraisal path from there.\n\n[agent]`,
`No replacement-vehicle video. If useful, make a brief face-to-name message asking for mileage and material condition only.`);

add('owner-already-replaced','Already Replaced / Bought Something Else','The owner says they already replaced the vehicle or recently bought something else.', 'Stop trying to create a deal that is not there and preserve the relationship.', 'Congratulate them, learn what they bought only if natural and close cleanly.',
`Got it. Congratulations on the new vehicle. What did you end up buying?`,
`Not a voicemail scenario unless you are returning a promised call.`,
`Got it. Congratulations on the new vehicle, [Name]. Hope it treats you well.`,
`Congratulations on the New Vehicle, [Name]`,
`Hi [Name],\n\nCongratulations on the new vehicle. I hope it treats you well.\n\nThanks for giving me the update.\n\n[agent]`,
`No sales video needed. Close the outreach cleanly.`);

/* Put the owner stage in a usable conversation order. */
var ORDER=['owner-first-contact','owner-no-answer','owner-why-calling','owner-still-driving','owner-keeping','owner-open-change','owner-same-model-newer','owner-needs-different-fit','owner-wants-value','owner-wants-offer','owner-program-question','owner-eligibility-question','owner-payoff-equity','owner-wants-numbers','owner-sell-only','owner-callback','owner-already-replaced','owner-not-interested'];
var out={},rest=[];
F.scenarios.forEach(function(s){if(s.stage==='outbound')out[s.id]=s;else rest.push(s);});
var ordered=[];ORDER.forEach(function(id){if(out[id]){ordered.push(out[id]);delete out[id];}});Object.keys(out).forEach(function(id){ordered.push(out[id]);});
F.scenarios=ordered.concat(rest);

/* Program tokens are filled only when a program-specific behavior actually uses them. */
F.resolveScenario=function(raw,ctx){
  var x=priorResolve?priorResolve(raw,ctx):clone(raw),o=clone(x||{});
  ['call','vm','sms','subject','email','video','goal','next','when'].forEach(function(k){if(o[k])o[k]=programTokens(o[k]);});
  return o;
};

/* Optional campaign context. It stays with the campaign while customer fields can be cleared. */
function injectContext(){
  var host=document.querySelector('#customerContext .context-tools');if(!host||document.getElementById('outboundProgramBox'))return;
  var box=document.createElement('div');box.className='context-box';box.id='outboundProgramBox';
  box.innerHTML='<div class="box-title">Outbound campaign context</div><div class="context-grid" style="margin-top:8px"><label>Program / campaign<input id="outboundProgramName" autocomplete="off" placeholder="Optional, only when relevant"></label><label>Plain-language note<input id="outboundProgramDesc" autocomplete="off" placeholder="What it is, without a dollar/rate/payment"></label></div><div class="quiet" style="margin-top:7px">Do not lead with the program. Use it only after the customer asks or discovery makes it relevant.</div>';
  host.appendChild(box);
  var p=profile(),n=document.getElementById('outboundProgramName'),d=document.getElementById('outboundProgramDesc');n.value=p.program||'';d.value=p.programdesc||'';
  function write(){var q=profile();q.program=n.value.trim();q.programdesc=d.value.trim();saveProfile(q);try{g.dispatchEvent(new CustomEvent('shq:funnel-context-change'));}catch(e){}}
  n.addEventListener('input',write);d.addEventListener('input',write);
  function toggle(){var s=document.getElementById('stageSelect');box.hidden=!s||s.value!=='outbound';}
  var stage=document.getElementById('stageSelect');if(stage)stage.addEventListener('change',toggle);toggle();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',injectContext);else injectContext();
})(window);
