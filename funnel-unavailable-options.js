/* ============================================================
   SHEEHY SALES HQ - unavailable vehicle replacement flow

   Purpose:
   - Expand unit-gone into a deliberate replacement workflow.
   - Tell the truth first, name the real difference, reconnect to the
     customer's must-have and prescribe one next step.
   - Keep long-distance customers remote until the alternative and
     verified purchase figures justify the trip.
   - Never imply an unsecured sister-store vehicle is ours.

   Pattern: direct update -> isolate must-have -> prove one alternative
   -> prescribe next step -> choice close -> stop.
============================================================ */
(function(g){
'use strict';
var F=g.SHQFunnel;
if(!F||!Array.isArray(F.scenarios))return;
var prior=typeof F.resolveScenario==='function'?F.resolveScenario:null;
var state={type:'same-color',must:'unknown'};
var renderTimer=null;

function $(id){return document.getElementById(id);}
function clone(o){var x={};Object.keys(o||{}).forEach(function(k){x[k]=o[k];});return x;}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function val(id,fb){var e=$(id);return e&&e.value?String(e.value).trim():fb;}
function selectedBehavior(){return val('behavior','');}
function isActive(){return selectedBehavior()==='unit-gone';}
function ctx(){return g.SHQFunnelExecution&&typeof g.SHQFunnelExecution.getContext==='function'?g.SHQFunnelExecution.getContext():{};}
function tok(key,fb){var e=document.querySelector('[data-f="'+key+'"]');return e&&e.value&&e.value.trim()?e.value.trim():fb;}
function name(){return tok('name','[Name]');}
function vehicle(){return tok('vehicle','[vehicle]');}
function agent(){return tok('agent','[agent]');}
function number(){return tok('number','[number]');}
function t1(){return tok('daytime','[day/time]');}
function t2(){return tok('alttime','[alt time]');}
function alt1(){return val('alternativeVehicle','');}
function alt2(){return val('alternativeVehicle2','');}
function replacementType(){return val('replacementType',state.type||'same-color');}
function mustSelection(){return val('originalMustHave',state.must||'unknown');}
function emailOnly(c){return !!c.emailOnly;}
function longDistance(c){return !!(c.distanceLong||c.distanceFar);}
function canSend(c){return !!(c.email||c.text);}

var unit=F.scenarios.filter(function(x){return x.id==='unit-gone';})[0];
if(unit){
  unit.label='Original Vehicle Unavailable / Sold';
  var stages=Array.isArray(unit.alsoStages)?unit.alsoStages.slice():[];
  ['attempting','engaged','appointment'].forEach(function(s){if(stages.indexOf(s)<0)stages.push(s);});
  unit.alsoStages=stages;
}

var TYPE={
  'same-color':{label:'Same model / trim, different color',short:'same setup, different color',difference:'same year, model and trim, with color as the material difference',proof:'Show the actual alternative and the color difference immediately. Do not bury the difference.'},
  'same-trim':{label:'Same model, different trim',short:'same model, different trim',difference:'same model, but the trim changes, so equipment and verified numbers can change',proof:'Show the trim badge and the one or two equipment differences that matter to this customer.'},
  'same-year':{label:'Same model / trim, different year',short:'same model and trim, different model year',difference:'same model and trim, with the model year changing',proof:'State the model year first. Verify any feature or equipment difference before describing it.'},
  'same-multiple':{label:'Same model, multiple differences',short:'same model with multiple configuration differences',difference:'same model family, but the configuration is not identical',proof:'Name the important differences before showing the similarities. Never disguise it as the original configuration.'},
  'similar-nissan':{label:'Similar Nissan model',short:'a different Nissan model that may solve the same job',difference:'a different Nissan model, not the vehicle originally requested',proof:'Show only why it may solve the same customer job. Do not feature-dump or pretend it is the same vehicle.'},
  'new-used':{label:'New / used alternative',short:'a new-versus-used alternative',difference:'the new/used status changes, so this is a different ownership proposition',proof:'State new versus used clearly. Verify the actual vehicle facts and numbers instead of implying an apples-to-apples match.'},
  'brand':{label:'Different-brand comparable',short:'a different-brand comparable',difference:'a different brand and model offered only as a comparable',proof:'Say the brand/model difference out loud and tie the comparison only to the customer’s stated priority. Do not invent competitor weaknesses.'},
  'sister':{label:'Exact / near match at sister store',short:'a possible match in group inventory',difference:'a vehicle in group inventory that still has to be verified and secured through management',proof:'Show the verified listing or specification. Do not say it is ours or transferable until management confirms it.'},
  'several':{label:'Several strong verified alternatives',short:'two deliberate alternatives',difference:'more than one verified direction that may fit the original need',proof:'Show no more than two alternatives. Name the difference on each and make the customer choose which one deserves the deeper comparison.'},
  'none':{label:'Nothing strong enough yet',short:'no replacement strong enough yet',difference:'no verified replacement is strong enough to justify forcing a substitute',proof:'Do not film random inventory. Use a face-to-name update and isolate what can move versus what cannot.'}
};
function typeInfo(){return TYPE[replacementType()]||TYPE['same-color'];}

function priorityKey(c){
  var m=mustSelection();if(m&&m!=='unknown')return m;
  var p=c&&c.priority||'unknown';
  return p==='value'?'value':p==='comfort'?'comfort':p==='reliability'?'reliability':p==='safety'?'safety':p==='technology'?'technology':p==='space'?'space':p==='ownership'?'ownership':'unknown';
}
function mustPhrase(c){
  var k=priorityKey(c),map={
    exact:'the exact model and configuration',value:'price and value',equipment:'specific equipment or trim',color:'color',miles:'mileage and condition',comfort:'comfort and fit',reliability:'reliability and ownership confidence',safety:'the safety equipment',technology:'the technology',space:'space and utility',ownership:'ownership cost'
  };return map[k]||'what made the original vehicle the right one';
}
function mustIsKnown(c){return priorityKey(c)!=='unknown';}
function peoplePhrase(c){
  if(c.decision==='partner')return 'you and your partner';
  if(c.decision==='family')return 'everyone involved in the decision';
  if(c.decision==='elder')return 'you and the parent or elder involved';
  return '';
}
function styleOpen(c){
  if(c.interaction==='warm')return name()+', I wanted you hearing this from me directly.';
  if(c.interaction==='formal')return name()+', I want to give you a clear update before we go any further.';
  if(c.interaction==='analytical')return name()+', here is the exact change so we can make a clean decision.';
  return name()+', straight update.';
}
function altName(){return alt1()||'the verified alternative';}
function secondName(){return alt2()||'the second verified option';}
function optionSentence(c){
  var t=replacementType(),a=altName();
  if(t==='same-color')return 'I do have '+a+'. It keeps the same core setup; the material difference is color.';
  if(t==='same-trim')return 'I do have '+a+'. Same model, different trim. I am not going to blur that because equipment and numbers can change.';
  if(t==='same-year')return 'I do have '+a+'. Same model and trim, different model year. I will show you exactly what changes before we call it a fit.';
  if(t==='same-multiple')return 'I do have '+a+'. It is the same model family, but the configuration is not identical. I will name the differences first.';
  if(t==='similar-nissan')return 'I have '+a+'. It is a different Nissan model, and I am only bringing it up because it may solve the same job.';
  if(t==='new-used')return 'I have '+a+'. It changes the new-versus-used equation, so I am not going to call it an identical replacement.';
  if(t==='brand')return 'I have '+a+'. It is a different-brand comparable, not the same vehicle, and I am only putting it in the conversation because it may solve the same priority.';
  if(t==='sister')return 'I found '+a+' in group inventory. It is not ours yet. Management still has to confirm it can actually be secured.';
  if(t==='several')return 'I have two directions worth your time: '+a+' and '+secondName()+'. I am not sending you six random links.';
  return 'I do not have a replacement strong enough to put in front of you yet, and I am not going to force a substitute just to keep the conversation alive.';
}
function familySentence(c){
  var p=peoplePhrase(c),t=replacementType();if(!p)return '';
  if(t==='none')return 'I want '+p+' aligned on the one non-negotiable before I send anything else.';
  if(t==='sister')return 'I want '+p+' working from the same verified facts before anyone commits time to the trip.';
  return 'I want '+p+' looking at the same differences so nobody has to relay the decision secondhand.';
}
function distanceSentence(c){
  if(!longDistance(c))return '';
  var t=replacementType(),send=canSend(c)?'send you':'review with you';
  if(t==='none')return 'You are coming a long way. I am not asking you to travel for a maybe. We stay remote until I have a verified option that actually earns the trip.';
  if(t==='sister')return 'You are coming a long way. I will not ask you to move until management confirms the sister-store vehicle can be secured. If it is confirmed, I will '+send+' the actual vehicle, the differences and the verified purchase numbers before you leave home.';
  if(t==='several')return 'You are coming a long way. Pick the direction that deserves the deeper look first. I will '+send+' the actual vehicle, the differences and the verified purchase numbers before we talk about the drive.';
  return 'You are coming a long way. Before I ask you to make that drive, I will '+send+' the actual alternative, call out the differences and work the verified purchase numbers remotely. If it earns the trip, then we lock the visit.';
}
function decisionQuestion(c){
  var t=replacementType(),m=mustPhrase(c),known=mustIsKnown(c);
  if(t==='none')return known?'Is your requirement around '+m+' truly non-negotiable, or can one part of the configuration move?':'Tell me the one thing I cannot compromise and the one thing that can move: color, trim, year, miles or price.';
  if(t==='several')return 'Which one do you want me to prove first: '+altName()+' or '+secondName()+'?';
  if(t==='sister')return known?'If management confirms it can be secured, does it still have to win on '+m+'?':'Before I push on the sister-store option, what is the one thing it absolutely has to match for you?';
  if(t==='same-color')return 'Is the color a hard no, or is the right vehicle in another color worth the comparison?';
  if(t==='same-trim')return known?'If '+m+' still checks out, is the trim change something you can evaluate, or is that a hard stop?':'Is the trim itself non-negotiable, or is the equipment you need the real target?';
  if(t==='same-year')return known?'If '+m+' still checks out, is the model-year change a hard stop?':'Is the model year itself non-negotiable, or is the actual fit and equipment the real target?';
  if(t==='same-multiple')return known?'If it still solves '+m+', is an exact configuration required or can the right differences earn one comparison?':'Is the exact configuration non-negotiable, or can the right alternative earn one comparison?';
  if(t==='similar-nissan')return known?'Is the original model itself non-negotiable, or is solving '+m+' the real target?':'Is the original model itself the must-have, or is the job you need the vehicle to do the real target?';
  if(t==='new-used')return known?'Is new-versus-used non-negotiable, or is '+m+' what actually decides this?':'Is new-versus-used a hard requirement, or are you solving for the right vehicle and value?';
  if(t==='brand')return known?'Is the original brand/model non-negotiable, or is '+m+' what actually decides this?':'Is the original brand/model a hard requirement, or are you open to the best fit for the job?';
  return 'What made the original vehicle the one for you?';
}
function appointmentClose(c){
  var t=replacementType(),m=mustPhrase(c);
  if(t==='none'||t==='several'||t==='sister')return '';
  if(longDistance(c))return 'If the remote comparison checks out, I have '+t1()+' or '+t2()+'. Which works better?';
  if(t==='same-color')return 'Is the color a hard no, or should I have it ready for '+t1()+' or '+t2()+'?';
  if(t==='same-trim')return 'If it still delivers on '+m+', is the trim change a hard stop, or should I have it ready for '+t1()+' or '+t2()+'?';
  if(t==='same-year')return 'If it still delivers on '+m+', is the model-year change a hard stop, or should I have it ready for '+t1()+' or '+t2()+'?';
  if(t==='same-multiple')return 'If it still solves '+m+', is the exact configuration a hard requirement, or should I have it ready for '+t1()+' or '+t2()+'?';
  if(t==='similar-nissan')return 'If the real decision is '+m+', I have '+t1()+' or '+t2()+' to compare it. If the original model is non-negotiable, tell me now and I stay exact.';
  if(t==='new-used')return 'If the real decision is '+m+', I have '+t1()+' or '+t2()+' to compare it. If new-versus-used is non-negotiable, tell me now and I stay in that lane.';
  if(t==='brand')return 'If the real decision is '+m+', I have '+t1()+' or '+t2()+' to compare it. If the original brand/model is non-negotiable, tell me now and I stay exact.';
  return 'I have '+t1()+' or '+t2()+' to compare it correctly. Which works better?';
}
function emailCallOption(c){return emailOnly(c)?'\n\nIf one 5-minute call is faster than another email chain, send me the best number and a short window. I will call once I have the verified information in front of me.':'';}
function build(raw,c){
  var o=clone(raw),open=styleOpen(c),opt=optionSentence(c),family=familySentence(c),dist=distanceSentence(c),question=decisionQuestion(c),close=appointmentClose(c),parts=[open,'The exact '+vehicle()+' you originally asked about is no longer available.',opt];
  if(family)parts.push(family);if(dist)parts.push(dist);
  var spoken=parts.join(' ');
  var ask=close||question;
  o.goal='Protect trust, isolate why the original vehicle mattered and move only to a verified alternative that deserves the customer’s attention.';
  o.next=replacementType()==='none'?'Do not force a substitute. Isolate the non-negotiable and the first thing that can move.':replacementType()==='several'?'Make the customer choose which verified direction deserves proof first.':replacementType()==='sister'?'Get management confirmation before treating the sister-store option as available, then work the comparison.':'Name the difference first, tie the alternative to the customer’s must-have and close the next step.';
  o.call=spoken+' '+ask;
  o.vm='Hi '+name()+', '+agent()+' at Sheehy Nissan. I have a straight update on the '+vehicle()+'. The exact one is no longer available, but I have '+(replacementType()==='none'?'a clear next step':'a specific direction worth discussing')+'. I am not sending random replacements. Call or text me at '+number()+'.';
  if(longDistance(c))o.vm+=' Since you are coming from a distance, we will work the real comparison before I ask you to travel.';
  o.sms=(c.interaction==='warm'?'I wanted you hearing this from me directly. ':'Straight update: ')+'the exact '+vehicle()+' is no longer available. '+optionSentence(c)+' '+(dist?dist+' ':'')+ask;
  o.subject='🚙 '+name()+', Straight Update on the '+vehicle();
  var paragraphs=[
    'Hi '+name()+',',
    (c.interaction==='warm'?'I wanted to give you the update directly instead of letting you discover it through another listing.':'Straight update: the exact '+vehicle()+' you originally asked about is no longer available.'),
    optionSentence(c)
  ];
  if(c.interaction==='warm')paragraphs[1]+=' The exact '+vehicle()+' is no longer available.';
  if(family)paragraphs.push(family);
  if(dist)paragraphs.push(dist);
  paragraphs.push(close||question);
  if(emailOnly(c))paragraphs.push('If one 5-minute call is faster than another email chain, send me the best number and a short window. I will call once I have the verified information in front of me.');
  paragraphs.push(agent());
  o.email=paragraphs.join('\n\n');
  o.video='Use the unavailable-vehicle 6PO: give the truth first, show only the verified alternative, name the difference immediately, tie it to '+mustPhrase(c)+' and close the next step without apologizing your way out of control.';
  o.unavailableFlow=true;
  o.replacementSummary=typeInfo().label+' · '+mustPhrase(c);
  return o;
}

F.resolveScenario=function(raw,c){
  var base=prior?prior(raw,c):clone(raw),id=base&&base.id||raw&&raw.id||'';
  if(id!=='unit-gone')return base;
  return build(base,c||{});
};

function copy(text,btn){
  function done(){var old=btn.textContent;btn.textContent='Copied';setTimeout(function(){btn.textContent=old;},850);}
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(done).catch(done);else done();
}
function videoPlan(c){
  var t=typeInfo(),a=altName(),m=mustPhrase(c),close='';
  if(replacementType()==='none')close='Close with the isolation question: “'+decisionQuestion(c)+'” Do not show random inventory.';
  else if(replacementType()==='several')close='Close with: “'+decisionQuestion(c)+'” Make them choose which option deserves proof first.';
  else if(replacementType()==='sister')close='Close with: “'+decisionQuestion(c)+'” Do not promise a transfer or appointment as secured.';
  else close='Close: “'+appointmentClose(c)+'” Then stop.';
  if(longDistance(c)&&replacementType()!=='none')close+=' The customer gets the actual alternative, differences and verified purchase numbers before making the trip.';
  return [
    ['0–7 sec · Face + truth','“Hi '+name()+', '+agent()+' at Sheehy Nissan. Straight update: the exact '+vehicle()+' you asked about is no longer available.” No long apology.'],
    ['7–17 sec · Prove this is not bait-and-switch',replacementType()==='none'?'Stay on camera. Say you are not showing random inventory just to keep the lead alive.':'Show '+a+' or the verified listing. Say clearly that this is the alternative, not the original vehicle.'],
    ['17–28 sec · Name the difference first',t.difference+'.'],
    ['28–40 sec · Prove only the relevant part',t.proof],
    ['40–51 sec · Tie it back to their reason','“The only reason I am putting this in front of you is to see whether it still solves '+m+'.” Keep it on that priority, not a feature dump.'],
    ['51–60 sec · Control the next step',close]
  ];
}
function companion(c){
  var t=replacementType(),base='Hi '+name()+',\n\nI made you a short video because the exact '+vehicle()+' you originally asked about is no longer available. I am not sending you random inventory.\n\n'+optionSentence(c);
  if(longDistance(c))base+='\n\n'+distanceSentence(c);
  if(t==='none'||t==='several'||t==='sister')base+='\n\n'+decisionQuestion(c);
  else base+='\n\n'+appointmentClose(c);
  if(emailOnly(c))base+='\n\nIf one 5-minute call is faster than another email chain, send me the best number and a short window.';
  if(c.email)return {label:'Companion email',subject:'🎥 '+name()+', Straight Update on the '+vehicle(),body:base+'\n\n'+agent()};
  if(c.text)return {label:'Companion SMS',subject:'',body:'Hi '+name()+', '+agent()+' at Sheehy Nissan. The exact '+vehicle()+' is no longer available, so I sent you a short video with the real update. '+optionSentence(c)+' '+(longDistance(c)?distanceSentence(c)+' ':'')+(t==='none'||t==='several'||t==='sister'?decisionQuestion(c):appointmentClose(c))};
  return {label:'Companion message',subject:'',body:'No email or text channel is enabled. Use the video only after you have a valid digital delivery path.'};
}
function renderVideo(){
  if(!isActive())return;
  var c=ctx(),six=$('sixpo'),box=$('videoCompanion');
  if(six){six.innerHTML=videoPlan(c).map(function(p,i){return '<div class="po"><div class="po-num">'+(i+1)+'</div><div><b>'+esc(p[0])+'</b><span>'+esc(p[1])+'</span></div></div>';}).join('');}
  if(box){var cm=companion(c),copyText=(cm.subject?'Subject: '+cm.subject+'\n\n':'')+cm.body;box.innerHTML='<div class="card-head"><h3>'+esc(cm.label)+'</h3><button class="copy-btn" id="copyVideoCompanion" type="button">Copy</button></div>'+(cm.subject?'<div class="subject">'+esc(cm.subject)+'</div>':'')+'<div class="script-body">'+esc(cm.body)+'</div>';var b=$('copyVideoCompanion');if(b)b.onclick=function(){copy(copyText,b);};}
  var notice=$('videoNotice'),nb=$('copyNotice'),via=$('notifyVia'),method=via?via.value:'email';
  if(notice){var core=replacementType()==='none'?'I sent you a short video with the straight update on the '+vehicle()+'. I am not throwing random replacements at you. '+decisionQuestion(c):'I sent you a short video with the straight update on the '+vehicle()+'. '+optionSentence(c);if(longDistance(c))core+=' '+distanceSentence(c);core+=' Did it come through?';var msg=method==='sms'?'Hi '+name()+', '+core:'Subject: 🎥 '+name()+', Straight Update on the '+vehicle()+'\n\nHi '+name()+',\n\n'+core+'\n\n'+agent();notice.textContent=msg;if(nb)nb.onclick=function(){copy(msg,nb);};}
}
function syncConditionalFields(){
  var active=isActive(),panel=$('unavailableOptions');if(panel)panel.hidden=!active;
  if(!active)return;
  var type=replacementType(),a2=$('alternative2Wrap'),a1=$('alternative1Wrap'),sister=$('openSisterStore');
  if(a2)a2.hidden=type!=='several';
  if(a1)a1.hidden=type==='none';
  if(sister)sister.hidden=type!=='sister';
  var tag=$('replacementSummary');if(tag)tag.textContent=(TYPE[type]||TYPE['same-color']).label+' · '+mustPhrase(ctx());
}
function dispatchRender(){var b=$('behavior');if(b)b.dispatchEvent(new Event('change',{bubbles:true}));}
function scheduleRender(){clearTimeout(renderTimer);renderTimer=setTimeout(function(){syncConditionalFields();dispatchRender();setTimeout(renderVideo,20);},90);}
function saveSisterPayload(){try{sessionStorage.setItem('shq_sister_prefill_v1',JSON.stringify({available:alt1(),location:'sister'}));}catch(e){}}
function bind(){
  syncConditionalFields();setTimeout(renderVideo,30);
  ['replacementType','originalMustHave'].forEach(function(id){var e=$(id);if(e)e.addEventListener('change',function(){state.type=replacementType();state.must=mustSelection();scheduleRender();});});
  ['alternativeVehicle','alternativeVehicle2'].forEach(function(id){var e=$(id);if(e)e.addEventListener('input',scheduleRender);});
  ['behavior','stageSelect'].forEach(function(id){var e=$(id);if(e)e.addEventListener('change',function(){setTimeout(function(){syncConditionalFields();renderVideo();},20);});});
  ['interactionStyle','decisionStructure','buyingPriority','customerZip'].forEach(function(id){var e=$(id);if(e)e.addEventListener('change',function(){if(isActive())setTimeout(renderVideo,30);});});
  document.querySelectorAll('[data-f]').forEach(function(e){e.addEventListener('input',function(){if(isActive())setTimeout(renderVideo,30);});});
  var clear=$('clearCustomer');if(clear)clear.addEventListener('click',function(){var rt=$('replacementType'),mh=$('originalMustHave'),a=$('alternativeVehicle'),b=$('alternativeVehicle2');if(rt)rt.value='same-color';if(mh)mh.value='unknown';if(a)a.value='';if(b)b.value='';state.type='same-color';state.must='unknown';setTimeout(syncConditionalFields,20);});
  var sister=$('openSisterStore');if(sister)sister.addEventListener('click',saveSisterPayload);
  g.addEventListener('shq:funnel-context-change',function(){if(isActive())setTimeout(renderVideo,30);});
  g.addEventListener('shq:funnel-state-change',function(){setTimeout(function(){syncConditionalFields();if(isActive())renderVideo();},30);});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();

g.SHQUnavailableVehicle={typeInfo:typeInfo,decisionQuestion:decisionQuestion,renderVideo:renderVideo};
})(window);
