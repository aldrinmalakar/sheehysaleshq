/* ============================================================
   SHEEHY SALES HQ - contextual Funnel personalization

   Model:
   behavior + channel + distance + interaction style
   + decision structure + buying priority

   This layer does not infer identity or demographics. It only uses
   customer behavior and interaction cues selected by the salesperson.
============================================================ */
(function(g){
  'use strict';
  var F=g.SHQFunnel;
  if(!F||!Array.isArray(F.scenarios))return;

  var DEFAULTS={interaction:'neutral',decision:'unknown',priority:'unknown'};
  var state=Object.assign({},DEFAULTS);
  var priorResolve=typeof F.resolveScenario==='function'?F.resolveScenario:null;

  function clone(o){var x={};Object.keys(o||{}).forEach(function(k){x[k]=o[k];});return x;}
  function save(){/* Deliberately session-only: this context belongs to the current customer, not the next one. */}
  function val(id,fb){var e=document.getElementById(id);return e&&e.value?e.value:fb;}
  function fillState(){state.interaction=val('interactionStyle',state.interaction||'neutral');state.decision=val('decisionStructure',state.decision||'unknown');state.priority=val('buyingPriority',state.priority||'unknown');}

  function decisionPhrase(v){
    if(v==='partner')return 'you and your partner';
    if(v==='family')return 'everyone involved in the family decision';
    if(v==='elder')return 'you and the parent or elder involved';
    if(v==='solo')return 'you';
    return '';
  }
  function priorityPhrase(v){
    if(v==='value')return 'the actual value and numbers we can verify';
    if(v==='comfort')return 'comfort, seat fit and how it drives';
    if(v==='reliability')return 'ownership confidence and the facts we can verify';
    if(v==='safety')return 'the safety features actually equipped on the vehicle and how they work';
    if(v==='technology')return 'the technology you will actually use';
    if(v==='space')return 'space, seating and cargo fit';
    if(v==='ownership')return 'ownership-cost factors and programs we can actually verify';
    return '';
  }
  function styleLead(v){
    if(v==='warm')return 'I want this to feel easy and straightforward.';
    if(v==='formal')return 'I want to respect your time and keep the process clear.';
    if(v==='analytical')return 'Let us keep this factual and easy to compare.';
    return '';
  }
  function profileSentence(ctx){
    var p=priorityPhrase(ctx.priority),d=decisionPhrase(ctx.decision),lead=styleLead(ctx.interaction);
    var core='';
    if(p&&d&&ctx.decision!=='solo')core='I will keep the visit focused on '+p+' so '+d+' can evaluate the same things at the same time.';
    else if(p)core='I will keep the visit focused on '+p+' instead of giving you a generic presentation.';
    else if(d&&ctx.decision!=='solo')core='I want '+d+' working from the same information so nobody has to relay the decision secondhand.';
    if(lead&&core)return lead+' '+core;
    return lead||core;
  }
  function distanceLead(ctx){
    if(ctx.interaction==='direct')return 'You are coming a long way. I am not asking you to travel for a maybe.';
    if(ctx.interaction==='warm')return 'You are coming from a good distance away, and I appreciate the effort that takes.';
    if(ctx.interaction==='formal')return 'You are coming from a good distance away, so I want to respect your time and make the visit precise.';
    if(ctx.interaction==='analytical')return 'Because you are coming from a good distance away, I want the important pieces verified upfront.';
    return 'You are coming from a good distance away, and I respect the time that takes.';
  }
  function proofPromise(ctx,detail){
    if(ctx.email||ctx.text)return detail?'I will verify it on the actual vehicle and send you a quick video before you leave home.':'I will verify the exact vehicle again and send you a quick video before you leave home.';
    return detail?'I will verify it on the actual vehicle with you before you leave home.':'I will verify the exact vehicle again with you before you leave home.';
  }
  function distanceSentence(id,ctx,short){
    var p=priorityPhrase(ctx.priority),d=decisionPhrase(ctx.decision),extra='',lead=distanceLead(ctx);
    if(p&&d&&ctx.decision!=='solo')extra=' I will keep the visit centered on '+p+' so '+d+' can make the trip with the same information.';
    else if(p)extra=' I will keep the visit centered on '+p+'.';
    else if(d&&ctx.decision!=='solo')extra=' I will make sure '+d+' has the same information before the trip.';

    var line='';
    if(id==='unit-gone')line=lead+' The exact vehicle is gone, so I will only put a replacement in front of you after I verify it is genuinely worth the trip.';
    else if(id==='availability-first')line=lead+' '+proofPromise(ctx,false)+' I want there to be no avoidable surprises when you arrive.';
    else if(id==='price-first')line=lead+' I understand why you want the numbers clear first. I would too. I will make sure we are comparing the exact vehicle and verified figures before I ask you to spend that time.';
    else if(id==='test-drive-request')line=lead+' This needs to be more than a casual appointment. '+proofPromise(ctx,false)+' I will line the visit up around what matters to you.';
    else if(id==='wants-details')line=lead+' '+proofPromise(ctx,true)+' If it does not check the box, I would rather know that before you get on the road.';
    else if(id==='payment-apr'||id==='credit-concern')line=lead+' I understand why you do not want to make that drive just to hear a guess. I will not guess at finance outcomes, but I can make sure the vehicle fit and the right conversation are lined up before you leave home.';
    else if(id==='trade-value'||id==='owner-wants-value')line=lead+' If you are bringing your trade this far, I want the visit to do real work. I will have the appraisal path ready so we are not starting from zero after you arrive.';
    else if(id==='competitor-shop')line=lead+' I should give you a better reason than “come see us.” Tell me exactly what you are comparing and I will build the visit around the decision you are actually making.';
    else if(id==='decision-maker'||id==='decision-maker-absent')line=lead+' If more than one person is making this trip, I want everybody working from the same facts before you leave home, not sorting out surprises in the showroom.';
    else if(id==='no-response-day1'||id==='final-nudge')line=lead+' I am not trying to pull you into a generic dealership visit. Tell me what you still need and I will make the next step worth your time.';
    else if(id==='booked'||id==='day-of')line=lead+' I am going to protect the appointment by rechecking the relevant vehicle details before you leave home so there are no avoidable surprises.';
    else line=lead+' I will verify what matters before you leave and structure the visit around your real priority.';

    if(short){
      var sl=ctx.interaction==='warm'?'I know that is a real drive, so ':ctx.interaction==='formal'?'Since you are traveling a good distance, ':ctx.interaction==='analytical'?'Because you are not local, ':ctx.interaction==='direct'?'You are coming a long way. ':'You are coming a long way, so ';
      if(id==='unit-gone')return sl+'I will only ask you to travel once I have a verified alternative worth the trip.'+extra;
      if(id==='price-first')return sl+'I will keep the exact vehicle and verified comparison clear before you make the trip.'+extra;
      if(id==='availability-first'||id==='test-drive-request')return sl+'I will recheck the exact vehicle before you leave home and make sure there are no surprises.'+extra;
      return sl+'I will verify the important pieces before I ask you to make the trip.'+extra;
    }
    return line+extra;
  }

  function insertEmail(body,sentence){
    if(!sentence)return body;
    var s=String(body||''),parts=s.split('\n\n'),sig=-1,i,target=-1;
    for(i=0;i<parts.length;i++)if(parts[i].indexOf('[agent]')>-1){sig=i;break;}
    var end=sig>-1?sig:parts.length;
    for(i=end-1;i>=0;i--){if(parts[i].indexOf('[day/time]')>-1||parts[i].indexOf('[alt time]')>-1||parts[i].indexOf('?')>-1){target=i;break;}}
    if(target<0)target=end;
    parts.splice(target,0,sentence);
    return parts.join('\n\n');
  }
  function insertBeforeCallback(text,sentence){
    if(!sentence)return text;
    var s=String(text||''),markers=[' Call or text me',' Call me',' Reply',' I have [day/time]',' [day/time] or [alt time]',' Bring it [day/time]'];
    for(var i=0;i<markers.length;i++){
      var at=s.lastIndexOf(markers[i]);
      if(at>0)return s.slice(0,at)+' '+sentence+s.slice(at);
    }
    return s+' '+sentence;
  }
  function insertBeforeQuestion(text,sentence){
    if(!sentence)return text;
    var s=String(text||''),q=s.lastIndexOf('?');
    if(q<0)return s+' '+sentence;
    var cut=Math.max(s.lastIndexOf('. ',q),s.lastIndexOf('! ',q));
    if(cut<0)return sentence+' '+s;
    return s.slice(0,cut+2)+sentence+' '+s.slice(cut+2);
  }

  function customerTrack(text){
    var s=String(text||'').trim();
    if(!s)return false;
    return !/^(Not a |No voicemail|No SMS|No email|No live-call|No phone number|Use the Survey page|Email-only lead|Do not leave|Do not text)/i.test(s);
  }
  function contextualize(base,ctx){
    var o=clone(base),id=o.id||ctx.scenario||'';
    var remote=['new','attempting','engaged','appointment','outbound','longterm'].indexOf(ctx.stage)>-1;
    var profile=profileSentence(ctx);
    var longDistance=!!ctx.distanceLong&&remote;
    var main=longDistance?distanceSentence(id,ctx,false):profile;
    var short=longDistance?distanceSentence(id,ctx,true):profile;

    if(main){
      if(customerTrack(o.call))o.call=insertBeforeQuestion(o.call,main);
      if(customerTrack(o.email))o.email=insertEmail(o.email,main);
    }
    if(short){
      if(customerTrack(o.vm))o.vm=insertBeforeCallback(o.vm,short);
      if(customerTrack(o.sms))o.sms=insertBeforeQuestion(o.sms,short);
    }
    o.contextSummary=[ctx.interaction!=='neutral'?ctx.interaction:'',ctx.decision!=='unknown'?ctx.decision:'',ctx.priority!=='unknown'?ctx.priority:'',longDistance?'long-distance':''].filter(Boolean).join(' · ');
    return o;
  }

  F.resolveScenario=function(raw,ctx){
    var base=priorResolve?priorResolve(raw,ctx):clone(raw);
    var c=Object.assign({},ctx||{},state);
    if(typeof c.distanceLong==='undefined')c.distanceLong=!!c.distanceFar;
    return contextualize(base,c);
  };

  function interactionLabel(v){return {neutral:'Balanced',direct:'Direct',warm:'Warm',formal:'Formal',analytical:'Analytical'}[v]||'Balanced';}
  function decisionLabel(v){return {unknown:'Decision unknown',solo:'Solo',partner:'Partner involved',family:'Family involved',elder:'Parent / elder involved'}[v]||'Decision unknown';}
  function priorityLabel(v){return {unknown:'Priority unknown',value:'Price / value',comfort:'Comfort',reliability:'Reliability',safety:'Safety',technology:'Technology',space:'Space / utility',ownership:'Ownership cost'}[v]||'Priority unknown';}

  function patchExecutionContext(){
    if(!g.SHQFunnelExecution||typeof g.SHQFunnelExecution.getContext!=='function')return false;
    if(g.SHQFunnelExecution.getContext.__shqProfiled)return true;
    var original=g.SHQFunnelExecution.getContext;
    var wrapped=function(){
      var c=original()||{};
      c.distanceLong=!!c.distanceFar;
      c.distanceFar=false; /* suppress the old generic append layer in funnel-ui.js */
      c.interaction=state.interaction;
      c.decision=state.decision;
      c.priority=state.priority;
      return c;
    };
    wrapped.__shqProfiled=true;
    g.SHQFunnelExecution.getContext=wrapped;
    return true;
  }

  function token(text){
    var m={
      '[Name]':(document.querySelector('[data-f="name"]')||{}).value||'[Name]',
      '[vehicle]':(document.querySelector('[data-f="vehicle"]')||{}).value||'[vehicle]',
      '[day/time]':(document.querySelector('[data-f="daytime"]')||{}).value||'[day/time]',
      '[alt time]':(document.querySelector('[data-f="alttime"]')||{}).value||'[alt time]',
      '[agent]':(document.querySelector('[data-f="agent"]')||{}).value||'[agent]'
    };
    var out=String(text||'');Object.keys(m).forEach(function(k){out=out.split(k).join(m[k]);});return out;
  }

  function videoClose(){
    var c=g.SHQFunnelExecution&&g.SHQFunnelExecution.getContext?g.SHQFunnelExecution.getContext():Object.assign({},state);
    var p=priorityPhrase(c.priority),d=decisionPhrase(c.decision),lead='';
    if(c.distanceLong){
      lead='Close warmly and directly: “You are coming a long way, so I will verify the important pieces before you leave home. I have [day/time] or [alt time]. Which works better?”';
      if(p)lead+=' Tie the visit to '+p+'.';
      if(d&&c.decision!=='solo')lead+=' Make sure '+d+' is included in the same plan.';
      return token(lead);
    }
    if(d&&c.decision!=='solo')return token('Close: “Let us get '+d+' the same information at once. I have [day/time] or [alt time]. Which works better?”');
    if(p)return token('Close: “We will keep the visit focused on '+p+'. I have [day/time] or [alt time]. Which works better?”');
    if(c.interaction==='warm')return token('Close: “Let us make this easy. I have [day/time] or [alt time]. Which works better?”');
    if(c.interaction==='formal')return token('Close: “I can work with [day/time] or [alt time] for the visit. Which is better for you?”');
    if(c.interaction==='analytical')return token('Close: “Two clean options: [day/time] or [alt time]. Which fits better?”');
    return token('Close: “I have [day/time] or [alt time]. Which works better?”');
  }

  function companionMessage(){
    var c=g.SHQFunnelExecution&&g.SHQFunnelExecution.getContext?g.SHQFunnelExecution.getContext():Object.assign({},state);
    var p=priorityPhrase(c.priority),d=decisionPhrase(c.decision),name=token('[Name]'),vehicle=token('[vehicle]'),agent=token('[agent]');
    var open=c.interaction==='warm'?'I wanted you to be able to see the '+vehicle+' for yourself, so I made you a quick video instead of sending another wall of text.':c.interaction==='formal'?'I made you a concise video on the '+vehicle+' so you can review the actual vehicle context clearly.':c.interaction==='analytical'?'I made you a 60-second video on the '+vehicle+' focused on the points that matter to the decision.':c.interaction==='direct'?'I made you a 60-second video on the '+vehicle+'. Here is exactly what I checked.':'I made you a quick video on the '+vehicle+' so you can see exactly what I am working with, not just read another sales email.';
    var body='Hi '+name+',\n\n'+open;
    if(p)body+=' I kept it focused on '+p+'.';
    if(d&&c.decision!=='solo')body+=' I also want '+d+' working from the same information.';
    if(c.distanceLong)body+='\n\nYou are coming from a good distance away, so I want the trip to be worth your time. Before you leave home, I will verify the relevant vehicle details again so there are no avoidable surprises.';
    body+='\n\nWatch it, then tell me the one thing you want me to work next. I have '+token('[day/time]')+' or '+token('[alt time]')+'. Which works better?';
    if(c.emailOnly)body+=' If a 5-minute call is faster than an email chain, send me the best number and a 5-minute window and I will call once with the answer in front of me.';
    body+='\n\n'+agent;
    return {subject:'🎥 '+name+', I Made This for Your '+vehicle+' Request',body:body};
  }

  function followupMessage(){
    var c=g.SHQFunnelExecution&&g.SHQFunnelExecution.getContext?g.SHQFunnelExecution.getContext():Object.assign({},state);
    var name=token('[Name]'),vehicle=token('[vehicle]'),p=priorityPhrase(c.priority),d=decisionPhrase(c.decision),via=document.getElementById('notifyVia'),method=via?via.value:'email';
    var focus=p?' I focused it on '+p+'.':'';
    var family=d&&c.decision!=='solo'?' I made it easy for '+d+' to see the same thing too.':'';
    var dist=c.distanceLong?' You are coming from a good distance away, so I am making sure the trip is worth your time before you leave home.':'';
    if(method==='sms')return 'Hi '+name+', I sent the quick '+vehicle+' video. '+focus.trim()+family+dist+' Did it come through?';
    return 'Subject: 🎥 '+name+', Quick '+vehicle+' Video\n\nHi '+name+',\n\nI sent the quick video on the '+vehicle+'.'+focus+family+dist+'\n\nDid it come through?\n\n'+token('[agent]');
  }

  function fallbackCopy(text){var ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}catch(e){}ta.remove();}
  function copy(text,btn){function done(){var old=btn.textContent;btn.textContent='Copied';setTimeout(function(){btn.textContent=old;},900);}if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(done).catch(function(){fallbackCopy(text);done();});else{fallbackCopy(text);done();}}

  function updateTags(){
    var tag=document.getElementById('contextTag');if(!tag)return;
    var c=g.SHQFunnelExecution&&g.SHQFunnelExecution.getContext?g.SHQFunnelExecution.getContext():{};
    var bits=[];
    if(c.emailOnly)bits.push('Email only');else if(c.phoneOnly)bits.push('Phone only');else if(c.textOnly)bits.push('Text only');else{if(c.phone)bits.push('Phone');if(c.text)bits.push('Text');if(c.email)bits.push('Email');}
    if(c.distanceLong)bits.push('100+ mi');
    if(state.interaction!=='neutral')bits.push(interactionLabel(state.interaction));
    if(state.decision!=='unknown')bits.push(decisionLabel(state.decision));
    if(state.priority!=='unknown')bits.push(priorityLabel(state.priority));
    tag.textContent=bits.join(' · ')||'Context';
  }
  function updateVideoUi(){
    var six=document.getElementById('sixpo');if(six){var pts=six.querySelectorAll('.po');if(pts.length){var last=pts[pts.length-1].querySelector('span');if(last)last.textContent=videoClose();}}
    var comp=document.getElementById('videoCompanion');if(comp){var msg=companionMessage(),subject=comp.querySelector('.subject'),body=comp.querySelector('.script-body'),btn=document.getElementById('copyVideoCompanion');if(subject)subject.textContent=msg.subject;if(body)body.textContent=msg.body;if(btn)btn.onclick=function(){copy('Subject: '+msg.subject+'\n\n'+msg.body,this);};}
    var notice=document.getElementById('videoNotice');if(notice){var f=followupMessage();notice.textContent=f;var b=document.getElementById('copyNotice');if(b)b.onclick=function(){copy(f,this);};}
  }
  function afterRender(){setTimeout(function(){updateTags();updateVideoUi();},0);}
  function emit(){fillState();save();try{g.dispatchEvent(new CustomEvent('shq:funnel-context-change',{detail:Object.assign({},state)}));}catch(e){}afterRender();}

  function bind(){
    ['interactionStyle','decisionStructure','buyingPriority'].forEach(function(id){var e=document.getElementById(id);if(!e)return;var key=id==='interactionStyle'?'interaction':id==='decisionStructure'?'decision':'priority';e.value=state[key]||DEFAULTS[key];e.addEventListener('change',function(){state[key]=this.value;emit();});});
    patchExecutionContext();
    g.addEventListener('shq:funnel-state-change',afterRender);
    g.addEventListener('shq:funnel-context-change',afterRender);
    g.addEventListener('shq:funnel-customer-cleared',function(){state=Object.assign({},DEFAULTS);save();['interactionStyle','decisionStructure','buyingPriority'].forEach(function(id){var e=document.getElementById(id);if(e)e.value=id==='interactionStyle'?state.interaction:id==='decisionStructure'?state.decision:state.priority;});emit();});
    document.addEventListener('input',function(e){if(e.target&&e.target.matches&&e.target.matches('[data-f]'))afterRender();});
    document.addEventListener('change',function(e){if(e.target&&(e.target.id==='videoVia'||e.target.id==='notifyVia'))afterRender();});
    emit();
  }

  F.contextProfile={get:function(){return Object.assign({},state);},interactionLabel:interactionLabel,decisionLabel:decisionLabel,priorityLabel:priorityLabel};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})(window);
