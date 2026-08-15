/* SHEEHY SALES HQ - warm-confidence + safety pass for local Email Library templates. */
(function(){
'use strict';
if((location.pathname.split('/').pop()||'').toLowerCase()!=='email-library.html')return;
var queued=false;
var WARM={
  'New lead':'I appreciate you reaching out. I want to make the first response useful, not bury you in information.',
  'No reply':'I know your inbox gets busy, so I will make this easy to answer.',
  'Price shopper':'You should know what you are comparing before you spend time chasing the wrong deal.',
  'Payment focused':'That makes sense. The payment has to fit your real life, and you deserve the real answer instead of a guess.',
  'Trade interest':'I get why you want to know where the trade stands before you make a bigger decision.',
  'Credit rebuild':'I appreciate you being straight with me. We can keep the conversation private and work from real information.',
  'Family decision':'If other people matter in the decision, I want everyone working from the same information.',
  'Competitor compare':'Smart. You should compare before you make a decision this size.',
  'Appt confirm':'I appreciate you making the time, and I want the visit to feel prepared when you arrive.',
  'Appt reminder':'I appreciate you making the time today. I want your arrival to be simple.',
  'No-show':'I figured something changed. No hard feelings. Let us get the plan clear so neither of us is guessing.',
  'Be-back':'I appreciate the time you spent with me. I do not need to resell you the whole vehicle.',
  'After test drive':'You have had a little time since the drive, so I want the real read now.',
  'Left with proposals':'You already have the vehicles and the numbers in your head, so let us focus on what is actually unresolved.',
  'Got home safe':'I appreciated you spending the time with me today. This note is simply to make sure you got home safely.',
  'Sold or swap':'I wanted you to hear the update from me directly before you made any plans around the original vehicle.',
  'Reconnect':'It has been a little while, so I will make this easy and respect where your plans are now.',
  'Referral':'If I earned your trust, the best compliment is an introduction to someone you care about.',
  'Post-sale':'Thank you again for trusting me with the purchase. I want the ownership side to feel taken care of too.',
  'Review request':'I appreciate the trust you put in me, and I would value your honest take on the experience.',
  'Service to sales':'While the vehicle is already here, I can make the information useful without turning the service visit into a sales pitch.',
  'Owner equity':'If we are talking about your current vehicle, you deserve a real value instead of a market guess.',
  'Lease end':'I want the lease-end choices clear before timing makes the decision for you.',
  'End of month':'I would rather work the current facts with you than sell you a calendar date.',
  'Model-year change':'If you are comparing model years, I want the real differences and current numbers clear.',
  'New inventory':'I wanted to contact you directly because this may line up with what you were looking for.',
  'Fresh offers':'If a current program can help, I want it verified before I put it in front of you.',
  'Tax season':'If you are considering putting refund money toward a vehicle, I want the vehicle and structure to make sense first.',
  'Holiday event':'If you are planning to shop during the event, I want the visit focused rather than crowded and random.',
  'Weather':'If bad-weather confidence is part of the reason you are shopping, let us solve that exact problem.',
  'Fuel and EV':'If fuel cost is driving the conversation, I want to match the vehicle to your actual daily use instead of selling a powertrain.',
  'High trade values':'If you are curious about the current vehicle value, I would rather get a real appraisal than repeat a market headline.',
  'Ownership check-in':'I am reaching out to stay useful, not to manufacture a reason to sell you another car.',
  'First-time buyer':'A first purchase should feel clear. I will explain the process and still help you make a decision.',
  'Rideshare and delivery':'For the miles you drive, the right vehicle has to make sense in the real world, not just on a brochure.',
  'Military and government':'I appreciate your time, and I will keep the process clear and verify any program before I quote it.'
};
function replaceText(t){
  var x=String(t||'');
  x=x.replace(/We are at a point in the month where I have a little more room to work for you on the \[vehicle\]\.?/gi,'I can verify the current programs and numbers on the [vehicle] and tell you exactly where it stands today.');
  x=x.replace(/If you were close before, this is a good week to talk\.?/gi,'If the [vehicle] is still in play, let us work the current facts instead of guessing what timing may do.');
  x=x.replace(/When that happens there is usually good movement on the current ones[^.]*\./gi,'If you are comparing model years, I can verify the current vehicles and numbers and show you the real difference.');
  x=x.replace(/These tend not to sit long\.?/gi,'I will verify the exact vehicle before I ask you to make plans around it.');
  x=x.replace(/I can hold it briefly and send you a couple photos/gi,'I can verify the exact one and send you a couple photos');
  x=x.replace(/Some new offers just came through this month that could work in your favor on the \[vehicle\]\.?/gi,'There may be current programs on the [vehicle] worth reviewing, and I will verify what actually applies before I quote anything.');
  x=x.replace(/a few things changed this month that might help on the \[vehicle\]\.?/gi,'I can verify the current programs on the [vehicle] and give you the clean answer.');
  x=x.replace(/Trade values have been stronger than people expect lately\.?/gi,'I can get you a current appraisal instead of guessing from a market headline.');
  x=x.replace(/Your \[current\] may be worth more right now than you think\.?/gi,'If you are curious what the [current] is worth today, I can get you a current appraisal.');
  x=x.replace(/The \[vehicle\] is built for the kind of miles you put on it\.?/gi,'For the miles you put on, we should judge the [vehicle] on fuel use, comfort, maintenance and downtime instead of a slogan.');
  x=x.replace(/a newer one may land closer to what you expect than you would guess\.?/gi,'I can show you what a change would actually look like with verified numbers.');
  x=x.replace(/\bno pressure(?: at all)?[,.]?\s*/gi,'');
  x=x.replace(/\bWant me to put something together for you\?/gi,'Are you still close enough to make a decision if the verified numbers make sense?');
  x=x.replace(/Want me to do that and set a time for you to look\?/gi,'Do you want the details first or should I set a time for you to see it?');
  x=x.replace(/\bWould you be open to\b/gi,'Does it make sense to');
  x=x.replace(/\bif you want\b/gi,'when it makes sense');
  x=x.replace(/[ \t]{2,}/g,' ');
  return x;
}
function addWarmth(body,cat){
  var line=WARM[cat]||'',x=String(body||'');if(!line||x.indexOf(line)>-1)return x;
  if(/I appreciate|I would value|Thank you|Thanks for|That makes sense|I understand|I get why|Smart\.|Good question|I wanted you to hear|I know your inbox|No hard feelings/i.test(x))return x;
  var parts=x.split('\n\n');
  if(parts.length>1){parts.splice(1,0,line);return parts.join('\n\n');}
  return line+'\n\n'+x;
}
function patch(){
  document.querySelectorAll('#grid .card').forEach(function(card){
    if(card.dataset&&card.dataset.canonicalWordtrack)return;
    var body=card.querySelector('textarea.body'),tag=card.querySelector('.tag');if(!body)return;
    var next=addWarmth(replaceText(body.value),tag?tag.textContent.trim():'');
    if(next!==body.value)body.value=next;
  });
}
function schedule(){if(queued)return;queued=true;setTimeout(function(){queued=false;patch();},0);}
patch();
var grid=document.getElementById('grid');if(grid&&window.MutationObserver)new MutationObserver(schedule).observe(grid,{childList:true,subtree:true});
document.addEventListener('input',schedule);document.addEventListener('change',schedule);document.addEventListener('click',schedule);
})();
