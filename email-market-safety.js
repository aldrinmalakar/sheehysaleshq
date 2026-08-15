/* SHEEHY SALES HQ - safety + confidence cleanup for local Email Library templates. */
(function(){
'use strict';
if((location.pathname.split('/').pop()||'').toLowerCase()!=='email-library.html')return;
var queued=false;
function replaceText(t){
  var x=String(t||'');
  x=x.replace(/We are at a point in the month where I have a little more room to work for you on the \[vehicle\]\.?/gi,'I can verify the current programs and numbers on the [vehicle] and tell you exactly where it stands today.');
  x=x.replace(/If you were close before, this is a good week to talk\.?/gi,'If the [vehicle] is still in play, let us work the current facts instead of guessing what timing may do.');
  x=x.replace(/When that happens there is usually good movement on the current ones[^.]*\./gi,'If you are comparing model years, I can verify the current vehicles and numbers and show you the real difference.');
  x=x.replace(/These tend not to sit long\.?/gi,'I will verify the exact vehicle before I ask you to make plans around it.');
  x=x.replace(/I can hold it briefly and send you a couple photos/gi,'I can verify the exact one and send you a couple photos');
  x=x.replace(/Some new offers just came through this month that could work in your favor on the \[vehicle\]\.?/gi,'There may be current programs on the [vehicle] worth reviewing, and I will verify what actually applies before I quote anything.');
  x=x.replace(/a few things changed this month that might help on the \[vehicle\]\.?/gi,'I can verify the current programs on the [vehicle] and give you the clean answer.');
  x=x.replace(/Trade values have been stronger than people expect lately\.?/gi,'I can get you a current appraisal instead of guessing from a market headline.');
  x=x.replace(/Your \[current\] may be worth more right now than you think\.?/gi,'If you are curious what the [current] is worth today, I can get you a current appraisal.');
  x=x.replace(/The \[vehicle\] is built for the kind of miles you put on it\.?/gi,'For the miles you put on, we should judge the [vehicle] on fuel use, comfort, maintenance and downtime instead of a slogan.');
  x=x.replace(/a newer one may land closer to what you expect than you would guess\.?/gi,'I can show you what a change would actually look like with verified numbers.');
  x=x.replace(/\bno pressure(?: at all)?[,.]?\s*/gi,'');
  x=x.replace(/\bWant me to put something together for you\?/gi,'Are you still close enough to make a decision if the verified numbers make sense?');
  x=x.replace(/[ \t]{2,}/g,' ');
  return x;
}
function patch(){
  document.querySelectorAll('#grid .card').forEach(function(card){
    if(card.dataset&&card.dataset.canonicalWordtrack)return;
    var body=card.querySelector('textarea.body');if(!body)return;
    var next=replaceText(body.value);if(next!==body.value)body.value=next;
  });
}
function schedule(){if(queued)return;queued=true;setTimeout(function(){queued=false;patch();},0);}
patch();
var grid=document.getElementById('grid');if(grid&&window.MutationObserver)new MutationObserver(schedule).observe(grid,{childList:true,subtree:true});
document.addEventListener('input',schedule);document.addEventListener('change',schedule);document.addEventListener('click',schedule);
})();
