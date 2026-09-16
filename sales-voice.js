/* SHEEHY SALES HQ - page-safe voice loader. */
(function(){
'use strict';
var page=(location.pathname.split('/').pop()||'').toLowerCase();
/* Sister Store owns its final decision-driven customer language directly. */
if(page==='sister-store.html')return;
var survey=(page==='survey.html');
var relationship=(page==='after-sale.html');
var src=survey?'./survey-voice.js':relationship?'./relationship-voice.js':'./sales-voice-core.js';
var id=survey?'shqSurveyVoiceCore':relationship?'shqRelationshipVoiceCore':'shqSalesVoiceCore';
function loadExtra(extraId,extraSrc,done){
  if(document.getElementById(extraId)){if(done)done();return;}
  var x=document.createElement('script');x.id=extraId;x.src=extraSrc;x.onload=function(){if(done)done();};x.onerror=function(){if(window.console&&console.warn)console.warn('Sales HQ could not load '+extraSrc);};(document.head||document.documentElement).appendChild(x);
}
function loadSafety(){
  if(page==='sms-library.html')loadExtra('shqSmsSpecialtySafety','./sms-specialty-safety.js');
  if(page==='email-library.html')loadExtra('shqEmailMarketSafety','./email-market-safety.js');
  if(page==='objection-library.html')loadExtra('shqObjectionSpecialtyVoice','./objection-specialty-voice.js',function(){loadExtra('shqObjectionNegotiationVoice','./objection-negotiation-voice.js');});
  if(page==='reconnect.html')loadExtra('shqReconnectVoiceSafety','./reconnect-voice-safety.js',function(){loadExtra('shqReconnectNegotiationVoice','./reconnect-negotiation-voice.js');});
}
if(document.getElementById(id)){loadSafety();return;}
var s=document.createElement('script');s.id=id;s.src=src;s.onload=loadSafety;s.onerror=function(){if(window.console&&console.warn)console.warn('Sales HQ could not load '+src);};(document.head||document.documentElement).appendChild(s);
})();
