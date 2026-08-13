/* Prefill Sister Store from the Funnel unavailable-vehicle branch. */
(function(){
'use strict';
function apply(){
  var raw='';try{raw=sessionStorage.getItem('shq_sister_prefill_v1')||'';}catch(e){}
  if(!raw)return;
  var data={};try{data=JSON.parse(raw)||{};}catch(e){return;}
  var a=document.getElementById('availableVeh'),loc=document.getElementById('location');
  if(a&&data.available){a.value=data.available;a.dispatchEvent(new Event('input',{bubbles:true}));}
  if(loc&&data.location){loc.value=data.location;loc.dispatchEvent(new Event('change',{bubbles:true}));}
  try{sessionStorage.removeItem('shq_sister_prefill_v1');}catch(e){}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
})();
