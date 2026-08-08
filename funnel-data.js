/* ============================================================
   SHEEHY SALES HQ - behavior-driven funnel data
   Scripts are organized by what the customer is doing right now,
   not by CRM status. The goal is fast next-step control.

   Customer-facing rules:
   - Short and human
   - One clear question or next step
   - No invented price, payment, APR, approval or incentive
   - No fake urgency or unsupported availability claims
============================================================ */
(function(g){
  var STAGES = [
    {id:'new', label:'1. New Lead', hint:'Lead just arrived. Sell the conversation or appointment.'},
    {id:'attempting', label:'2. Trying to Reach', hint:'You have reached out but do not have a real conversation yet.'},
    {id:'engaged', label:'3. Engaged Remote', hint:'They are replying or talking, but have not committed to a visit.'},
    {id:'appointment', label:'4. Appointment', hint:'Protect the appointment and recover schedule changes.'},
    {id:'showroom', label:'5. Showroom / Discovery', hint:'Control the process without becoming an information desk.'},
    {id:'drive', label:'6. Demo / Test Drive', hint:'Confirm fit, isolate concerns and move to real numbers.'},
    {id:'proposal', label:'7. Proposal / Close', hint:'Clarify the real objection, isolate it and ask for commitment.'},
    {id:'after', label:'8. After Visit / Ownership', hint:'Recover unsold traffic or protect the relationship after delivery.'},
    {id:'longterm', label:'9. Lost / Long-Term', hint:'Close the loop cleanly or create a future reason to reconnect.'}
  ];

  var S = [];
  function add(stage,id,label,when,goal,next,call,vm,sms,subject,email,video){
    S.push({stage:stage,id:id,label:label,when:when,goal:goal,next:next,call:call,vm:vm,sms:sms,subject:subject,email:email,video:video});
  }

  /* ==================== 1. NEW LEAD ==================== */
  add('new','fresh-standard','Fresh Lead, Normal Request','Brand-new internet lead with usable contact information.','Create a response and ask for the visit.','Call first when possible, then text/email, then a short video.',
`Hi [Name], this is [agent] at Sheehy Nissan of Manassas. I saw your request on the [vehicle]. Before I send you a pile of information, are you mainly checking availability, price or the right setup?`,
`Hi [Name], this is [agent] at Sheehy Nissan of Manassas. I am calling about the [vehicle] you asked about. I have one quick question so I point you in the right direction. Call or text me back at [number].`,
`Hi [Name], this is [agent] at Sheehy Nissan. I saw your request on the [vehicle]. Are you mainly checking availability, price or the right setup?`,
`👋 [Name], About the [vehicle] You Asked About`,
`Hi [Name], I saw your request on the [vehicle] and wanted to reach out directly.\n\nBefore I send information you may not need, are you mainly checking availability, price or the right setup?\n\nReply with one and I will keep it simple. If you are ready to see it, is [day/time] or [alt time] easier?\n\n[agent]`,
`Hi [Name], [agent] here at Sheehy Nissan. I saw your request on the [vehicle] and wanted to put a face to the name. I will keep this simple. If you want to see it in person, is [day/time] or [alt time] better?`);

  add('new','fresh-email-only','Email Only, No Phone','The lead did not provide a usable phone number.','Earn a reply and give them a simple appointment choice.','Send a concise email, then a DriveCentric video by email if available.',
`No phone number on this lead. Use email and video. Do not waste time hunting for a number you were not given.`,
`No voicemail path on this lead.`,
`No SMS path on this lead.`,
`👋 [Name], Quick Question About the [vehicle]`,
`Hi [Name], I am [agent] at Sheehy Nissan of Manassas. I saw your request on the [vehicle].\n\nI only received your email, so I wanted to make this easy. Are you mainly trying to confirm the vehicle, compare numbers or decide whether it is worth a visit?\n\nReply with whichever one it is. If you are ready to see it, I can work around [day/time] or [alt time].\n\n[agent]`,
`Hi [Name], [agent] at Sheehy Nissan. I only received your email, so I wanted to send a quick face-to-name video instead of another generic message. I am here to help with the [vehicle]. Reply to my email and tell me what matters most, or let me know if [day/time] works to see it.`);

  add('new','availability-first','They Ask, “Is It Available?”','Customer leads with availability.','Answer only after verification, then immediately move to timing.','Verify the exact stock first. If available, give two visit choices. If not, use Sold / Unavailable.',
`Yes, I verified the [vehicle] for you. The bigger question is timing. Do you want to see it [day/time] or would [alt time] be easier?`,
`Hi [Name], this is [agent] at Sheehy Nissan. I was calling back about the [vehicle] and its status. Call or text me at [number] and I will give you the clean answer and next step.`,
`Hi [Name], I verified the [vehicle] for you. Want to see it [day/time] or is [alt time] better?`,
`🚙 [Name], Update on the [vehicle]`,
`Hi [Name], I verified the [vehicle] for you.\n\nIf you want to put eyes on it before making any decisions, I can make this easy. Is [day/time] or [alt time] better for you?\n\n[agent]`,
`Hi [Name], quick update from [agent] at Sheehy Nissan. I verified the [vehicle] for you. Rather than send a long description, I wanted you to see I am actually here working the request. Is [day/time] or [alt time] better to take a look?`);

  add('new','price-first','They Lead With “Best Price?”','Fresh lead asks for price or best price immediately.','Keep the price discussion accurate and turn it into a real conversation.','Verify advertised/current pricing with the desk or approved source, answer briefly, then regain control.',
`I can help with the number. I just do not want to give you a figure that is missing context. Are you comparing the exact [vehicle] to another quote, or are you trying to see where it lands before you come in?`,
`Hi [Name], [agent] at Sheehy Nissan. I am calling about your price question on the [vehicle]. I want to make sure I give you the right comparison, not a number with missing pieces. Call or text me at [number].`,
`Hi [Name], I can help with the number on the [vehicle]. Are you comparing an exact quote or just trying to see where it lands before you visit?`,
`💬 [Name], Getting You the Right Number on the [vehicle]`,
`Hi [Name], I can help with the number on the [vehicle].\n\nI want to make sure you are comparing the same vehicle and the same terms rather than sending you something misleading. Are you comparing an exact quote from another store or just trying to see where this one lands?\n\nSend me that one detail and I will point you correctly.\n\n[agent]`,
`Hi [Name], [agent] at Sheehy Nissan. I saw the price question on the [vehicle]. I am not going to make up a number on video. I want to get you an accurate answer and then make the next step easy. Reply to me and tell me whether you are comparing another quote or just checking the market.`);

  add('new','unit-gone','Exact Vehicle Sold / Unavailable','You have verified the exact unit is no longer available.','Tell the truth immediately, then pivot to the reason they chose it.','Ask what mattered most about that unit and offer the closest verified alternative.',
`[Name], I want to be straight with you. The exact [vehicle] you asked about is no longer available. Before I throw random alternatives at you, what was the main thing that made you pick that one?`,
`Hi [Name], [agent] at Sheehy Nissan. I have an update on the exact [vehicle] you asked about. I want to give it to you directly and see if one of the closest alternatives makes sense. Call or text me at [number].`,
`Hi [Name], straight update: the exact [vehicle] you asked about is no longer available. What mattered most about that one? I will check the closest real alternatives instead of guessing.`,
`🚙 [Name], Update on the [vehicle]`,
`Hi [Name], I want to give you the straight update. The exact [vehicle] you asked about is no longer available.\n\nRather than send random replacements, tell me what mattered most about that one and I will check the closest real options.\n\n[agent]`,
`Hi [Name], [agent] at Sheehy Nissan. Quick honest update: the exact [vehicle] you asked about is gone. I do not want to bait-and-switch you with something random. Tell me what you liked about that one and I will check the closest real match.`);

  /* ==================== 2. TRYING TO REACH ==================== */
  add('attempting','no-response-day1','No Response After First Touch','You called/texted/emailed and heard nothing.','Create a low-friction reply without sounding needy.','Use a different channel if available and ask one easy choice question.',
`Hi [Name], [agent] at Sheehy Nissan. I wanted to make sure I did not miss you on the [vehicle]. Are you trying to handle this this week or is it more of a later plan?`,
`Hi [Name], [agent] at Sheehy Nissan. I am following up on the [vehicle]. I only need one quick answer so I know whether to keep working it for you. Call or text me at [number].`,
`Hi [Name], quick one on the [vehicle]. Are you trying to handle this this week or is it more of a later plan?`,
`👋 [Name], Quick One on the [vehicle]`,
`Hi [Name], quick follow-up on the [vehicle].\n\nI do not want to fill your inbox if the timing changed. Are you trying to handle this this week or is it more of a later plan?\n\nOne line back is enough.\n\n[agent]`,
`Hi [Name], [agent] here. I wanted to make one quick video instead of piling on more messages. If the [vehicle] is still in play, tell me whether you are looking this week or later and I will follow your timing.`);

  add('attempting','video-email-notice','Video Sent by Email, Need Heads-Up','DriveCentric video went by email and may land in spam or Promotions.','Get the customer to find and watch the video.','Notify by text when possible. If no text, send a short second email with a clear subject.',
`Hi [Name], quick heads-up. I sent you a short video on the [vehicle] so you can see who you are working with. It came by email and may land in spam or Promotions. Did it come through?`,
`Hi [Name], [agent] at Sheehy Nissan. I just sent you a short video on the [vehicle]. It came by email, so check spam or Promotions if you do not see it. Call or text me at [number] if it is missing.`,
`Hi [Name], I just emailed you a short video on the [vehicle]. If you do not see it, check spam, junk or Promotions. Did it come through?`,
`🎥 [Name], I Just Sent You a Short Video`,
`Hi [Name], I just sent you a short video on the [vehicle].\n\nIf it is not in your main inbox, check spam, junk or Promotions. DriveCentric messages can occasionally land there.\n\nDid it come through?\n\n[agent]`,
`Use the original DriveCentric video. No second video needed unless the first one failed.`);

  add('attempting','video-text-notice','Video Sent by Text, Need Heads-Up','DriveCentric video went by text and the customer has not acknowledged it.','Get them to notice the link without sounding repetitive.','Use email as the cross-channel notice when available.',
`Hi [Name], quick heads-up. I sent you a short video on the [vehicle] by text. Did the link come through on your end?`,
`Hi [Name], [agent] at Sheehy Nissan. I sent you a short video on the [vehicle] by text. I just wanted to make sure the link reached you. Call or text me at [number] if it did not.`,
`Hi [Name], I sent you a short video on the [vehicle] a little earlier. Did the link come through?`,
`🎥 [Name], Quick Heads-Up on the Video I Sent`,
`Hi [Name], quick heads-up. I sent you a short video on the [vehicle] by text a little earlier.\n\nI just wanted to make sure the link reached you. Did it come through?\n\n[agent]`,
`Use the original DriveCentric video. No second video needed unless the first one failed.`);

  add('attempting','final-nudge','Several Attempts, Still Silent','Multiple reasonable touches with no response.','Create a clean yes/no exit and stop chasing blindly.','Ask whether they are still looking. If no response, slow the cadence and move to reconnect.',
`Hi [Name], last quick check from me on the [vehicle]. Are you still looking or did you already handle it?`,
`Hi [Name], [agent] at Sheehy Nissan. Last quick check on the [vehicle] so I do not keep chasing you. If you are still looking, call or text me at [number]. If you already handled it, no problem at all.`,
`Hi [Name], last quick check on the [vehicle] so I do not keep chasing you. Still looking or all set?`,
`👋 [Name], Should I Close This Out?`,
`Hi [Name], last quick check on the [vehicle] so I do not keep filling your inbox.\n\nAre you still looking or did you already handle it? Either answer is fine. I just want to follow your lead.\n\n[agent]`,
`Hi [Name], [agent] at Sheehy Nissan. I am making this my last quick video touch for now. If you are still shopping the [vehicle], reply and I will keep helping. If you are all set, I will get out of your way.`);

  /* ==================== 3. ENGAGED REMOTE ==================== */
  add('engaged','wants-details','They Want More Vehicle Details','Customer is asking feature/spec questions remotely.','Answer the question, then move toward seeing/driving the vehicle.','Give only the relevant answer. Do not feature-dump.',
`Yes, I can help with that. Based on what you asked, the bigger question is whether it feels right in person. If I have it ready, is [day/time] or [alt time] better?`,
`Hi [Name], [agent] at Sheehy Nissan. I have the answer to your question on the [vehicle] and one thing I want you to see in person. Call or text me at [number].`,
`I have the answer on the [vehicle]. Rather than send you a feature dump, I can show you the part that matters when you see it. Is [day/time] or [alt time] better?`,
`🔎 [Name], The Detail You Asked About on the [vehicle]`,
`Hi [Name], I have the answer to the question you asked about the [vehicle].\n\nI will keep it focused instead of sending you a brochure. The next useful step is seeing how it works in person. Is [day/time] or [alt time] easier?\n\n[agent]`,
`Hi [Name], [agent] at Sheehy Nissan. I wanted to show you the specific part you asked about on the [vehicle] instead of reading a spec sheet to you. If this looks right, is [day/time] or [alt time] better to see the whole vehicle?`);

  add('engaged','payment-apr','They Ask Payment, APR or Approval','Customer wants finance-specific numbers or approval expectations.','Do not guess. Keep momentum and route the finance question correctly.','Answer the process question, then ask for the information/visit needed for finance to give a real answer.',
`I understand why you want that number first. I do not want to guess on payment, APR or approval. Those depend on the actual structure and finance review. If we get the vehicle fit right, are you open to coming in [day/time] or [alt time] so we can get you real options?`,
`Hi [Name], [agent] at Sheehy Nissan. I am calling back on your payment or financing question. I do not want to guess and give you bad information. Call or text me at [number] and I will get you to the right next step.`,
`I understand wanting the payment or APR first. I do not guess on those, but I can get you in front of finance for real options. Is [day/time] or [alt time] better?`,
`💳 [Name], Getting You a Real Answer on the [vehicle]`,
`Hi [Name], I understand wanting the payment, APR or approval picture before you spend time on this.\n\nI do not guess on finance numbers because the real answer depends on the actual structure and finance review. If the [vehicle] is the right fit, I can get you to the right people for real options.\n\nIs [day/time] or [alt time] easier?\n\n[agent]`,
`Hi [Name], [agent] at Sheehy Nissan. I saw your finance question. I am not going to throw a made-up payment or rate at you on video. If the [vehicle] fits what you need, I can help get the real structure in front of you. Is [day/time] or [alt time] better?`);

  add('engaged','trade-value','They Want Trade Value Before Visiting','Customer wants a trade estimate remotely.','Avoid fake precision and get the trade physically appraised.','Explain why condition matters, then set a quick appraisal appointment.',
`I can help with the trade, but I do not want to pretend I can see condition from my desk. The clean number comes from putting eyes on your [current]. Can you bring it [day/time] or is [alt time] easier?`,
`Hi [Name], [agent] at Sheehy Nissan. I am calling about your [current] trade question. The only number I can stand behind comes from a quick look at the vehicle. Call or text me at [number] and I will make the appraisal easy.`,
`I can help with your [current], but I do not want to guess at the value without seeing it. Can you bring it [day/time] or is [alt time] easier?`,
`🚗 [Name], Let’s Get a Real Look at Your [current]`,
`Hi [Name], I can help with the trade value on your [current].\n\nMiles, condition and current demand all matter, so I do not want to give you a fake-precise number from my desk. A quick physical appraisal gets us a figure we can actually work with.\n\nCan you bring it [day/time] or is [alt time] easier?\n\n[agent]`,
`Hi [Name], [agent] at Sheehy Nissan. On your [current], I would rather be accurate than guess. A quick look at the vehicle gives us something real to work with. If you bring it [day/time], I can make that easy for you.`);

  add('engaged','credit-concern','They Volunteer a Credit Concern','Customer is worried about getting approved or being embarrassed.','Lower anxiety without promising anything and move to finance review.','Do not diagnose or promise. Give a private, realistic next step.',
`I hear you. I am not going to judge it or promise an approval I cannot control. What I can do is keep it private and get you in front of the finance team for a real answer. Is [day/time] or [alt time] better?`,
`Hi [Name], [agent] at Sheehy Nissan. I got your note about the credit concern. No judgment and no guessing from me. I can help you get a real answer privately. Call or text me at [number].`,
`No judgment on the credit concern. I will not promise an approval, but I can get you a real answer privately with finance. Is [day/time] or [alt time] better?`,
`🔒 [Name], A Private Next Step on the [vehicle]`,
`Hi [Name], I understand the concern and I will keep it straightforward.\n\nI am not going to judge your situation or promise an approval I cannot control. What I can do is get you in front of our finance team privately for a real answer.\n\nIs [day/time] or [alt time] easier?\n\n[agent]`,
`Hi [Name], [agent] at Sheehy Nissan. I saw your note about credit. I am not going to make promises on video, but I can make the process private and straightforward. If you want a real answer, is [day/time] or [alt time] better?`);

  add('engaged','competitor-shop','They Are Comparing Dealers or Brands','Customer says they are shopping around.','Make the comparison useful, then earn a visit.','Ask what else they are considering and isolate the deciding factor.',
`That makes sense. What are you comparing the [vehicle] against, and what is going to decide it for you: price, equipment, drive or ownership cost?`,
`Hi [Name], [agent] at Sheehy Nissan. I know you are comparing the [vehicle] with a few options. I have one quick question that will make the comparison cleaner. Call or text me at [number].`,
`Smart to compare. What else is on your list, and what is going to decide it for you: price, equipment, drive or ownership cost?`,
`⚖️ [Name], Let’s Make the [vehicle] Comparison Useful`,
`Hi [Name], smart to compare before you decide.\n\nWhat else is on your list, and what is going to decide it for you: price, equipment, drive or ownership cost?\n\nTell me that and I will give you the straight comparison, including where the other option may be stronger.\n\n[agent]`,
`Hi [Name], [agent] at Sheehy Nissan. If you are cross-shopping the [vehicle], that is completely fair. Tell me the other vehicle and the one thing that matters most. I will show you the real difference instead of giving you a sales pitch.`);

  add('engaged','not-ready','They Say “I’m Not Ready Yet”','Customer likes the idea but timing is later.','Get a real timeline instead of accepting a vague brush-off.','Clarify whether later means days, weeks or months, then set the appropriate next touch.',
`No problem. When you say not ready yet, are we talking later this week, a few weeks or a few months? I just want to follow your timing instead of chasing you.`,
`Hi [Name], [agent] at Sheehy Nissan. I got that the timing is not quite there yet. I only want to clarify whether that means days, weeks or months so I follow up appropriately. Call or text me at [number].`,
`No problem on timing. When you say not ready yet, are we talking later this week, a few weeks or a few months?`,
`🗓️ [Name], I’ll Follow Your Timing on the [vehicle]`,
`Hi [Name], no problem if the timing is not there yet.\n\nWhen you say not ready, are we talking later this week, a few weeks or a few months? I would rather follow your real timeline than keep chasing you.\n\n[agent]`,
`Hi [Name], [agent] here. No pressure if the timing is later. I just want to know whether later means days, weeks or months so I can follow your timing and leave you alone in between.`);

  add('engaged','decision-maker','Spouse / Family Decision Maker Not Involved','Customer says someone else needs to weigh in.','Get the actual decision maker into the next interaction.','Do not make the customer become your messenger. Invite both to the visit or call.',
`That makes sense. Rather than make you relay everything secondhand, let’s get both of you the same information. Is [day/time] or [alt time] better for you both?`,
`Hi [Name], [agent] at Sheehy Nissan. Since this is a shared decision, I would rather make it easy for both of you than have you relay everything. Call or text me at [number] and we will find a time that works.`,
`Makes sense to decide together. Rather than make you relay everything, is [day/time] or [alt time] better for both of you to look at the [vehicle]?`,
`👥 [Name], Let’s Make the [vehicle] Easy for Both of You`,
`Hi [Name], it makes sense to make this decision together.\n\nRather than have you relay every detail secondhand, let’s get both of you the same information and make one clean decision. Is [day/time] or [alt time] better?\n\n[agent]`,
`Hi [Name], [agent] at Sheehy Nissan. Since someone else is helping with the decision, I would rather make this easy on both of you. Bring them with you and I will have the [vehicle] ready. Is [day/time] or [alt time] better?`);

  /* ==================== 4. APPOINTMENT ==================== */
  add('appointment','booked','Appointment Just Booked','Customer agreed to a specific visit.','Reduce friction and strengthen commitment.','Confirm exact time, vehicle and who is coming.',
`Perfect. I have you for [day/time] on the [vehicle]. I will make sure we are ready for you. Will it just be you or is anyone else coming with you?`,
`Hi [Name], [agent] at Sheehy Nissan. You are set for [day/time] on the [vehicle]. If anything changes, call or text me at [number]. Otherwise I will see you then.`,
`[Name], you are set for [day/time] at Sheehy Nissan on the [vehicle]. I will be ready for you. Will it just be you or is anyone else coming?`,
`📅 [Name], You’re Set for [day/time]`,
`Hi [Name], you are confirmed for [day/time] on the [vehicle].\n\nI will be ready for you so we can use your time well. If anything changes, reply here. Otherwise I will see you then.\n\nWill it just be you or is anyone else helping with the decision?\n\n[agent]`,
`Hi [Name], [agent] at Sheehy Nissan. You are set for [day/time] on the [vehicle]. I wanted to send a quick face-to-name video so you know who to ask for when you arrive. I will see you then.`);

  add('appointment','day-of','Day-of Confirmation','Appointment is later today.','Get a clean confirmation without sounding desperate.','Confirm once, then prepare the vehicle and your process.',
`Hi [Name], [agent] at Sheehy Nissan. We are still good for [day/time] on the [vehicle], correct?`,
`Hi [Name], [agent] at Sheehy Nissan. Quick confirmation for [day/time] today on the [vehicle]. Call or text me at [number] if anything changed. Otherwise I will see you then.`,
`Hi [Name], quick confirmation for [day/time] today on the [vehicle]. Still good on your end?`,
`📅 [Name], Still Good for [day/time] Today?`,
`Hi [Name], quick confirmation for [day/time] today on the [vehicle].\n\nIf anything changed, reply and I will adjust. Otherwise I will see you then.\n\n[agent]`,
`Hi [Name], [agent] at Sheehy Nissan. Quick confirmation that we are still on for [day/time] today. I will be ready for you when you arrive.`);

  add('appointment','reschedule','They Need to Reschedule','Customer says the original appointment no longer works.','Protect the appointment instead of letting it dissolve.','Immediately offer two replacement choices.',
`No problem. I can move it. Is [day/time] or [alt time] better for you?`,
`Hi [Name], [agent] at Sheehy Nissan. No problem on the schedule change. I can move your [vehicle] visit. Call or text me at [number] and we will lock the better time.`,
`No problem. I can move it. Is [day/time] or [alt time] better for you?`,
`📅 [Name], Let’s Move Your [vehicle] Visit`,
`Hi [Name], no problem on the schedule change.\n\nI can move your [vehicle] visit. Is [day/time] or [alt time] better?\n\n[agent]`,
`Hi [Name], [agent] here. No problem on the schedule change. I can move the [vehicle] visit and keep this easy. Is [day/time] or [alt time] better?`);

  add('appointment','running-late','They Are Running Late','Customer says they are delayed but still coming.','Keep commitment without guilt-tripping them.','Get a realistic ETA and reset expectations.',
`No problem. What is your best ETA now, about 15 minutes or closer to 30? I will plan around you.`,
`Hi [Name], [agent] at Sheehy Nissan. Got your note that you are running late. No problem. Call or text me at [number] with your best ETA and I will plan around you.`,
`No problem. What is your best ETA now, about 15 minutes or closer to 30? I will plan around you.`,
`📅 [Name], I’ll Adjust for Your ETA`,
`Hi [Name], no problem on the delay.\n\nSend me your best ETA and I will adjust so we are ready when you arrive.\n\n[agent]`,
`No video needed. Keep this operational.`);

  add('appointment','no-show','They No-Show','Appointment time passed and the customer did not arrive.','Recover without scolding and find out whether the plan changed.','Ask whether to reset or whether the search changed.',
`Hi [Name], [agent] at Sheehy Nissan. We missed each other on the [vehicle]. Did the schedule get away from you, or did your plan change?`,
`Hi [Name], [agent] at Sheehy Nissan. We missed each other today on the [vehicle]. Things happen. Call or text me at [number] and tell me whether you want to reset it or if your plan changed.`,
`Hi [Name], we missed each other on the [vehicle]. Did the schedule get away from you, or did your plan change?`,
`👋 [Name], We Missed Each Other Today`,
`Hi [Name], we missed each other today on the [vehicle].\n\nThings happen. Did the schedule get away from you, or did your plan change? If you still want to see it, I can reset the time.\n\n[agent]`,
`Hi [Name], [agent] at Sheehy Nissan. We missed each other today. No lecture from me. If the [vehicle] is still in play, tell me and we will reset it. If the plan changed, tell me that too and I will follow your lead.`);

  /* ==================== 5. SHOWROOM ==================== */
  add('showroom','just-looking','They Say “Just Looking”','Customer wants to browse and avoid pressure.','Lower resistance while keeping control of discovery.','Give space, then ask one narrowing question.',
`Absolutely. I will not glue myself to you. Let me ask one thing so I point you to the right row. Are you replacing something, adding a vehicle or just seeing what catches your eye?`,
`Not a voicemail scenario.`,
`If you leave before we connect: Hi [Name], [agent] at Sheehy Nissan. Good meeting you. When you are ready to narrow things down, tell me what caught your eye and I will make the next visit faster.`,
`👋 Good Meeting You Today, [Name]`,
`Hi [Name], good meeting you today.\n\nWhen you are ready to narrow things down, tell me what caught your eye and I will make the next visit faster.\n\n[agent]`,
`Not usually needed while they are physically in store.`);

  add('showroom','price-immediately','They Ask Price Before Discovery','Customer jumps straight to price as soon as they arrive.','Answer what is verified, then regain process control.','Do not dodge. Give the factual answer, then ask what they are comparing it to.',
`I can show you the verified price. Before we decide whether it is a good number for you, what are you comparing it against: another [vehicle], another brand or a budget target?`,
`Not a voicemail scenario.`,
`After they leave: I can help you compare the [vehicle] cleanly. What are you measuring it against: another quote, another vehicle or a budget target?`,
`💬 [Name], Let’s Compare the [vehicle] Cleanly`,
`Hi [Name], I can help you compare the [vehicle] cleanly.\n\nWhat are you measuring it against: another quote, another vehicle or a budget target? That tells me what actually needs to be solved.\n\n[agent]`,
`Not usually needed while they are physically in store.`);

  add('showroom','unsure-vehicle','They Don’t Know What They Want','Customer has broad needs but no specific model.','Narrow to one or two vehicles, not six.','Use current vehicle, use case and must-haves to select.',
`That is fine. Let me narrow it down instead of walking you through the whole lot. What are you driving now, and what do you wish it did better?`,
`Not a voicemail scenario.`,
`After they leave: You gave me enough to narrow this down. I am looking at the two options that fit what you said instead of sending you everything. Want the quick comparison by text or a short call?`,
`🔎 [Name], I Narrowed It Down to the Right Direction`,
`Hi [Name], based on what you told me, I would rather narrow this to the right one or two vehicles than send you a wall of inventory.\n\nI am focusing on the options that solve what your current vehicle is missing. Want the quick comparison by email or a short call?\n\n[agent]`,
`Hi [Name], [agent] at Sheehy Nissan. Based on what you told me, I narrowed the search instead of throwing the whole lot at you. I have one or two directions worth seeing. When can you come back and compare them?`);

  add('showroom','decision-maker-absent','Decision Maker Is Not Present','Customer is gathering information for someone else.','Avoid a full sales cycle with half the decision.','Learn what matters to the absent person and set a return visit with both.',
`I can absolutely help you today. Since someone else is part of the decision, what are the two things they are going to care about most? Then let’s set a time when both of you can see the final choice together.`,
`Not a voicemail scenario.`,
`Hi [Name], good meeting you. Since this is a shared decision, when can both of you come back and look at the [vehicle] together? I can do [day/time] or [alt time].`,
`👥 [Name], Let’s Get Both Decision Makers Together`,
`Hi [Name], good meeting you.\n\nSince this is a shared decision, the cleanest next step is getting both of you the same information at the same time. I can have the [vehicle] ready [day/time] or [alt time]. Which works better?\n\n[agent]`,
`Hi [Name], [agent] here. Since someone else is helping decide, bring them with you for the next look. I will have the [vehicle] ready and keep it focused. Is [day/time] or [alt time] better?`);

  /* ==================== 6. DEMO / TEST DRIVE ==================== */
  add('drive','loves-it','They Clearly Like the Vehicle','Strong positive reactions during or after the drive.','Do not keep selling past the close. Move to numbers.','Trial close, then write it up.',
`Sounds like this checks the boxes. If the numbers make sense, is there anything else stopping you from moving forward on this one?`,
`Not a voicemail scenario.`,
`After they leave unexpectedly: You liked the [vehicle]. The next useful step is real numbers so you can decide cleanly. Want to finish that [day/time] or [alt time]?`,
`✅ [Name], The [vehicle] Checked the Boxes`,
`Hi [Name], the [vehicle] seemed to check the boxes you cared about.\n\nThe next useful step is real numbers so you can decide cleanly. Want to finish that [day/time] or [alt time]?\n\n[agent]`,
`Not needed if they are still in store. If they left: Hi [Name], quick recap from [agent]. The [vehicle] looked like a strong fit. The next step is simply putting real numbers next to it. When can we finish that?`);

  add('drive','unsure-after-drive','They Say “I’m Not Sure” After Driving','Customer is not rejecting it but does not sound sold.','Find the missing piece before talking numbers.','Ask what felt off or incomplete.',
`Fair. When you say you are not sure, what is the part that did not fully land: the size, drive, features, price expectation or something else?`,
`Not a voicemail scenario.`,
`When you say you are not sure on the [vehicle], what did not fully land: size, drive, features, price expectation or something else?`,
`🔎 [Name], What Didn’t Fully Land on the [vehicle]?`,
`Hi [Name], I heard the hesitation after the drive and I do not want to guess at it.\n\nWhat did not fully land: the size, drive, features, price expectation or something else? Tell me that and I can either solve it or point you to a better fit.\n\n[agent]`,
`Hi [Name], [agent] here. I could tell the [vehicle] was close but not a clean yes. Tell me what felt off and I will either solve it or stop trying to force the wrong car.`);

  add('drive','wrong-fit','Vehicle Is Clearly the Wrong Fit','Customer dislikes a meaningful part of the vehicle.','Stop defending the wrong car and reselect.','Identify the mismatch and move to the next best vehicle.',
`Good, that tells us something. I do not want to force the wrong car. What is the one thing this [vehicle] missed that the next one has to get right?`,
`Not a voicemail scenario.`,
`The [vehicle] missed the mark, which is useful. What is the one thing the next vehicle has to get right? I will narrow from there.`,
`🔄 [Name], Let’s Fix the One Thing the [vehicle] Missed`,
`Hi [Name], the [vehicle] was not the right fit, and that is useful information.\n\nWhat is the one thing the next vehicle has to get right? Tell me that and I will narrow the search instead of starting over randomly.\n\n[agent]`,
`Hi [Name], [agent] here. I am not going to defend the wrong car. Tell me the one thing the [vehicle] missed and I will use that to find the better fit.`);

  add('drive','leave-before-numbers','They Want to Leave Before Seeing Numbers','Customer liked the vehicle but wants to leave before a proposal.','Prevent them from making a decision based on guesses.','Ask for 10 to 15 minutes to get real figures.',
`Before you go, let me do one useful thing. You already know how the [vehicle] feels. Give me 10 to 15 minutes to put real numbers next to it so you are not deciding off a guess. Fair?`,
`Not a voicemail scenario.`,
`You left before we put real numbers next to the [vehicle]. I do not want you deciding off a guess. Can we finish that [day/time] or [alt time]?`,
`💬 [Name], Don’t Decide on the [vehicle] From a Guess`,
`Hi [Name], you left before we put real numbers next to the [vehicle].\n\nI do not want you comparing or deciding from a guess. Let’s finish the useful part and give you something real to evaluate. Is [day/time] or [alt time] better?\n\n[agent]`,
`Hi [Name], [agent] here. You already drove the [vehicle]. The one thing we did not finish was putting real numbers next to it. I would rather give you something real than have you decide from assumptions.`);

  /* ==================== 7. PROPOSAL / CLOSE ==================== */
  add('proposal','price-high','“The Price Is Too High”','Customer objects to total price or selling price.','Clarify the gap and isolate price from other concerns.','Find out whether price is the only issue, then take a specific ask to the desk.',
`I hear you. When you say too high, are we off by a little or completely outside where you expected? And other than price, does the [vehicle] work for you?`,
`Hi [Name], [agent] at Sheehy Nissan. I was calling back on the price concern. I want to make sure I understand the actual gap before I ask anyone to move numbers around. Call or text me at [number].`,
`On the price, are we off by a little or completely outside where you expected? Other than that, does the [vehicle] work for you?`,
`💬 [Name], Let’s Isolate the Price Gap on the [vehicle]`,
`Hi [Name], I heard you on the price.\n\nBefore I ask the desk to solve the wrong problem, are we off by a little or completely outside where you expected? And other than price, does the [vehicle] work for you?\n\n[agent]`,
`Hi [Name], [agent] here. I heard the price concern. I am not going to negotiate with myself on video. Tell me whether we are a little off or way off, and whether price is the only thing keeping the [vehicle] from being the right deal.`);

  add('proposal','payment-high','“The Payment Is Too High”','Customer objects to monthly payment.','Clarify the target and isolate payment.','Do not guess new payment. Get the actual target and take it to finance/desk.',
`I hear you. When you say the payment is too high, are we a little above where you wanted or nowhere close? Other than payment, are you good with the [vehicle] and the rest of the structure?`,
`Hi [Name], [agent] at Sheehy Nissan. I am following up on the payment concern. I want to understand the actual gap before I take anything back to finance. Call or text me at [number].`,
`On the payment, are we a little above where you wanted or nowhere close? Other than payment, are you good with the [vehicle]?`,
`💳 [Name], Let’s Isolate the Payment Gap`,
`Hi [Name], I heard you on the payment.\n\nBefore I take anything back to finance, are we a little above where you wanted or nowhere close? Other than payment, are you good with the [vehicle] and the rest of the structure?\n\n[agent]`,
`Hi [Name], [agent] here. I heard the payment concern. I am not going to invent a lower payment on video. Tell me whether we are a little off or way off and I will take the real concern to the right people.`);

  add('proposal','trade-low','“Your Trade Number Is Too Low”','Customer is unhappy with the trade appraisal.','Separate emotional attachment from the actual gap and isolate trade.','Ask what they expected and whether the trade is the only blocker.',
`I hear you. What were you expecting for the [current]? And if we can get closer on the trade, is there anything else keeping you from moving forward on the [vehicle]?`,
`Hi [Name], [agent] at Sheehy Nissan. I am following up on the [current] trade concern. I want to understand the actual gap before I take it back to the used-car side. Call or text me at [number].`,
`What were you expecting for the [current]? If we can get closer on the trade, is anything else stopping you on the [vehicle]?`,
`🚗 [Name], Let’s Isolate the Gap on Your [current]`,
`Hi [Name], I heard you on the trade value for the [current].\n\nWhat were you expecting? And if we can get closer on the trade, is there anything else keeping you from moving forward on the [vehicle]?\n\n[agent]`,
`Hi [Name], [agent] here. I heard the trade concern. Tell me the number you expected on the [current] and whether that is the only thing holding up the [vehicle]. Then I can take a clean ask back to the right manager.`);

  add('proposal','fees','They Question Fees or Line Items','Customer challenges a fee or does not understand the worksheet.','Explain verified items plainly without becoming defensive.','Answer exactly what the line is, then ask whether anything else is unclear.',
`Good question. Let me show you exactly what that line is rather than talk around it. Once that is clear, is there anything else on the worksheet you want me to break down?`,
`Hi [Name], [agent] at Sheehy Nissan. I am calling back on the line-item question from the proposal. I want to explain exactly what you were looking at, not give you a vague answer. Call or text me at [number].`,
`Good question on that line item. I want to explain exactly what it is, not talk around it. Is that the only part of the proposal that is unclear?`,
`📄 [Name], Let’s Make the Proposal Clear`,
`Hi [Name], good question on the proposal.\n\nI want to explain exactly what that line item is rather than give you a vague answer. Once that is clear, is there anything else on the worksheet you want broken down?\n\n[agent]`,
`Video is usually not the right channel for specific deal figures. Use a call or in-person review so the exact worksheet can be verified.`);

  add('proposal','think-about-it','“I Need to Think About It”','Customer gives a broad delay objection.','Find the real unresolved issue before accepting the delay.','Ask what specifically they need to think through.',
`Absolutely. Usually when someone says they need to think, there is one piece that still does not feel settled. Is it the vehicle, the numbers, the trade or just the timing?`,
`Hi [Name], [agent] at Sheehy Nissan. I know you wanted to think it over. I have one quick question so I know whether there is something useful I can solve or whether you simply need time. Call or text me at [number].`,
`Totally fair to think it over. What is the one piece that still does not feel settled: the vehicle, numbers, trade or timing?`,
`🤔 [Name], What’s the One Piece Still Unsettled?`,
`Hi [Name], totally fair to think it over.\n\nUsually there is one piece that still does not feel settled. Is it the vehicle, the numbers, the trade or just the timing? Tell me that and I will either help solve it or give you the space you need.\n\n[agent]`,
`Hi [Name], [agent] here. I know you wanted to think about the [vehicle]. I am not going to pressure you. I do want to know the one thing still unresolved so I do not keep following up on the wrong issue.`);

  add('proposal','sleep-spouse','“I Need to Sleep on It / Talk to Someone”','Customer wants outside validation before committing.','Identify whether there is a real objection hidden behind the delay.','Ask what the other person is likely to question, then involve them if possible.',
`That makes sense. Before you go, what do you think they are going to ask you first about the [vehicle] or the numbers? Let’s make sure you leave with that answer.`,
`Hi [Name], [agent] at Sheehy Nissan. I know you wanted to talk it over. I just want to make sure you have the answer to the question they are most likely to ask. Call or text me at [number].`,
`Makes sense to talk it over. What do you think they are going to ask you first about the [vehicle] or the numbers? I want to make sure you have that answer.`,
`👥 [Name], One Thing Before You Talk It Over`,
`Hi [Name], it makes sense to talk it over.\n\nWhat do you think the other decision maker is going to ask first about the [vehicle] or the numbers? I want to make sure you have that answer instead of having to guess for me.\n\n[agent]`,
`Hi [Name], [agent] here. Since someone else is weighing in, I want to make sure you are not stuck relaying half the story. Tell me what they are most likely to care about and I will help you leave with a clean answer.`);

  add('proposal','ready','They Say Yes / Ready to Move Forward','Customer is ready.','Stop selling and execute the next step cleanly.','Confirm the agreed direction and move to the proper paperwork/finance handoff.',
`Perfect. We have the right [vehicle] and the direction makes sense. Let’s get the next step handled and keep this moving.`,
`Not a voicemail scenario.`,
`Perfect. I have you moving forward on the [vehicle]. I will keep the next steps organized and let you know exactly what I need from you.`,
`🔑 [Name], Next Steps on Your [vehicle]`,
`Hi [Name], we are moving forward on the [vehicle].\n\nI will keep the next steps organized and make sure you know what is needed as we go.\n\n[agent]`,
`No sales video needed. Focus on execution and delivery preparation.`);

  /* ==================== 8. AFTER VISIT / OWNERSHIP ==================== */
  add('after','left-with-numbers','They Left With a Proposal','Customer drove and saw numbers but did not buy.','Reopen the real decision without restarting the whole sale.','Reference the unresolved issue and ask where their head is now.',
`Hi [Name], [agent] at Sheehy Nissan. You had the [vehicle] and the numbers in front of you. Where is your head now: still considering it, leaning another direction or did one issue stand out?`,
`Hi [Name], [agent] at Sheehy Nissan. I am following up after you looked at the [vehicle] and the proposal. I want to know where your head landed, not restart the whole pitch. Call or text me at [number].`,
`Hi [Name], where did your head land after the [vehicle] and the proposal: still considering it, leaning another direction or did one issue stand out?`,
`👋 [Name], Where Did You Land on the [vehicle]?`,
`Hi [Name], you had a chance to see the [vehicle] and the proposal.\n\nWhere did your head land: still considering it, leaning another direction or did one issue stand out? I would rather address the real thing than restart the whole sales pitch.\n\n[agent]`,
`Hi [Name], [agent] here. You already know the [vehicle] and you already saw the proposal, so I am not going to repeat everything. I just want to know where your head landed and whether there is one thing still keeping it from being a yes.`);

  add('after','ghost-after-visit','They Ghost After a Good Visit','Customer engaged in store but stops responding afterward.','Use specifics from the visit to earn one more response.','Do not send generic “checking in.” Ask whether the plan changed.',
`Hi [Name], [agent] at Sheehy Nissan. We spent real time on the [vehicle], so I wanted to ask directly: did your plan change or is there still something unresolved on it?`,
`Hi [Name], [agent] at Sheehy Nissan. We spent real time together on the [vehicle], so I do not want to send you generic follow-ups. Did your plan change, or is there one thing still unresolved? Call or text me at [number].`,
`Hi [Name], we spent real time on the [vehicle], so I will ask directly: did your plan change or is there still something unresolved?`,
`👋 [Name], Did the Plan Change on the [vehicle]?`,
`Hi [Name], we spent real time on the [vehicle], so I do not want to send you generic “checking in” emails.\n\nDid your plan change, or is there still something unresolved on it? Either answer helps me know what to do next.\n\n[agent]`,
`Hi [Name], [agent] here. Since you already spent time with me on the [vehicle], I am not going to repeat the pitch. I just want to know whether the plan changed or whether one issue is still unresolved.`);

  add('after','sold-thankyou','Day After Delivery','Customer purchased and took delivery.','Reinforce ownership support and surface problems early.','Check the vehicle, then ask if any feature or issue needs attention.',
`Hi [Name], [agent] at Sheehy Nissan. How is the first day with the [vehicle]? Anything on the vehicle or controls you want me to go over while it is still fresh?`,
`Hi [Name], [agent] at Sheehy Nissan. Just checking on your first day with the [vehicle]. If anything feels unclear or needs attention, call or text me at [number].`,
`Hi [Name], how is the first day with the [vehicle]? Anything on the vehicle or controls you want me to go over while it is still fresh?`,
`🔑 [Name], How’s the First Day With Your [vehicle]?`,
`Hi [Name], how is the first day with your [vehicle]?\n\nIf anything on the vehicle, controls or ownership process feels unclear, tell me while it is fresh and I will help get it handled.\n\n[agent]`,
`Hi [Name], [agent] here. I just wanted to check in on your first day with the [vehicle]. If anything feels unclear, send me a message and I will help you with it.`);

  add('after','post-sale-problem','Customer Reports a Post-Sale Problem','Customer has a concern after delivery.','Own the communication and get the right department involved without making promises.','Clarify the issue, acknowledge it, then route it to the correct person/team.',
`Thank you for telling me. I want to understand it correctly before I pull in the right person. What exactly happened, and when did you first notice it?`,
`Hi [Name], [agent] at Sheehy Nissan. I got your message about the issue with the [vehicle]. I want to understand it correctly and get the right person involved. Call or text me at [number].`,
`Thank you for telling me. I want to understand it correctly before I pull in the right person. What exactly happened, and when did you first notice it?`,
`🛠️ [Name], I’m Following Up on the [vehicle] Issue`,
`Hi [Name], thank you for telling me about the issue with the [vehicle].\n\nI want to understand it correctly before I pull in the right person. What exactly happened, and when did you first notice it? I will take it from there and keep you updated on the next step.\n\n[agent]`,
`Do not use video for a complaint unless it genuinely helps explain something visual. Start with a call or text and route the issue correctly.`);

  add('after','survey','Survey Follow-Up','Customer is in the Nissan survey window.','Make them aware of the survey and surface unresolved issues without coaching scores.','Use the dedicated Survey page for the full scenario set.',
`Use the Survey page. Ask for honest feedback and surface any unresolved issue before or after the survey. Do not coach a score.`,
`Use the Survey page for the appropriate voicemail.`,
`Use the Survey page for the appropriate SMS.`,
`⭐ [Name], Quick Ownership Check`,
`Use the Survey page for the appropriate email scenario.`,
`Use the Survey page only if a personal video is appropriate. Keep it about ownership support, not survey scoring.`);

  /* ==================== 9. LOST / LONG-TERM ==================== */
  add('longterm','bought-elsewhere','They Bought Somewhere Else','Customer tells you they already purchased.','Close gracefully and preserve future/referral value.','Congratulate them. Do not interrogate or guilt them.',
`Got it. Congratulations on the new vehicle and thank you for telling me. I appreciate the chance to work with you. If you ever need anything automotive down the road, you have my number.`,
`Hi [Name], [agent] at Sheehy Nissan. I got the update that you purchased. Congratulations and thank you for letting me know. I appreciate the chance to work with you.`,
`Congratulations on the new vehicle, [Name]. Thanks for letting me know and for giving me a shot. If you ever need anything down the road, you have my number.`,
`🔑 Congratulations on the New Vehicle, [Name]`,
`Hi [Name], congratulations on the new vehicle and thank you for letting me know.\n\nI appreciate the chance to work with you. If you ever need anything automotive down the road, you have my contact information.\n\n[agent]`,
`No video needed unless you had a strong personal rapport and it would feel natural.`);

  add('longterm','months-away','They Are Months Away','Customer gives a real long-term timeline.','Stop over-contacting and create permission for a future touch.','Confirm the month and one reason to reconnect.',
`Perfect, that helps. I will stop chasing you now. I will circle back around that time unless something directly relevant to the [vehicle] comes up sooner. Fair?`,
`Hi [Name], [agent] at Sheehy Nissan. Thanks for giving me the real timing. I will back off and reconnect closer to when you are ready. You have my number if anything changes sooner.`,
`That helps. I will stop chasing you and circle back closer to your real timing unless something directly relevant to the [vehicle] comes up sooner. Fair?`,
`🗓️ [Name], I’ll Follow Your Timing`,
`Hi [Name], thanks for giving me the real timing.\n\nI will back off and reconnect closer to when you are ready unless something directly relevant to the [vehicle] comes up sooner.\n\n[agent]`,
`No video needed. Respect the timeline.`);

  add('longterm','fallback','Something Else / Unusual Behavior','Customer does something not covered by the common behavior set.','Do not improvise a speech. Use the control framework.','Acknowledge, clarify, isolate, answer briefly, then ask for the next step.',
`I hear you. When you say that, what specifically do you mean? And if we solve that piece, what would you want the next step to be?`,
`Hi [Name], [agent] at Sheehy Nissan. I wanted to make sure I understood your last point correctly before I respond to the wrong issue. Call or text me at [number].`,
`I hear you. When you say that, what specifically do you mean? I want to answer the real issue, not guess.`,
`💬 [Name], One Quick Clarification`,
`Hi [Name], I want to make sure I understood your last point correctly before I answer the wrong issue.\n\nWhat specifically did you mean by that? Give me the short version and I will respond to the real concern.\n\n[agent]`,
`Hi [Name], [agent] here. I do not want to guess at what you meant. Give me the one issue you want solved and I will keep the answer focused.`);

  g.SHQFunnel={stages:STAGES, scenarios:S};
})(window);
