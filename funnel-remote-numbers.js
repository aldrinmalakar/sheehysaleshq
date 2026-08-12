/* SHEEHY SALES HQ - long-distance remote numbers layer */
(function(g){
'use strict';
var F=g.SHQFunnel;if(!F||typeof F.resolveScenario!=='function')return;
var prior=F.resolveScenario;
function clone(o){var x={};Object.keys(o||{}).forEach(function(k){x[k]=o[k];});return x;}
function priority(ctx){if(ctx.priority==='value')return 'the verified numbers';if(ctx.priority==='comfort')return 'comfort and fit';if(ctx.priority==='safety')return 'the safety equipment actually on the vehicle';if(ctx.priority==='technology')return 'the technology you will actually use';if(ctx.priority==='space')return 'space and utility';if(ctx.priority==='ownership')return 'the ownership-cost factors we can verify';if(ctx.priority==='reliability')return 'the ownership facts we can verify';return 'the pieces that matter most';}
function people(ctx){if(ctx.decision==='partner')return 'you and your partner';if(ctx.decision==='family')return 'everyone involved in the decision';if(ctx.decision==='elder')return 'you and the parent or elder involved';return 'you';}
function warm(ctx){if(ctx.interaction==='warm')return 'I know that is a real drive and I appreciate you considering making it.';if(ctx.interaction==='formal')return 'I want to respect the time you would be putting into the trip.';if(ctx.interaction==='analytical')return 'Because you are not local, I want the decision points clear before you spend time on the road.';if(ctx.interaction==='direct')return 'You are coming a long way. I am not asking you to drive here just to get basic answers.';return 'You are coming a long way, so I want the trip to have a real purpose.';}
function baseClose(ctx){var p=priority(ctx),who=people(ctx);return 'I will keep the remote work focused on '+p+(ctx.decision&&ctx.decision!=='unknown'&&ctx.decision!=='solo'?' so '+who+' can see the same information':'')+'. Once that makes sense, we lock the visit.';}
function email(n,a,body){return 'Hi '+n+',\n\n'+body+'\n\n'+a;}
function tok(name){var el=document.querySelector('[data-f="'+name+'"]');return el&&el.value&&el.value.trim()?el.value.trim():'['+(name==='name'?'Name':name)+']';}
function callOption(ctx){return ctx.emailOnly?'\n\nIf a 5-minute call is faster than another email chain, send me the best number and a short window. I will call once I have the verified information in front of me.':'';}
F.resolveScenario=function(raw,ctx){
  var out=prior(raw,ctx),c=ctx||{},id=out&&out.id||raw&&raw.id||'';
  if(!out||!c.distanceLong)return out;
  var o=clone(out),n='[Name]',v='[vehicle]',a='[agent]',p='[number]',lead=warm(c),close=baseClose(c),callAsk=callOption(c);
  if(id==='price-first'){
    o.call=lead+' I can work the verified purchase numbers remotely before you come. First, are you comparing a written quote on the exact '+v+' or are you setting your budget? Send me the comparison and I will work the right structure before we talk about the drive.';
    o.vm='Hi '+n+', '+a+' at Sheehy Nissan. I saw the price question on the '+v+'. Since you are coming from a distance, I can work the verified numbers remotely before you make the trip. Call or text me at '+p+' and I will get the right comparison started.';
    o.sms=lead+' I can work the verified purchase numbers remotely before you make the trip. Are you comparing a written quote on the exact '+v+' or setting your budget?';
    o.subject='💬 '+n+', Let’s Work the '+v+' Numbers Before the Drive';
    o.email=email(n,a,lead+' I can work the verified purchase numbers remotely before you make the trip. I am not asking you to drive here just to learn whether the deal is worth pursuing.\n\nAre you comparing a written quote on the exact '+v+' or are you setting your budget? If you have a quote, send it over. I will work the verified comparison first.\n\n'+close+callAsk);
  }else if(id==='payment-apr'){
    o.call=lead+' We can do real deal work remotely before you come. I will not invent a payment, APR or approval, but I can get the vehicle and purchase structure worked first and route the finance-specific pieces for a real answer. '+close;
    o.vm='Hi '+n+', '+a+' at Sheehy Nissan. Since you are coming from a distance, we can work much of the deal remotely before you make the trip. I will not guess at payment, APR or approval, but I can get the real structure moving. Call or text me at '+p+'.';
    o.sms=lead+' We can work much of the deal remotely before you come. I will not guess at payment, APR or approval, but I can get the purchase structure moving and the finance-specific questions routed correctly.';
    o.subject='💬 '+n+', Let’s Work the '+v+' Structure Before You Drive';
    o.email=email(n,a,lead+' We can work much of the deal structure remotely before you come. I will not guess at payment, APR or approval because finance has to review the actual structure.\n\nWhat I can do is get the vehicle and verified purchase figures worked first, then route the finance-specific questions for a real answer. '+close+callAsk);
  }else if(id==='competitor-shop'){
    o.call=lead+' Give me the exact vehicle or written quote you are comparing. I will build the apples-to-apples comparison remotely first. If our option deserves the trip after that, then we lock the time.';
    o.sms=lead+' Send me the exact vehicle or written quote you are comparing. I will build the apples-to-apples comparison remotely first. If our option deserves the trip, then we lock the time.';
    o.email=email(n,a,lead+' Send me the exact vehicle or written quote you are comparing and tell me what is most likely to decide it. I will build the apples-to-apples comparison remotely first.\n\nIf our option deserves the trip after that, then we lock the time.'+callAsk);
  }else if(id==='trade-value'){
    o.call=lead+' I can work the purchase side remotely before you come. On the '+tok('current')+', I will not fake a final appraisal from a screen. Give me the mileage and material condition details so I can line up the appraisal path before you travel. '+close;
    o.sms=lead+' I can work the purchase side remotely first. On your '+tok('current')+', send the approximate miles and any material condition details so I can line up the appraisal path before you travel.';
    o.email=email(n,a,lead+' I can work the purchase side remotely before you come. On your '+tok('current')+', I will not pretend a screen gives us a final appraisal.\n\nSend the approximate mileage and anything material about condition. I will line up the appraisal path so the trip does real work instead of starting from zero.'+callAsk);
  }
  return o;
};
function context(){return g.SHQFunnelExecution&&typeof g.SHQFunnelExecution.getContext==='function'?g.SHQFunnelExecution.getContext():{};}
function behavior(){var e=document.getElementById('behavior');return e?e.value:'';}
function isRemoteNumbers(id){return ['price-first','payment-apr','competitor-shop','trade-value'].indexOf(id)>-1;}
function copy(text,btn){function done(){var old=btn.textContent;btn.textContent='Copied';setTimeout(function(){btn.textContent=old;},850);}if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(done).catch(done);else done();}
function updateVideo(){var c=context(),id=behavior();if(!c.distanceLong||!isRemoteNumbers(id))return;var n=tok('name'),v=tok('vehicle'),a=tok('agent'),day=tok('daytime'),alt=tok('alttime'),numLine=id==='payment-apr'?'I can work the vehicle and verified purchase structure remotely first. Finance-specific terms still get a real finance review, not a guess.':id==='trade-value'?'I can work the purchase side remotely first and line up the appraisal path before you travel.':'I can work the verified comparison remotely first so you know whether the trip deserves your time.';var pts=document.querySelectorAll('#sixpo .po');if(pts.length){var last=pts[pts.length-1].querySelector('span');if(last)last.textContent='Close: “'+numLine+' Once that makes sense, I have '+day+' or '+alt+'. Which works better?”';}
var comp=document.getElementById('videoCompanion');if(comp){var sub=comp.querySelector('.subject'),body=comp.querySelector('.script-body'),btn=document.getElementById('copyVideoCompanion'),subject='🎥 '+n+', '+v+' Before You Make the Drive',text='Hi '+n+',\n\nI made you a quick video on the '+v+' so you can see what I am working with. '+numLine+'\n\nYou are coming a good distance, so I want the vehicle, the important details and the remote number work as clear as possible before you leave home.\n\nOnce it makes sense, I have '+day+' or '+alt+'. Which works better?'+(c.emailOnly?' If a 5-minute call is faster, send me the best number and a short window.':'')+'\n\n'+a;if(sub)sub.textContent=subject;if(body)body.textContent=text;if(btn)btn.onclick=function(){copy('Subject: '+subject+'\n\n'+text,this);};}
var notice=document.getElementById('videoNotice');if(notice){var via=document.getElementById('notifyVia'),method=via?via.value:'email',line='I sent the '+v+' video so you can see the actual vehicle context while I work the remote numbers. '+numLine+' Did it come through?',msg=method==='sms'?'Hi '+n+', '+line:'Subject: 🎥 '+n+', '+v+' Video\n\nHi '+n+',\n\n'+line+'\n\n'+a;notice.textContent=msg;var nb=document.getElementById('copyNotice');if(nb)nb.onclick=function(){copy(msg,this);};}}
function schedule(){setTimeout(updateVideo,15);}function bind(){schedule();g.addEventListener('shq:funnel-context-change',schedule);g.addEventListener('shq:funnel-state-change',schedule);document.addEventListener('change',function(e){if(e.target&&(e.target.id==='videoVia'||e.target.id==='notifyVia'||e.target.id==='behavior'))schedule();});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})(window);
