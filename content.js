/* ============================================================
   SALES HQ CONTENT FILE
   All message content for the main app lives here, separate
   from the app engine. Edit a script in this file and nothing
   in index.html has to change.

   SMS        = text templates
   EMAILS     = email templates
   TRACKS     = call scripts (Cold call, Internet lead, Owner offer, Inbound)
   VOICEMAIL  = voicemail per track
   OBJECTIONS = in-call quick answers
============================================================ */

/* ================= SMS templates =================
   CTA rules baked in: end on one choice question or a reply-1-or-2 ask. */
const SMS = [
 // First touch
 {cat:'First touch', title:'New lead intro', use:'First text to a fresh internet lead',
  body:`Hi [Name], this is [agent] at Sheehy Nissan of Manassas. Good news on the [vehicle] you asked about, it is here. Are you trying to see it today or is tomorrow better?`},
 {cat:'First touch', title:'No reply nudge', use:'About a day later',
  body:`Hi [Name], [agent] at Sheehy Nissan. Still have the [vehicle] in my notes for you. Quick one so I plan around you. Reply 1 if you want to look this week or 2 if this is a next-month thing.`},
 {cat:'First touch', title:'Last nudge', use:'Final touch before slowing down',
  body:`Hi [Name], last one from me on the [vehicle] so I am not blowing up your phone. If you are still looking I will keep you posted on it. If you are all set just tell me and I will close it out. Which is it?`},

 // Continuation after another channel
 {cat:'Continuation', title:'Just called, left voicemail', use:'Right after leaving a VM',
  body:`Hi [Name], [agent] at Sheehy Nissan. Just left you a voicemail about the [vehicle]. Texting in case that is easier. Is later today or tomorrow better for a quick call?`},
 {cat:'Continuation', title:'Just called, no voicemail', use:'They did not pick up, no VM left',
  body:`Hi [Name], [agent] at Sheehy Nissan of Manassas. Just tried you about the [vehicle], did not want to clog your voicemail. Want me to call back after 5 or is text easier for you?`},
 {cat:'Continuation', title:'We just spoke, recap', use:'Right after a good phone call',
  body:`[Name], great talking with you. Locking in what we said: [vehicle], [day/time] at Sheehy Nissan, [address]. I will have it pulled up front. Reply YES and it is set.`},
 {cat:'Continuation', title:'Just emailed you', use:'Drive them to open the email',
  body:`Hi [Name], [agent] here. Just sent you an email about the [vehicle] with the piece you asked about. Two minute read. Can you take a look and tell me which option fits better?`},
 {cat:'Continuation', title:'Just sent a video', use:'Drive them to watch it',
  body:`[Name], just sent you a short video of the [vehicle], me walking it in person so you can see exactly what you would be getting. 60 seconds. Watch it and tell me, is it what you pictured?`},
 {cat:'Continuation', title:'They texted first', use:'Reply that steers to a call or visit',
  body:`Hi [Name], thanks for reaching out, this is [agent] at Sheehy Nissan. I can answer that faster on a two minute call than in ten texts. Can I ring you now or is after work better?`},

 // Appointments
 {cat:'Appointments', title:'Appointment confirmed', use:'Right after booking',
  body:`[Name], you are set for [day/time] at Sheehy Nissan of Manassas, [address]. I will have the [vehicle] pulled up and ready. Will it be just you or is anyone helping with the decision?`},
 {cat:'Appointments', title:'Day-of reminder', use:'Morning of the appointment',
  body:`Hi [Name], see you today at [day/time]. The [vehicle] is ready and waiting. Directions if you need them: [maps]. Reply if anything changed, otherwise see you soon.`},
 {cat:'Appointments', title:'Pulled up and ready', use:'1 to 2 hours before',
  body:`[Name], just pulled the [vehicle] up front with your name on it. See you at [day/time]. Ask for [agent] at the front desk and I will come right out.`},
 {cat:'Appointments', title:'Reschedule offer', use:'They said the time no longer works',
  body:`No problem at all [Name], life happens. I can do [day/time] or [alt time] instead. Which one works better for you?`},
 {cat:'Appointments', title:'No-show recovery', use:'They missed the appointment',
  body:`Hi [Name], we had you down today and I had the [vehicle] ready. All good, things come up. Want me to reset it for [day/time] or has your plan changed? Either answer works, I just do not want to hold it if you moved on.`},

 // After contact
 {cat:'After contact', title:'After showroom visit', use:'Same evening',
  body:`[Name], good meeting you today. You liked the [detail] on the [vehicle] and wanted to think it over, totally fair. When you are ready for round two, is the weekend or a weekday evening easier?`},
 {cat:'After contact', title:'After test drive', use:'Same day they drove it',
  body:`[Name], thanks for driving the [vehicle] today. You said the [detail] stood out. Next step is simple, real numbers so you can decide clean. Want to do that in person or should I call you with them?`},
 {cat:'After contact', title:'Left before numbers', use:'They walked before the proposal',
  body:`Hi [Name], you left before we could put anything real together on the [vehicle], and I do not want you deciding off a guess. Give me 15 minutes and you will have actual numbers. Today or tomorrow?`},

 // Situations
 {cat:'Situations', title:'Price shopper', use:'They are comparing dealers',
  body:`[Name], fair play on shopping around, I would too. Send me the other quote or stock number and I will tell you straight if we can match the vehicle, trim and terms. Deal?`},
 {cat:'Situations', title:'Trade follow-up', use:'Trade value is the sticking point',
  body:`Hi [Name], on your [current], the only honest number comes from a quick look, about 15 minutes. A guess over text would just waste your time. Can you swing by [day/time] or is earlier in the week better?`},
 {cat:'Situations', title:'Inventory arrived', use:'The vehicle they wanted landed',
  body:`[Name], the [vehicle] you were waiting on just landed. You are the first person I am telling. Want first look before it goes on the lot? I can have it ready [day/time].`},
 {cat:'Situations', title:'Reconnect after silence', use:'Weeks of quiet',
  body:`Hi [Name], [agent] at Sheehy Nissan. Been a minute since we talked about the [vehicle]. Still in the market or did you already handle it? Reply 1 if still looking, 2 if all set, and I will act accordingly.`},
 {cat:'Situations', title:'Credit-sensitive', use:'Worried about qualifying',
  body:`Hi [Name], I hear you on wanting a straight answer before getting hopes up. I will not guess or promise, but I can get you in front of the right people privately with zero pressure. Is [day/time] doable for you?`},

 // Sold or not in stock, pivot to a real alternative (never claim we still have it)
 {cat:'Sold or swap', title:'Exact one sold', use:'The unit they asked about is gone',
  body:`Hi [Name], [agent] at Sheehy Nissan. Straight with you, the exact [vehicle] you asked about just sold. Before you cross us off, I have one or two very close to it here right now. Want me to send the details or would you rather see them in person?`},
 {cat:'Sold or swap', title:'Not in stock, close match', use:'We never had it, have a comparable',
  body:`Hi [Name], [agent] at Sheehy Nissan. That exact [vehicle] is not on our lot, but I have something close that may actually fit you better. Worth a quick look? I can set it aside and have it ready [day/time].`},
 {cat:'Sold or swap', title:'Wrong trim, right vehicle', use:'Trim they wanted is gone, others available',
  body:`Hi [Name], the specific [vehicle] you spotted is spoken for, but we have the same model in a couple of other setups. Tell me what mattered most about that one and I will point you to the closest match. What was the main draw for you?`},

 // Post-sale
 {cat:'Post-sale', title:'Thank you', use:'Right after the sale',
  body:`[Name], thank you for trusting me with this. You have my number for anything on the [vehicle], a feature question, first service, anything. I am not disappearing after the sale. Enjoy it.`},
 {cat:'Post-sale', title:'Review ask', use:'Few days after delivery, if it went well',
  body:`Hi [Name], hope the [vehicle] is treating you well. If the experience was a good one, a short review would mean a lot and helps the next buyer choose. Takes a minute. Want me to send the link?`},
 {cat:'Post-sale', title:'First service intro', use:'A few weeks in',
  body:`[Name], quick heads up. When your first service comes due on the [vehicle] I can introduce you to our service team directly so you skip the queue feeling. Want me to connect you or just send the scheduling info?`},
 {cat:'Post-sale', title:'Referral ask', use:'Happy owner, later on',
  body:`Hi [Name], hope you are still loving the [vehicle]. If anyone you know starts car shopping, send them my way and I will take care of them like I took care of you. That is the whole ask.`},
];

/* ================= EMAIL templates =================
   Line 1 = greeting fused with the hook. The inbox preview shows
   subject + first ~40 chars, so line 1 has to earn the open. */
const EMAILS = [
 {cat:'Leads', title:'Initial intro', use:'Fresh internet lead',
  subject:'[Name], about the [vehicle] you asked for',
  body:`Hi [Name], good news, it is here and I can have it pulled up for you.

I am [agent], your point of contact at Sheehy Nissan of Manassas. Before I send information you may not need, one quick question so I only send what is useful.

Are you mainly comparing price, availability or the right trim for how you drive?

Reply with one word and I will take it from there. Or skip ahead, are you free to see it today or is tomorrow easier?`},

 {cat:'Leads', title:'Follow-up, no reply', use:'About a day after the intro',
  subject:'quick one on the [vehicle], [Name]',
  body:`Hi [Name], still here and I would rather not waste your time.

You asked about the [vehicle] and I have it flagged in my notes so I can move fast when you are ready.

Are you trying to look this week or is this a next-month plan? One line back and I will plan around you either way.`},

 {cat:'Leads', title:'Last touch before slowing down', use:'Final email in the sequence',
  subject:'closing your file [Name]?',
  body:`Hi [Name], one last note so I am not filling your inbox.

If the [vehicle] is still on your mind, I will keep you posted when anything changes on it. If you already bought or moved on, tell me and I will close your file today, no hard feelings.

Which is it? One word is enough.`},

 {cat:'Leads', title:'First-time buyer intro', use:'New buyer who seems unsure',
  subject:'[Name], this is easier than you think',
  body:`Hi [Name], buying your first car should not feel like a test.

I am [agent] at Sheehy Nissan of Manassas and I will walk you through it in plain language at your pace. No rushing, no tricks, every step explained before it happens.

What matters most right now, the monthly comfort, the specific vehicle or just understanding your options?

Reply with whichever one it is, or if talking is easier, what time works today or tomorrow?`},

 {cat:'Appointments', title:'Appointment confirmation', use:'Right after booking',
  subject:'You are set, [Name]: [day/time]',
  body:`Hi [Name], you are locked in for [day/time].

We are at [address]. Ask for [agent] at the front desk and I will come right out. The [vehicle] will be pulled up and ready so we are not standing around.

Two things that help me prep. Will it be just you or is anyone else helping with the decision, and are you bringing your current vehicle in case you want it looked at?

See you then.`},

 {cat:'Appointments', title:'Reminder, morning of', use:'Send the day of the appointment',
  subject:'Today at [day/time], [Name]',
  body:`Hi [Name], the [vehicle] is ready for you today.

We are at [address]. Directions: [maps]

If anything changed and you need a different time, reply here and I will move it. Otherwise I will see you at [day/time].`},

 {cat:'Appointments', title:'Missed appointment', use:'They did not show',
  subject:'Missed you today [Name]',
  body:`Hi [Name], we had you down today and the [vehicle] was ready to go.

Life happens, zero judgment. I just need to know one thing so I plan right.

Do you want me to reset it, I have [day/time] or [alt time] open, or has your plan shifted? Either answer is fine, I just do not want to keep it reserved if you have moved on.`},

 {cat:'Appointments', title:'Delivery scheduling', use:'Deal agreed, set pickup',
  subject:'Picking up your [vehicle], [Name]',
  body:`Hi [Name], best part now, let us set your pickup.

I want it detailed, fueled and ready so you can just enjoy it. Does [day/time] work or would [alt time] be easier?

We are at [address]. Bring your license and current insurance info and I will handle the rest on my end.`},

 {cat:'Post-visit', title:'After showroom visit', use:'Same day they came in',
  subject:'Great meeting you [Name]',
  body:`Hi [Name], good meeting you today, thanks for making the time.

Quick recap of where we landed: you liked the [detail] on the [vehicle] and wanted to think it over. Completely fair.

I am around tonight for any question that pops up. For round two, is the weekend better or a weekday evening?`},

 {cat:'Post-visit', title:'After test drive', use:'Same day they drove it',
  subject:'How the [vehicle] felt, [Name]',
  body:`Hi [Name], that [detail] you noticed on the drive today, that is the thing owners mention most.

Sleep on it if you need to. When you are ready, the next step is simple: real numbers on paper so you can make a clean decision instead of guessing.

Want to do that in person, or should I get it started and call you? Either way takes about 15 minutes of your time.`},

 {cat:'Post-visit', title:'Left before numbers', use:'They walked before the proposal',
  subject:'[Name], do not decide off a guess',
  body:`Hi [Name], you left today before we put anything real together on the [vehicle].

That means any number in your head right now is a guess, and I do not want you comparing or deciding off a guess. Fifteen minutes gets you actual figures you can hold other quotes against.

Can you come back [day/time], or want me to call you with them instead?`},

 {cat:'Follow-up', title:'Price shopper', use:'They are comparing dealers',
  subject:'[Name], happy to earn it',
  body:`Hi [Name], you are comparing a few stores and that is the smart move.

I will not play games with the number. The fastest way to make sure you are comparing apples to apples: send me the other quote or the stock number and I will tell you straight whether we can match the vehicle, the trim and the terms.

Fair? Send it over and I will have an answer for you same day.`},

 {cat:'Follow-up', title:'Trade-in follow-up', use:'Trade is the sticking point',
  subject:'your [current], [Name]',
  body:`Hi [Name], about your [current], here is the honest version.

Any number I text you without seeing it is a guess, and a guess can cost you money in either direction. A real appraisal takes about fifteen minutes in person.

Can you bring it by [day/time], or would [alt time] work better? You will leave with an actual figure either way, no obligation attached.`},

 {cat:'Follow-up', title:'New inventory alert', use:'The vehicle they wanted arrived',
  subject:'It landed, [Name]',
  body:`Hi [Name], the [vehicle] you were waiting on just arrived.

You are the first person I am telling, before it even hits the main lot. First look is yours if you want it.

I can have it ready [day/time] or [alt time]. Which one should I set?`},

 {cat:'Follow-up', title:'Reconnect after silence', use:'Weeks of no contact',
  subject:'still thinking, [Name]?',
  body:`Hi [Name], it has been a little while since we talked about the [vehicle].

No pressure, I just need to know which list you are on. If you are still in the market, inventory has likely changed since we spoke and I am happy to update you. If you are all set, say the word and I will get out of your inbox for good.

Still looking or all set? One word does it.`},

 {cat:'Sold or swap', title:'Exact one sold, pivot', use:'The unit they asked about is gone',
  subject:'[Name], the [vehicle] sold, but read this',
  body:`Hi [Name], being straight with you: that exact one just sold.

I could have dodged your message and hoped you would forget, but that is not how I work. Here is the useful part. I have one or two very close to it in stock right now, and honestly one of them may suit you better than the original.

Tell me what pulled you toward that specific [vehicle], the price, the trim, the color or the timing, and I will point you straight at the closest match. Or skip ahead, are you free [day/time] or [alt time] to see them?`},

 {cat:'Sold or swap', title:'Not in stock, close match', use:'We never had it, have a comparable',
  subject:'[Name], a closer fit than the [vehicle]',
  body:`Hi [Name], quick and honest: we do not have that exact [vehicle] on the lot.

What I do have is a very close match, and in a couple of ways it may actually fit you better. I would rather show you something real than pretend I have something I do not.

What mattered most about the one you found, the payment range, the trim or a specific feature? Answer that and I will line up the best option we have. If it is easier, I can have it ready [day/time].`},

 {cat:'Follow-up', title:'Credit-sensitive reassurance', use:'Worried about qualifying',
  subject:'[Name], let us skip the guessing',
  body:`Hi [Name], wanting to know where you stand before getting your hopes up is completely fair.

Here is what I will and will not do. I will not guess numbers or make promises I cannot keep. I will get you in front of the right people who look at real options for your actual situation, privately and without pressure.

The fastest path to a straight answer is starting in person. Are you free [day/time], or would [alt time] work better?`},

 {cat:'Post-sale', title:'Post-sale thank you', use:'Right after they buy',
  subject:'Thank you [Name]',
  body:`Hi [Name], thank you for trusting me with this. It genuinely means a lot.

You have my direct line now and it stays good. A feature that will not click, a question about your first service, anything on the [vehicle], I am one text away. I do not disappear after the sale.

Enjoy it. You earned this one.`},

 {cat:'Post-sale', title:'Review request', use:'A few days after delivery, if it went well',
  subject:'a one-minute favor, [Name]',
  body:`Hi [Name], hope the [vehicle] is treating you well so far.

If your experience was a good one, a short review would mean a lot. It helps me directly and helps the next person pick where to buy with confidence.

It takes about a minute. Want me to text you the link or email it?`},

 {cat:'Post-sale', title:'Referral ask', use:'Happy owner, later on',
  subject:'[Name], one small ask',
  body:`Hi [Name], hope you are still loving the [vehicle].

Here is my whole ask. When someone you know starts car shopping, send them my way. I will treat them exactly how I treated you, and they skip the part where they wonder who to trust.

That is it. Just keep my number handy for them.`},

 {cat:'Post-sale', title:'First service handoff', use:'Some weeks after delivery',
  subject:'your first service, [Name]',
  body:`Hi [Name], quick heads up before your first service comes due on the [vehicle].

When it is time, I can introduce you to our service team directly so you are a name, not a number in a queue. We are at [address], same building you know.

Want me to connect you when the time comes, or would you rather have the scheduling info now to keep on hand?`},
];

/* ================= call tracks ================= */
const TRACKS = {
 coldcall: {label:'Cold call', openers:{
   equity:{label:'Equity', hint:'Best when the car is paid off or close', tag:'paid off or close',
     text:`"So here is why I called. You have been in the {[current]} a good while now, and honestly, depending on what you still owe, there is a real chance you have some equity built up in it. I did not want you sitting on that without knowing. Ten minutes with me and you will have the actual number."`,
     vm:`Hey [Name], it is [agent] over at Sheehy Nissan in Manassas. Listen, depending on what you still owe, there is a real chance you have some equity built up in your [current] right now. Figured you would want to know. Give me a call or shoot me a text at [number]. That is [number]. Talk soon [Name].`},
   age:{label:'Age & cost', hint:'Best on high miles or a car that has needed repairs', tag:'older or high miles',
     text:`"So here is the thing. You are a good few years into the {[current]} now, and that is right about when the little repair bills start adding up. Before you go putting money into it, I figured you would want to know what it is worth today, and whether something newer lands close to what you are already paying. Feels worth a look, right?"`,
     vm:`Hey [Name], [agent] here from Sheehy Nissan in Manassas. Your [current] has got some age on it now, and before you sink money into it, I thought you would want to know what it is worth today. Only takes a few minutes. Give me a call or text at [number]. That is [number]. Talk soon [Name].`},
   straight:{label:'Straight', hint:'Least pitchy, often the most credible', tag:'no angle, just honest',
     text:`"No pitch, I promise. I am just going back through folks who bought from us, and your {[current]} has some age on it now, so I wanted to check in before you make your next move. Worst case, you find out what it is worth and we call it a day. That easy."`,
     vm:`Hey [Name], it is [agent] over at Sheehy Nissan in Manassas. No agenda here, just going back through our past customers and wanted to check in on the [current] before you decide what is next. Give me a call or text at [number]. That is [number]. Talk soon [Name].`}
  }, script:
`[cue]Open warm — say the name, then stop talking. Mirror their pace.
"Hey {[Name]}. How you doing."

[cue]Who you are + permission — keep it fast, sound like you know them
"It is {[agent]} over at Sheehy Nissan in Manassas. I know you are probably in the middle of something so I will keep this quick, that fair?"

[cue]Check in on the car first — genuine, then stop talking and let them answer
"How has the {[current]} been treating you? Everything still running the way you like? ... And how long have you had it now, are you usually a trade-it-every-few-years person, or do you drive them till the wheels fall off?"

[cue]Reason for the call — pick the angle in the dropdown above
{{OPENER}}

[cue]Bridge — ten minutes, zero pressure, either-way-you-win
"Here is all I am suggesting. Ten minutes, I put real eyes on your car and get you the actual number. If there is strong equity and we can get you into something newer without your payment jumping, great. If not, you drive home in the same car and now you know where you stand. Either way you win, that sound reasonable?"

[cue]Two-choice close — never ask "can you come in"
"When is your next day off this week? ... Perfect. Do mornings or afternoons work better for you? ... I have got {[day/time]} or {[alt time]}, which one is easier?"

[cue]Lock it + confirm on the call
"Done, I have got you {[day/time]}. I will have your number pulled before you get here so we are not wasting your time. Is it just you coming, or is anyone else in on the decision with you? ... Great, and this is the best number for a confirmation text?"`},

 lead: {label:'Internet lead', script:
`[cue]Opener
"Hi, is this {[Name]}? ... Hi {[Name]}, this is {[agent]} over at Sheehy Nissan of Manassas. You asked about the {[vehicle]} online. Did I catch you at an okay time?"

[cue]If yes, purpose
"Perfect, I will keep it quick. It is available, and my job is to make sure you do not waste a trip. Two quick questions so I point you right."

[cue]Light qualify
"Is the {[vehicle]} the one, or are you comparing a couple of options?"
"And what is pushing the change, is the current car giving you trouble or is this an upgrade move?"

[cue]Bridge to appointment
"Here is the fastest way to know if it fits. Put your eyes on it and drive it, takes about twenty minutes and you will know."

[cue]Two-choice close
"I can have it pulled up for you {[day/time]} or {[alt time]}. Which works better?"

[cue]Lock it
"Done. {[day/time]} it is. I will have it up front with your name on it. Will it be just you coming, or is anyone helping with the decision? ... Great, and this number is the best one for a confirmation text?"`},

 owner: {label:'Owner offer (equity)', script:
`[cue]Opener — bring real energy, smile in your voice
"Hey {[Name]}! I hope you are having the best day of your life. My name is {[agent]}, over at Sheehy Nissan of Manassas. Do you have thirty seconds to talk about your {[current]}?"

[cue]If yes
"Awesome, I appreciate you. I will be quick, I promise."

[cue]Reason for the call — honest hook, no promises
"So here is why I am reaching out. Right now there are some genuinely strong owner offers on vehicles like your {[current]}, and cars like yours are in real demand at the moment. That combination does not line up often, and I did not want you to be the one who missed it."

[cue]Light qualify — then stop talking and let them answer
"Real quick, how has the {[current]} been treating you? Anything you wish it did a little better?"
"And be straight with me, are you the type who drives it till the wheels fall off, or would the right numbers actually get you into something newer?"

[cue]Value bridge — zero pressure, a real reason to come in
"Here is all I am asking, no strings attached. Swing by, we put a real appraisal number on your {[current]}, takes about fifteen minutes, and you will know exactly where you stand. Worst case you leave knowing what your car is worth today. Best case we find you something you love."

[cue]Two-choice close
"I have got time {[day/time]} or {[alt time]}. Which one is easier for you?"

[cue]Lock it
"Boom, {[day/time]} it is. Bring the {[current]} and your key fob and I will handle the rest. Is this the best number to text your confirmation to?"`},

 inbound: {label:'Inbound phone-up', script:
`[cue]Answer
"Thank you for calling Sheehy Nissan of Manassas, this is {[agent]}. Who do I have the pleasure of speaking with? ... Great to meet you {[Name]}, how can I help?"

[cue]Capture while they talk
Type their name, phone and vehicle into the workspace above as you go. Do not trust memory.

[cue]Answer, then trade
Answer their question honestly and briefly. Then trade for information:
"Happy to check that for you. While I pull it up, is the {[vehicle]} the one you are set on, or are you still comparing?"

[cue]Availability rule
Never promise a unit is available without checking. Say:
"Let me confirm that unit is physically here before you drive out. I do not want you making a trip for nothing. What is the best number to text you the confirmation?"

[cue]Two-choice close
"The fastest way to know if it is your car is to see it and drive it. I can have it ready {[day/time]} or {[alt time]}. Which works better?"

[cue]Lock it
"You are set for {[day/time]}. We are at 9010 Liberia Ave in Manassas, ask for {[agent]} at the desk. I will text you a confirmation right now so you have my number."`}
};

const VOICEMAIL = {
 coldcall:`Hey [Name], [agent] here from Sheehy Nissan of Manassas. Real quick, used values on your [current] have been running high lately and there is a good chance you are sitting on equity you could use. Ten minutes and I can get you the actual number, no pressure either way. Call or text me back at [number]. That is [number]. Again, [agent] at Sheehy. Talk soon [Name].`,
 owner:`Hey [Name], [agent] here from Sheehy Nissan of Manassas, hope you are having a great one. Real quick, there are some strong owner offers on your [current] right now and I did not want you to miss them. Do me a favor and call or text me back at [number]. That is [number]. Again, it is [agent] at Sheehy Nissan. Talk soon [Name].`,
 lead:`Hi [Name], this is [agent] at Sheehy Nissan of Manassas. You asked about the [vehicle], and good news, it is here. I have one quick question before I send anything over, so give me a call or text at [number]. That is [number]. Again, [agent] at Sheehy. Talk soon.`,
 inbound:`Hi [Name], [agent] at Sheehy Nissan of Manassas returning your call about the [vehicle]. Easiest way to reach me is a call or text at [number]. That is [number]. Looking forward to helping you out. Talk soon.`
};

const OBJECTIONS = [
 {q:'"I am not really interested" (cold call)',
  a:`"Totally fair, most people are not until they see the number. Let me ask you this. When you got the {[current]}, did you happen to lock in a great rate, or were you just taking whatever the payment was at the time? ... Right. That is exactly why ten minutes is worth it. Get it in front of me and you will know where you actually stand. Would {[day/time]} or {[alt time]} work?"`},
 {q:'"Call me back later" (cold call)',
  a:`"Happy to. Real quick though, so I catch you at a good time, are you more of a mornings or an evenings person? ... Got it. Then let me just hold a spot so you are not chasing me. {[day/time]} or {[alt time]}, which is easier?"`},
 {q:'"Just give me your best price over the phone"',
  a:`"I get it, you want a real number, and I want to give you one that actually holds up. A price without the exact unit, your trade and how you are paying is a guess, and a guess can move on you later. Come in, fifteen minutes, and you leave with real figures you can hold anyone else to. Would {[day/time]} or {[alt time]} work?"`},
 {q:'"Just email me the info"',
  a:`"Happy to. So I do not bury you in stuff you do not need, what matters most, the trim differences, what your trade changes or the bottom line? ... Got it. I will send exactly that today. And if it looks right on paper, are you open to seeing it this week?"`},
 {q:'"I am busy right now"',
  a:`"Totally fair, I will be quick. One question and I will let you go. Are you still looking at the {[vehicle]}, or has that changed? ... Okay. When is a better time for five minutes, tonight or tomorrow?"`},
 {q:'"I already bought elsewhere"',
  a:`"Congratulations, genuinely. Quick one before I close your file. Was there anything we could have done better? ... Appreciate that. Enjoy the new ride, and if anyone you know is shopping, you have my number."`},
 {q:'"I am still shopping around"',
  a:`"Smart, you should. Help me help you compare clean. What are you comparing it against? ... Good choices. Here is my offer, come drive ours back to back with what you have seen, and if it does not win on its own, I will say so. Would {[day/time]} work for that?"`},
 {q:'"What is my trade worth?" (over the phone)',
  a:`"Honest answer, any number I say without seeing it is a guess, and I do not guess with your money. The real appraisal takes fifteen minutes and you leave with an actual figure, no strings. Can you bring it by {[day/time]} or is {[alt time]} easier?"`},
 {q:'"I need to talk to my spouse / family"',
  a:`"Of course, that is how it should be. So they get the full picture, what do you think their main question will be, the money side or the vehicle itself? ... Makes sense. Why not bring them in so they see it firsthand instead of secondhand? I can set {[day/time]} or {[alt time]}, which suits you both?"`},
 {q:'The car they want just sold / is not in stock',
  a:`Be straight, never claim you still have it. "I want to be upfront with you, that exact {[vehicle]} sold. I would not have you drive out here for it. What I can do is this, tell me what mattered most about that one, the price, the trim or a feature, and I will show you the closest thing we have. A few of them may fit you even better. Want to come look {[day/time]} or {[alt time]}?"`},
];
