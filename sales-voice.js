/* ============================================================
   SHEEHY SALES HQ - current-page sales voice pass

   Purpose:
   - Give current operational communication surfaces the same voice:
     warm, human, confident, controlled and closing-oriented.
   - Preserve each page's purpose and compliance guardrails.
   - Never manufacture inventory, urgency, pricing, finance outcomes,
     incentive eligibility, transfer status or customer satisfaction.
============================================================ */
(function(g){
'use strict';
var page=(location.pathname.split('/').pop()||'').toLowerCase();

function $(id){return document.getElementById(id);}
function val(sel,fb){var e=document.querySelector(sel);return e&&e.value&&String(e.value).trim()?String(e.value).trim():fb;}
function name(){return val('[data-f="name"]','[Name]');}
function vehicle(){return val('[data-f="vehicle"]','[vehicle]');}
function agent(){return val('[data-f="agent"]','[agent]');}
function number(){return val('[data-f="number"]','[number]');}
function clean(s){
  var x=String(s||'');
  x=x.replace(/\bjust checking in\b/gi,'checking in with a purpose');
  x=x.replace(/\bjust following up\b/gi,'following up with a clear next step');
  x=x.replace(/\bcircling back\b/gi,'following up');
  x=x.replace(/\bno pressure(?: at all)?[,.]?\s*/gi,'');
  x=x.replace(/\bI would love to\b/gi,'I want to');
  x=x.replace(/\bI would love\b/gi,'I want');
  x=x.replace(/\bHappy to\b/g,'I can');
  x=x.replace(/\bWould you be open to\b/gi,'Does it make sense to');
  x=x.replace(/\bIf you want\b/gi,'When it makes sense');
  x=x.replace(/[ \t]{2,}/g,' ');
  return x;
}

/* ---------------- SMS Library: local specialty templates ---------------- */
var SMS_OVERRIDE={
  'New lead|Question first':'Hi [Name], [agent] at Sheehy Nissan. I appreciate you reaching out on the [vehicle]. I want to work the part that matters first: are you checking the vehicle, the numbers or the right setup?',
  'New lead|Warm and low-key':'Hi [Name], [agent] at Sheehy Nissan. Thanks for reaching out on the [vehicle]. I will keep this easy. What do you need first: a clean answer by text or a two-minute call?',
  'No reply|Day three check':'Hi [Name], [agent] at Sheehy Nissan. I know life gets busy, so I will make this easy. Is the [vehicle] still in play, did you already buy or should I pause this for now?',
  'No reply|Value nudge':'Hi [Name], [agent] here. I can save you a wasted trip by narrowing this down first. What matters most right now: the vehicle, the numbers or the timing?',
  'Price shopper|Honest about the number':'Hi [Name], I get why you want the number first. I will keep it clean and verified. Are you comparing one exact [vehicle] to a written quote or setting your budget?',
  'Price shopper|Earn the business':'Hi [Name], I want to earn the business on the facts, not win a texting contest. If the [vehicle] fits and the verified numbers are competitive, are you deciding this week?',
  'Payment focused|Get it right in person':'Hi [Name], the payment has to fit your real life. I will not guess at it over text. Let us get the vehicle and structure right, then finance can give you the real options. Are you closer to [day/time] or another time?',
  'Trade interest|Real figure, ten minutes':'Hi [Name], I get why you want the trade number first. The honest figure depends on the actual mileage and condition. I can get it in front of the right manager and give you a real appraisal. Is morning or evening easier?',
  'Credit rebuild|One piece of the puzzle':'Hi [Name], I appreciate you being straight with me. We can keep this private and get you real answers without guessing at approval. Is [day/time] better or do you need another time?',
  'Family decision|Make it easy on everyone':'Hi [Name], that makes sense. I want everyone involved working from the same information so you are not carrying the whole conversation home. Weekend or weekday evening, which works better?',
  'Competitor compare|Feel the difference':'Hi [Name], smart to compare. Tell me the exact vehicle you are weighing against the [vehicle]. I will give you the real differences, including where each one is stronger. Quick call or a back-to-back look?',
  'Appt confirm|Anything to prep':'Hi [Name], we are set for [day/time] on the [vehicle]. What is the one thing you want me to have checked or ready before you arrive?',
  'Appt reminder|Day-of reminder':'Hi [Name], [agent] at Sheehy Nissan. I appreciate you making the time today. I am rechecking the [vehicle] before you head this way. Still good for [day/time]?',
  'No-show|Hold it or not':'Hi [Name], we had you down today for the [vehicle] and I figured something changed. No hard feelings. Should we reset the visit or has your plan changed?',
  'Be-back|Great meeting you':'Hi [Name], [agent] at Sheehy Nissan. Good meeting you today. Based on what you told me, the [vehicle] was close. What is the one thing still keeping it from being a yes?',
  'Be-back|One thing on your mind':'Hi [Name], thanks again for coming in. I do not need to resell the whole car. What is the one thing still unresolved: the vehicle, the money, the trade or the timing?',
  'After test drive|How did it sit':'Hi [Name], [agent] at Sheehy Nissan. You have had a little time since the drive. What is the one thing you keep thinking about, good or bad?',
  'After test drive|Checked the boxes':'Hi [Name], the [vehicle] checked a lot of boxes on the drive. If the structure makes sense, is this the one you want to move forward with?',
  'Left with proposals|Slept on it':'Hi [Name], you have had a night with the options. Which one keeps coming back to mind, and what is the one thing keeping it from a yes?',
  'Left with proposals|Where is your head':'Hi [Name], [agent] here. You already know the vehicles and you have seen the numbers. What kept it from being a yes: the car, the money, the trade or the timing?',
  'Got home safe|Home with the paperwork':'Hi [Name], [agent] here. I wanted to make sure you got home safely. Leave the paperwork alone for tonight. Tomorrow, tell me the one thing you want clarified first.',
  'Reconnect|Been a minute':'Hi [Name], [agent] at Sheehy Nissan. It has been a minute since we talked about the [vehicle]. Which lane are we in now: still shopping, already bought or pause for now?',
  'Reconnect|You came to mind':'Hi [Name], [agent] at Sheehy Nissan. I was cleaning up a few conversations I never got to finish and yours came back to mind. Did you buy, are you still looking or did the timing move?',
  'Referral|Send them my way':'Hi [Name], I hope the [vehicle] is treating you well. If I earned your trust, I want to take care of the people you care about the same way. Who comes to mind first that may need a vehicle next?',
  'Referral|Quick favor':'Hi [Name], quick favor. If I earned your trust, who is the first person you would feel comfortable introducing me to when they need a vehicle? You make the introduction and I will take care of the rest.',
  'Post-sale|Thank you':'Hi [Name], [agent] at Sheehy Nissan. Thank you again for trusting me with the [vehicle]. If something feels unclear in the first few days, text me first. I want ownership to feel as good as delivery did.',
  'Post-sale|Text me first':'Hi [Name], congrats again on the [vehicle]. Keep my number. If a feature, service or ownership question comes up, text me first and I will help get you to the right answer.',
  'Review request|Quick review ask':'Hi [Name], now that you have had real time with the [vehicle], I would value your honest take on working with us. If you have a minute, share the experience on our review page. Your words help the next shopper know what to expect.',
  'Review request|Meant a lot':'Hi [Name], you have had enough time with the [vehicle] to have a real opinion. I would genuinely value your honest review of the experience. It helps other shoppers know what working with us is actually like.',
  'Service to sales|While it is here':'Hi [Name], [agent] at Sheehy Nissan. While your [current] is here, I can get you a current appraisal and show you what a change would actually look like. No guessing. Do you want the number or should we leave it alone?',
  'Service to sales|No rush, just options':'Hi [Name], hope the service visit went smoothly. If you are curious what the [current] is worth today, I can get a real appraisal while it is convenient. Want the number or should I leave it be?',
  'Owner equity|Equity check':'Hi [Name], [agent] at Sheehy Nissan. I am reaching out about your [current]. I can get you a current value and, once payoff is verified, show you whether there is equity to work with. Worth getting the real number?',
  'Owner equity|No gimmick check-in':'Hi [Name], [agent] at Sheehy Nissan. Straight check on the [current]: are you planning to keep it for a while or are you curious what a change would look like? I can work either direction.',
  'Lease end|Options, no pressure':'Hi [Name], [agent] at Sheehy Nissan. Your [current] lease is getting closer to maturity. Let us make the options clear before the deadline is on top of you. Keep it, turn it in or replace it, which direction are you leaning?',
  'Lease end|All three paths':'Hi [Name], as the [current] lease gets closer to the end, there are three paths to review: return it, buy it or replace it. Which one do you want me to work first?',
  'End of month|A little more room':'Hi [Name], [agent] at Sheehy Nissan. If the [vehicle] is still in play, I can verify today\'s current programs and numbers and tell you exactly where it stands. Are you still close enough to make a decision?',
  'End of month|Good timing':'Hi [Name], if the [vehicle] is still on your list, I can verify the current numbers today instead of guessing about what timing might do. Still shopping or did you already handle it?',
  'Model-year change|New one just landed':'Hi [Name], [agent] at Sheehy Nissan. If you are comparing model years on the [vehicle], I can verify what we actually have and show you the real differences. Are you trying to maximize value or get the newest setup?',
  'Model-year change|Worth seeing new':'Hi [Name], if the newer [vehicle] is on your radar, I can verify the exact one and show you what actually changed. Is [day/time] better or another time?',
  'New inventory|Back in stock':'Hi [Name], [agent] at Sheehy Nissan. I found a [vehicle] that may match what you were waiting for. I am verifying the exact vehicle now. Do you want the details first or a time to see it?',
  'New inventory|First to see it':'Hi [Name], [agent] at Sheehy Nissan. I found a [vehicle] that looks close to what you described. I am checking the exact setup now. What matters most for the match: trim, color, equipment or numbers?',
  'Fresh offers|New offers this month':'Hi [Name], [agent] at Sheehy Nissan. There may be current programs on the [vehicle] worth reviewing. I will verify what actually applies before I quote anything. Are you buying or leasing?',
  'Fresh offers|Let me verify it':'Hi [Name], I can check the current programs on the [vehicle] and give you the verified answer. Are you buying or leasing, and is there a trade?',
  'Tax season|Refund into a car':'Hi [Name], if you are considering using part of a refund toward a vehicle, let us make sure the car and the structure make sense first. What are you trying to improve from the [current]?',
  'Tax season|Stretch it further':'Hi [Name], if you are thinking about putting refund money toward a vehicle, I can help you compare the real options without guessing at what it buys. What vehicle are you trying to get into?',
  'Holiday event|Event this weekend':'Hi [Name], [agent] at Sheehy Nissan. If you are planning to shop the [vehicle] this weekend, I can verify the current event details and set a specific time so the visit is focused. Morning or afternoon?',
  'Holiday event|Skip the crowd':'Hi [Name], if the [vehicle] is still on your mind for the holiday weekend, I can verify the actual vehicle and current programs before you come. Morning or afternoon works better?',
  'Weather|Before the next storm':'Hi [Name], if bad-weather confidence is part of why you are shopping, let us compare the actual traction and safety equipment on the [vehicle] you are considering. What bothers you most about the [current] in bad weather?',
  'Weather|Nervous in bad weather':'Hi [Name], if the [current] has you uncomfortable in bad weather, tell me what is missing: traction, visibility, ground clearance or driver-assist confidence. I will point you at the right fit, not just any SUV.',
  'Fuel and EV|Better fuel numbers':'Hi [Name], if fuel cost is part of the decision, I can give you the real pros and tradeoffs on the [vehicle] and the electric options that fit your driving. What does a normal day of driving look like?',
  'Fuel and EV|Match your daily drive':'Hi [Name], if fuel cost is getting your attention, let us match the vehicle to your actual driving instead of selling you a powertrain. How many miles is a normal day and can you charge at home?',
  'High trade values|Worth more than you think':'Hi [Name], [agent] at Sheehy Nissan. If you are curious what the [current] is worth today, I can get you a current appraisal instead of guessing from a market headline. Want the real number?',
  'High trade values|No obligation number':'Hi [Name], quick question on the [current]. Want to know what it is actually worth today? I can get a current appraisal and you can decide whether it changes anything.',
  'Ownership check-in|One year in':'Hi [Name], [agent] at Sheehy Nissan. One year with the [current] already. Give me the real ownership read: what has been great and what has annoyed you?',
  'Ownership check-in|No pitch today':'Hi [Name], [agent] at Sheehy Nissan. I am checking on you, not trying to manufacture a sale. Anything with the [current], service or ownership that I can make easier?',
  'First-time buyer|Make it simple':'Hi [Name], [agent] at Sheehy Nissan. First car is a big decision. I will keep the process clear and explain each step before it happens. What matters first: finding the right car, understanding the numbers or knowing the process?',
  'First-time buyer|Should feel good':'Hi [Name], buying your first car should feel clear, not confusing. I will explain the process in plain language and still help you make a decision. What do you want to understand first?',
  'Rideshare and delivery|Built for high miles':'Hi [Name], if you drive for rideshare or delivery, we should judge the [vehicle] on the things that hit your wallet and body every day: fuel use, comfort, cargo, maintenance and downtime. Which matters most?',
  'Rideshare and delivery|Save real money':'Hi [Name], for the miles you put on, the wrong vehicle gets expensive fast. Tell me what you drive now and your rough daily miles. I will narrow the right direction from there.',
  'Military and government|Thank you for your service':'Hi [Name], [agent] at Sheehy Nissan. Thank you for your service. There may be a current program that applies, and I will verify eligibility before quoting it. Are you shopping the [vehicle] now or planning ahead?',
  'Military and government|Around your schedule':'Hi [Name], [agent] at Sheehy Nissan. I will respect your schedule and keep the visit focused. I have [day/time] or another time. Which works better?'
};

function applySms(){
  if(typeof SMS==='undefined')return;
  SMS.forEach(function(x){var k=x.cat+'|'+x.title;if(SMS_OVERRIDE[k])x.body=SMS_OVERRIDE[k];else x.body=clean(x.body);});
  if(typeof render==='function')render();
}

/* ---------------- Email Library: specialty + safety pass ---------------- */
var EMAIL_OVERRIDE={
  'New lead|Short intro, minimal context':{subject:'[Name], One Quick Question on the [vehicle]',body:'Hi [Name],\n\nThanks for reaching out on the [vehicle]. I am [agent] at Sheehy Nissan of Manassas, and I want to make the first contact useful instead of sending you a form letter.\n\nWhich one matters first: vehicle status, numbers or making sure it is the right fit?\n\nReply with one and I will work that first.\n\n[agent]'},
  'No reply|Value-add follow-up':{subject:'[Name], What Matters Most on the [vehicle]?',body:'Hi [Name],\n\nI know your inbox is busy, so I will make this worth answering.\n\nOn the [vehicle], what is the one thing that will decide it for you: value, comfort, safety, technology, space or something else?\n\nGive me that one priority and I will send you the useful answer, not a brochure.\n\n[agent]'},
  'Review request|Quick review ask':{subject:'⭐ [Name], Your Honest Take on the Experience',body:'Hi [Name],\n\nNow that you have had real time with the [vehicle], I would value your honest take on working with us.\n\nIf you have a minute, share the experience on our review page. Your words help the next shopper know what working with us is actually like.\n\nThank you again,\n[agent]'},
  'Review request|Meant a lot':{subject:'⭐ [Name], I Would Value Your Honest Review',body:'Hi [Name],\n\nYou have had enough time with the [vehicle] to have a real opinion, and I would genuinely value it.\n\nAn honest review of your experience helps other shoppers know what to expect before they walk in.\n\nThank you again for trusting me,\n[agent]'}
};
function emailSafety(body){
  var x=clean(body);
  x=x.replace(/good news,?\s+the \[vehicle\] is here and I can have it pulled up for you\.?/gi,'thanks for reaching out on the [vehicle]. I am checking the exact vehicle so I can give you a real status.');
  x=x.replace(/these do not sit long\.?/gi,'I will verify the exact vehicle before I ask you to make plans around it.');
  x=x.replace(/you are the first person I am telling\.?/gi,'I wanted to contact you directly because it matches what you were looking for.');
  x=x.replace(/trade values have been stronger than people expect lately\.?/gi,'I can get you a current appraisal instead of guessing from the market.');
  x=x.replace(/values are decent right now/gi,'I can get a current appraisal');
  return x;
}
function applyEmail(){
  if(typeof EMAILS==='undefined')return;
  EMAILS.forEach(function(x){var k=x.cat+'|'+x.title,o=EMAIL_OVERRIDE[k];if(o){x.subject=o.subject;x.body=o.body;}else{x.subject=clean(x.subject);x.body=emailSafety(x.body);}});
  if(typeof render==='function')render();
}

/* ---------------- Objections: stronger isolation, warmer control ---------------- */
var OBJ_OVERRIDE={
  '"I am just looking"':{
    steps:[
      ['Acknowledge + lower guard','Good. Take a look. I am not going to chase you around the lot.'],
      ['Take useful control','Give me one thing so I can point you correctly: are you replacing something, adding a vehicle or simply learning what is out there?'],
      ['Choice','I can point you at the two best directions and then give you space, or you can wander first and grab me when something catches you. Which works better?']
    ],close:'Give me sixty seconds to point you in the right direction. Then you decide how much help you want.'},
  '"I need to think about it"':{
    steps:[
      ['Acknowledge','Of course. You should think clearly before you make a decision this size.'],
      ['Isolate','Before you go, let us make sure you are thinking about the real issue. Is it the vehicle, the money, the trade or the timing?'],
      ['Prescribe','Good. That is the one thing we work. I do not need to resell you the whole car.']
    ],isolate:'If that one piece were handled to your satisfaction, are you ready to move forward on this vehicle?',close:'Let me work that one piece. If it gets solved, we move. If it does not, you have a clean answer.'},
  '"I need to sleep on it"':{
    steps:[
      ['Acknowledge','That makes sense. I do not want you making a rushed decision.'],
      ['Isolate','I do want you sleeping on the right thing. What is actually unresolved: the vehicle, the money, the trade or the timing?'],
      ['Prescribe','Let us get that one answer clear tonight so tomorrow is a real yes or a real no, not another maybe.']
    ],isolate:'If that one issue were solved tonight, would you still need to sleep on the vehicle?',close:'Give me five minutes to get that one issue clear. Then you decide.'},
  '"I want to do more research"':{
    steps:[
      ['Respect it','Smart. You should verify a purchase this size.'],
      ['Isolate the research','What exact question are you still trying to answer: reliability, ownership cost, features, price or the competitor comparison?'],
      ['Become useful','Good. Let me give you the verified answer on that one thing so your research gets shorter, not longer.']
    ],close:'Give me the one question you still need answered. I will either prove it or tell you I need to verify it.'},
  '"I will come back later"':{
    steps:[
      ['Acknowledge','Absolutely. Before you go, help me make sure I did not miss the real reason.'],
      ['Isolate','What did not line up today: the vehicle, the money or the timing?'],
      ['Prescribe','If it is something we can solve now, I would rather save you another trip than restart this later.']
    ],isolate:'If we solve that one thing right now, is there any other reason you would not move forward today?',close:'Let me work the one issue before you leave. Then you can make the decision with the full picture.'},
  '"I need to talk to my spouse or family"':{
    steps:[
      ['Acknowledge','Absolutely. If they are part of the decision, they deserve the same information you have.'],
      ['Do not make them the messenger','Let us not make you carry the whole presentation home from memory. We can get them on a quick call or set a time for both of you.'],
      ['Confirm your side','Before we do that, if this were only your decision, is this the vehicle you would choose?']
    ],isolate:'If it were only up to you, would you move forward on this one?',close:'Quick call now or a time for both of you to come in, which is easier?'},
  '"Your price is too high"':{
    steps:[
      ['Acknowledge','I hear you. If the number feels high, let us get specific instead of arguing about it.'],
      ['Clarify','Too high compared with what: another written quote, your budget or where you expected this exact vehicle to land?'],
      ['Prescribe','Show me the real comparison or give me the real gap. I will take one clean request to the desk and get you an answer.']
    ],isolate:'If price is the only thing between you and a yes on this vehicle, is everything else right?',close:'Give me the real gap. I will take that one issue to the desk and come back with the answer.'},
  '"Just give me your best price" (phone or text)':{
    steps:[
      ['Reward the directness','Absolutely. You should not have to chase the number.'],
      ['Set the comparison','I can get you verified purchase figures. Are you comparing a written quote on the exact vehicle or setting your budget?'],
      ['Route','Give me the exact vehicle and the comparison you are working from. I will get the desk to build the real figure instead of throwing out a teaser.']
    ],close:'Send me the exact vehicle or quote you are comparing. I will work the real number from there.'},
  '"The payment is too high"':{
    steps:[
      ['Acknowledge','I hear you. The payment has to work in your life after you leave here.'],
      ['Isolate the target','What monthly range feels comfortable? Give me the real target so finance has something useful to work with.'],
      ['Route','If payment is the only issue, I will take that target to finance and let them work the actual structure.']
    ],isolate:'If finance can get the structure into a range you are comfortable with, is this the vehicle you want?',close:'Give me the real comfortable range. I will put that one issue in front of finance.'},
  '"My credit is not good"':{
    steps:[
      ['Acknowledge','I appreciate you being straight with me. We can handle that privately and without judgment.'],
      ['Set the boundary','I am not going to guess at approval, rate or payment. Finance needs the real information before anyone can give you a real answer.'],
      ['Route','Let us make sure we have the right vehicle, then I will get you with finance for the private conversation.']
    ],isolate:'If the finance side comes back workable, is this the vehicle you want?',close:'Let us get the vehicle right first, then I will put you with the right finance person for the real answer.'},
  '"I am comparing the Toyota or Honda"':{
    steps:[
      ['Respect the comparison','Smart. You should compare before you make a decision this size.'],
      ['Discovery','Which exact vehicle and trim are you comparing, and what is going to decide it for you?'],
      ['Differentiate honestly','Good. I will compare those exact points, tell you where the [vehicle] is stronger and tell you where the competitor has the edge. You are going to find out anyway, so I would rather give it to you straight.']
    ],close:'Let us compare the exact vehicles on the things that matter to you, then drive the front-runner. Which one are we comparing against?'},
  '"I hate dealerships, I do not want to be pressured"':{
    steps:[
      ['Acknowledge','I get it. This business earned some of that reputation.'],
      ['Set the contract','Here is how I work: clear answers, real numbers when they are verified and no pretending a bad fit is a good one.'],
      ['Lead without pressure','You control the decision. I will control the process so you do not have to fight your way through it.']
    ],close:'What would make this visit genuinely useful for you today?'},
  '"I do not want to be here all day"':{
    steps:[
      ['Acknowledge','Agreed. Your time matters, and I am going to treat it that way.'],
      ['Set the pace','We confirm the right vehicle, get the real numbers and make a decision. If it works, we move. If it does not, you leave with a clear answer.']
    ],isolate:'Is the [vehicle] already the right car, or do we need to solve that before I ask the desk for numbers?',close:'Let us move. Vehicle first or numbers first, which problem are we solving?'},
  '"Let me think about it" (after seeing the proposal)':{
    steps:[
      ['Acknowledge','Of course. You have the real structure now. Let us make sure we know what actually needs thought.'],
      ['Isolate hard','Is it the vehicle, the price, the payment or the trade? Which one kept this from being a yes?'],
      ['Handle one thing','Good. I am not going to reopen the whole deal. I will work that one issue.']
    ],isolate:'If we solve that one issue, are you ready to move forward today?',close:'If we solve that one issue, are you ready to move forward today? Then stop and let them answer.'}
};
function applyObjections(){
  if(typeof OBJ==='undefined')return;
  OBJ.forEach(function(o){
    var up=OBJ_OVERRIDE[o.obj];
    o.steps=(o.steps||[]).map(function(s){return {lab:s.lab,say:clean(s.say)};});
    if(o.isolate)o.isolate=clean(o.isolate);
    if(o.close)o.close=clean(o.close).replace(/\s*Fair\?$/i,'').replace(/\s*Sound (?:fair|good|okay)\?$/i,'');
    if(up){
      o.steps=up.steps.map(function(p){return {lab:p[0],say:p[1]};});
      if(up.isolate)o.isolate=up.isolate;
      if(up.close)o.close=up.close;
    }
  });
  if(typeof render==='function')render();
}

/* ---------------- Reconnect: keep age logic, upgrade output voice ---------------- */
function polishReconnect(){
  if(page!=='reconnect.html')return;
  var sc=$('scenario')?$('scenario').value:'',ageText=$('agePill')?$('agePill').textContent:'',cold=/9\d day|1\d\d day|2\d\d day|3\d\d day/.test(ageText);
  var c=$('callOut'),vm=$('vmOut'),sms=$('smsOut'),body=$('bodyOut');
  [c,vm,sms,body].forEach(function(e){if(e)e.value=clean(e.value);});
  if(c){
    c.value=c.value.replace(/honestly that is on me, I should have reached back sooner\./gi,'I wanted to reconnect with a purpose instead of pretending the gap did not happen.');
    c.value=c.value.replace(/So no pressure at all\./gi,'I will make this easy.');
    c.value=c.value.replace(/Would it be worth a fresh look this week\?/gi,'Let us decide whether a fresh look is actually worth your time this week.');
    c.value=c.value.replace(/First one to speak loses the slot\./gi,'Then stop talking and let them answer.');
  }
  if(sms&&sc==='pencil')sms.value='Hi '+name()+', '+agent()+' at Sheehy Nissan. You already know the '+vehicle()+' and you already saw the numbers. One question: what kept it from being a yes, the vehicle, the money, the trade or the timing?';
  if(sms&&sc==='quiet')sms.value='Hi '+name()+', '+agent()+' at Sheehy Nissan. We had a real conversation on the '+vehicle()+' and then it went quiet. Did the plan change or is one thing still unresolved?';
  if(sms&&cold)sms.value='Hi '+name()+', '+agent()+' at Sheehy Nissan. It has been a while since we talked about the '+vehicle()+'. I will make this easy: still shopping, already bought or pause this for now?';
}
function bindReconnect(){
  polishReconnect();
  ['scenario','leadDate','dayChips','todChips','dateSel','timeSel'].forEach(function(id){var e=$(id);if(e)e.addEventListener('change',function(){setTimeout(polishReconnect,0);});});
  document.querySelectorAll('[data-f]').forEach(function(e){e.addEventListener('input',function(){setTimeout(polishReconnect,0);});});
  document.addEventListener('click',function(){setTimeout(polishReconnect,0);});
}

/* ---------------- Survey: warm ownership first, still ethical ---------------- */
function polishSurvey(){
  if(page!=='survey.html')return;
  var sc=$('scenario')?$('scenario').value:'pre',N=name(),V=vehicle(),A=agent(),P=number(),call='',vm='',sms='',sub='',email='';
  if(sc==='pre'){
    call='Hi '+N+', '+A+' at Sheehy Nissan. I wanted to check on you, not chase a survey. How is the '+V+' treating you now that you have had a little real time with it?\n\n[Listen.]\n\nGood. Nissan may send a short purchase survey. If it reaches you, answer it based on your real experience. Before that, is there anything from the purchase, paperwork, delivery or vehicle setup that I still need to get handled?';
    vm='Hi '+N+', '+A+' at Sheehy Nissan. I am checking on you and the '+V+' after delivery. Nissan may send a short purchase survey, but my first concern is that nothing from the purchase or delivery is still unfinished. Call or text me at '+P+'.';
    sms='Hi '+N+', '+A+' at Sheehy Nissan. Ownership check first: how is the '+V+' treating you? Nissan may send a short purchase survey. If it does, answer it based on your real experience. Anything from the purchase or delivery I still need to handle?';
    sub='⭐ '+N+', Quick Ownership Check on the '+V;
    email='Hi '+N+',\n\nI wanted to check on you now that you have had real time with the '+V+'. How is everything going?\n\nNissan may send a short purchase survey. If it reaches you, answer it based on your actual experience. More importantly, if anything from the purchase, paperwork, delivery or vehicle setup still needs attention, reply with the one thing and I will work the next step.\n\n'+A;
  }else if(sc==='arrived'){
    call='Hi '+N+', '+A+' at Sheehy Nissan. Quick ownership check on the '+V+'. Nissan may have sent the purchase survey by now. If it reached you, answer it based on your real experience. Before we leave it there, is anything from the purchase, paperwork, vehicle setup or delivery still unresolved?';
    vm='Hi '+N+', '+A+' at Sheehy Nissan. I am checking on you and the '+V+'. Nissan may have sent the purchase survey by now. My main question is whether anything from your purchase or delivery still needs attention. Call or text me at '+P+'.';
    sms='Hi '+N+', Nissan may have sent the purchase survey by now. Answer it based on your real experience. More importantly, is anything from the purchase, paperwork, setup or delivery still unresolved?';
    sub='⭐ '+N+', Nissan Survey and One Ownership Check';
    email='Hi '+N+',\n\nNissan may have sent the purchase survey for your '+V+'. If it reached you, answer it based on your real experience.\n\nBefore we leave it there, is anything from the purchase, paperwork, vehicle setup or delivery still unresolved? If yes, tell me the one thing and I will get the right next step moving.\n\n'+A;
  }else if(sc==='notreceived'){
    call='No problem, '+N+'. Do not spend your day hunting for a survey. Check spam or junk and search Nissan once. If it is not there, leave it alone. While I have you, how is the '+V+' treating you and is there anything you need from me?';
    vm='Hi '+N+', '+A+' at Sheehy Nissan. If you have not seen the Nissan survey, check spam or junk and search Nissan once. No need to chase it beyond that. I also want to make sure the '+V+' is treating you well. Call or text me at '+P+' if you need anything.';
    sms='No problem if the Nissan survey has not shown up, '+N+'. Check spam or junk and search Nissan once. If it is not there, leave it alone. How is the '+V+' treating you?';
    sub='⭐ '+N+', About the Nissan Survey';
    email='Hi '+N+',\n\nNo problem if the Nissan survey has not shown up. Check spam or junk and search your inbox for Nissan once. If it is not there, I would leave it alone rather than chase it.\n\nIf it arrives later, answer it based on your real experience. In the meantime, if anything with the '+V+' needs attention, reply to me first.\n\n'+A;
  }else if(sc==='issue'){
    var concern=$('concern')?$('concern').value:'sales',label=concern==='finance'?'financing or paperwork':concern==='features'?'features or controls':concern==='condition'?'vehicle condition at delivery':concern==='other'?'what happened':'sales experience';
    call='Thank you for telling me, '+N+'. Forget the survey for now. I want the actual issue clear. When you say there was a problem with '+label+', what specifically happened?\n\n[Listen. Clarify.]\n\nOther than that, is anything else still unresolved?\n\nGot it. I am going to get the right person involved rather than guess, and I will own the follow-up with you.';
    vm='Hi '+N+', '+A+' at Sheehy Nissan. I am following up on the concern you raised about '+label+'. I want to understand it correctly and get it to the right person. Call or text me at '+P+'.';
    sms='Thanks for telling me, '+N+'. Forget the survey for now. What specifically happened with '+label+'? Give me the clean version and I will get the right next step moving.';
    sub='🔧 '+N+', Let’s Get the Open Issue Handled';
    email='Hi '+N+',\n\nThank you for telling me about the issue with '+label+'. I am not going to turn this into a survey conversation while something is unresolved.\n\nReply with what specifically happened and what you expected instead. I will get the right person involved and own the follow-up with you.\n\n'+A;
  }else{
    call='Hi '+N+', '+A+' at Sheehy Nissan. Thank you for taking the time to complete Nissan\'s survey. I am not calling for the score. I am checking on the '+V+'. What can I make easier for you now: a feature question, service direction or something else?';
    vm='Hi '+N+', '+A+' at Sheehy Nissan. Thank you for taking the time to complete Nissan\'s survey. I am checking on you and the '+V+' now. Call or text me at '+P+' if anything comes up.';
    sms='Hi '+N+', thank you for taking the time to complete Nissan\'s survey. I do not need the score. How is the '+V+' treating you, and is there anything you need from me?';
    sub='🔑 '+N+', Thank You and a Quick '+V+' Check';
    email='Hi '+N+',\n\nThank you for taking the time to complete Nissan\'s survey. I appreciate the feedback and I am not asking what score you gave.\n\nHow is the '+V+' treating you? If a feature, service or ownership question comes up, reply to me first and I will help get it pointed in the right direction.\n\n'+A;
  }
  if($('callOut'))$('callOut').textContent=call;if($('vmOut'))$('vmOut').textContent=vm;if($('smsOut'))$('smsOut').textContent=sms;if($('subjOut'))$('subjOut').textContent=sub;if($('emailOut'))$('emailOut').textContent=email;
}
function bindSurvey(){polishSurvey();['scenario','concern'].forEach(function(id){var e=$(id);if(e)e.addEventListener('change',function(){setTimeout(polishSurvey,0);});});document.querySelectorAll('[data-f]').forEach(function(e){e.addEventListener('input',function(){setTimeout(polishSurvey,0);});});}

/* ---------------- After Sale: relationship warmth + confident asks ---------------- */
function afterSaleText(title,kind){
  var N=name(),V=vehicle(),A=agent(),P=number();
  var map={
    'Issue recovery first':{
      call:'Hi '+N+', '+A+' at Sheehy Nissan. Thank you for telling me something is still open on the '+V+'. I want to get the issue handled, not explain around it. Walk me through exactly what is unresolved. I will get the right next step moving from there.',
      vm:'Hi '+N+', '+A+' at Sheehy Nissan. I am following up on the open item with your '+V+'. I want to understand it clearly and get it to the right person. Call or text me at '+P+'.',
      sms:'Hi '+N+', '+A+' at Sheehy Nissan. I want to get the open item on your '+V+' handled. What is the one part that is still unresolved?',
      email:'Hi '+N+',\n\nThank you for telling me something is still open on your '+V+'. I want to get the actual issue handled.\n\nReply with the one part that is still unresolved and I will get the correct next step moving.\n\n'+A
    },
    'First-night check':{sms:'Hi '+N+', '+A+' here. First night with the '+V+'. What already feels great, and what is the one thing you want me to clear up while it is still fresh?',email:'Hi '+N+',\n\nFirst night with the '+V+'. I wanted to check the handoff while everything is still fresh.\n\nWhat already feels great, and what is the one thing you want me to clear up?\n\n'+A},
    '24-hour ownership call':{call:'Hi '+N+', '+A+' at Sheehy Nissan. You have had your first real day with the '+V+'. Give me the real read: what is better than expected, and what still needs an explanation?',vm:'Hi '+N+', '+A+' at Sheehy Nissan. I wanted to catch you after your first real day with the '+V+' and make sure the vehicle and the handoff feel right. Call or text me at '+P+'.',sms:'Hi '+N+', first real day with the '+V+'. What is better than expected, and what still needs an explanation? I want anything unclear handled while it is fresh.'},
    'Experience cleanup':{sms:'Hi '+N+', you should be settling into the '+V+' now. What is the one thing with features, controls, paperwork or delivery that still feels unfinished? Tell me and I will work the next step.',email:'Hi '+N+',\n\nYou have had a few days with the '+V+'. I want the purchase to feel finished, not just the paperwork.\n\nWhat is the one thing with features, controls, paperwork or delivery that still needs attention? Tell me and I will work it.\n\n'+A},
    'Google experience review':{sms:'Hi '+N+', you have had real time with the '+V+' now, so I would value your honest take on working with us. If you have a minute, share the experience on Google. Your words help the next shopper know what to expect.',email:'Hi '+N+',\n\nYou have had real time with the '+V+' now, so I would value your honest take on working with us.\n\nIf you have a minute, share the experience on Google. A genuine review helps the next shopper know what working with us is actually like.\n\nThank you again,\n'+A},
    'Referral conversation':{call:'Hi '+N+', you have had the '+V+' about a month now, and I want to ask you one direct favor. If I earned your trust, who is the first person you would feel comfortable introducing me to when they need a vehicle? You make the introduction. I will take care of the rest.',vm:'Hi '+N+', '+A+' at Sheehy Nissan. I wanted to check on the '+V+' and ask you one quick favor. Call or text me at '+P+' when you have a second.',sms:'Quick favor, '+N+'. If I earned your trust, who is the first person you would feel comfortable introducing me to when they need a vehicle? You make the introduction and I will take care of the rest.',email:'Hi '+N+',\n\nYou have had the '+V+' about a month now. If I earned your trust, who is the first person you would feel comfortable introducing me to when they need a vehicle?\n\nYou do not have to sell them on me. Make the introduction and I will take care of the rest.\n\n'+A},
    '90-day ownership check':{call:'Hi '+N+', you have had the '+V+' long enough for the honeymoon period to wear off. Give me the real ownership answer now: what is one thing you love and one thing you would change?',vm:'Hi '+N+', '+A+' at Sheehy Nissan. I am checking in around the 90-day mark on the '+V+'. I want the real ownership read now. Call or text me at '+P+'.',sms:'About 90 days with the '+V+' now. Give me the real ownership read: one thing you love and one thing you would change?'},
    'Six-month relationship check':{call:'Hi '+N+', '+A+' at Sheehy Nissan. Six months already. I am not manufacturing a sales reason. I am checking whether there is anything automotive I can make easier for you right now with the '+V+', service or a question.',sms:'Hi '+N+', six-month check from '+A+'. Anything automotive I can make easier right now with the '+V+', service or a question?',email:'Hi '+N+',\n\nSix months with the '+V+' already. I am not reaching out to manufacture a sales reason. I want to stay useful.\n\nAnything automotive I can make easier right now with the vehicle, service or a question?\n\n'+A}
  };
  return map[title]&&map[title][kind]||'';
}
function patchAfterSale(){
  if(page!=='after-sale.html')return;
  var title=$('workTitle')?$('workTitle').textContent.trim():'';
  document.querySelectorAll('#scripts .script-card').forEach(function(card){
    var kind=['call','vm','sms','email','mail','gift'].filter(function(k){return card.classList.contains(k);})[0]||'';
    var body=card.querySelector('.body'),sub=card.querySelector('.subject'),replacement=afterSaleText(title,kind);
    if(replacement&&body)body.textContent=replacement;
    else if(body)body.textContent=clean(body.textContent);
    var b=card.querySelector('.copy-btn');
    if(b)b.onclick=function(){var txt=(sub&&sub.textContent?'Subject: '+sub.textContent+'\n\n':'')+(body?body.textContent:'');if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(function(){var o=b.textContent;b.textContent='Copied';setTimeout(function(){b.textContent=o;},850);});};
  });
}
function bindAfterSale(){
  patchAfterSale();var host=$('scripts');if(host&&g.MutationObserver){var q=false;new MutationObserver(function(){if(q)return;q=true;setTimeout(function(){q=false;patchAfterSale();},0);}).observe(host,{childList:true,subtree:true});}
  document.addEventListener('change',function(){setTimeout(patchAfterSale,0);});
}

/* ---------------- Sister Store: preserve truth, add warmer delivery ---------------- */
function patchSister(){
  if(page!=='sister-store.html')return;
  document.querySelectorAll('#scripts .card').forEach(function(card){
    var body=card.querySelector('.body');if(!body)return;var t=clean(body.textContent);
    if(card.classList.contains('call')&&!/wanted you hearing|appreciate|you are right/i.test(t))t=t.replace(/^(Hi [^.]+\.)\s*/,'$1 I wanted you hearing the update from me directly. ');
    if(card.classList.contains('sms')&&!/wanted you hearing|you are right/i.test(t))t=t.replace(/^(Hi [^.]+\.)\s*/,'$1 I wanted to give you the clean update directly. ');
    body.textContent=t;
    var b=card.querySelector('.copy');var sub=card.querySelector('.subject');if(b)b.onclick=function(){var txt=(sub&&sub.textContent?'Subject: '+sub.textContent+'\n\n':'')+body.textContent;if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(function(){var o=b.textContent;b.textContent='Copied';setTimeout(function(){b.textContent=o;},850);});};
  });
}
function bindSister(){patchSister();var h=$('scripts');if(h&&g.MutationObserver){var q=false;new MutationObserver(function(){if(q)return;q=true;setTimeout(function(){q=false;patchSister();},0);}).observe(h,{childList:true,subtree:true});}}

function init(){
  if(page==='sms-library.html')applySms();
  else if(page==='email-library.html')applyEmail();
  else if(page==='objection-library.html')applyObjections();
  else if(page==='reconnect.html')bindReconnect();
  else if(page==='survey.html')bindSurvey();
  else if(page==='after-sale.html')bindAfterSale();
  else if(page==='sister-store.html')bindSister();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})(window);
