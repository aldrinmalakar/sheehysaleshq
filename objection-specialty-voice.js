/* SHEEHY SALES HQ - warm-confidence completion pass for secondary objections. */
(function(){
'use strict';
if((location.pathname.split('/').pop()||'').toLowerCase()!=='objection-library.html')return;
if(typeof OBJ==='undefined')return;
var EXTRA={
  '"My car is running fine, I do not need a new one"':{
    steps:[
      ['Respect it','That is a good thing. You should not replace a car that still works for you just because somebody wants to sell you another one.'],
      ['Discover the reason','What would actually have to improve for a change to make sense: reliability, comfort, safety, space, technology or ownership cost?'],
      ['Set the standard','Good. Then that is the test. If another vehicle does not improve that enough to justify the change, keep what you have.']
    ],
    isolate:'If a replacement meaningfully improves that one area and the structure makes sense, would you consider making the change?',
    close:'Let us compare only that one improvement. If the current car still wins, you have your answer.'
  },
  '"This is too much car for me"':{
    steps:[
      ['Acknowledge','That makes sense. I do not want to sell you more vehicle than you actually need.'],
      ['Clarify','When you say too much, do you mean price, size, equipment or just more features than you would use?'],
      ['Redirect precisely','Good. Then we step down for that reason, not randomly. I will show you the closest fit that removes what you do not need without giving up what matters.']
    ],
    isolate:'If I get you the right size and equipment without the extra you do not value, is that the direction you want?',
    close:'Let us step down one level for the exact reason you gave me and compare it.'
  },
  '"My trade is worth more than that"':{
    steps:[
      ['Acknowledge','I get it. You want to feel the vehicle you own was valued fairly.'],
      ['Find the real gap','What number were you expecting, and what are you basing that expectation on?'],
      ['Prescribe one review','If the trade is the only thing between you and a yes, give me the real gap. I will take one clean appraisal question to the right manager instead of arguing with you about it.']
    ],
    isolate:'If the trade is the only issue, is everything else on the vehicle and the deal right?',
    close:'Give me the real trade gap. I will get you a clean answer on that one issue.'
  },
  '"I saw a lower payment advertised"':{
    steps:[
      ['Respect the comparison','Absolutely. Send me the ad or show it to me. We should compare the same structure before either of us calls one payment better.'],
      ['Make it apples to apples','Advertised payments can depend on the exact vehicle, term, money down, credit tier, taxes and other conditions. I am not going to guess which of those applies.'],
      ['Prescribe','Let us put the advertised structure next to the actual structure you are considering and have finance verify the real comparison.']
    ],
    isolate:'If the real apples-to-apples payment works in your comfortable range, is this the vehicle you want?',
    close:'Show me the ad. We will compare the actual terms instead of comparing a headline to a different deal.'
  },
  '"I am upside down on my trade"':{
    steps:[
      ['Acknowledge','I appreciate you saying it upfront. That is something we can evaluate, but nobody should guess at the gap.'],
      ['Get the real facts','We need the real payoff and a real appraisal first. Until we have both, any equity number is just speculation.'],
      ['Keep control','Let us get those two facts, then the desk and finance can show you what structures are actually available.']
    ],
    isolate:'If the trade situation can be structured in a way you are comfortable with, is the replacement vehicle itself right?',
    close:'First payoff and appraisal. Then we look at the real structure, not a guessed equity number.'
  },
  '"I have little or no money down"':{
    steps:[
      ['Acknowledge','Understood. Let us work with the real constraint instead of pretending it is not there.'],
      ['Clarify','Is keeping cash upfront low a preference, or is that a hard requirement for the purchase?'],
      ['Route correctly','Good. I will not promise a structure or approval before finance reviews it. We get the right vehicle first, then let finance work the real options around that constraint.']
    ],
    isolate:'If finance finds a workable structure with the upfront cash you are comfortable using, is this the vehicle you want?',
    close:'Let us keep the vehicle fit right and give finance the real cash constraint to work from.'
  },
  '"I do not have a co-signer"':{
    steps:[
      ['Acknowledge','Understood. Then we plan around you, not around a person who is not part of the deal.'],
      ['Set the boundary','I am not going to guess at approval, rate or payment. Finance needs to review the actual application and structure.'],
      ['Prescribe','Let us make sure the vehicle itself is right, then I will get you into the private finance conversation for the real answer.']
    ],
    isolate:'If finance can structure something workable with only you on the application, is this the vehicle you want?',
    close:'We work the deal around the real applicant. Vehicle first, then the finance review.'
  },
  '"I heard bad things about Nissan"':{
    steps:[
      ['Do not get defensive','Fair concern. If you heard something that could affect ownership, we should talk about the specific issue instead of brushing it off.'],
      ['Get specific','What exactly did you hear: reliability, a particular transmission, resale, service or something else?'],
      ['Verify the actual concern','Good. Let us verify that exact concern on the model and year you are considering. If there is a real disadvantage, I will tell you. If the concern does not apply, I will show you why.']
    ],
    isolate:'If we verify that concern to your satisfaction, is there anything else keeping the vehicle off your list?',
    close:'Give me the exact concern. We will verify that one before we talk about anything else.'
  },
  '"The other brand has better resale"':{
    steps:[
      ['Respect the point','That can be a real advantage depending on the exact models and how long you plan to own them. I am not going to pretend resale never matters.'],
      ['Make it specific','Which exact vehicle are you comparing, and how long do you normally keep a car?'],
      ['Broaden correctly','Then let us compare the ownership picture that matters to you: purchase value, expected use, features you care about, operating costs we can verify and the resale evidence you are using.']
    ],
    isolate:'If the total ownership case still favors this vehicle for the way you will use it, are you comfortable choosing it even if the competitor has a resale advantage?',
    close:'Show me the exact competitor and the resale source you are using. We will compare it honestly.'
  },
  '"I want to drive it alone"':{
    steps:[
      ['Acknowledge','I get it. Sometimes you need quiet to feel the car without somebody talking in your ear.'],
      ['Protect the experience','I can keep the drive quiet and let the vehicle speak for itself. If driving completely alone is important, I need to confirm what we can accommodate before I promise it.'],
      ['Set the useful test','Either way, use the drive to answer the things that matter to you: visibility, comfort, power, braking, noise and fit.']
    ],
    close:'Tell me what you need from the drive, including whether being completely alone is a must-have, and I will set up the best option we can verify.'
  }
};
OBJ.forEach(function(o){
  var x=EXTRA[o.obj];if(!x)return;
  o.steps=x.steps.map(function(p){return {lab:p[0],say:p[1]};});
  if(x.isolate)o.isolate=x.isolate;
  if(x.close)o.close=x.close;
});
if(typeof render==='function')render();
})();
