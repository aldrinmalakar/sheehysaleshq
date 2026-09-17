/* Customer-facing shared-inventory terminology. */
(function(){
'use strict';
if((location.pathname.split('/').pop()||'').toLowerCase()!=='sister-store.html')return;
function apply(){
  var h=document.querySelector('h1');if(h)h.textContent='Shared Inventory / Comparable';
  var sub=document.querySelector('.sub');if(sub)sub.textContent='Protect the exact request, explain only the meaningful difference, and earn the commitment required before we move shared inventory.';
  var loc=document.getElementById('location');if(loc){Array.prototype.forEach.call(loc.options,function(o){if(o.value==='sister')o.textContent='Shared group inventory';});}
  var diff=document.getElementById('difference');if(diff){Array.prototype.forEach.call(diff.options,function(o){if(o.value==='exact-sister')o.textContent='Exact match in shared inventory';});}
  var resp=document.getElementById('response');if(resp){Array.prototype.forEach.call(resp.options,function(o){if(o.value==='pending')o.textContent='Manager checking shared vehicle';if(o.value==='secured')o.textContent='Manager approved shared vehicle';if(o.value==='failed')o.textContent='Shared vehicle could not be secured';});}
  document.title='Shared Inventory / Comparable | Sheehy Sales HQ';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
})();