(function(){
'use strict';
var FILL_KEY='shq_fill_v1',F=(function(){try{return JSON.parse(localStorage.getItem(FILL_KEY)||'{}');}catch(e){return {};}})();
function $(id){return document.getElementById(id);}function save(){try{localStorage.setItem(FILL_KEY,JSON.stringify(F));}catch(e){}}function tok(k,fb){return F[k]&&F[k].trim()?F[k].trim():fb;}function name(){return tok('name','[Name]');}function req(){return tok('vehicle','[requested vehicle]');}function av(){return $('availableVeh').value.trim()||'[available vehicle]';}function agent(){return tok('agent','[agent]');}function number(){return tok('number','[number]');}function t1(){return tok('daytime','[day/time]');}function t2(){return tok('alttime','[alt time]');}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function diff(){return $('difference').value;}function response(){return $('response').value;}function location(){return $('location').value;}
var DIFF={
'exact-sister':{label:'Exact match · sister store',line:'The specification matches what they asked for, but the vehicle is not on our Manassas lot.',proof:'Show the requested specification on screen or in the verified listing. Do not say the unit is secured until management confirms it.'},
'color':{label:'Color only',line:'Same year, model and trim. Color is the only material difference.',proof:'Show the actual color clearly in daylight and say that color is the difference.'},
'trim':{label:'Trim difference',line:'Same year and model, but the trim changes. Treat the equipment difference as real.',proof:'Show the trim badge and one visible feature that differs. Name what is not the same.'},
'year':{label:'Model-year difference',line:'Same model and trim, but the model year changes. Do not present the years as identical.',proof:'Show the model year and the areas that matter to the customer. Verify any feature changes before stating them.'},
'trim-color':{label:'Trim + color',line:'Same model/year, but both trim and color differ.',proof:'Show both differences early so the customer never feels switched.'},
'year-trim':{label:'Year + trim',line:'Same model, but year and trim both differ.',proof:'Show the actual year and trim first. Use it as a comparison, not as a substitute disguised as the requested vehicle.'},
'year-color':{label:'Year + color',line:'Same model/trim, but year and color differ.',proof:'Show both differences before showing similarities.'},
'all':{label:'Year + trim + color',line:'It is the same model family, but year, trim and color all differ.',proof:'Call it a driving/size comparison only. Do not imply it represents the exact requested configuration.'},
'brand':{label:'Different brand comparable',line:'This is a different brand vehicle being offered only as a comparable option.',proof:'Say the brand/model difference out loud. Show why it may be worth comparing based on the customer’s stated priorities without inventing a competitor weakness.'}
};
function d(){return DIFF[diff()]||DIFF.color;}
function placeLine(){if(location()==='sister'||diff()==='exact-sister')return 'I found '+av()+' in our group at a sister store. My manager still has to confirm it can be secured, so I am not calling it ours until that happens.';return 'I have '+av()+' here at our Manassas store and I can put the actual vehicle in front of you.';}
function differenceLine(){var k=diff();if(k==='exact-sister')return 'It matches the request. The only issue is location, and the transfer is not confirmed yet.';if(k==='color')return 'Same year, model and trim. The color is the only difference.';if(k==='trim')return 'Same year and model, different trim. I will show you exactly what changes and what stays the same.';if(k==='year')return 'Same model and trim, different model year. I will show you the actual differences rather than pretend the years are identical.';if(k==='trim-color')return 'Trim and color are both different. I will call out both before we compare anything else.';if(k==='year-trim')return 'Year and trim are different. This is a comparison vehicle, not the exact build you asked for.';if(k==='year-color')return 'Model year and color are different. I will show both differences first.';if(k==='all')return 'Year, trim and color all differ. This is useful for basic fit and drive only, not as a claim that it is the same configuration.';return 'This is a different brand comparable. I am not presenting it as the same vehicle. I am giving you one honest alternative because it may solve the same job.';}
function intro(){return 'Hi '+name()+', '+agent()+' at Sheehy Nissan of Manassas. You asked about the '+req()+'.';}
function subjectFor(){var k=diff();if(k==='exact-sister')return '🚙 '+name()+', I Found the '+req()+' Match';if(k==='color')return '🎨 '+name()+', Same Setup, Different Color';if(k==='trim')return '🚙 '+name()+', '+req()+' Update: Different Trim';if(k==='year')return '🚙 '+name()+', '+req()+' Update: Different Model Year';if(k==='brand')return '⚖️ '+name()+', One Straight Alternative to the '+req();return '🚙 '+name()+', Straight Update on the '+req();}
function sisterLocation(){return location()==='sister'||diff()==='exact-sister';}
function visitAsk(){return sisterLocation()?'If my manager secures it, I have '+t1()+' or '+t2()+'. Which works better?':'I have '+t1()+' or '+t2()+' to see it. Which works better?';}
function firstScripts(){var loc=placeLine(),dif=differenceLine(),ask=visitAsk();return {
call:intro()+' I checked the request instead of sending you random inventory. Here is what I found: '+loc+' '+dif+' This is not me trying to switch you. It is the closest honest option I can actually work. '+ask,
vm:'Hi '+name()+', '+agent()+' at Sheehy Nissan. I checked the '+req()+' and found the closest real option. There is a difference and I want you to hear it from me before you spend time on it. Call or text me at '+number()+'.',
sms:'Hi '+name()+', '+agent()+' at Sheehy Nissan. I checked the '+req()+'. I found a real option and I want to be exact about the difference: '+d().line+' '+ask,
subject:subjectFor(),
email:'Hi '+name()+',\n\nI checked the '+req()+' instead of sending you random inventory.\n\n'+loc+' '+dif+'\n\nI am not presenting a substitute as the vehicle you asked for. I am giving you the closest honest option I can actually work. '+ask+'\n\n'+agent()
};}
function pushbackScripts(){return {
call:'You are right, '+name()+'. You asked for the '+req()+', not '+av()+'. I am not going to pretend they are the same. Here is why I brought it up: '+differenceLine()+' If that difference is a hard no, tell me and I stay on the exact request. If it is not a hard no, let us compare it once and make a real decision.',
vm:'Hi '+name()+', '+agent()+' at Sheehy Nissan. I heard you on wanting the exact '+req()+'. You are right. I am not replacing your request with something else. I have one honest comparison and I will show the exact difference. Call or text me at '+number()+'.',
sms:'You are right. You asked for the '+req()+', not '+av()+'. I am not disguising it as the same vehicle. '+differenceLine()+' Is that difference a hard no, or is it worth one clean comparison?',
subject:name()+', You Are Right About the '+req(),
email:'Hi '+name()+',\n\nYou are right. You asked for the '+req()+', not '+av()+'. I am not going to pretend they are the same.\n\n'+differenceLine()+'\n\nIs that difference a hard no, or is it worth one clean comparison while I keep the exact request in play?\n\n'+agent()
};}
function openScripts(){var ask=sisterLocation()?'Good. I will have my manager verify whether '+av()+' can actually be secured. If it is confirmed, I have '+t1()+' or '+t2()+'. Which works?':'Good. I will have '+av()+' ready and I will show the difference before anything else. I have '+t1()+' or '+t2()+'. Which works?';return {
call:'Good. Then we compare it correctly. '+differenceLine()+' '+ask,
vm:sisterLocation()?'Hi '+name()+', '+agent()+' at Sheehy Nissan. I am having my manager verify whether '+av()+' can actually be secured. I will give you a real yes or no as soon as I have it. Call or text me at '+number()+'.':'Hi '+name()+', '+agent()+' at Sheehy Nissan. I have the '+av()+' comparison lined up. I will show the differences first so you can decide quickly. Call or text me at '+number()+'.',
sms:sisterLocation()?'Good. My manager is verifying whether '+av()+' can be secured. If it is confirmed, I have '+t1()+' or '+t2()+'. Which works?':'Good. I will have '+av()+' ready and show the differences first. '+t1()+' or '+t2()+'. Which works?',
subject:'📅 '+name()+', Let’s Compare the '+av()+' Correctly',
email:'Hi '+name()+',\n\nGood. We will compare it correctly and I will show the difference first. '+differenceLine()+'\n\n'+ask+'\n\n'+agent()
};}
function pendingScripts(){return {
call:'Hi '+name()+', '+agent()+' at Sheehy Nissan. Update on the '+req()+': my manager is checking the sister-store vehicle now. It is not secured yet, so I am not calling it ours. The moment I have a real yes or no, I will contact you.',
vm:'Hi '+name()+', '+agent()+' at Sheehy Nissan. Update on the '+req()+': the sister-store vehicle is still being checked and it is not confirmed yet. I will contact you as soon as I have a real answer.',
sms:'Update on the '+req()+': my manager is checking the sister-store vehicle now. It is not secured yet. I will message you the moment I have a real yes or no.',
subject:'🔎 '+name()+', Real-Time Update on the '+req(),
email:'Hi '+name()+',\n\nUpdate on the '+req()+': my manager is checking the sister-store vehicle now. It is not secured yet, so I am not going to call it ours before it is confirmed.\n\nThe moment I have a real yes or no, I will contact you.\n\n'+agent()
};}
function failedScripts(){return {
call:'Hi '+name()+', I want you hearing this from me first. We were not able to secure the exact '+req()+'. I am already working the next move. Which matters more now: staying exact on the configuration or getting the closest match sooner?',
vm:'Hi '+name()+', '+agent()+' at Sheehy Nissan. I have the answer on the '+req()+'. We could not secure that exact unit. I am already working the next options and I want to give them to you directly. Call me at '+number()+'.',
sms:'Straight update: we could not secure the exact '+req()+'. I am already working the next options. Which matters more now: exact configuration or closest match sooner?',
subject:name()+', Straight Update on the '+req(),
email:'Hi '+name()+',\n\nStraight update: we were not able to secure the exact '+req()+'.\n\nI am already working the next options. Which matters more now: staying exact on the configuration or getting the closest match sooner?\n\nReply with the direction and I will work that first.\n\n'+agent()
};}
function scripts(){var r=response();if(r==='pushback')return pushbackScripts();if(r==='open')return openScripts();if(r==='pending')return pendingScripts();if(r==='failed')return failedScripts();return firstScripts();}
function videoPlan(){var r=response(),focus=d().proof,close=r==='pending'?'Close with: “I will contact you the moment management gives me a real yes or no.”':r==='failed'?'Close with one choice: exact configuration or closest match sooner.':'Close with a direct time choice: '+t1()+' or '+t2()+'. Do not end with “let me know.”';return [
['1 · Face + control','Hi '+name()+', '+agent()+' at Sheehy Nissan. State that you checked their exact '+req()+' request and this video is the real update.'],
['2 · Show the real option','Show '+av()+' or the verified sister-store listing. No random substitute, no stock-image theater.'],
['3 · Name the difference first',differenceLine()],
['4 · Prove it',focus],
['5 · Tie it to their job','Show only the area that helps them decide: size, seating, cargo, driving position or the feature they actually care about.'],
['6 · Close the next step',close]
];}
function fallbackCopy(text){var ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}catch(e){}ta.remove();}
function copy(text,btn){var done=function(){var o=btn.textContent;btn.textContent='Copied';setTimeout(function(){btn.textContent=o;},900);};if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(done).catch(function(){fallbackCopy(text);done();});else{fallbackCopy(text);done();}}
function card(kind,title,text,subject){return '<div class="card '+kind+'"><div class="head"><b>'+esc(title)+'</b><button class="copy" type="button">Copy</button></div>'+(subject?'<div class="subject">'+esc(subject)+'</div>':'')+'<div class="body">'+esc(text)+'</div></div>';}
function render(){var s=scripts(),html=card('call','Call',s.call)+card('vm','Voicemail',s.vm)+card('sms','SMS',s.sms)+card('email','Email',s.email,s.subject);var vp=videoPlan(),pts='';vp.forEach(function(p){pts+='<div class="point"><b>'+esc(p[0])+'</b><span>'+esc(p[1])+'</span></div>';});var videoText=vp.map(function(p){return p[0]+'\n'+p[1];}).join('\n\n');html+='<div class="card video"><div class="head"><b>Video · 6PO, about 60 seconds</b><button class="copy" type="button">Copy pointers</button></div><div class="video-grid">'+pts+'</div></div>';$('scripts').innerHTML=html;var cards=$('scripts').querySelectorAll('.card');cards.forEach(function(c,i){var b=c.querySelector('.copy');if(i===3)b.onclick=function(){copy('Subject: '+s.subject+'\n\n'+s.email,b);};else if(i===4)b.onclick=function(){copy(videoText,b);};else b.onclick=function(){copy(c.querySelector('.body').textContent,b);};});$('differenceTag').textContent=d().label;$('locationTag').textContent=location()==='sister'||diff()==='exact-sister'?'Sister store':'Our lot';var labels={first:'First response',pushback:'Mismatch pushback',open:'Open to compare',pending:'Transfer check pending',failed:'Exact unit unavailable'};$('responseTag').textContent=labels[response()]||'First response';$('matchSummary').innerHTML='<b>What is different:</b> '+esc(d().line)+' <b>How to frame it:</b> '+esc(differenceLine());}
document.querySelectorAll('[data-f]').forEach(function(el){var k=el.getAttribute('data-f');if(F[k])el.value=F[k];el.addEventListener('input',function(){F[k]=el.value.trim();save();render();});});['availableVeh','location','difference','response'].forEach(function(id){$(id).addEventListener(id==='availableVeh'?'input':'change',render);});render();
})();