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
      'availability-first':'Show proof of the exact unit only after verification. Say what you verified. Then stop and move to the time choice.',
      'price-first':'Show the exact vehicle or stock context. Say: “I am working the comparison you asked for. I will not invent a number on camera.”',
      'test-drive-request':'Show the exact vehicle, driver area and keys. Make it obvious this is the vehicle they are coming to drive, subject to final verification.',
      'wants-details':'Spend this entire section on the exact feature or detail they asked about. One proof point, not a feature dump.',
      'payment-apr':'Show the vehicle. Say you will keep the finance answer real and route it correctly. Do not state payment, APR or approval expectations.',
      'trade-value':'Show the vehicle they want. Then say the trade gets a real appraisal when the actual trade is in front of the right manager.',
      'credit-concern':'Keep the video neutral and private. Say you received the note and the next step can be handled privately. Do not say sensitive details on video.',
      'competitor-shop':'Show one visible reason this vehicle deserves the comparison. State the comparison point. Do not invent a weakness on the other vehicle.',
      'decision-maker':'Show the one or two things both decision makers need to see. Close by getting both people into the same visit or call.',
      'unit-gone':'Do not film a random replacement. If you have a verified alternative, show it and name the difference immediately. Otherwise make this a direct face-to-name update.',
      'no-response-day1':'Use the vehicle as proof that a real person is working the lead. Close with one choice: status, numbers or a time to see it.',
      'final-nudge':'One face shot, one vehicle shot, one question: still shopping, already bought or pause?'
    };
    return map[id]||'One proof point only. Tie it directly to why they reached out. Do not turn the video into a walkaround.';
  }
  function videoPlan(){
    var ctx=executionContext(),name=tokens('[Name]'),veh=tokens('[vehicle]'),agent=tokens('[agent]');
    var close=ctx.distanceFar?'Close: “Before you leave home I will verify the relevant vehicle details again. I have '+tokens('[day/time]')+' or '+tokens('[alt time]')+'. Which works?”':'Close: “I have '+tokens('[day/time]')+' or '+tokens('[alt time]')+'. Which works better?” Do not end with “let me know.”';
    if(ctx.emailOnly)close+=' If a 5-minute call would save the email back-and-forth, add: “Send me the best number and a 5-minute window.”';
    return [
      ['0–6 sec','Face + reason','Camera on you. “Hi '+name+', '+agent+' at Sheehy Nissan. You reached out on the '+veh+', so I made this specifically for your request.”'],
      ['6–16 sec','Prove it is personal','Show '+veh+' or the exact verified vehicle context. State the year, model and trim they asked about. No generic intro.'],
      ['16–27 sec','Exterior proof','Front 3/4 plus one exterior proof point: color, wheels, condition or stock identity. Show proof, do not narrate the brochure.'],
      ['27–38 sec','Interior proof','Show the single interior area most likely to matter: driver seat, second row, cargo or the requested feature. One point only.'],
      ['38–50 sec','Behavior proof',focusFor(state.scenario)],
      ['50–60 sec','Close',close]
    ];
  }
  function companionFocus(id){
    var map={
      'availability-first':'I focused on the exact vehicle context tied to your availability question.',
      'price-first':'I focused on the exact vehicle so we are comparing the same unit while I work the number question.',
      'test-drive-request':'I focused on what you need to see before you make the trip for the drive.',
      'wants-details':'I focused on the exact detail you asked about, not a generic feature tour.',
      'payment-apr':'I kept the video on the vehicle. I will keep the finance answer real instead of guessing.',
      'trade-value':'I focused on the vehicle you are considering. Your trade gets a real appraisal when we put eyes on it.',
      'credit-concern':'I kept the video on the vehicle. I received your note and the next step can stay private.',
      'competitor-shop':'I focused on a real comparison point instead of giving you a generic pitch.',
      'decision-maker':'I focused on the pieces both decision makers can compare together.',
      'unit-gone':'I made this as a straight update and only used a verified alternative if I had one.',
      'no-response-day1':'I kept it short so you can tell me what you still need: status, numbers or a time to see it.',
      'final-nudge':'I kept it to one clean update so you can tell me whether you are still shopping, already bought or pausing.'
    };return map[id]||'I kept it focused on the exact vehicle and the reason you reached out.';
  }
  function videoCompanion(){
    var ctx=executionContext(),subject='🎥 '+tokens('[Name]')+', I Made This for Your '+tokens('[vehicle]')+' Request';
    var body='Hi '+tokens('[Name]')+',\n\nI made you a 60-second video on the '+tokens('[vehicle]')+'. '+companionFocus(state.scenario);
    if(ctx.distanceFar)body+='\n\nBecause you are coming from a distance, I will re-verify the relevant vehicle details before you leave home.';
    body+='\n\nWatch it, then tell me the one thing you want me to work next.';
    if(['new','attempting','engaged','appointment','outbound'].indexOf(state.stage)>-1)body+=' I have '+tokens('[day/time]')+' or '+tokens('[alt time]')+'. Which works better?';
    if(ctx.emailOnly)body+=' If a 5-minute call is faster than an email chain, send the best number and a 5-minute window.';
    body+='\n\n'+tokens('[agent]');
    if(ctx.email)return {label:'Companion email',subject:subject,body:body};
    if(ctx.text)return {label:'Companion SMS',subject:'',body:'Hi '+tokens('[Name]')+', '+tokens('[agent]')+' at Sheehy Nissan. I sent you a 60-second video on the '+tokens('[vehicle]')+'. '+companionFocus(state.scenario)+' Watch it, then tell me what you want me to work next.'};
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