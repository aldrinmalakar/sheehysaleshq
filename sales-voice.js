/* SHEEHY SALES HQ - page-safe voice loader. */
(function(){
'use strict';
var page=(location.pathname.split('/').pop()||'').toLowerCase();
var relationship=(page==='after-sale.html'||page==='sister-store.html');
var src=relationship?'./relationship-voice.js':'./sales-voice-core.js';
var id=relationship?'shqRelationshipVoiceCore':'shqSalesVoiceCore';
if(document.getElementById(id))return;
function loadSafety(){
  if(page!=='email-library.html'||document.getElementById('shqEmailMarketSafety'))return;
  var x=document.createElement('script');x.id='shqEmailMarketSafety';x.src='./email-market-safety.js';x.onerror=function(){if(window.console&&console.warn)console.warn('Sales HQ could not load '+x.src);};(document.head||document.documentElement).appendChild(x);
}
var s=document.createElement('script');s.id=id;s.src=src;s.onload=loadSafety;s.onerror=function(){if(window.console&&console.warn)console.warn('Sales HQ could not load '+src);};(document.head||document.documentElement).appendChild(s);
})();
