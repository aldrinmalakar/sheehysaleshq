/* SHEEHY SALES HQ - Owner / Outbound UI discipline. */
(function(g){
'use strict';
function $(id){return document.getElementById(id);}
function isOutbound(){var s=$('stageSelect');return !!s&&s.value==='outbound';}
function ensureHint(){
  var scripts=$('scripts');if(!scripts||$('outboundStageHint'))return;
  var hint=document.createElement('div');hint.id='outboundStageHint';hint.className='notice';hint.style.marginTop='10px';
  hint.textContent='Owner / Outbound is a conversation stage. Once you have a specific replacement vehicle or a real shopping direction, move the Funnel to Engaged Remote. Vehicle-specific video and appointment work belongs there.';
  scripts.parentNode.insertBefore(hint,scripts.nextSibling);
}
function apply(){
  ensureHint();
  var out=isOutbound(),video=$('videoPanel'),follow=$('videoFollowupPanel')||$('activityPanel'),hint=$('outboundStageHint'),activityJump=document.querySelector('.funnel-jump-nav a[href="#activityPanel"]');
  if(video)video.hidden=out;
  if(follow)follow.hidden=out;
  if(activityJump)activityJump.hidden=out;
  if(hint)hint.hidden=!out;
}
function loadPhoneVoice(){
  if(document.getElementById('shqFunnelCallVoice'))return;
  var s=document.createElement('script');s.id='shqFunnelCallVoice';s.src='./funnel-call-voice.js';
  s.onerror=function(){if(g.console&&console.warn)console.warn('Sales HQ could not load funnel-call-voice.js');};
  (document.head||document.documentElement).appendChild(s);
}
function bind(){
  apply();
  var stage=$('stageSelect');if(stage)stage.addEventListener('change',apply);
  g.addEventListener('shq:funnel-state-change',apply);
  g.addEventListener('shq:funnel-context-change',apply);
  /* This deferred UI file runs after contact-control, so the spoken phone voice
     becomes the final Funnel resolver without disturbing earlier behavior logic. */
  loadPhoneVoice();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})(window);
