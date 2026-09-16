/* Final operating copy for the Objections page. */
(function(){
'use strict';
if((location.pathname.split('/').pop()||'').toLowerCase()!=='objection-library.html')return;
function apply(){var foot=document.querySelector('.foot');if(foot)foot.textContent='Use the customer’s exact objection. Make it specific, isolate it, solve the real gap, then re-close. Do not answer three objections when the customer only gave you one.';}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
})();
