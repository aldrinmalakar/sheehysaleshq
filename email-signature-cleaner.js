/* Remove generated email signatures; the mail system supplies Aldrin's signature. */
(function(g){
'use strict';
function clean(t){
  var s=String(t||'').replace(/\r/g,'');
  var lines=s.split('\n');
  while(lines.length&&/^\s*$/.test(lines[lines.length-1]))lines.pop();
  var sig=/^(?:\[agent\]|Aldrin(?: Malakar)?|Sheehy Nissan(?: of Manassas)?|Sales and Leasing Consultant|\(?571\)?[\s.-]*292[\s.-]*8302|\(?703\)?[\s.-]*996[\s.-]*9877|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})\s*$/i;
  while(lines.length&&sig.test(lines[lines.length-1].trim())){lines.pop();while(lines.length&&/^\s*$/.test(lines[lines.length-1]))lines.pop();}
  return lines.join('\n').trimEnd();
}
g.SHQCleanEmailSignature=clean;
function cleanNode(el){
  if(!el)return;
  if(el.tagName==='TEXTAREA'||el.tagName==='INPUT'){var n=clean(el.value);if(n!==el.value)el.value=n;}
  else{var x=clean(el.textContent);if(x!==el.textContent)el.textContent=x;}
}
function apply(){
  ['#bodyOut','.card.email .body','.email .body','.output.email .outBody','[data-email-body]'].forEach(function(sel){document.querySelectorAll(sel).forEach(cleanNode);});
}
var timer=null;function schedule(){clearTimeout(timer);timer=setTimeout(apply,20);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
if(g.MutationObserver&&document.body)new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,characterData:true});
document.addEventListener('input',schedule);document.addEventListener('change',schedule);
})(window);