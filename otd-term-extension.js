/* Add extended finance term without changing calculator math. */
(function(){
'use strict';
function apply(){var s=document.getElementById('term');if(!s||s.querySelector('option[value="96"]'))return;var o=document.createElement('option');o.value='96';o.textContent='96 months';s.appendChild(o);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
})();