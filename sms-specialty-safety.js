/* SHEEHY SALES HQ - final warm-confidence cleanup for local SMS specialty cards. */
(function(){
'use strict';
if((location.pathname.split('/').pop()||'').toLowerCase()!=='sms-library.html')return;
var queued=false;
var OVERRIDE={
  'Appt reminder|Meet you out front':'Hi [Name], quick reminder we are on for [day/time]. I appreciate you making the time. Text me when you are heading over and I will meet you out front so you are not waiting around.',
  'Left with proposals|Narrow the field':'Hi [Name], you have a few real options in front of you. What is deciding this: the total numbers, monthly comfort or how the vehicle fits? Give me the one priority and I will help you narrow it.',
  'Left with proposals|Questions on the numbers':'Hi [Name], if anything on those proposals is not clear, send me the exact line. I want you deciding with facts, not guessing. What is the one number or line item you want cleared up first?',
  'Left with proposals|Which one keeps standing out':'Hi [Name], simple one: which vehicle keeps coming back to mind, and what is the one thing keeping that one from being a yes?',
  'Sold or swap|Something better':'Hi [Name], straight update: the exact [vehicle] is no longer available. I do have a verified alternative worth comparing, but I am not going to pretend it is the same vehicle. Do you want the differences first or a time to see it?'
};
function clean(t){
  return String(t||'')
    .replace(/\bno pressure(?: at all)?[,.]?\s*/gi,'')
    .replace(/\bjust checking in\b/gi,'checking in with a purpose')
    .replace(/\bcircling back\b/gi,'following up')
    .replace(/\bwould you be open to\b/gi,'does it make sense to')
    .replace(/\bif you want\b/gi,'when it makes sense')
    .replace(/[ \t]{2,}/g,' ');
}
function patch(){
  document.querySelectorAll('#grid .card').forEach(function(card){
    if(card.dataset&&card.dataset.canonicalWordtrack)return;
    var tag=card.querySelector('.tag'),title=card.querySelector('.card-title'),msg=card.querySelector('textarea.msg');if(!tag||!title||!msg)return;
    var key=tag.textContent.trim()+'|'+title.textContent.trim(),next=OVERRIDE[key]||clean(msg.value);
    if(next!==msg.value){msg.value=next;try{msg.dispatchEvent(new Event('input'));}catch(e){}}
  });
}
function schedule(){if(queued)return;queued=true;setTimeout(function(){queued=false;patch();},0);}
patch();
var grid=document.getElementById('grid');if(grid&&window.MutationObserver)new MutationObserver(schedule).observe(grid,{childList:true,subtree:true});
document.addEventListener('change',schedule);document.addEventListener('click',schedule);
})();
