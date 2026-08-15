/* SHEEHY SALES HQ - final reconnect phrasing cleanup. */
(function(){
'use strict';
if((location.pathname.split('/').pop()||'').toLowerCase()!=='reconnect.html')return;
var timer=null;
function $(id){return document.getElementById(id);}
function patch(){
  var call=$('callOut'),body=$('bodyOut');
  if(call){
    var c=call.value;
    c=c.replace(/So\s+If I set aside twenty minutes/gi,'I will make this easy. If I set aside twenty minutes');
    c=c.replace(/\[cue\]Permission ask, easy exit/gi,'[cue]Clear status choice, easy exit');
    c=c.replace(/First one to speak loses the slot\./gi,'Then stop talking and let them answer.');
    if(c!==call.value)call.value=c;
  }
  if(body){
    var b=body.value;
    b=b.replace(/so\s+in this note at all\./gi,'so I will make this easy.');
    b=b.replace(/Worth a fresh look, or should I leave you be\? Either answer is a good answer\./gi,'Which is true now: worth a fresh look, already handled or pause this for now?');
    if(b!==body.value)body.value=b;
  }
}
function schedule(){clearTimeout(timer);timer=setTimeout(patch,0);}
patch();document.addEventListener('input',schedule);document.addEventListener('change',schedule);document.addEventListener('click',schedule);
})();
