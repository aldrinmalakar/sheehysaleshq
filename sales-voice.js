/* SHEEHY SALES HQ - page-safe voice loader. */
(function(){
'use strict';
var page=(location.pathname.split('/').pop()||'').toLowerCase();
var src=(page==='after-sale.html'||page==='sister-store.html')?'./relationship-voice.js':'./sales-voice-core.js';
var id=src.indexOf('relationship')>-1?'shqRelationshipVoiceCore':'shqSalesVoiceCore';
if(document.getElementById(id))return;
var s=document.createElement('script');s.id=id;s.src=src;s.onerror=function(){if(window.console&&console.warn)console.warn('Sales HQ could not load '+src);};(document.head||document.documentElement).appendChild(s);
})();
