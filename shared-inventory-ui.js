/* Customer-facing shared-inventory terminology. */
(function(){
'use strict';
if((location.pathname.split('/').pop()||'').toLowerCase()!=='sister-store.html')return;
var busy=false;
function replaceText(root){if(!root)return;var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null),n;while((n=walker.nextNode())){var t=n.nodeValue;if(/sister store/i.test(t))n.nodeValue=t.replace(/sister store/ig,'shared inventory');if(/sister-store/i.test(n.nodeValue))n.nodeValue=n.nodeValue.replace(/sister-store/ig,'shared-inventory');}}
function apply(){if(busy)return;busy=true;
  var h=document.querySelector('h1');if(h)h.textContent='Shared Inventory / Comparable';
  var sub=document.querySelector('.sub');if(sub)sub.textContent='Protect the exact request, explain only the meaningful difference, and earn the commitment required before we move shared inventory.';
  var loc=document.getElementById('location');if(loc)Array.prototype.forEach.call(loc.options,function(o){if(o.value==='sister')o.textContent='Shared group inventory';});
  var diff=document.getElementById('difference');if(diff)Array.prototype.forEach.call(diff.options,function(o){if(o.value==='exact-sister')o.textContent='Exact match in shared inventory';});
  var resp=document.getElementById('response');if(resp)Array.prototype.forEach.call(resp.options,function(o){if(o.value==='pending')o.textContent='Manager checking shared vehicle';if(o.value==='secured')o.textContent='Manager approved shared vehicle';if(o.value==='failed')o.textContent='Shared vehicle could not be secured';});
  replaceText(document.body);document.title='Shared Inventory / Comparable | Sheehy Sales HQ';busy=false;
}
function schedule(){setTimeout(apply,0);}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();if(window.MutationObserver&&document.body)new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,characterData:true});
})();