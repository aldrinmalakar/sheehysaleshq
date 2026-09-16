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
function loadOnce(id,src,done){
  var old=document.getElementById(id);if(old){if(done)done();return;}
  var s=document.createElement('script');s.id=id;s.src=src;s.onload=function(){if(done)done();};
  s.onerror=function(){if(g.console&&console.warn)console.warn('Sales HQ could not load '+src);};
  (document.head||document.documentElement).appendChild(s);
}
function loadFinalVoice(){
  loadOnce('shqFunnelCallVoice','./funnel-call-voice.js',function(){
    loadOnce('shqFunnelNegotiationVoice','./funnel-negotiation-voice.js',function(){
      loadOnce('shqFunnelNegotiationSafety','./funnel-negotiation-safety.js',function(){
        loadOnce('shqFunnelVideoNegotiation','./funnel-video-negotiation.js');
      });
    });
  });
}
function bind(){
  apply();
  var stage=$('stageSelect');if(stage)stage.addEventListener('change',apply);
  g.addEventListener('shq:funnel-state-change',apply);
  g.addEventListener('shq:funnel-context-change',apply);
  /* Deferred after the earlier Funnel layers: spoken phone voice, negotiation,
     contact-stop guard, then the decision-focused video presentation layer. */
  loadFinalVoice();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})(window);
