(function(){
'use strict';

var FILL_KEY='shq_fill_v1';
var F=(function(){try{return JSON.parse(localStorage.getItem(FILL_KEY)||'{}');}catch(e){return {};}})();

function $(id){return document.getElementById(id);}
function save(){try{localStorage.setItem(FILL_KEY,JSON.stringify(F));}catch(e){}}
function tok(k,fb){return F[k]&&F[k].trim()?F[k].trim():fb;}
function name(){return tok('name','[Name]');}
function req(){return tok('vehicle','[requested vehicle]');}
function av(){return $('availableVeh').value.trim()||'[available vehicle]';}
function agent(){return tok('agent','[agent]');}
function number(){return tok('number','[number]');}
function t1(){return tok('daytime','[day/time]');}
function t2(){return tok('alttime','[alt time]');}
function diff(){return $('difference').value;}
function response(){return $('response').value;}
function location(){return $('location').value;}
function priority(){return $('priority').value;}
function sisterLocation(){return location()==='sister'||diff()==='exact-sister';}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}

var DIFF={
  'exact-sister':{label:'Exact match · sister store',fact:'Exact requested configuration found at a sister store. Management confirmation is still required before promising the unit.',proof:'Show the verified listing or inventory record. Do not call it secured until management confirms it.'},
  'color':{label:'Color only',fact:'Same year, model and trim. Color is the material difference.',proof:'Show the actual color clearly. Do not spend the video re-selling features they already chose.'},
  'trim':{label:'Trim difference',fact:'Same year and model. Trim and equipment change.',proof:'Show the trim badge and only the equipment difference that could affect their decision.'},
  'year':{label:'Model-year difference',fact:'Same model and trim. Model year changes.',proof:'Show the actual year and verify any feature, warranty or equipment difference before stating it.'},
  'trim-color':{label:'Trim + color',fact:'Trim and color both change.',proof:'Show both differences quickly, then stop presenting and ask which one matters.'},
  'year-trim':{label:'Year + trim',fact:'Model year and trim both change.',proof:'Show year and trim first. Focus on price-range/equipment implications only after they tell you what matters.'},
  'year-color':{label:'Year + color',fact:'Model year and color both change.',proof:'Show both differences first, then isolate which one is actually important.'},
  'all':{label:'Year + trim + color',fact:'Year, trim and color all change. This is not close enough to treat as a replacement without more discovery.',proof:'Use the vehicle only to judge fit, space or drive if the customer agrees. Keep the exact search alive.'},
  'brand':{label:'Different brand comparable',fact:'Different brand/model. It should be presented only if it solves the customer’s stated need.',proof:'Show only the customer-relevant comparison point. Do not invent a weakness in the requested brand.'}
};
function d(){return DIFF[diff()]||DIFF.color;}

var PRIORITY={
  unknown:'what mattered most about the original vehicle',
  exact:'keeping the exact configuration',
  value:'staying in the right price and value range',
  equipment:'keeping the trim and equipment you wanted',
  color:'getting the color you actually want',
  miles:'mileage and condition',
  comfort:'comfort and fit',
  reliability:'ownership confidence',
  safety:'the safety equipment you care about',
  technology:'the technology you will actually use',
  space:'space and utility',
  ownership:'ownership cost'
};
function priorityPhrase(){return PRIORITY[priority()]||PRIORITY.unknown;}

function firstQuestion(){
  var k=diff();
  if(k==='exact-sister')return 'If management confirms we can secure that specific unit, is that the vehicle you are ready to move forward on?';
  if(k==='color')return 'Is the original color a must-have, or would you look at this one if everything else is right?';
  if(k==='trim')return 'Was the original trim important because of a specific feature, or because of the price point?';
  if(k==='year')return 'Was the original model year important because of budget, mileage/condition or something specific to that year?';
  if(k==='trim-color')return 'Which one is the hard line for you, the trim/equipment or the color?';
  if(k==='year-trim')return 'Which mattered more, staying in the original year and price range or keeping the original trim and equipment?';
  if(k==='year-color')return 'Which is the real must-have, the original year and price range or the color?';
  if(k==='all')return 'This one changes too much for me to call it a replacement. What is the one thing I absolutely cannot move on: year, trim, color, price range or exact model?';
  if(priority()==='unknown')return 'Was the '+req()+' itself the must-have, or were you really trying to solve for price, space, comfort or equipment?';
  return 'The reason I would even compare it is '+priorityPhrase()+'. Is the '+req()+' itself still the must-have, or can the model move if that need is solved?';
}

function firstSetup(){
  var k=diff();
  if(k==='exact-sister')return 'I found an exact match to the '+req()+' at one of our sister stores. I need management to confirm we can secure that specific unit before I promise it.';
  if(k==='color')return 'I found '+av()+'. Same year, model and trim as what you asked for. The difference is the color.';
  if(k==='trim')return 'I found '+av()+'. Same year and model, but the trim changes.';
  if(k==='year')return 'I found '+av()+'. Same model and trim, but the model year changes.';
  if(k==='trim-color')return 'I found '+av()+'. It changes two things from your request: trim and color.';
  if(k==='year-trim')return 'I found '+av()+'. It changes the model year and the trim.';
  if(k==='year-color')return 'I found '+av()+'. It changes the model year and the color.';
  if(k==='all')return 'I found '+av()+', but the year, trim and color all differ from what you asked for.';
  return 'I found '+av()+'. It is a different brand/model, so I only want to compare it if it solves the reason you were shopping the '+req()+'.';
}

function subjectFor(){
  var k=diff();
  if(k==='exact-sister')return '🚙 '+name()+', I Found a '+req()+' Match';
  if(k==='color')return '🚙 '+name()+', One '+req()+' Color Difference';
  if(k==='trim')return '🚙 '+name()+', One Trim Question on the '+req();
  if(k==='year')return '🚙 '+name()+', One Model-Year Question on the '+req();
  if(k==='brand')return '🚙 '+name()+', One Alternative Worth Comparing';
  return '🚙 '+name()+', Quick '+req()+' Update';
}

function firstScripts(){
  var setup=firstSetup(),q=firstQuestion();
  return {
    call:'Hi '+name()+', '+agent()+' at Sheehy Nissan. '+setup+' '+q,
    vm:'Hi '+name()+', '+agent()+' at Sheehy Nissan. I have a real update on the '+req()+'. I found an option, but there is one decision point I need to confirm with you before I push it any further. Call or text me at '+number()+'.',
    sms:'Hi '+name()+', '+agent()+' at Sheehy Nissan. '+setup+' '+q,
    subject:subjectFor(),
    email:'Hi '+name()+',\n\n'+setup+'\n\n'+q+'\n\n'+agent()
  };
}

function pushbackQuestion(){
  if(priority()!=='unknown'&&priority()!=='exact')return 'Got it. Then I will keep '+priorityPhrase()+' fixed. What is the one thing that can move, if anything?';
  return 'Got it. Tell me the one thing I cannot change: year, trim, color, price range or exact model. I will work outward from that.';
}
function pushbackScripts(){
  var q=pushbackQuestion();
  return {
    call:'You are right, '+name()+'. That is not the '+req()+'. Let us keep the search centered on what you actually asked for. '+q,
    vm:'Hi '+name()+', '+agent()+' at Sheehy Nissan. I heard you. I am resetting the search around the '+req()+' instead of trying to make the wrong vehicle fit. Call or text me at '+number()+' and give me the one requirement that cannot move.',
    sms:'You are right. That is not the '+req()+'. '+q,
    subject:name()+', Let’s Keep the '+req()+' Search Exact',
    email:'Hi '+name()+',\n\nYou are right. That is not the '+req()+'.\n\n'+q+'\n\n'+agent()
  };
}

function openScripts(){
  var ask=sisterLocation()
    ? 'Good. I will get management to confirm whether we can secure '+av()+'. If it clears, which fits better for you, '+t1()+' or '+t2()+'?'
    : 'Good. Then let us evaluate only the difference that matters. I will have '+av()+' ready. Which is better for you, '+t1()+' or '+t2()+'?';
  return {
    call:ask,
    vm:sisterLocation()
      ? 'Hi '+name()+', '+agent()+' at Sheehy Nissan. I am getting management to verify the '+av()+' now. I will contact you as soon as I have a confirmed answer. Call or text me at '+number()+' if anything changes on your side.'
      : 'Hi '+name()+', '+agent()+' at Sheehy Nissan. I have the '+av()+' lined up for the comparison. Call or text me at '+number()+' and we will lock the time.',
    sms:ask,
    subject:'📅 '+name()+', Next Step on the '+av(),
    email:'Hi '+name()+',\n\n'+ask+'\n\n'+agent()
  };
}

function pendingScripts(){
  var line='Management is checking the specific '+av()+' now. It is not confirmed yet. I will contact you as soon as I have a yes or no.';
  return {
    call:'Hi '+name()+', '+agent()+' at Sheehy Nissan. Quick update on the '+req()+'. '+line,
    vm:'Hi '+name()+', '+agent()+' at Sheehy Nissan. The '+av()+' is still being checked and is not confirmed yet. I will contact you as soon as I have the answer.',
    sms:'Quick update on the '+req()+': '+line,
    subject:'🔎 '+name()+', '+req()+' Status Update',
    email:'Hi '+name()+',\n\nQuick update on the '+req()+'. '+line+'\n\n'+agent()
  };
}

function securedScripts(){
  var line='Management confirmed we can work the specific '+av()+'.';
  var close='I have '+t1()+' or '+t2()+'. Which works better?';
  return {
    call:'Hi '+name()+', '+agent()+' at Sheehy Nissan. '+line+' '+close,
    vm:'Hi '+name()+', '+agent()+' at Sheehy Nissan. I have the confirmation on the '+av()+'. Call or text me at '+number()+' and we will lock the next step.',
    sms:'Good update: '+line+' '+close,
    subject:'✅ '+name()+', '+av()+' Is Confirmed',
    email:'Hi '+name()+',\n\n'+line+'\n\n'+close+'\n\n'+agent()
  };
}

function failedScripts(){
  var q=priority()!=='unknown'&&priority()!=='exact'
    ? 'I will keep '+priorityPhrase()+' fixed. What is the next thing I can move: year, trim, color or model?'
    : 'Which requirement stays fixed now: year, trim, color, price range or exact model?';
  return {
    call:'Hi '+name()+', '+agent()+' at Sheehy Nissan. I have the answer on the '+av()+'. We could not secure that specific unit. Let us reset around your must-have instead of throwing substitutes at you. '+q,
    vm:'Hi '+name()+', '+agent()+' at Sheehy Nissan. I have the answer on the '+av()+'. We could not secure that specific unit. Call or text me at '+number()+' and we will reset around the one requirement that matters most.',
    sms:'Straight update: we could not secure the '+av()+'. '+q,
    subject:name()+', Update on the '+req(),
    email:'Hi '+name()+',\n\nWe could not secure the specific '+av()+'.\n\n'+q+'\n\n'+agent()
  };
}

function scripts(){
  var r=response();
  if(r==='pushback')return pushbackScripts();
  if(r==='open')return openScripts();
  if(r==='pending')return pendingScripts();
  if(r==='secured')return securedScripts();
  if(r==='failed')return failedScripts();
  return firstScripts();
}

function videoClose(){
  var r=response();
  if(r==='pushback')return 'Close with the reset question: “What is the one thing I cannot change?”';
  if(r==='open')return sisterLocation()?'Close on the conditional next step: “If management confirms it, which works better, '+t1()+' or '+t2()+'?”':'Close for the visit: “I have '+t1()+' or '+t2()+'. Which works better?”';
  if(r==='pending')return 'Do not make a full walkaround. Give the status, say it is not confirmed yet and promise the next update only.';
  if(r==='secured')return 'Close immediately: “Management confirmed the unit. I have '+t1()+' or '+t2()+'. Which works better?”';
  if(r==='failed')return 'Close with the reset: “Which requirement stays fixed now?”';
  return 'Close with the decision question, not an appointment unless the customer has accepted the difference: “'+firstQuestion()+'”';
}

function videoPlan(){
  var r=response();
  var option=sisterLocation()?'Show the verified listing or inventory record for '+av()+'.':'Show the actual '+av()+' on the lot.';
  if(r==='pending')option='Stay on camera or show the verified listing briefly. Do not present the unit as available to us yet.';
  if(r==='failed')option='Stay on camera. There is nothing to walk around. Give the result and reset the search.';
  return [
    ['1 · Start with the update',r==='first'?'“'+firstSetup()+'”':'State the current status in one sentence. No dealership speech.'],
    ['2 · Show only what is real',option],
    ['3 · Name the decision point',r==='first'?firstQuestion():r==='pushback'?pushbackQuestion():d().fact],
    ['4 · Prove only what matters',d().proof],
    ['5 · Stop presenting','Once the customer has enough information to answer the decision question, stop selling the alternative.'],
    ['6 · Close the next decision',videoClose()]
  ];
}

function fallbackCopy(text){var ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}catch(e){}ta.remove();}
function copy(text,btn){var done=function(){var o=btn.textContent;btn.textContent='Copied';setTimeout(function(){btn.textContent=o;},900);};if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(done).catch(function(){fallbackCopy(text);done();});else{fallbackCopy(text);done();}}
function card(kind,title,text,subject){return '<div class="card '+kind+'"><div class="head"><b>'+esc(title)+'</b><button class="copy" type="button">Copy</button></div>'+(subject?'<div class="subject">'+esc(subject)+'</div>':'')+'<div class="body">'+esc(text)+'</div></div>';}

function render(){
  var s=scripts();
  var html=card('call','Call',s.call)+card('vm','Voicemail',s.vm)+card('sms','SMS',s.sms)+card('email','Email',s.email,s.subject);
  var vp=videoPlan(),pts='';
  vp.forEach(function(p){pts+='<div class="point"><b>'+esc(p[0])+'</b><span>'+esc(p[1])+'</span></div>';});
  var videoText=vp.map(function(p){return p[0]+'\n'+p[1];}).join('\n\n');
  html+='<div class="card video"><div class="head"><b>Video · decision-focused 6PO</b><button class="copy" type="button">Copy pointers</button></div><div class="video-grid">'+pts+'</div></div>';
  $('scripts').innerHTML=html;

  var cards=$('scripts').querySelectorAll('.card');
  cards.forEach(function(c,i){
    var b=c.querySelector('.copy');
    if(i===3)b.onclick=function(){copy('Subject: '+s.subject+'\n\n'+s.email,b);};
    else if(i===4)b.onclick=function(){copy(videoText,b);};
    else b.onclick=function(){copy(c.querySelector('.body').textContent,b);};
  });

  $('differenceTag').textContent=d().label;
  $('locationTag').textContent=sisterLocation()?'Sister store':'Our lot';
  var labels={first:'First response',pushback:'Customer rejected alternative',open:'Alternative accepted',pending:'Manager confirmation pending',secured:'Manager confirmed unit',failed:'Unit could not be secured'};
  $('responseTag').textContent=labels[response()]||'First response';
  $('matchSummary').innerHTML='<b>What is actually different:</b> '+esc(d().fact)+' <b>Decision to earn next:</b> '+esc(response()==='first'?firstQuestion():response()==='pushback'?pushbackQuestion():videoClose());
}

document.querySelectorAll('[data-f]').forEach(function(el){
  var k=el.getAttribute('data-f');
  if(F[k])el.value=F[k];
  el.addEventListener('input',function(){F[k]=el.value.trim();save();render();});
});
['availableVeh','location','difference','priority','response'].forEach(function(id){
  $(id).addEventListener(id==='availableVeh'?'input':'change',render);
});
render();
})();
