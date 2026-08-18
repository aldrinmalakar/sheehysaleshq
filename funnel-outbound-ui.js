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
  var out=isOutbound(),video=$('videoPanel'),follow=$('videoFollowupPanel')||$('activityPanel'),hint=$('outboundStageHint');
  if(video)video.hidden=out;
  if(follow)follow.hidden=out;
  if(hint)hint.hidden=!out;
}
function bind(){
  apply();
  var stage=$('stageSelect');if(stage)stage.addEventListener('change',apply);
  g.addEventListener('shq:funnel-state-change',apply);
  g.addEventListener('shq:funnel-context-change',apply);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})(window);
