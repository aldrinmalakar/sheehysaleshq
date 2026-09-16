/* ============================================================
   SHEEHY SALES HQ - objection negotiation voice

   Operational pattern:
   label -> calibrated question -> isolate -> reframe / certainty loop -> close.
   Mirrors and no-oriented questions are used selectively, not mechanically.
============================================================ */
(function(){
'use strict';
if((location.pathname.split('/').pop()||'').toLowerCase()!=='objection-library.html'||typeof OBJ==='undefined')return;
function set(key,cfg){var o=OBJ.find(function(x){return x.obj===key;});if(!o)return;if(cfg.real)o.real=cfg.real;if(cfg.hold)o.hold=cfg.hold;if(cfg.steps)o.steps=cfg.steps.map(function(x){return {lab:x[0],say:x[1]};});if(cfg.isolate)o.isolate=cfg.isolate;if(cfg.close)o.close=cfg.close;}
set('"I am just looking"',{
  real:'They want control of the interaction before they are willing to reveal buying intent.',
  hold:'Curious tone. Do not pitch. Give them room, then earn one useful answer.',
  steps:[
    ['Label','Sounds like you want to look without somebody turning it into a sales presentation.'],
    ['Calibrated question','What caught your eye enough to come in today?'],
    ['Low-friction permission','Would it be a bad idea if I showed you the two differences that actually matter, then got out of your way?']
  ],
  isolate:'What would have to be true for something here to become worth a serious look?',
  close:'Good. Let me show you only that. Then you can decide whether we keep going.'
});
set('"I need to think about it"',{
  real:'“Think about it” is a stall until the unresolved issue becomes specific.',
  hold:'Do not answer a vague objection. Label it, make it concrete, then isolate it.',
  steps:[
    ['Label','It sounds like there is still one part of this that does not feel settled.'],
    ['Calibrated question','What is the one thing you would need to know or see before you could be comfortable deciding?'],
    ['Mirror + silence','Repeat the key phrase they give you in two or three words, then stop talking. Let them expand it.']
  ],
  isolate:'If we solve that one issue, what else would still keep you from moving forward?',
  close:'Then let us solve that one thing now. If it clears, we finish the deal. If it does not, you have your answer.'
});
set('"I need to sleep on it"',{
  real:'They want distance from the decision because something still feels uncertain.',
  hold:'Slow down. Do not challenge the desire to sleep on it; uncover what tomorrow is supposed to change.',
  steps:[
    ['Label','Sounds like you do not want to make the call while something still feels uncertain.'],
    ['Calibrated question','What specifically are you hoping feels different tomorrow?'],
    ['Clarify','Is that about the vehicle, the money or the timing?']
  ],
  isolate:'If that piece were resolved tonight, what else would you need to sleep on?',
  close:'Let us get that piece clear before you leave. Then if you still want the night, you are thinking about a real decision instead of an unknown.'
});
set('"I want to do more research"',{
  real:'They are not yet certain enough in the vehicle, the deal or the information they have.',
  hold:'Do not attack research. Find out what they are still trying to prove or disprove.',
  steps:[
    ['Label','Sounds like you are trying to make sure you do not miss something important.'],
    ['Calibrated question','What are you still trying to prove or disprove before you can decide?'],
    ['Build certainty','Good. Let us compare that exact point with the real vehicle and the real numbers instead of adding more random information.']
  ],
  isolate:'If that research question checks out the way you need it to, what else would still be in the way?',
  close:'Let us answer that one first. If I cannot make it clearer, keep researching. If I can, we move forward.'
});
set('"I will come back later"',{
  real:'They are exiting before the real barrier has been named.',
  hold:'Do not chase them toward the door. Label the hesitation and make the exit reason specific.',
  steps:[
    ['Label','It sounds like there is a reason finishing this now does not make sense yet.'],
    ['Calibrated question','What is the biggest thing stopping you from finishing it today?'],
    ['Mirror + isolate','Mirror the answer, let them expand it, then ask whether anything else is behind it.']
  ],
  isolate:'If we solve that one thing, what else would keep you from wrapping this up today?',
  close:'Would it be a bad idea to solve that before you leave, so you know whether coming back is even necessary?'
});
set('"I need to talk to my spouse or family"',{
  real:'The decision is not fully aligned yet. The goal is to understand what the absent decision-maker needs, not fight their involvement.',
  hold:'Respect the decision structure, then keep control by making the missing person’s criteria explicit.',
  steps:[
    ['Label','Sounds like you do not want to make the call without everyone who matters being comfortable with it.'],
    ['Calibrated question','What would they need to see or hear before they could be comfortable saying yes?'],
    ['Bring the real issue forward','And if they were completely comfortable with it, what would still be holding you back?']
  ],
  isolate:'So if they are comfortable and there is nothing else unresolved for you, is this the vehicle you want?',
  close:'Would it be a bad idea to get them into the same conversation now, or set a time when everyone can look at the same information together?'
});
set('"Your price is too high"',{
  real:'The customer either has a real comparison, a target, or insufficient certainty that this vehicle is worth the gap.',
  hold:'Do not defend the price and do not discount against a vague statement. Make the comparison concrete first.',
  steps:[
    ['Label','Sounds like the number landed higher than you expected.'],
    ['Calibrated question','Compared to what: the same exact vehicle, a written offer, or a target you had in mind?'],
    ['Certainty loop','Good. Let us compare the actual vehicle, equipment, condition, fees and trade structure that affect the real difference.']
  ],
  isolate:'Other than price, what else would have to be right for you to move forward?',
  close:'If the real apples-to-apples comparison gets into a range you can justify, is there anything else that stops the deal?'
});
set('"My trade is worth more than that"',{
  real:'The appraisal missed the customer’s expectation or another source has anchored them higher.',
  hold:'Do not insult the vehicle or defend the appraisal. Find the expectation and its source, then isolate the trade gap.',
  steps:[
    ['Label','Sounds like the appraisal came in well below what you expected.'],
    ['Calibrated question','What value were you expecting, and what are you basing that on?'],
    ['Isolate the hinge','If we get the trade side resolved, what else about the vehicle or deal would still need work?']
  ],
  isolate:'If the trade is the only gap, is everything else right enough for you to move forward?',
  close:'Give me the real gap and the source behind it. I will take one clean appraisal question back instead of arguing around it.'
});
set('"I saw a lower payment advertised"',{
  real:'The ad created an anchor, but the underlying term, cash, vehicle and qualification structure may not match.',
  hold:'Do not explain around an ad you have not seen. Get the exact structure and compare it line by line.',
  steps:[
    ['Label','Sounds like that advertised payment set a very different expectation.'],
    ['Calibrated question','What exact vehicle, term, cash down and qualification assumptions are in that ad?'],
    ['Proof','Show me the ad. We will compare the same structure instead of comparing a headline to a different deal.']
  ],
  isolate:'If the real apples-to-apples structure lands in a range you are comfortable with, is this the vehicle you want?',
  close:'Let us put the ad and the real structure side by side. Then we know whether there is actually a gap.'
});
set('"I am upside down on my trade"',{
  real:'They are worried the trade position will make the move financially unattractive or impossible.',
  hold:'Separate fear from facts. Get payoff and appraisal before discussing the size of the problem.',
  steps:[
    ['Label','Sounds like the concern is making a move without making the negative equity situation worse.'],
    ['Calibrated question','What payoff are you working with right now?'],
    ['Get the second fact','Good. The other number we need is the real appraisal. Until we have both, we do not actually know the gap.']
  ],
  isolate:'If the trade position can be structured in a way you are comfortable with, is the replacement vehicle itself right?',
  close:'Let us get payoff and appraisal first. Then we make the decision on the real gap, not the fear of the gap.'
});
set('"I have little or no money down"',{
  real:'Upfront cash is a hard constraint or a strong preference; the actual finance structure is still unknown.',
  hold:'Treat the constraint as useful information, not a problem to argue with.',
  steps:[
    ['Label','Sounds like keeping the upfront cash low is important.'],
    ['Calibrated question','What is the most cash you would actually be comfortable using if the rest of the deal made sense?'],
    ['Qualify the vehicle decision','If finance can structure something workable around that constraint, is this the vehicle you want?']
  ],
  isolate:'Other than cash down, what else would have to be right for you to move forward?',
  close:'Good. We keep the real cash constraint fixed and let finance work from facts instead of guessing.'
});
/* Give every untouched objection a stronger live-use cue without rewriting its specialty content. */
OBJ.forEach(function(o){if(!o.hold)return;if(!/^Tone:/i.test(o.hold))o.hold='Tone: calm certainty. Listen for the exact words worth mirroring; do not answer until the objection is specific. '+o.hold;});
var spine=document.querySelector('.spine');if(spine)spine.innerHTML='<b>The negotiation spine:</b> <span class="steps">Label → Clarify → Mirror / Listen → Isolate → Reframe → Re-close.</span> Get the customer talking before you start persuading. Build certainty around the exact gap, then ask for the next commitment and stop.';
if(typeof render==='function')render();
})();
