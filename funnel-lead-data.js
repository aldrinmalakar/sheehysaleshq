/* ============================================================
   SHEEHY SALES HQ - Funnel lead/outbound scenarios

   Extends the canonical SHQFunnel model with exact lead-contact
   outcomes and Always On Owner / outbound behaviors. Keep customer
   wordtracks here, not in the execution UI.
============================================================ */
(function(g){
  'use strict';
  var F=g.SHQFunnel;
  if(!F || !Array.isArray(F.stages) || !Array.isArray(F.scenarios)) return;

  function hasStage(id){ return F.stages.some(function(x){return x.id===id;}); }
  function hasScenario(id){ return F.scenarios.some(function(x){return x.id===id;}); }
  function add(stage,id,label,when,goal,next,call,vm,sms,subject,email,video){
    if(hasScenario(id)) return;
    F.scenarios.push({stage:stage,id:id,label:label,when:when,goal:goal,next:next,call:call,vm:vm,sms:sms,subject:subject,email:email,video:video});
  }

  if(!hasStage('outbound')){
    F.stages.unshift({id:'outbound',label:'0. Owner / Outbound',hint:'You are initiating contact from an approved owner or prospecting list. Earn the conversation first.'});
  }

  /* ==================== OWNER / OUTBOUND ==================== */
  add('outbound','owner-first-contact','Owner List, First Contact','You are calling a customer from an approved owner/outbound list and have not spoken yet.','Earn a short conversation and find out whether there is any reason to discuss their current vehicle.','Identify yourself, reference the vehicle only if the manifest supports it, ask one simple keep-or-explore question and follow their answer.',
`Hi [Name], this is [agent] with Sheehy Nissan of Manassas. I am reaching out because we have you associated with a [current]. Quick question, are you planning to keep it for a while, or would you be open to seeing what your options look like today?`,
`Hi [Name], this is [agent] with Sheehy Nissan of Manassas. I have a quick question about your [current]. Nothing urgent, I just want to see whether keeping it or looking at options makes more sense for you right now. Call or text me at [number]. Again, this is [agent] at [number].`,
`Hi [Name], this is [agent] at Sheehy Nissan of Manassas. Quick question about your [current]. Are you planning to keep it for a while, or would you be open to seeing what your options look like?`,
`🚙 [Name], Quick Question About Your [current]`,
`Hi [Name], I am [agent] with Sheehy Nissan of Manassas. I am reaching out because we have you associated with a [current].\n\nQuick question: are you planning to keep it for a while, or would you be open to seeing what your options look like today?\n\nEither answer is fine. I just want to point you in the right direction.\n\n[agent]`,
`Hi [Name], [agent] here at Sheehy Nissan. I wanted to put a face to the name. I am reaching out about your [current], and my first question is simple: are you keeping it, or are you open to looking at options?`);

  add('outbound','owner-no-answer','Owner Call, No Answer','You made the first owner/outbound call and did not connect.','Create one recognizable follow-up without turning the outbound call into a chase.','Leave one concise voicemail when available, use another permitted channel and ask the same simple keep-or-explore question.',
`Hi [Name], [agent] at Sheehy Nissan. I tried you earlier about your [current]. I only need thirty seconds. Are you planning to keep it for a while, or are you open to looking at options?`,
`Hi [Name], this is [agent] at Sheehy Nissan of Manassas. I am calling with one quick question about your [current]. Call or text me at [number]. Again, [agent] at [number].`,
`Hi [Name], [agent] at Sheehy Nissan. I just tried you about your [current]. Quick question, are you planning to keep it or are you open to looking at options?`,
`👋 [Name], I Tried You About Your [current]`,
`Hi [Name], I tried you by phone about your [current].\n\nI only have one quick question: are you planning to keep it for a while, or would you be open to seeing what your options look like?\n\nOne line back is enough.\n\n[agent]`,
`A second video is usually unnecessary here. If you use video, keep it to a brief face-to-name introduction and one question.`);

  add('outbound','owner-wants-value','Owner Asks, “What Is Mine Worth?”','The owner is willing to discuss the current vehicle and asks for a value.','Move from curiosity to a real appraisal without inventing a trade figure.','Explain that condition and miles matter, then offer two times for a quick physical appraisal.',
`Absolutely, I can help you get a real number. I do not want to guess at your [current] from my desk because miles and condition matter. Can you bring it by [day/time], or is [alt time] easier?`,
`Hi [Name], [agent] at Sheehy Nissan. I am following up on the value question for your [current]. I would rather get you a real appraisal than guess over the phone. Call or text me at [number] and I will make it easy.`,
`I can help you get a real number on the [current]. I do not want to guess without seeing it. Can you bring it by [day/time], or is [alt time] easier?`,
`🚗 [Name], Let’s Get a Real Look at Your [current]`,
`Hi [Name], I can help you get a real number on your [current].\n\nMiles, condition and current demand all matter, so I do not want to give you a fake-precise figure from my desk. A quick physical appraisal gives us something real to work with.\n\nCan you bring it [day/time], or is [alt time] easier?\n\n[agent]`,
`Hi [Name], [agent] at Sheehy Nissan. On your [current], I would rather be accurate than guess. A quick look gives us something real to work with. If you bring it [day/time], I can make that easy.`);

  add('outbound','owner-callback','Owner Says, “Call Me Later”','The owner is not rejecting the conversation but the timing is bad.','Get a specific callback instead of leaving “later” undefined.','Offer two concrete callback windows, confirm one and end the call.',
`Absolutely. I will get out of your way. What is better for a two-minute call, [day/time] or [alt time]?`,
`Hi [Name], [agent] at Sheehy Nissan. I am following the callback timing you gave me on the [current]. Call or text me at [number] if another time is easier.`,
`No problem. What is better for a quick callback, [day/time] or [alt time]? I will follow your timing.`,
`📅 [Name], I’ll Follow Your Timing`,
`Hi [Name], no problem on the timing.\n\nI will keep this short and follow your schedule. Is [day/time] or [alt time] better for a quick callback?\n\n[agent]`,
`No video needed. Respect the callback time and make the next touch when promised.`);

  add('outbound','owner-not-interested','Owner Is Not Interested','The owner clearly says they are not interested in discussing a vehicle change.','Exit cleanly and preserve the relationship.','Acknowledge the answer, stop selling and follow the store’s outbound/DNC process if they ask not to be contacted.',
`Understood. Thanks for giving me a straight answer. I will get out of your way. If anything changes with the [current] down the road, you have my contact information.`,
`Not a voicemail scenario.`,
`Understood. Thanks for letting me know, [Name]. I will get out of your way. If anything changes with the [current] down the road, you have my number.`,
`Thanks for the Straight Answer, [Name]`,
`Hi [Name], thanks for giving me a straight answer.\n\nI will get out of your way. If anything changes with the [current] down the road, you have my contact information.\n\n[agent]`,
`No video needed. End the outreach cleanly.`);

  /* ==================== EXACT FRESH-LEAD CONTACT OUTCOMES ==================== */
  add('new','fresh-text-only','Text Only, No Other Channel','The lead can only be reached by text.','Earn a reply with one short question and move toward an appointment.','Send one human text, wait for the reply and do not stack messages.',
`No live-call path on this lead. Use the permitted text channel.`,
`No voicemail path on this lead.`,
`Hi [Name], this is [agent] at Sheehy Nissan of Manassas. I saw your request on the [vehicle]. Are you mainly checking availability, price or the right setup?`,
`No Email Channel`,
`No email path on this lead.`,
`Hi [Name], [agent] at Sheehy Nissan. I wanted to put a face to the name on your [vehicle] request. Reply here with what matters most and I will keep it simple.`);

  add('attempting','first-voicemail','First Call Went to Voicemail','The fresh lead did not answer and you can leave a voicemail.','Make the next text/email recognizable and earn a callback or reply.','Leave a short voicemail, then switch to another available channel instead of redialing immediately.',
`When they call back: Hi [Name], glad I caught you. You asked about the [vehicle]. Are you mainly checking availability, price or the right setup?`,
`Hi [Name], this is [agent] at Sheehy Nissan of Manassas. I am calling about the [vehicle] you asked about. I have one quick question so I point you in the right direction. Call or text me at [number]. Again, [agent] at [number].`,
`Hi [Name], [agent] at Sheehy Nissan. I just left you a voicemail about the [vehicle]. Are you trying to handle this this week, or is it more of a later plan?`,
`👋 [Name], I Just Tried You About the [vehicle]`,
`Hi [Name], I just tried you by phone about the [vehicle] and left a quick voicemail.\n\nRather than fill your inbox, one question: are you trying to handle this this week, or is it more of a later plan?\n\nOne line back is enough.\n\n[agent]`,
`Hi [Name], [agent] at Sheehy Nissan. I just tried you by phone about the [vehicle]. I wanted to put a face to the name and show you I am actually here working the request. Reply when you get a second and I will keep it simple.`);

  add('attempting','first-no-voicemail','First Call, No Voicemail Available','The fresh lead did not answer and you could not leave a voicemail.','Switch channels fast and find the customer’s preferred way to communicate.','Do not keep redialing. Text or email once and ask which channel is easiest.',
`When you connect: Hi [Name], [agent] at Sheehy Nissan. We kept missing each other on the [vehicle]. Do you have thirty seconds?`,
`No voicemail was available. Do not keep calling just to create attempts.`,
`Hi [Name], [agent] at Sheehy Nissan. I just tried you about the [vehicle] but could not leave a message. Is text good for you, or is email easier?`,
`👋 [Name], I Tried to Reach You About the [vehicle]`,
`Hi [Name], I tried calling about the [vehicle] but could not get through or leave a message, so I did not want to keep dialing you.\n\nWhat is easiest for you: phone, text or email?\n\n[agent]`,
`Hi [Name], [agent] at Sheehy Nissan. We missed each other by phone, so I wanted to put a face to the name. Tell me the easiest way to reach you and I will follow your preference.`);

  add('attempting','bad-contact','Bad Number or Wrong Person','The phone number reaches the wrong person or is confirmed bad.','Stop using the bad number and move only to a valid channel.','Mark the number bad in DriveCentric, do not redial it and use email if available.',
`If a wrong person answers: I am sorry to bother you. I was trying to reach [Name] and I have the wrong number. I will take this off my list. Have a good one.`,
`Do not leave another voicemail on a number confirmed to be wrong.`,
`Do not text a number that a person told you is wrong.`,
`[Name], I May Have the Wrong Number`,
`Hi [Name], I tried the phone number that came through with your request on the [vehicle] and it does not seem to reach you.\n\nIf you would still like help, reply with the best number and a good time, or we can keep everything right here in email.\n\n[agent]`,
`No video by text to a bad number. If email is valid, a brief video by email is fine.`);
})(window);
