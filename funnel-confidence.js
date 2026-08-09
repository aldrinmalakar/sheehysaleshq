/* ============================================================
   SHEEHY SALES HQ - 2026 confidence wordtrack layer

   Purpose:
   - Keep the existing behavior model and compliance boundaries.
   - Tighten customer-facing language around control, isolation and closes.
   - Remove passive permission-seeking and generic follow-up language.
   - Never invent inventory, price, payment, APR, approval or incentives.

   Pattern: fact -> isolate -> prescribe next step -> choice close -> stop.
============================================================ */
(function(g){
  'use strict';
  var F=g.SHQFunnel;
  if(!F||!Array.isArray(F.scenarios))return;

  function find(id){for(var i=0;i<F.scenarios.length;i++)if(F.scenarios[i].id===id)return F.scenarios[i];return null;}
  function patch(id,data){var s=find(id);if(!s)return;Object.keys(data).forEach(function(k){s[k]=data[k];});}

  patch('fresh-standard',{
    goal:'Get a real response, identify the buying motive and move directly toward the appointment.',
    next:'Ask one three-way intent question. Once they answer, solve that issue and close on two visit times.',
    call:`Hi [Name], [agent] at Sheehy Nissan. You reached out on the [vehicle]. Quick question so I do not waste your time: are you trying to confirm the vehicle, get the numbers right or make sure it is the right fit?`,
    vm:`Hi [Name], [agent] at Sheehy Nissan of Manassas. You reached out on the [vehicle]. I have one quick question before I work the wrong thing for you. Call or text me at [number]. Again, [agent] at [number].`,
    sms:`Hi [Name], [agent] at Sheehy Nissan. You reached out on the [vehicle]. Which one matters first: vehicle status, numbers or fit?`,
    subject:`👋 [Name], One Quick Question on the [vehicle]`,
    email:`Hi [Name],\n\nYou reached out on the [vehicle]. I do not want to bury you in information you did not ask for.\n\nWhich one matters first: vehicle status, numbers or making sure it is the right fit?\n\nReply with one. I will work that first and keep this moving.\n\n[agent]`,
    video:`Hi [Name], [agent] at Sheehy Nissan. You reached out on the [vehicle], so I made this for your request, not as a generic walkaround. Tell me what matters first: status, numbers or fit. I will work that next.`
  });

  patch('fresh-email-only',{
    call:`Email-only lead. Do not manufacture a call path. Earn the phone number by making the call useful.`,
    email:`Hi [Name],\n\nYou reached out on the [vehicle]. I only received your email, so I will keep this efficient.\n\nWhat are you solving first: vehicle status, numbers or fit? Reply with one and I will work that first.\n\nIf the fastest way to handle it is one short call, send me the best number and a 5-minute window. I will call once with the answer in front of me.\n\n[agent]`,
    video:`Hi [Name], [agent] at Sheehy Nissan. I made this specifically for your [vehicle] request. Tell me what you need first: status, numbers or fit. If one short call is faster than an email chain, send me the best number and time and I will call once with the answer ready.`
  });

  patch('availability-first',{
    goal:'Answer the exact question after verification and convert the answer into a visit.',
    next:'Verify the exact unit. Then state the status and immediately offer two visit times.',
    call:`I verified the [vehicle]. Let us make the next step simple. I can line up your visit for [day/time] or [alt time]. Which works better?`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. I am calling with the status on the [vehicle] you asked about. Call or text me at [number]. I will give you the clean answer and the next move.`,
    sms:`Hi [Name], I verified the [vehicle]. I can line up your visit for [day/time] or [alt time]. Which works better?`,
    subject:`🚙 [Name], I Verified the [vehicle]`,
    email:`Hi [Name],\n\nI verified the [vehicle] so we are working from a real status, not a screen guess.\n\nThe next move is simple: [day/time] or [alt time]. Which works better for you?\n\n[agent]`,
    video:`Hi [Name], [agent] at Sheehy Nissan. I verified the [vehicle] you asked about. I am showing you the actual vehicle context so there is no mystery. I can line up your visit for [day/time] or [alt time]. Which works better?`
  });

  patch('price-first',{
    goal:'Clarify what “best price” means, protect accuracy and take control of the comparison.',
    next:'Determine whether they have a written competing quote or are setting a budget. Then work the right comparison and move to the appointment.',
    call:`I can get you the clean number. First, are you comparing a written quote on the exact [vehicle] or are you setting your budget? Those are two different conversations.`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. I saw the price question on the [vehicle]. I can work it, but I need to know whether we are comparing an exact quote or setting a budget. Call or text me at [number].`,
    sms:`I can work the number on the [vehicle]. Are you comparing a written quote on the exact vehicle or setting your budget?`,
    subject:`💬 [Name], Let’s Make the [vehicle] Number Make Sense`,
    email:`Hi [Name],\n\nI can work the number on the [vehicle]. First I need to know what we are solving.\n\nAre you comparing a written quote on the exact vehicle or are you setting your budget? If you have a quote, send it over.\n\nOnce I know that, I can give you a clean comparison instead of throwing out a disconnected number.\n\n[agent]`,
    video:`Hi [Name], [agent] at Sheehy Nissan. I saw the price question on the [vehicle]. I am not going to negotiate against myself or make up a number on video. Tell me whether you are comparing an exact quote or setting your budget. Then I can work the right problem.`
  });

  patch('test-drive-request',{
    goal:'Turn existing intent into a firm appointment with almost no friction.',
    next:'Verify the exact vehicle, offer two times and confirm one.',
    call:`Absolutely. I will verify the [vehicle] and line the visit up correctly. I have [day/time] or [alt time]. Which one works?`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. I saw your test-drive request on the [vehicle]. I am verifying the exact vehicle now. Call me at [number] and we will lock the better time.`,
    sms:`I saw your test-drive request on the [vehicle]. I am verifying the exact vehicle now. [day/time] or [alt time]?`,
    subject:`📅 [Name], Let’s Lock In Your [vehicle] Drive`,
    email:`Hi [Name],\n\nI saw your request to drive the [vehicle]. I am verifying the exact vehicle so your trip is productive.\n\nI have [day/time] or [alt time]. Which one works better?\n\n[agent]`,
    video:`Hi [Name], [agent] at Sheehy Nissan. I saw your request to drive the [vehicle]. I am verifying the exact vehicle and lining up the visit. I have [day/time] or [alt time]. Pick the better one and I will take it from there.`
  });

  patch('unit-gone',{
    goal:'Protect trust fast, identify why that unit mattered and redirect to the closest real match.',
    next:'State the bad news plainly. Then isolate the must-have that made that vehicle attractive.',
    call:`[Name], straight update: the exact [vehicle] is no longer available. I am not going to throw a random substitute at you. What made that one the one: price, equipment, color, miles or something else?`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. I have a direct update on the exact [vehicle] you asked about and I am already working the closest real direction. Call or text me at [number].`,
    sms:`Straight update: the exact [vehicle] is no longer available. What made that one the one: price, equipment, color, miles or something else? I will work from that.`,
    subject:`🚙 [Name], Straight Update on the [vehicle]`,
    email:`Hi [Name],\n\nStraight update: the exact [vehicle] you asked about is no longer available.\n\nI am not going to send you random substitutes. Tell me what made that one the one: price, equipment, color, miles or something else.\n\nI will work from that and give you the closest real options.\n\n[agent]`,
    video:`Hi [Name], [agent] at Sheehy Nissan. Straight update: the exact [vehicle] is gone. I am not going to bait-and-switch you with something random. Tell me the one or two things that made that vehicle right and I will work from there.`
  });

  patch('no-response-day1',{
    goal:'Earn a low-effort response without sounding needy or repeating the first message.',
    next:'Give them a simple choice that tells you what to work next.',
    call:`Hi [Name], [agent] at Sheehy Nissan. I do not need a long conversation. On the [vehicle], what do you still need from me: status, numbers or a time to see it?`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. I am not calling to repeat the same message. On the [vehicle], I only need to know what you still need: status, numbers or a time to see it. Call or text me at [number].`,
    sms:`Quick one, [Name]. What do you still need on the [vehicle]: 1 status, 2 numbers or 3 a time to see it?`,
    subject:`[Name], Pick One on the [vehicle]`,
    email:`Hi [Name],\n\nI am not sending another “just checking in” email. Pick the one thing you still need:\n\n1. Vehicle status\n2. Numbers / comparison\n3. A time to see it\n\nReply 1, 2 or 3 and I will work that next.\n\n[agent]`,
    video:`Hi [Name], [agent] at Sheehy Nissan. I am not going to keep stacking generic follow-ups. Give me one answer on the [vehicle]: status, numbers or a time to see it. I will work that next.`
  });

  patch('final-nudge',{
    goal:'Force clarity without pressure and stop wasting follow-up cycles.',
    next:'Ask for one of three outcomes: still shopping, already bought or pause.',
    call:`Hi [Name], [agent] at Sheehy Nissan. I am cleaning up my follow-up on the [vehicle]. Which one is true: still shopping, already bought or pause this for now?`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. I am closing the loop on the [vehicle]. If you are still shopping, call or text me at [number]. If you bought or the timing changed, send me one line and I will update it.`,
    sms:`Closing the loop on the [vehicle]: still shopping, already bought or pause for now?`,
    subject:`👋 [Name], Still Shopping, Bought or Pause?`,
    email:`Hi [Name],\n\nI am closing the loop on the [vehicle]. Which one is true?\n\n1. Still shopping\n2. Already bought\n3. Pause for now\n\nReply with the number and I will handle it correctly.\n\n[agent]`,
    video:`Hi [Name], [agent] at Sheehy Nissan. Last clean update from me on the [vehicle]. Tell me which lane we are in: still shopping, already bought or pause for now. One answer is enough.`
  });

  patch('wants-details',{
    goal:'Answer the exact question, prove it on the actual vehicle and convert curiosity into a visit.',
    next:'Answer only what they asked. Then show or demonstrate it and close on two times.',
    call:`I have the answer. I am not going to dump twenty features on you. The part you asked about is the one we should prove in person. I have [day/time] or [alt time]. Which works?`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. I have the answer on the [vehicle] and I can show you the exact part you asked about. Call or text me at [number].`,
    sms:`I have the answer on the [vehicle]. Let us prove the part you care about in person. [day/time] or [alt time]?`,
    subject:`🔎 [Name], I Checked the [vehicle] Detail`,
    email:`Hi [Name],\n\nI checked the detail you asked about on the [vehicle]. I will keep this focused instead of sending you a brochure.\n\nThe best next step is seeing that exact part work in person. I have [day/time] or [alt time]. Which works better?\n\n[agent]`,
    video:`Hi [Name], [agent] at Sheehy Nissan. I checked the exact detail you asked about on the [vehicle]. I am showing that piece here, not giving you a generic feature tour. If this checks the box, I have [day/time] or [alt time] for you to see the whole vehicle.`
  });

  patch('payment-apr',{
    goal:'Keep control without inventing finance numbers and move the customer toward a real structure.',
    next:'State the boundary once. Then move to vehicle fit and the finance review needed for a real answer.',
    call:`I can get you a real answer. I am not going to guess at payment, APR or approval because the structure and finance review matter. Let us get the vehicle fit right first, then put real options in front of you. [day/time] or [alt time]?`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. I got your payment or financing question. I will not guess at a rate, payment or approval. I can get you to the real answer. Call or text me at [number].`,
    sms:`I can get you a real answer on the finance question. I will not guess at payment, APR or approval. Let us get the vehicle fit right and then structure it correctly. [day/time] or [alt time]?`,
    subject:`💬 [Name], Let’s Get a Real Answer on the [vehicle]`,
    email:`Hi [Name],\n\nI understand why you want the finance answer before spending time at the dealership. I am not going to guess at payment, APR or approval because the actual structure and finance review matter.\n\nThe clean move is to get the vehicle fit right and then put real options in front of you. I have [day/time] or [alt time]. Which works better?\n\n[agent]`,
    video:`Hi [Name], [agent] at Sheehy Nissan. I saw the finance question on the [vehicle]. I will not make up a payment, rate or approval expectation on video. I can get you to the real answer. First, let us make sure this is the right vehicle. [day/time] or [alt time]?`
  });

  patch('trade-value',{
    goal:'Move from online curiosity to a real appraisal and keep the replacement vehicle in the conversation.',
    next:'Explain the two variables that matter, then set the appraisal appointment.',
    call:`I can get you a real appraisal on the [current]. Mileage and condition are what move the number, so I am not going to fake precision from my desk. Bring it [day/time] or [alt time]. Which works?`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. I can get you a real number on the [current]. Mileage and condition matter, so I want the actual vehicle in front of the right manager. Call or text me at [number].`,
    sms:`I can get you a real appraisal on the [current]. Bring it [day/time] or [alt time]. Which works better?`,
    subject:`🚗 [Name], Let’s Put a Real Number on Your [current]`,
    email:`Hi [Name],\n\nI can get you a real appraisal on the [current]. Mileage and condition are what move the number, so I am not going to throw out fake precision from a screen.\n\nBring it [day/time] or [alt time]. Which works better?\n\n[agent]`,
    video:`Hi [Name], [agent] at Sheehy Nissan. On your [current], I would rather give you a real appraisal than an internet guess. Bring it with you and let us put the actual vehicle in front of the right manager. [day/time] or [alt time]?`
  });

  patch('credit-concern',{
    goal:'Lower anxiety, keep the conversation private and move to the people who can give a real answer.',
    next:'Do not diagnose or promise. Move directly to a private finance conversation.',
    call:`Understood. We handle that privately. I am not going to judge it or promise an approval I do not control. The clean move is to put the situation in front of finance and get facts. I have [day/time] or [alt time]. Which works?`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. I got your note. We can handle the next step privately and without guessing. Call or text me at [number] and I will line up the right conversation.`,
    sms:`Understood. We can handle the next step privately. I will not promise an approval, but I can get you a real answer with finance. [day/time] or [alt time]?`,
    subject:`🔒 [Name], Let’s Handle the Next Step Privately`,
    email:`Hi [Name],\n\nUnderstood. We can handle the next step privately. I am not going to judge the situation or promise an approval I do not control.\n\nThe clean move is to get you in front of finance for a real answer. I have [day/time] or [alt time]. Which works better?\n\n[agent]`,
    video:`Hi [Name], [agent] at Sheehy Nissan. I received your note. I will keep the details private and I will not make promises I do not control. I can get you to a real answer. [day/time] or [alt time]?`
  });

  patch('competitor-shop',{
    goal:'Control the comparison by isolating what will actually decide the purchase.',
    next:'Ask what they are comparing and what the deciding factor is. Then prove that factor.',
    call:`Good. You should compare. What is the [vehicle] up against, and what is actually going to decide it: price, equipment, drive or ownership cost?`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. I know you are comparing the [vehicle]. Good. I have one question that will make the comparison useful instead of noisy. Call or text me at [number].`,
    sms:`You should compare. What is the [vehicle] up against, and what decides it: price, equipment, drive or ownership cost?`,
    subject:`⚖️ [Name], Let’s Compare the [vehicle] on What Matters`,
    email:`Hi [Name],\n\nYou should compare before you decide. The useful question is what will actually decide it.\n\nWhat is the [vehicle] up against, and is the deciding factor price, equipment, drive or ownership cost?\n\nTell me that and I will give you a straight comparison, including where the other option may be stronger.\n\n[agent]`,
    video:`Hi [Name], [agent] at Sheehy Nissan. You are comparing, which is smart. Tell me the other vehicle and the one factor that decides it. I will show you the real difference and I will not invent a weakness on the other car.`
  });

  patch('not-ready',{
    goal:'Turn a vague delay into a real timeline and stop chasing blindly.',
    next:'Define whether “later” means days, weeks or months. Then schedule the correct follow-up.',
    call:`Got it. Define “not ready” for me so I follow your timing correctly: are we talking days, weeks or months?`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. I heard you on the timing. I only need to know whether “later” means days, weeks or months so I do not chase you incorrectly. Call or text me at [number].`,
    sms:`Got it. When you say not ready, are we talking days, weeks or months?`,
    subject:`🗓️ [Name], Days, Weeks or Months on the [vehicle]?`,
    email:`Hi [Name],\n\nI heard you on the timing. Define “not ready” for me so I handle this correctly: days, weeks or months?\n\nGive me the real window and I will follow that timeline.\n\n[agent]`,
    video:`Hi [Name], [agent] at Sheehy Nissan. I heard you on the timing. I do not need a sales answer. I need the real one: days, weeks or months? Give me the window and I will follow it.`
  });

  patch('decision-maker',{
    goal:'Bring the real decision makers into one conversation and stop using the customer as a messenger.',
    next:'Ask what the other person cares about most, then set a joint visit or call.',
    call:`Then let us not play telephone. What are the one or two things the other decision maker is going to care about most? We will cover those together. I have [day/time] or [alt time]. Which works for both of you?`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. Since this is a shared decision, let us get both people the same information once. Call or text me at [number] and we will line up the right time.`,
    sms:`Let us not make you relay everything secondhand. What are the one or two things the other decision maker cares about most? I have [day/time] or [alt time] for both of you.`,
    subject:`👥 [Name], Let’s Get Everyone on the Same Page`,
    email:`Hi [Name],\n\nSince this is a shared decision, let us not make you relay everything secondhand.\n\nWhat are the one or two things the other decision maker will care about most? We will cover those together.\n\nI have [day/time] or [alt time]. Which works for both of you?\n\n[agent]`,
    video:`Hi [Name], [agent] at Sheehy Nissan. Since someone else is part of the decision, I want both of you looking at the same vehicle and the same facts. Tell me what matters most to them, then pick [day/time] or [alt time] and we will handle it together.`
  });

  patch('booked',{
    goal:'Lock the commitment and remove ambiguity about the visit.',
    next:'Confirm the time, vehicle and who is coming. Then stop reselling the appointment.',
    call:`Perfect. You are locked in for [day/time] on the [vehicle]. I am lining the visit up now. Will it be just you or is anyone else part of the decision?`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. You are locked in for [day/time] on the [vehicle]. If anything changes, call or text me at [number]. Otherwise I will see you then.`,
    sms:`[Name], you are locked in for [day/time] on the [vehicle]. I am lining the visit up now. Will it be just you or is anyone else coming?`,
    subject:`📅 [Name], Locked In for [day/time]`,
    email:`Hi [Name],\n\nYou are locked in for [day/time] on the [vehicle]. I am lining the visit up so we can use your time well.\n\nWill it be just you or is anyone else part of the decision?\n\n[agent]`,
    video:`Hi [Name], [agent] at Sheehy Nissan. You are locked in for [day/time] on the [vehicle]. I am sending this so you know exactly who to ask for when you arrive. I will see you then.`
  });

  patch('day-of',{
    call:`Hi [Name], [agent] at Sheehy Nissan. I am lining up your [day/time] visit on the [vehicle] now. We are still on, correct?`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. I am lining up your [day/time] visit on the [vehicle]. If anything changed, call or text me at [number]. Otherwise I will see you then.`,
    sms:`I am lining up your [day/time] visit on the [vehicle] now. We are still on, correct?`,
    subject:`📅 [Name], Confirming [day/time] on the [vehicle]`,
    email:`Hi [Name],\n\nI am lining up your [day/time] visit on the [vehicle] now. We are still on, correct?\n\nIf anything changed, reply here and I will adjust it.\n\n[agent]`,
    video:`Hi [Name], [agent] at Sheehy Nissan. I am lining up your visit on the [vehicle] now. We are still on for [day/time], correct?`
  });

  patch('reschedule',{
    call:`Absolutely. Let us reset it now instead of leaving it floating. I have [day/time] or [alt time]. Which one works?`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. I can move your [vehicle] visit. Call or text me at [number] and we will lock the replacement time.`,
    sms:`Let us reset it now: [day/time] or [alt time]. Which works?`,
    subject:`📅 [Name], Let’s Reset the [vehicle] Visit`,
    email:`Hi [Name],\n\nLet us reset the [vehicle] visit now instead of leaving it open.\n\n[day/time] or [alt time]. Which works better?\n\n[agent]`,
    video:`Hi [Name], [agent] at Sheehy Nissan. We will move the visit and keep this simple. [day/time] or [alt time]. Pick the better one and I will reset it.`
  });

  patch('running-late',{
    call:`Got it. Give me the real ETA so I plan correctly: about 15 minutes or closer to 30?`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. I got the delay. Send me your real ETA so I can plan the visit correctly. Call or text me at [number].`,
    sms:`Got it. Real ETA: about 15 minutes or closer to 30?`,
    subject:`📅 [Name], Send Me Your Real ETA`,
    email:`Hi [Name],\n\nGot it on the delay. Send me your real ETA so I can plan the visit correctly.\n\n[agent]`
  });

  patch('no-show',{
    goal:'Get a clean answer fast: reset the appointment or identify that the plan changed.',
    next:'Do not scold. Ask a binary recovery question.',
    call:`Hi [Name], [agent] at Sheehy Nissan. We missed each other on the [vehicle]. Do we reset the appointment or did the plan change?`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. We missed each other on the [vehicle]. No lecture. Tell me whether we reset it or the plan changed. Call or text me at [number].`,
    sms:`We missed each other on the [vehicle]. Do we reset it or did the plan change?`,
    subject:`👋 [Name], Reset the [vehicle] Visit or Did the Plan Change?`,
    email:`Hi [Name],\n\nWe missed each other on the [vehicle]. No lecture from me.\n\nDo we reset the appointment or did the plan change?\n\n[agent]`,
    video:`Hi [Name], [agent] at Sheehy Nissan. We missed each other on the [vehicle]. No lecture. Tell me whether we reset the visit or whether your plan changed.`
  });

  patch('just-looking',{
    goal:'Lower resistance without surrendering control of selection.',
    next:'Give them space, earn 20 seconds and ask one narrowing question.',
    call:`Perfect. Look around. Give me 20 seconds so I do not point you at the wrong cars: are you replacing something, adding a vehicle or comparing options?`,
    sms:`Good meeting you, [Name]. What caught your eye today? Give me the model or two and I will make the next look faster.`,
    subject:`👋 [Name], What Caught Your Eye Today?`,
    email:`Hi [Name],\n\nGood meeting you today. What caught your eye? Give me the model or two and I will make the next visit much faster.\n\n[agent]`
  });

  patch('price-immediately',{
    goal:'Answer the factual price question and immediately regain control of the comparison.',
    next:'Show the verified price, then isolate what they are comparing it against.',
    call:`Absolutely. I will show you the verified price. Before we call it good or bad, what are you comparing it to: another quote, another vehicle or your target budget?`,
    sms:`I can help you compare the [vehicle] cleanly. What are we measuring it against: another quote, another vehicle or your target budget?`,
    subject:`💬 [Name], What Are We Comparing the [vehicle] Against?`,
    email:`Hi [Name],\n\nI can help you compare the [vehicle] cleanly. What are we measuring it against: another quote, another vehicle or your target budget?\n\nThat tells me what actually needs to be solved.\n\n[agent]`
  });

  patch('unsure-vehicle',{
    goal:'Turn broad shopping into a controlled two-vehicle selection.',
    next:'Shop the problem, not the model list. Identify what the current vehicle fails to do.',
    call:`Good. Then we do not shop the whole lot. We shop the problem. What are you driving now, and what does it not do well enough?`,
    sms:`You gave me enough to narrow this down. What does your current vehicle not do well enough? I will work from that, not send you twenty cars.`,
    subject:`🔎 [Name], Let’s Narrow This to Two Real Options`,
    email:`Hi [Name],\n\nYou do not need twenty options. You need the right two.\n\nWhat does your current vehicle not do well enough? I will work from that and narrow the field.\n\n[agent]`,
    video:`Hi [Name], [agent] at Sheehy Nissan. I am not going to throw the whole lot at you. Tell me what your current vehicle is missing and I will narrow this to the one or two directions worth your time.`
  });

  patch('decision-maker-absent',{
    call:`Then we have two jobs today: make sure this fits you and make sure the other decision maker is not getting the story secondhand. What are the two things they will care about most? Then we will set the return time with both of you.`,
    sms:`Since this is a shared decision, let us get both of you in front of the same vehicle once. I have [day/time] or [alt time]. Which works for both?`,
    subject:`👥 [Name], Let’s Get Both Decision Makers Together`,
    email:`Hi [Name],\n\nSince this is a shared decision, let us get both of you in front of the same vehicle and the same facts once.\n\nI have [day/time] or [alt time]. Which works for both of you?\n\n[agent]`
  });

  patch('loves-it',{
    goal:'Stop selling. Confirm commitment and move straight to the proposal.',
    next:'Trial close once. If the vehicle is right, write it up.',
    call:`Sounds like the car is right. If the structure makes sense, are you buying this one today?`,
    sms:`You liked the [vehicle]. The unfinished part is the real structure. Let us finish that [day/time] or [alt time]. Which works?`,
    subject:`✅ [Name], Let’s Finish the [vehicle] Decision`,
    email:`Hi [Name],\n\nThe [vehicle] checked the boxes. The unfinished part is the real structure so you can make a clean decision.\n\nLet us finish that [day/time] or [alt time]. Which works?\n\n[agent]`,
    video:`Hi [Name], [agent] at Sheehy Nissan. You already know how the [vehicle] drives and it looked like the right fit. The unfinished part is the structure. Let us finish the decision instead of restarting the sale.`
  });

  patch('unsure-after-drive',{
    goal:'Find the missing piece immediately instead of adding more features or discounting blindly.',
    next:'Make them name what failed to become a yes.',
    call:`Good. “Not sure” means something did not become a yes. What is it: size, drive, features, price expectation or something else?`,
    sms:`“Not sure” means one piece did not land. Which one: size, drive, features, price expectation or something else?`,
    subject:`🔎 [Name], What Kept the [vehicle] From Being a Yes?`,
    email:`Hi [Name],\n\n“Not sure” usually means one piece did not become a yes. What was it: size, drive, features, price expectation or something else?\n\nName the piece and I will either solve it or move you to a better fit.\n\n[agent]`,
    video:`Hi [Name], [agent] at Sheehy Nissan. I could tell the [vehicle] was close but not a clean yes. Tell me the one thing that missed. I will either solve it or stop trying to sell you the wrong car.`
  });

  patch('wrong-fit',{
    call:`Good. Kill the wrong car fast. What is the one thing this [vehicle] missed that the next vehicle absolutely has to get right?`,
    sms:`The [vehicle] missed. Good, now we know. What must the next vehicle get right?`,
    subject:`🔄 [Name], What Must the Next Vehicle Get Right?`,
    email:`Hi [Name],\n\nThe [vehicle] missed. That is useful because now we know what not to repeat.\n\nWhat is the one thing the next vehicle absolutely has to get right? I will narrow from there.\n\n[agent]`,
    video:`Hi [Name], [agent] at Sheehy Nissan. I am not defending the wrong car. Tell me the one thing the [vehicle] missed. That becomes the rule for the next one.`
  });

  patch('leave-before-numbers',{
    goal:'Keep the customer from leaving with assumptions after doing the hardest part of the sale.',
    next:'Ask for 10 minutes and get a real proposal in front of them.',
    call:`Before you go, give me 10 minutes. You already did the hard part and drove the [vehicle]. Let me put real numbers next to it so you do not leave deciding from guesses.`,
    sms:`You already drove the [vehicle]. The unfinished part is real numbers. Let us finish that [day/time] or [alt time] so you are not deciding from assumptions.`,
    subject:`💬 [Name], Finish the One Part We Did Not Do`,
    email:`Hi [Name],\n\nYou already drove the [vehicle]. The unfinished part is putting real numbers next to it.\n\nLet us finish that [day/time] or [alt time] so you can decide from facts, not assumptions.\n\n[agent]`,
    video:`Hi [Name], [agent] at Sheehy Nissan. You already know the vehicle. We stopped before the one part that lets you make a real decision: the numbers. Let us finish that instead of restarting the process.`
  });

  patch('price-high',{
    goal:'Isolate price as the only objection, define the gap and earn permission to ask the desk for a real move.',
    next:'Ask whether price is the only blocker. If yes, identify the gap and close conditionally.',
    call:`Fair. Is price the only thing between us and a yes on the [vehicle]? If it is, how far apart are we? Give me the real gap and I will take one clean ask to the desk.`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. I heard the price concern. I am not calling to restart the negotiation. I need to know whether price is the only blocker and what the real gap is. Call or text me at [number].`,
    sms:`Is price the only thing between us and a yes on the [vehicle]? If yes, how far apart are we?`,
    subject:`💬 [Name], Is Price the Only Thing Left?`,
    email:`Hi [Name],\n\nI heard you on price. Let us isolate it.\n\nIs price the only thing between us and a yes on the [vehicle]? If yes, how far apart are we?\n\nGive me the real gap and I can take one clean ask to the desk.\n\n[agent]`,
    video:`Hi [Name], [agent] here. I heard the price concern. I am not negotiating against myself on video. One question: is price the only thing keeping the [vehicle] from being a yes? If it is, tell me the real gap.`
  });

  patch('payment-high',{
    goal:'Isolate payment without inventing a new payment and get the real target to finance.',
    next:'Ask whether payment is the only blocker, then identify whether the gap is small or structural.',
    call:`Fair. Is payment the only thing between us and a yes on the [vehicle]? If it is, are we a little high or nowhere close to where you need to be? I will take the real concern to finance.`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. I heard the payment concern. I am not going to guess at a new payment. I need the real gap so finance can work the right problem. Call or text me at [number].`,
    sms:`Is payment the only thing between us and a yes on the [vehicle]? If yes, are we a little high or nowhere close?`,
    subject:`💳 [Name], Is Payment the Only Thing Left?`,
    email:`Hi [Name],\n\nI heard you on payment. Let us isolate it.\n\nIs payment the only thing between us and a yes on the [vehicle]? If yes, are we a little high or nowhere close to where you need to be?\n\nI will take the real concern to finance instead of guessing at a number.\n\n[agent]`,
    video:`Hi [Name], [agent] here. I heard the payment concern. I am not going to invent a lower payment on video. Tell me whether payment is the only blocker and whether we are a little off or way off.`
  });

  patch('trade-low',{
    goal:'Isolate the trade gap and make the customer state the number they expected.',
    next:'Ask their expectation, then conditionally close if the trade is the only blocker.',
    call:`Understood. What number were you expecting on the [current]? And if we get closer there, are you ready to move forward on the [vehicle]?`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. I heard you on the [current] appraisal. I need the number you expected and whether trade is the only blocker so I can take a clean ask to the right manager. Call or text me at [number].`,
    sms:`What number were you expecting on the [current]? If we get closer there, are you ready to move on the [vehicle]?`,
    subject:`🚗 [Name], What Number Did You Expect on the [current]?`,
    email:`Hi [Name],\n\nI heard you on the [current] appraisal. What number were you expecting?\n\nAnd if we get closer there, are you ready to move forward on the [vehicle]?\n\nThat gives me a clean ask to take to the right manager.\n\n[agent]`,
    video:`Hi [Name], [agent] here. I heard the trade concern. Give me the number you expected on the [current], then tell me if trade is the only thing keeping the [vehicle] from being a yes.`
  });

  patch('fees',{
    goal:'Remove confusion without defensiveness and isolate whether any real objection remains.',
    next:'Identify the exact line item, explain only verified facts, then ask whether anything else remains.',
    call:`Good question. Point to the exact line you want explained and I will break down that line, not dance around it. Once it is clear, is there anything else keeping the deal from making sense?`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. I am calling about the line item you questioned. I want to explain the exact item, not give you a vague answer. Call or text me at [number].`,
    sms:`Which exact line item is the issue? I will explain that one directly. Once it is clear, is anything else holding up the deal?`,
    subject:`📄 [Name], Let’s Clear Up the Exact Line Item`,
    email:`Hi [Name],\n\nGood question on the proposal. Tell me the exact line item you want explained and I will break down that item directly.\n\nOnce it is clear, is there anything else keeping the deal from making sense?\n\n[agent]`
  });

  patch('think-about-it',{
    goal:'Find the hidden objection instead of accepting a vague delay.',
    next:'Make them choose the unresolved category. Then isolate and solve it.',
    call:`You should think clearly, not vaguely. What exactly is unresolved: the vehicle, the money, the trade or the timing?`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. I know you wanted to think it over. I am not calling to pressure you. I need to know which piece is actually unresolved so I do not keep following up on the wrong thing. Call or text me at [number].`,
    sms:`What exactly is still unresolved: the vehicle, the money, the trade or the timing?`,
    subject:`🤔 [Name], What Exactly Is Still Unresolved?`,
    email:`Hi [Name],\n\nYou should think it through. I just want the thinking focused on the real issue.\n\nWhat exactly is still unresolved: the vehicle, the money, the trade or the timing?\n\nName the piece and I will either solve it or leave it alone.\n\n[agent]`,
    video:`Hi [Name], [agent] here. I know you wanted to think about it. I am not going to chase you with another pitch. Tell me the one piece still unresolved: vehicle, money, trade or timing. Then I know whether there is actually something to solve.`
  });

  patch('sleep-spouse',{
    goal:'Stop the customer from becoming the messenger and surface the absent decision maker’s real objection.',
    next:'Ask what question the other person will ask first, answer it and invite them into the conversation.',
    call:`Let us not send you home as my salesperson. What is the first question they are going to ask you about the [vehicle] or the numbers? Let us answer that now.`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. Since someone else is weighing in, I want to make sure you have the answer they are most likely to ask for. Call or text me at [number].`,
    sms:`What is the first question the other decision maker is going to ask about the [vehicle] or the numbers? Let us answer that before you have to relay it.`,
    subject:`👥 [Name], What Will They Ask You First?`,
    email:`Hi [Name],\n\nSince someone else is weighing in, let us not make you relay half the story.\n\nWhat is the first question they are going to ask about the [vehicle] or the numbers? Let us answer that directly.\n\n[agent]`,
    video:`Hi [Name], [agent] here. I do not want you going home as the messenger. Tell me what the other decision maker is going to ask first. I will help you get that answer cleanly.`
  });

  patch('ready',{
    goal:'Stop selling and execute the purchase cleanly.',
    next:'Confirm the vehicle and direction, then move to paperwork and the proper handoff.',
    call:`Great. We have the right [vehicle] and the direction works. Let us write it up and move to the next step.`,
    sms:`Great. We are moving forward on the [vehicle]. I am organizing the next step now and I will tell you exactly what I need.`,
    subject:`🔑 [Name], We’re Moving Forward on the [vehicle]`,
    email:`Hi [Name],\n\nWe are moving forward on the [vehicle]. I am organizing the next step now and I will keep it clean from here.\n\nI will tell you exactly what I need as we go.\n\n[agent]`
  });

  patch('left-with-numbers',{
    goal:'Get the real reason they did not buy without restarting the presentation.',
    next:'Ask the one closing question: what kept it from being a yes?',
    call:`Hi [Name], [agent] at Sheehy Nissan. You already know the [vehicle] and you already saw the numbers. One question: what kept it from being a yes?`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. I am not calling to replay the whole visit. You know the [vehicle] and the numbers. I only need to know what kept it from being a yes. Call or text me at [number].`,
    sms:`You know the [vehicle] and the numbers. What kept it from being a yes?`,
    subject:`👋 [Name], What Kept the [vehicle] From Being a Yes?`,
    email:`Hi [Name],\n\nYou already know the [vehicle] and you already saw the proposal, so I am not going to restart the whole sales pitch.\n\nWhat kept it from being a yes?\n\n[agent]`,
    video:`Hi [Name], [agent] here. You know the vehicle and you know the proposal. I only need one answer: what kept it from being a yes? That tells me whether there is something real to solve.`
  });

  patch('ghost-after-visit',{
    goal:'Force clarity after a real visit without sending another generic follow-up.',
    next:'Ask whether the plan changed or one part of the deal missed.',
    call:`Hi [Name], [agent] at Sheehy Nissan. We spent real time on the [vehicle], so I will ask you directly: did the plan change or did one part of our deal miss?`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. We spent real time on the [vehicle], so I am not sending another generic follow-up. Did the plan change or did one part of our deal miss? Call or text me at [number].`,
    sms:`We spent real time on the [vehicle], so I will ask directly: did the plan change or did one part of our deal miss?`,
    subject:`👋 [Name], Did the Plan Change or Did We Miss Something?`,
    email:`Hi [Name],\n\nWe spent real time on the [vehicle], so I am not sending another generic follow-up.\n\nDid the plan change or did one part of our deal miss?\n\nEither answer tells me what to do next.\n\n[agent]`,
    video:`Hi [Name], [agent] here. We already did the work on the [vehicle]. I am not going to repeat the pitch. Tell me whether the plan changed or whether one part of our deal missed.`
  });

  patch('sold-thankyou',{
    call:`Hi [Name], [agent] at Sheehy Nissan. First-day check on the [vehicle]: what is working great, and is there anything on the controls or ownership side you want me to clear up?`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. First-day check on the [vehicle]. If anything needs clarification or attention, call or text me at [number] and I will point it to the right place.`,
    sms:`First-day check on the [vehicle]: anything on the controls or ownership side you want me to clear up?`,
    subject:`🔑 [Name], First-Day Check on Your [vehicle]`,
    email:`Hi [Name],\n\nFirst-day check on your [vehicle]: what is working great, and is there anything on the controls or ownership side you want me to clear up?\n\nIf something needs attention, tell me while it is fresh and I will point it to the right place.\n\n[agent]`
  });

  patch('post-sale-problem',{
    goal:'Own the communication, define the problem precisely and route it without making promises.',
    next:'Get the exact facts and timing, then involve the correct department or manager.',
    call:`Thank you for telling me. Give me the exact issue and when you first noticed it. I will get the right person involved instead of guessing at the fix.`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. I got your message about the [vehicle]. I want the exact facts so I can get the right person involved. Call or text me at [number].`,
    sms:`Tell me exactly what happened with the [vehicle] and when you first noticed it. I will get the right person involved.`,
    subject:`🛠️ [Name], Let’s Get the [vehicle] Issue to the Right Person`,
    email:`Hi [Name],\n\nThank you for telling me. Give me the exact issue and when you first noticed it.\n\nI will get the right person involved instead of guessing at the fix.\n\n[agent]`
  });

  patch('bought-elsewhere',{
    call:`Got it. Congratulations on the new vehicle and thanks for closing the loop with me. I appreciate the shot. Keep my number. If you need anything automotive later, call me.`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. I got the update that you purchased. Congratulations and thanks for closing the loop with me. I appreciate the opportunity.`,
    sms:`Congratulations on the new vehicle, [Name]. Thanks for closing the loop with me. I appreciate the shot. Keep my number for anything automotive down the road.`,
    subject:`🔑 Congratulations, [Name]`,
    email:`Hi [Name],\n\nCongratulations on the new vehicle and thanks for closing the loop with me. I appreciate the opportunity.\n\nKeep my contact information. If you need anything automotive down the road, call me.\n\n[agent]`
  });

  patch('months-away',{
    goal:'Get a real re-entry date and stop meaningless follow-up.',
    next:'Ask for the month, record it and leave them alone until then unless something directly relevant changes.',
    call:`Perfect. What month should I put you back on my radar? I will leave you alone until then unless something directly relevant to the [vehicle] changes.`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. Thanks for giving me the real timing. I will reconnect closer to that window instead of filling your phone. You have my number if anything changes sooner.`,
    sms:`What month should I put you back on my radar? I will leave you alone until then unless something directly relevant changes.`,
    subject:`🗓️ [Name], What Month Should I Put You Back on My Radar?`,
    email:`Hi [Name],\n\nThanks for giving me the real timing. What month should I put you back on my radar?\n\nI will leave you alone until then unless something directly relevant to the [vehicle] changes.\n\n[agent]`
  });

  patch('fallback',{
    goal:'Get to the real issue fast and establish the condition for the next step.',
    next:'Clarify the issue, isolate it and ask what happens if it is solved.',
    call:`Say that one more time for me in the simplest version. What specifically is the issue? And if we solve that piece, are you ready for the next step?`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. I want to make sure I am solving the actual issue, not the one I guessed. Call or text me at [number] and give me the short version.`,
    sms:`What specifically is the issue? If we solve that piece, are you ready for the next step?`,
    subject:`💬 [Name], Let’s Isolate the One Issue`,
    email:`Hi [Name],\n\nGive me the simplest version of the issue so I solve the right problem.\n\nWhat specifically is holding up the next step? If we solve that piece, are you ready to move forward?\n\n[agent]`,
    video:`Hi [Name], [agent] here. I do not want to guess at your concern. Give me the one issue that matters. If we solve that piece, tell me what you want the next step to be.`
  });

  patch('owner-first-contact',{
    goal:'Earn a real owner conversation in under 30 seconds and find out whether there is any replacement intent.',
    next:'Ask a clean keep-or-explore question and follow the answer.',
    call:`Hi [Name], [agent] at Sheehy Nissan of Manassas. Quick reason for the call: I have you associated with a [current]. Are you keeping it another year or are you open to seeing what replacing it looks like right now?`,
    vm:`Hi [Name], [agent] at Sheehy Nissan of Manassas. I have one quick question on your [current]. Are you keeping it another year or open to looking at replacement options? Call or text me at [number].`,
    sms:`Quick question on your [current]: keeping it another year or open to looking at replacement options?`,
    subject:`🚙 [Name], Keeping the [current] or Exploring Options?`,
    email:`Hi [Name],\n\nQuick question on your [current]: are you keeping it another year or are you open to looking at replacement options?\n\nOne answer is enough. I will follow your direction from there.\n\n[agent]`,
    video:`Hi [Name], [agent] at Sheehy Nissan. I am reaching out about your [current]. One question: keeping it another year or open to looking at what a replacement would look like?`
  });

  patch('owner-no-answer',{
    call:`Hi [Name], [agent] at Sheehy Nissan. I tried you on the [current]. I only need one answer: keeping it another year or open to exploring options?`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. One quick question on your [current]: keeping it another year or open to exploring replacement options? Call or text me at [number].`,
    sms:`I tried you on the [current]. One question: keeping it another year or open to exploring options?`,
    subject:`👋 [Name], One Question on Your [current]`,
    email:`Hi [Name],\n\nI tried you by phone about the [current]. I only need one answer: keeping it another year or open to exploring replacement options?\n\n[agent]`
  });

  patch('owner-wants-value',{
    call:`I can get you a real number on the [current], not an internet guess. Mileage and condition matter. Bring it [day/time] or [alt time]. Which works?`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. I can get you a real appraisal on the [current]. Bring the actual vehicle and we will put it in front of the right manager. Call or text me at [number].`,
    sms:`I can get you a real appraisal on the [current]. Bring it [day/time] or [alt time]. Which works?`,
    subject:`🚗 [Name], Let’s Put a Real Number on the [current]`,
    email:`Hi [Name],\n\nI can get you a real number on the [current], not an internet guess. Mileage and condition matter.\n\nBring it [day/time] or [alt time]. Which works better?\n\n[agent]`
  });

  patch('owner-callback',{
    call:`Done. Let us put a real time on it: [day/time] or [alt time]. Which one?`,
    vm:`Hi [Name], [agent] at Sheehy Nissan. I am following the callback timing we set on the [current]. Call or text me at [number] if the window changed.`,
    sms:`Let us put a real callback time on it: [day/time] or [alt time]. Which one?`,
    subject:`📅 [Name], Let’s Lock the Callback Time`,
    email:`Hi [Name],\n\nLet us put a real callback time on it so I am not catching you at the wrong moment.\n\n[day/time] or [alt time]. Which works?\n\n[agent]`
  });

  patch('first-voicemail',{
    call:`When they call back: Hi [Name], glad we connected. You reached out on the [vehicle]. What matters first: status, numbers or fit?`,
    vm:`Hi [Name], [agent] at Sheehy Nissan of Manassas. You reached out on the [vehicle]. I have one quick question before I work the wrong thing for you. Call or text me at [number]. Again, [agent] at [number].`,
    sms:`Hi [Name], [agent] at Sheehy Nissan. I just left you a voicemail on the [vehicle]. What matters first: status, numbers or fit?`,
    subject:`👋 [Name], I Just Tried You on the [vehicle]`,
    email:`Hi [Name],\n\nI just tried you by phone on the [vehicle]. I am not going to stack messages. One question: what matters first, status, numbers or fit?\n\nReply with one and I will work that.\n\n[agent]`
  });

  patch('first-no-voicemail',{
    call:`When you connect: Hi [Name], [agent] at Sheehy Nissan. We missed each other on the [vehicle]. Give me 30 seconds: what matters first, status, numbers or fit?`,
    sms:`Hi [Name], [agent] at Sheehy Nissan. I tried you on the [vehicle] and could not leave a message. What is easiest from here: text, email or a quick call?`,
    subject:`👋 [Name], Best Way to Handle the [vehicle]?`,
    email:`Hi [Name],\n\nI tried you on the [vehicle] and could not leave a message. I am not going to keep dialing blindly.\n\nWhat is easiest from here: phone, text or email?\n\n[agent]`
  });

  patch('bad-contact',{
    email:`Hi [Name],\n\nThe phone number attached to your [vehicle] request does not appear to reach you.\n\nIf you still want help, reply with the best number and a good time or keep the conversation right here by email.\n\n[agent]`
  });

  /* Email-only variants. Behavior stays primary. The call is offered only
     when it makes the customer's specific task faster or cleaner. */
  var E=F.channelVariants&&F.channelVariants.emailOnly;
  if(E){
    function ep(id,data){if(!E[id])return;Object.keys(data).forEach(function(k){E[id][k]=data[k];});}
    ep('fresh-standard',{
      channelStrategy:'Email only: make the reply easy, then make one short call the fastest path rather than a condition of service.',
      subject:`👋 [Name], Pick the First Thing You Need on the [vehicle]`,
      email:`Hi [Name],\n\nYou reached out on the [vehicle]. I only received your email, so I will keep this efficient.\n\nWhich one do you need first: vehicle status, numbers or fit? Reply with one.\n\nIf one short call is faster than an email chain, send me the best number and a 5-minute window. I will call once with the answer in front of me.\n\n[agent]`,
      video:`Hi [Name], [agent] at Sheehy Nissan. I made this specifically for your [vehicle] request. Tell me what you need first: status, numbers or fit. If a short call saves us the email back-and-forth, send me the best number and a 5-minute window.`,
      videoNoticeSubject:`🎥 [Name], Your [vehicle] Video Is on the Way`,
      videoNoticeEmail:`Hi [Name],\n\nI sent a short video on the [vehicle] in a separate email. If it is not in the main inbox, check spam, junk or Promotions.\n\nAfter you watch it, tell me what you want me to work next. If a 5-minute call is faster, send the best number and time.\n\n[agent]`
    });
    ep('availability-first',{
      channelStrategy:'Email only: verify first. A phone number is useful because the customer can get the status the moment it is confirmed.',
      subject:`🚙 [Name], I’m Checking the Exact [vehicle]`,
      email:`Hi [Name],\n\nI am checking the exact [vehicle] before I give you a status. I would rather be right than fast and wrong.\n\nOnce I verify it, I can line up [day/time] or [alt time].\n\nIf you want the update the second I have it, send me the best number and a 5-minute window. Otherwise I will keep it right here by email.\n\n[agent]`
    });
    ep('price-first',{
      channelStrategy:'Email only: clarify the comparison first. A short call is useful for an apples-to-apples quote comparison, not as a gate to pricing help.',
      subject:`💬 [Name], Are We Comparing a Quote or Setting the Budget?`,
      email:`Hi [Name],\n\nI can work the number on the [vehicle]. First I need to know what we are solving.\n\nAre you comparing a written quote on the exact vehicle or setting your budget? If you have a quote, send it here.\n\nIf you want me to break the comparison down in one shot, send the best number and a 5-minute window and I will call once I have it in front of me.\n\n[agent]`
    });
    ep('test-drive-request',{
      channelStrategy:'Email only: lock the visit first. The phone number becomes useful for protecting the appointment if vehicle status or arrival changes.',
      subject:`📅 [Name], Pick Your [vehicle] Drive Time`,
      email:`Hi [Name],\n\nI saw your request to drive the [vehicle]. I am verifying the exact vehicle now.\n\nI have [day/time] or [alt time]. Which works?\n\nOnce we lock the time, send the best number if you want me to reach you quickly if anything changes with the vehicle or your arrival.\n\n[agent]`
    });
    ep('wants-details',{
      channelStrategy:'Email only: answer the exact feature question. A phone number is useful only if a live walkaround from the vehicle is faster than typing.',
      subject:`🔎 [Name], I Checked the [vehicle] Detail`,
      email:`Hi [Name],\n\nI checked the exact detail you asked about on the [vehicle]. I will keep this focused instead of sending a brochure.\n\nIf there is another specific item you want checked, send it here. If it is easier for me to stand at the vehicle and talk you through it live, send the best number and a 5-minute window.\n\n[agent]`
    });
    ep('payment-apr',{
      channelStrategy:'Email only: do not invent finance numbers. Make a short call the clean way to gather context without a long email chain.',
      subject:`💬 [Name], Let’s Get the Finance Question to a Real Answer`,
      email:`Hi [Name],\n\nI understand why you want the finance answer first. I will not guess at payment, APR or approval because the real structure and finance review matter.\n\nI can keep the process moving by email. If you want to handle the context in one short conversation, send the best number and a 5-minute window and I will call you once.\n\n[agent]`
    });
    ep('trade-value',{
      channelStrategy:'Email only: give the customer two efficient paths, send miles/condition or handle it in a 60-second call.',
      subject:`🚗 [Name], Let’s Get the [current] Appraisal Started`,
      email:`Hi [Name],\n\nI can get the [current] appraisal moving. Send the approximate miles and anything important about condition.\n\nIf that is easier to cover in 60 seconds, send the best number and a 5-minute window. Either way, I will work from the actual details instead of guessing.\n\n[agent]`
    });
    ep('credit-concern',{
      channelStrategy:'Email only: do not ask for sensitive details by email. A private call is the natural next step.',
      subject:`🔒 [Name], Let’s Handle the Next Step Privately`,
      email:`Hi [Name],\n\nI received your note. There is no need to send sensitive details by email, and I will not promise an approval I do not control.\n\nSend the best number and a 5-minute window if you want to explain the situation privately. I will use that conversation to coordinate the correct next step with finance.\n\n[agent]`
    });
    ep('unit-gone',{
      channelStrategy:'Email only: tell the truth first. A phone number becomes useful only if the customer wants the fastest shortlist of verified alternatives.',
      subject:`🚙 [Name], Straight Update on the [vehicle]`,
      email:`Hi [Name],\n\nStraight update: the exact [vehicle] is no longer available.\n\nTell me what made that one the one: price, equipment, color, miles or something else. I will work from that.\n\nIf you want me to narrow the closest verified options with you in one quick conversation, send the best number and a 5-minute window.\n\n[agent]`
    });
    ep('competitor-shop',{
      channelStrategy:'Email only: ask for the competing vehicle or quote. A short call is useful for a clean apples-to-apples comparison.',
      subject:`⚖️ [Name], What Is the [vehicle] Up Against?`,
      email:`Hi [Name],\n\nYou should compare. What is the [vehicle] up against, and what is going to decide it: price, equipment, drive or ownership cost?\n\nSend the other vehicle or quote here. If you want a clean apples-to-apples breakdown in one shot, send the best number and a 5-minute window.\n\n[agent]`
    });
    ep('decision-maker',{
      channelStrategy:'Email only: do not make the first customer relay the sale. A short call becomes useful when both decision makers can join at once.',
      subject:`👥 [Name], Let’s Get Everyone the Same Information Once`,
      email:`Hi [Name],\n\nSince this is a shared decision, let us not make you relay everything secondhand.\n\nWhat are the one or two things the other decision maker will care about most?\n\nIf both of you can join one short call, send the best number and a 5-minute window and I will cover those pieces once.\n\n[agent]`
    });
    ep('no-response-day1',{
      channelStrategy:'Email only: force a low-effort choice instead of repeating the first email. Offer a call only as the faster route.',
      subject:`[Name], Pick One on the [vehicle]`,
      email:`Hi [Name],\n\nI am not sending another “just checking in” email. Pick what you still need:\n\n1. Vehicle status\n2. Numbers / comparison\n3. A time to see it\n\nReply 1, 2 or 3 and I will work that next. If a short call is faster, send the best number and a 5-minute window.\n\n[agent]`
    });
  }
})(window);
