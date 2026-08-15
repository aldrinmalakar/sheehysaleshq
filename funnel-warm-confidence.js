/* ============================================================
   SHEEHY SALES HQ - warm confidence voice layer

   Final customer-facing voice standard:
   warm human opening -> direct truth -> isolate -> prescribe
   -> clear choice / commitment -> stop.

   This layer adds warmth without making the salesperson passive.
   It never invents inventory, pricing, payments, APR, approval,
   incentives, scarcity, transfer status or manager outcomes.
============================================================ */
(function(g){
'use strict';
var F=g.SHQFunnel;
if(!F||!Array.isArray(F.scenarios))return;

var priorResolve=typeof F.resolveScenario==='function'?F.resolveScenario:null;
var FIELDS=['call','vm','sms','email','video'];

var WARM={
  /* Owner / outbound */
  'owner-first-contact':'I appreciate you taking the call. I want to make this useful, not turn it into a sales pitch.',
  'owner-no-answer':'I know an unexpected dealership call is easy to ignore, so I will keep this simple.',
  'owner-wants-value':'That makes sense. If we are talking about your vehicle, you deserve a real number, not a guess.',
  'owner-callback':'Absolutely. I respect your time, so let us make the callback specific and easy.',
  'owner-not-interested':'Understood. I appreciate you being straight with me.',

  /* New lead */
  'fresh-standard':'I appreciate you reaching out. I want to work the part that actually matters to you first.',
  'fresh-email-only':'Thanks for reaching out. I will keep this easy and useful from the first email.',
  'fresh-text-only':'Thanks for reaching out. I will keep this short and work the part you actually need.',
  'availability-first':'You are asking the right question. Let me give you a clean answer and make the next step easy.',
  'price-first':'That makes sense. You should know the real number before you spend time chasing the wrong deal.',
  'test-drive-request':'Absolutely. If you are making time to drive it, I want the visit to be worth the trip.',
  'unit-gone':'I wanted you hearing the update from me directly, not discovering it after you made plans around the vehicle.',

  /* Trying to reach */
  'no-response-day1':'I know your day gets busy, so I will make this easy to answer.',
  'video-email-notice':'I made the video for your request, so I want to make sure it actually reached you.',
  'video-text-notice':'I made the video for your request, so I want to make sure it actually reached you.',
  'final-nudge':'I respect your time, so I am going to make this one easy to answer.',
  'first-voicemail':'I appreciate the opportunity. I will keep this short and useful.',
  'first-no-voicemail':'I appreciate the opportunity. I will keep this short and useful.',
  'bad-contact':'I want to make sure I have the right person before I keep reaching out.',

  /* Engaged remote */
  'wants-details':'Good question. I would rather answer the one thing you care about than bury you in a brochure.',
  'payment-apr':'That makes sense. The payment has to fit your real life, and you deserve the real answer instead of a guess.',
  'trade-value':'I get why you want to know where your trade stands. Let us get you a number we can actually defend.',
  'credit-concern':'I appreciate you being straight with me. We can handle this privately and without judgment.',
  'competitor-shop':'Smart. You should compare before you make a decision this size.',
  'not-ready':'That makes sense. I do not need to force a today decision when your timing is not today.',
  'decision-maker':'Absolutely. If someone else matters in the decision, they deserve the same information you have.',

  /* Appointment */
  'booked':'Perfect. I appreciate you making the time, and I want the visit to feel prepared when you arrive.',
  'day-of':'I appreciate you making the time today. I want your arrival to be simple.',
  'reschedule':'No problem. Things move. Let us put you into a time you can actually keep.',
  'running-late':'Thanks for the heads-up. I would rather adjust around you than have you rushing here.',
  'no-show':'I figured something changed. No hard feelings. Let us get the plan clear so neither of us is guessing.',

  /* Showroom / discovery */
  'just-looking':'Good. You should look before anybody tries to sell you anything. I will give you room and still make the time useful.',
  'price-immediately':'Absolutely. We can get right to the part you came in for and keep the rest simple.',
  'unsure-vehicle':'That is completely fine. My job here is not to force the first car you touched. It is to narrow this down correctly.',
  'decision-maker-absent':'That makes sense. I want the other decision maker getting the same facts, not a secondhand version later.',

  /* Demo / drive */
  'loves-it':'I can see why this one is clicking for you. Let us keep the momentum and make the next decision clean.',
  'unsure-after-drive':'That is useful. I would rather hear the hesitation now than talk past it.',
  'wrong-fit':'Good. Finding out what is wrong with this one saves us from forcing the wrong car.',
  'leave-before-numbers':'I respect that you have somewhere to be. I also do not want you leaving with nothing but a guess in your head.',

  /* Proposal / close */
  'price-high':'I hear you. If the number feels high, let us get specific instead of arguing about it.',
  'payment-high':'I hear you. The payment has to work after you leave here, not just inside the showroom.',
  'trade-low':'I get it. You want to feel your trade was valued fairly, and we should get specific about the gap.',
  'fees':'You are right to ask. You should understand every line before you sign anything.',
  'think-about-it':'Of course. I want you thinking about the real issue, not taking a vague concern home with you.',
  'sleep-spouse':'Absolutely. This is too big a decision for one person to carry back as a message.',
  'ready':'Perfect. You have made the decision. I will stop selling and make the next steps easy.',

  /* After visit / ownership */
  'left-with-numbers':'I appreciate you spending the time with me. You already have the car and the numbers in your head, so let us focus on what actually kept it from being a yes.',
  'ghost-after-visit':'I know life gets busy after you leave the store. I only need to know whether the plan changed or one thing is still unresolved.',
  'sold-thankyou':'Thank you again for trusting me with the purchase. I want you to feel taken care of after the paperwork too.',
  'post-sale-problem':'Thank you for telling me. I want to understand the issue clearly and own the next step with you.',
  'survey':'I appreciate the feedback. My first concern is that the ownership experience is where it should be.',

  /* Long term */
  'bought-elsewhere':'I appreciate you telling me, and I hope the vehicle treats you well.',
  'months-away':'That makes sense. I would rather follow your real timing than chase you every week.',
  'fallback':'Thanks for being straight with me. Let us get the one unresolved piece clear and decide the next move from there.'
};

function clone(o){var x={};Object.keys(o||{}).forEach(function(k){x[k]=o[k];});return x;}
function customerTrack(s){
  s=String(s||'').trim();
  if(!s)return false;
  return !/^(Not a |No voicemail|No SMS|No email|No live-call|No phone number|Use the Survey page|Email-only lead|Text-only lead|Do not leave|Do not text|Internal:|Route:)/i.test(s);
}
function alreadyWarm(s,w){
  var t=String(s||'').toLowerCase();
  if(!w)return true;
  var keys=['appreciate','that makes sense','makes sense','good question','you are asking the right question','you\'re asking the right question','thanks for','thank you','i hear you','i get it','absolutely','no hard feelings','i respect your time','straight with me'];
  for(var i=0;i<keys.length;i++)if(t.indexOf(keys[i])>-1)return true;
  return false;
}
function warmShort(w){
  if(!w)return '';
  return w.replace(/ I want[^.]*\./g,'').replace(/ Let us[^.]*\./g,'').trim();
}
function afterGreetingEmail(body,sentence){
  if(!sentence)return body;
  var s=String(body||''),parts=s.split('\n\n');
  if(parts.length>1){parts.splice(1,0,sentence);return parts.join('\n\n');}
  return sentence+'\n\n'+s;
}
function afterFirstSentence(text,sentence){
  if(!sentence)return text;
  var s=String(text||''),m=s.match(/^(.+?[.!?])\s+/);
  if(m)return m[1]+' '+sentence+' '+s.slice(m[0].length);
  return sentence+' '+s;
}
function beforeCallback(text,sentence){
  var s=String(text||''),marks=[' Call or text me',' Call me',' Text me',' Reply'];
  for(var i=0;i<marks.length;i++){
    var at=s.lastIndexOf(marks[i]);
    if(at>0)return s.slice(0,at)+' '+sentence+s.slice(at);
  }
  return s+' '+sentence;
}
function cleanWeak(s){
  var out=String(s||'');
  out=out.replace(/\bjust checking in\b/gi,'checking in with a purpose');
  out=out.replace(/\bjust following up\b/gi,'following up with a clear next step');
  out=out.replace(/\bif you want\b/gi,'when it makes sense');
  out=out.replace(/\bif you would like\b/gi,'when it makes sense');
  out=out.replace(/\bwould you be open to\b/gi,'does it make sense to');
  out=out.replace(/\blet me know\.?$/gi,'Tell me which direction fits.');
  out=out.replace(/\bno pressure(?: at all)?[,.]?\s*/gi,'');
  return out.replace(/[ \t]{2,}/g,' ').replace(/ \n/g,'\n');
}
function addWarmth(text,id,channel){
  if(!customerTrack(text))return text;
  var w=WARM[id]||'';
  if(!w||alreadyWarm(text,w))return cleanWeak(text);
  var sentence=channel==='sms'||channel==='vm'?warmShort(w):w;
  if(!sentence)return cleanWeak(text);
  if(channel==='email')return cleanWeak(afterGreetingEmail(text,sentence));
  if(channel==='vm')return cleanWeak(beforeCallback(text,sentence));
  return cleanWeak(afterFirstSentence(text,sentence));
}
function polishScenario(x,id){
  var o=clone(x||{}),sid=id||o.id||'';
  for(var i=0;i<FIELDS.length;i++){
    var k=FIELDS[i];
    if(o[k])o[k]=addWarmth(o[k],sid,k);
  }
  o.voiceStandard='warm-confidence';
  return o;
}

/* Mutate canonical scenarios so SMS / Email / Reconnect adapters inherit the voice. */
F.scenarios.forEach(function(s){
  var p=polishScenario(s,s.id);
  FIELDS.forEach(function(k){if(Object.prototype.hasOwnProperty.call(p,k))s[k]=p[k];});
  s.voiceStandard='warm-confidence';
});

/* Also polish final resolved variants on Funnel after channel/context/distance layers. */
F.resolveScenario=function(raw,ctx){
  var base=priorResolve?priorResolve(raw,ctx):clone(raw);
  var id=base&&base.id||raw&&raw.id||'';
  return polishScenario(base,id);
};

/* Small helpers used by current communication pages and future tools. */
g.SHQSalesVoice=g.SHQSalesVoice||{};
g.SHQSalesVoice.standard='Warm human opening -> direct truth -> isolate -> prescribe -> choice / commitment -> stop.';
g.SHQSalesVoice.cleanWeak=cleanWeak;
g.SHQSalesVoice.addWarmth=addWarmth;
g.SHQSalesVoice.warmthFor=function(id){return WARM[id]||'';};
})(window);
