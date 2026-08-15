/* SHEEHY SALES HQ - page-safe voice loader. */
(function(){
'use strict';
var page=(location.pathname.split('/').pop()||'').toLowerCase();
var relationship=(page==='after-sale.html'||page==='sister-store.html');
var src=relationship?'./relationship-voice.js':'./sales-voice-core.js';
var id=relationship?'shqRelationshipVoiceCore':'shqSalesVoiceCore';
if(document.getElementById(id))return;
function loadExtra(extraId,extraSrc){
  if(document.getElementById(extraId))return;
  var x=document.createElement('script');x.id=extraId;x.src=extraSrc;x.onerror=function(){if(window.console&&console.warn)console.warn('Sales HQ could not load '+extraSrc);};(document.head||document.documentElement).appendChild(x);
}
function loadSafety(){
  if(page==='sms-library.html')loadExtra('shqSmsSpecialtySafety','./sms-specialty-safety.js');
  if(page==='email-library.html')loadExtra('shqEmailMarketSafety','./email-market-safety.js');
  if(page==='objection-library.html')loadExtra('shqObjectionSpecialtyVoice','./objection-specialty-voice.js');
  if(page==='reconnect.html')loadExtra('shqReconnectVoiceSafety','./reconnect-voice-safety.js');
}
var s=document.createElement('script');s.id=id;s.src=src;s.onload=loadSafety;s.onerror=function(){if(window.console&&console.warn)console.warn('Sales HQ could not load '+src);};(document.head||document.documentElement).appendChild(s);
})();
