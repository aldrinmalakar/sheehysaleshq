(function(){
  'use strict';
  var PROFILE_KEY='shq_fill_v1';
  var DATA=window.SHQFunnel||{stages:[],scenarios:[]};
  var qp;try{qp=new URLSearchParams(location.search);}catch(e){qp={get:function(){return null;}};}

  function allowedInStage(x,stage){return !!x&&!x.hiddenBehavior&&(x.stage===stage||(Array.isArray(x.alsoStages)&&x.alsoStages.indexOf(stage)>-1));}
  function listForStage(stage){var list=DATA.scenarios.filter(function(x){return allowedInStage(x,stage);});var fb=DATA.scenarios.filter(function(x){return x.id==='fallback';})[0];if(fb&&!list.some(function(x){return x.id==='fallback';}))list.push(fb);return list;}
  var requestedStage=qp.get('stage')||'new',requestedScenario=qp.get('scenario')||'fresh-standard';
  if(!DATA.stages.some(function(x){return x.id===requestedStage;}))requestedStage='new';
  var req=DATA.scenarios.filter(function(x){return x.id===requestedScenario;})[0];if(!allowedInStage(req,requestedStage)){var first=listForStage(requestedStage)[0];requestedScenario=first?first.id:'fresh-standard';}
  var state={stage:requestedStage,scenario:requestedScenario,fill:{}};

  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function loadFill(){try{return JSON.parse(localStorage.getItem(PROFILE_KEY)||'{}');}catch(e){return {};}}
  function saveFill(){try{localStorage.setItem(PROFILE_KEY,JSON.stringify(state.fill));}catch(e){}}
  function tokens(text){var f=state.fill||{},m={'[Name]':f.name||'[Name]','[vehicle]':f.vehicle||'[vehicle]','[current]':f.current||'[current]','[day/time]':f.daytime||'[day/time]','[alt time]':f.alttime||'[alt time]','[agent]':f.agent||'[agent]','[number]':f.number||'[number]','[email]':f.email||'[email]'};var out=String(text||'');Object.keys(m).forEach(function(k){out=out.split(k).join(m[k]);});return out;}
  function executionContext(){if(window.SHQFunnelExecution&&typeof window.SHQFunnelExecution.getContext==='function')return window.SHQFunnelExecution.getContext();return {phone:true,email:true,text:false,emailOnly:false,textOnly:false,phoneOnly:false,distanceFar:false,distanceMiles:null};}
  function rawScenario(){return DATA.scenarios.filter(function(x){return x.id===state.scenario;})[0]||listForStage(state.stage)[0]||DATA.scenarios[0];}
  function clone(x){var o={};for(var k in x)if(Object.prototype.hasOwnProperty.call(x,k))o[k]=x[k];return o;}
  function insertBeforeAgent(body,paragraph){var marker='\n\n[agent]';return body.indexOf(marker)>-1?body.replace(marker,'\n\n'+paragraph+marker):body+'\n\n'+paragraph;}
  function travelLine(){
    if(state.scenario==='unit-gone')return 'Since you are coming from a good distance away, I do not want you traveling for a random replacement. I will verify the alternative you actually want to see and send you proof before you head this way.';
    if(state.scenario==='availability-first')return 'Since you are coming from a good distance away, I do not want you making the trip on an unchecked status. I will re-verify the exact vehicle before you head this way.';
    if(state.scenario==='price-first')return 'Since you are coming from a good distance away, I want the vehicle and comparison verified before you spend time on the trip.';
    if(state.scenario==='test-drive-request')return 'Since you are coming from a good distance away, I will re-verify the exact vehicle and have the visit lined up before you leave home.';
    return 'Since you are coming from a good distance away, I do not want you making the trip on a guess. Before you head this way, I will re-verify the vehicle and the important details with you.';
  }
  function applyDistance(x,ctx){
    if(!ctx.distanceFar||['new','attempting','engaged','appointment','outbound','longterm'].indexOf(state.stage)<0)return x;
    var o=clone(x),travel=travelLine();
    o.call=String(o.call||'')+'\n\n'+travel;
    o.vm=String(o.vm||'')+' I see you are coming from a distance, so I want to make sure the trip is worth it before you head this way.';
    o.sms=String(o.sms||'')+' '+travel;
    o.email=insertBeforeAgent(String(o.email||''),travel);
    o.channelStrategy=(o.channelStrategy?o.channelStrategy+' ':'')+'Long-distance lead: protect the trip, establish two-way contact and confirm the relevant vehicle details before travel.';
    return o;
  }
  function scenario(){var ctx=executionContext(),x=rawScenario();if(typeof DATA.resolveScenario==='function')x=DATA.resolveScenario(x,ctx);return applyDistance(x,ctx);}

  function renderStage(){var sel=document.getElementById('stageSelect');sel.innerHTML=DATA.stages.map(function(s){return '<option value="'+esc(s.id)+'"'+(s.id===state.stage?' selected':'')+'>'+esc(s.label)+'</option>';}).join('');}
  function renderBehavior(){var list=listForStage(state.stage),sel=document.getElementById('behavior');if(!list.some(function(x){return x.id===state.scenario;})&&list[0])state.scenario=list[0].id;sel.innerHTML=list.map(function(x){return '<option value="'+esc(x.id)+'"'+(x.id===state.scenario?' selected':'')+'>'+esc(x.label)+'</option>';}).join('');}
  function copy(text,btn){var done=function(){var old=btn.textContent;btn.textContent='Copied';setTimeout(function(){btn.textContent=old;},900);};if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(done).catch(function(){fallbackCopy(text);done();});else{fallbackCopy(text);done();}}
  function fallbackCopy(text){var ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}catch(e){}ta.remove();}
  function card(kind,title,sub,text){return '<div class="script-card '+kind+'"><div class="card-head"><div class="channel-name">'+esc(title)+(sub?'<small>'+esc(sub)+'</small>':'')+'</div><button class="copy-btn" type="button">Copy</button></div><div class="script-body">'+esc(tokens(text))+'</div></div>';}

  function renderScripts(){
    var x=scenario(),ctx=executionContext(),html='',emailText='Subject: '+tokens(x.subject)+'\n\n'+tokens(x.email);
    if(ctx.phone){html+=card('call','Call','live',x.call);html+=card('vm','Voicemail','if missed',x.vm);}
    if(ctx.text)html+=card('sms','SMS','behavior matched',x.sms);
    if(ctx.email)html+='<div class="script-card email"><div class="card-head"><div class="channel-name">Email <small>behavior + context matched</small></div><button class="copy-btn email-copy" type="button">Copy</button></div><div class="subject">'+esc(tokens(x.subject))+'</div><div class="script-body">'+esc(tokens(x.email))+'</div></div>';
    if(!ctx.phone&&!ctx.text&&!ctx.email)html='<div class="empty-channels">Turn on at least one real contact channel in Customer Context.</div>';
    document.getElementById('scripts').innerHTML=html;
    document.querySelectorAll('#scripts .script-card').forEach(function(c){var b=c.querySelector('.copy-btn');if(!b)return;if(b.classList.contains('email-copy'))b.onclick=function(){copy(emailText,b);};else b.onclick=function(){copy((c.querySelector('.script-body')||{}).textContent||'',b);};});
  }

  function focusFor(id){
    var map={
      'availability-first':'Show physical proof of the exact unit only after you have verified it. If status is still being checked, say that plainly.',
      'price-first':'Show the exact vehicle, window label or stock context. Do not quote an unverified number on video. Tell them you are working the comparison they asked for.',
      'test-drive-request':'Show the exact vehicle, driver area and keys. Make the video feel like the car is being prepared for their visit.',
      'wants-details':'Spend most of the video on the exact feature or detail they asked about. Do not turn it into a feature dump.',
      'payment-apr':'Show the vehicle and keep the finance piece process-focused. Do not state a payment, APR or approval expectation.',
      'trade-value':'Show the vehicle they want, then explain that the trade needs a real appraisal. Ask them to bring the trade with them.',
      'credit-concern':'Keep the video neutral and private. Do not say “credit” where someone else could overhear it. Say you received their note and can handle the next step privately.',
      'competitor-shop':'Show one visible reason the vehicle deserves comparison. Do not invent a competitor disadvantage.',
      'decision-maker':'Show the one or two items most likely to matter to both decision makers, then invite both to the same visit or call.',
      'unit-gone':'Do not film a random replacement. If you have a verified alternative, show it and state exactly how it differs. Otherwise make this a face-to-name update.',
      'no-response-day1':'Use the vehicle as visual proof that a real person is working the lead. Ask for one simple reply: status, numbers or a time to see it.',
      'final-nudge':'Keep it short. One face-to-name shot, one vehicle shot and one clean “still looking or all set?” close.'
    };
    return map[id]||'Show the exact vehicle and one relevant detail tied to why they submitted the lead. Do not give a generic walkaround.';
  }
  function videoPlan(){
    var ctx=executionContext(),name=tokens('[Name]'),veh=tokens('[vehicle]'),agent=tokens('[agent]'),close=ctx.distanceFar?'Because they are coming from a distance, say you will verify the relevant vehicle details before they leave home, then ask for a firm time.':'Ask for the appointment with the two times already entered: '+tokens('[day/time]')+' or '+tokens('[alt time]')+'.';
    if(ctx.emailOnly)close+=' If a quick call would save back-and-forth, invite them to reply with the best number and time.';
    return [
      ['0–7 sec','Face + name','Camera on you. “Hi '+name+', '+agent+' at Sheehy Nissan.” One sentence on why you made the video.'],
      ['7–17 sec','Confirm the request','Show '+veh+' or the exact verified vehicle context. State the year/model/trim they asked about so they know this is personal.'],
      ['17–28 sec','Exterior proof','Front 3/4 plus the exterior detail that matters: color, wheels, condition or exact stock identity. Only say what you can physically verify.'],
      ['28–40 sec','Inside proof','Driver area, second row or cargo area. Pick one area that helps this customer decide instead of showing everything.'],
      ['40–51 sec','Behavior proof',focusFor(state.scenario)],
      ['51–60 sec','Appointment close',close]
    ];
  }
  function companionFocus(id){
    var map={
      'availability-first':'I focused on the exact vehicle and the details tied to the availability question you sent.',
      'price-first':'I focused on the exact vehicle so we are talking about the same unit while I work the comparison you asked for.',
      'test-drive-request':'I focused on what you will want to see before you make the trip for the drive.',
      'wants-details':'I focused on the specific vehicle detail you asked about instead of giving you a generic walkaround.',
      'payment-apr':'I focused on the vehicle itself. I will keep the finance side accurate rather than guessing at a payment, rate or approval.',
      'trade-value':'I focused on the vehicle you are considering. Your trade still needs a real appraisal, and I can make that part easy when you come in.',
      'credit-concern':'I kept the video focused on the vehicle. I received your note and can handle the next step privately.',
      'competitor-shop':'I focused on the parts that make this vehicle worth comparing with the other option you are considering.',
      'decision-maker':'I focused on the items that are easiest for both decision makers to compare together.',
      'unit-gone':'I made this as an honest update on the requested vehicle and the closest verified direction I found.',
      'no-response-day1':'I kept this short so you can see a real person is working the request and tell me what you still need.',
      'final-nudge':'I kept this to one quick update so you can tell me whether the vehicle is still in play or you are all set.'
    };return map[id]||'I kept it focused on the exact vehicle and the reason you reached out.';
  }
  function videoCompanion(){
    var ctx=executionContext(),subject='🎥 '+tokens('[Name]')+', Quick Video on the '+tokens('[vehicle]');
    var body='Hi '+tokens('[Name]')+',\n\nI made you a quick video on the '+tokens('[vehicle]')+'. '+companionFocus(state.scenario);
    if(ctx.distanceFar)body+='\n\nSince you are coming from a good distance away, I focused on the things that help you decide whether the trip makes sense. Before you head this way, I will verify the relevant vehicle details.';
    body+='\n\nReply with anything specific you want me to show.';
    if(ctx.emailOnly)body+=' If a quick call is easier after you watch it, include the best number and a good time.';
    body+='\n\n'+tokens('[agent]');
    if(ctx.email)return {label:'Companion email',subject:subject,body:body};
    if(ctx.text)return {label:'Companion SMS',subject:'',body:'Hi '+tokens('[Name]')+', '+tokens('[agent]')+' at Sheehy Nissan. I just sent you a quick video on the '+tokens('[vehicle]')+'. '+companionFocus(state.scenario)+' Tell me what you want me to check next.'};
    return {label:'Companion message',subject:'',body:'No email or text channel is enabled. Use the video only after you have a valid digital delivery path.'};
  }
  function renderVideo(){
    var plan=videoPlan(),html='';plan.forEach(function(p,i){html+='<div class="po"><div class="po-num">'+(i+1)+'</div><div><b>'+esc(p[0]+' · '+p[1])+'</b><span>'+esc(p[2])+'</span></div></div>';});document.getElementById('sixpo').innerHTML=html;
    var c=videoCompanion(),box=document.getElementById('videoCompanion'),copyTextValue=(c.subject?'Subject: '+c.subject+'\n\n':'')+c.body;box.innerHTML='<div class="card-head"><h3>'+esc(c.label)+'</h3><button class="copy-btn" id="copyVideoCompanion" type="button">Copy</button></div>'+(c.subject?'<div class="subject">'+esc(c.subject)+'</div>':'')+'<div class="script-body">'+esc(c.body)+'</div>';document.getElementById('copyVideoCompanion').onclick=function(){copy(copyTextValue,this);};
  }
  function renderTags(){var x=rawScenario(),ctx=executionContext();document.getElementById('behaviorTag').textContent=x?x.label:'Behavior';var bits=[];if(ctx.emailOnly)bits.push('Email only');else if(ctx.phoneOnly)bits.push('Phone only');else if(ctx.textOnly)bits.push('Text only');else{if(ctx.phone)bits.push('Phone');if(ctx.text)bits.push('Text');if(ctx.email)bits.push('Email');}if(ctx.distanceFar)bits.push('100+ mi');document.getElementById('contextTag').textContent=bits.join(' · ')||'No contact channel';}
  function render(){renderStage();renderBehavior();renderTags();renderScripts();renderVideo();}
  function seed(){state.fill=loadFill();if(!state.fill.agent)state.fill.agent='Aldrin';document.querySelectorAll('[data-f]').forEach(function(el){var k=el.getAttribute('data-f');el.value=state.fill[k]||'';el.addEventListener('input',function(){state.fill[k]=el.value;saveFill();render();});});}

  document.getElementById('stageSelect').addEventListener('change',function(){state.stage=this.value;var first=listForStage(state.stage)[0];state.scenario=first?first.id:'fallback';render();window.dispatchEvent(new CustomEvent('shq:funnel-state-change'));});
  document.getElementById('behavior').addEventListener('change',function(){state.scenario=this.value;render();window.dispatchEvent(new CustomEvent('shq:funnel-state-change'));});
  document.getElementById('clearCustomer').addEventListener('click',function(){['name','vehicle','current','zipcode','daytime','alttime'].forEach(function(k){state.fill[k]='';});saveFill();document.querySelectorAll('[data-f]').forEach(function(el){var k=el.getAttribute('data-f');el.value=state.fill[k]||'';});render();window.dispatchEvent(new CustomEvent('shq:funnel-customer-cleared'));});
  window.addEventListener('shq:funnel-context-change',render);
  seed();render();
})();