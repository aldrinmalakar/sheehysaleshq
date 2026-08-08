/* ============================================================
   SHEEHY SALES HQ - Funnel execution context

   Operational UI only. Customer-facing wordtracks live in Funnel
   data. Reuses shq_lead_log_v1 so existing attempt history remains.
============================================================ */
(function(g){
  'use strict';

  var LOG_KEY='shq_lead_log_v1';
  var leadState={channels:{phone:true,email:true,text:false},leadAt:''};

  function $(id){return document.getElementById(id);}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function field(name,fallback){var el=document.querySelector('[data-f="'+name+'"]'),v=el&&typeof el.value==='string'?el.value.trim():'';return v||fallback;}
  function vars(){return {name:field('name','[Name]'),vehicle:field('vehicle','[vehicle]'),current:field('current','[current]'),agent:field('agent','[agent]'),number:field('number','[number]'),email:field('email','[email]'),daytime:field('daytime','[day/time]'),alttime:field('alttime','[alt time]')};}
  function fill(text){var v=vars();return String(text==null?'':text).replace(/\[Name\]/g,v.name).replace(/\[vehicle\]/g,v.vehicle).replace(/\[current\]/g,v.current).replace(/\[agent\]/g,v.agent).replace(/\[number\]/g,v.number).replace(/\[email\]/g,v.email).replace(/\[day\/time\]/g,v.daytime).replace(/\[alt time\]/g,v.alttime);}
  function scenario(id){var list=(g.SHQFunnel&&g.SHQFunnel.scenarios)||[];for(var i=0;i<list.length;i++)if(list[i].id===id)return list[i];return null;}
  function currentStage(){var b=document.querySelector('#stages .stage.on');return b?b.getAttribute('data-stage'):'';}
  function currentScenario(){var s=$('behavior');return s?s.value:'';}
  function operationalStage(){var st=currentStage();return st==='new'||st==='attempting'||st==='outbound';}

  function addStyles(){
    var st=document.createElement('style');
    st.textContent=[
      '.leadops{margin:0;padding:0}',
      '.leadops-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:10px}',
      '.leadops-title{font-size:15px;font-weight:800;color:#1a2330;margin-bottom:2px}.leadops .opsub{font-size:11.5px;color:#6b7889;line-height:1.45}',
      '.opgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}',
      '.opbox{background:#f6f8fb;border:1px solid #edf0f4;border-radius:11px;padding:11px}.opbox.full{grid-column:1/-1}',
      '.oplabel{font-size:10px;text-transform:uppercase;letter-spacing:.07em;color:#6b7889;font-weight:800;margin-bottom:7px}',
      '.opchips{display:flex;gap:6px;flex-wrap:wrap}.opchip{border:1px solid #dce2ea;background:#fff;color:#5e6a7a;border-radius:999px;padding:6px 10px;font-size:11.5px;font-weight:700;cursor:pointer}.opchip.on{background:#2f5fe0;border-color:#2f5fe0;color:#fff}',
      '.opage{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.agepill{border:1px solid #dce2ea;border-radius:999px;padding:5px 9px;font-size:11px;font-weight:800;color:#6b7889;background:#fff}.agepill.hot{color:#16794a;border-color:#a9d7bd;background:#eff9f3}.agepill.warm{color:#2f5fe0;border-color:#c7d5fb;background:#f3f6ff}.agepill.cool{color:#8a5a12;border-color:#ead19c;background:#fff9ed}.agepill.cold{color:#a52e42;border-color:#efc3ca;background:#fff4f5}',
      '.opselects{display:grid;grid-template-columns:1fr 1fr;gap:8px}.opselects select,.oplog select{width:100%;margin-top:4px;border:1px solid #d8dee7;border-radius:8px;padding:8px 9px;background:#fff;font:inherit;font-size:12.5px}',
      '.notice{white-space:pre-wrap;background:#fff;border:1px solid #dce2ea;border-radius:9px;padding:10px;font-size:13px;line-height:1.5;margin-top:8px}',
      '.opactions{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px}.opbtn{border:1px solid #2f5fe0;background:#2f5fe0;color:#fff;border-radius:8px;padding:7px 10px;font-size:11.5px;font-weight:750;cursor:pointer}.opbtn.ghost{background:#fff;color:#2f5fe0}.opbtn.muted{border-color:#dce2ea;color:#6b7889;background:#fff}',
      '.channel-note{font-size:11px;color:#6b7889;margin-top:7px;line-height:1.45}',
      '.opdetails{margin-top:10px;border:1px solid #e4e8ee;border-radius:10px;background:#fff}.opdetails summary{cursor:pointer;padding:10px 11px;font-size:12px;font-weight:800;color:#536174;list-style-position:inside}.opdetails[open] summary{border-bottom:1px solid #edf0f4}.opdetails-body{padding:11px}',
      '.oplog{display:grid;grid-template-columns:1fr 1fr auto;gap:7px;align-items:end}.oplog label{font-size:10px}.loglist{margin-top:9px}.logitem{display:flex;justify-content:space-between;gap:9px;padding:7px 0;border-top:1px solid #edf0f4;font-size:12px}.logmeta{color:#6b7889;font-size:11px}.logrm{border:0;background:none;color:#a52e42;font-size:11px;cursor:pointer}',
      '@media(max-width:720px){.opgrid,.opselects{grid-template-columns:1fr}.opbox.full{grid-column:auto}.oplog{grid-template-columns:1fr 1fr}.oplog .opbtn{grid-column:1/-1}}'
    ].join('');
    document.head.appendChild(st);
  }

  function panelHtml(){
    return '<section class="leadops" id="leadOps">'
      +'<div class="leadops-head"><div><div class="leadops-title" id="leadOpsTitle">Lead setup and execution</div><div class="opsub" id="leadOpsSub">Set the real channels and timing here. The behavior selector above is the only place you describe what happened.</div></div><button class="opbtn muted" id="leadReset" type="button">Reset setup</button></div>'
      +'<div class="opgrid">'
      +'<div class="opbox" id="leadTimingBox"><div class="oplabel">Lead timing</div><div class="opage"><input type="datetime-local" id="leadAt" style="flex:1;min-width:190px;border:1px solid #d8dee7;border-radius:8px;padding:8px 9px;font:inherit;font-size:12.5px"><button class="opbtn ghost" id="leadNow" type="button">Now</button><span class="agepill" id="leadAge">Set arrival time</span></div><div class="channel-note" id="leadAgeHint">Fresh lead speed matters. Set the actual arrival time when you want the urgency cue.</div></div>'
      +'<div class="opbox"><div class="oplabel">Channels you actually have</div><div class="opchips" id="leadChannels"></div><div class="channel-note">Phone does not automatically mean text. The scripts below hide channels you cannot use.</div></div>'
      +'<div class="opbox full" id="videoOps"><div class="oplabel">DriveCentric video follow-up</div><div class="opselects"><label>Video sent by<select id="videoVia"></select></label><label>Heads-up by<select id="notifyVia"></select></label></div><div class="notice" id="videoNotice"></div><div class="opactions"><button class="opbtn ghost" id="copyNotice" type="button">Copy heads-up</button><button class="opbtn" id="logVideo" type="button">Log video sent</button><button class="opbtn ghost" id="logNotice" type="button">Log heads-up sent</button></div><div class="channel-note">If email is your only channel, both actions stay on email. If email and text are available, the heads-up defaults to the other channel.</div></div>'
      +'</div>'
      +'<details class="opdetails" id="attemptDetails"><summary id="attemptSummary">Attempt log</summary><div class="opdetails-body"><div class="oplog"><label>Activity<select id="logWhat"><option>Called, connected</option><option>Called, left voicemail</option><option>Called, no answer</option><option>Texted</option><option>Emailed</option><option>Sent video by email</option><option>Sent video by text</option><option>Video notice by email</option><option>Video notice by text</option></select></label><label>Result<select id="logResult"><option>No response yet</option><option>Replied</option><option>Appointment set</option><option>Callback scheduled</option><option>Not interested</option><option>Bad contact info</option></select></label><button class="opbtn" id="logAdd" type="button">Log attempt</button></div><div class="loglist" id="leadLog"></div><div class="channel-note">Saved on this browser only. DriveCentric remains the store system of record, so assigned-customer activity still belongs there.</div></div></details>'
      +'</section>';
  }

  function renderChannels(){
    var box=$('leadChannels');if(!box)return;
    var defs=[['phone','Phone'],['email','Email'],['text','Okay to text']];
    box.innerHTML='';
    defs.forEach(function(d){
      var b=document.createElement('button');b.type='button';b.className='opchip'+(leadState.channels[d[0]]?' on':'');b.textContent=d[1];
      b.onclick=function(){leadState.channels[d[0]]=!leadState.channels[d[0]];renderChannels();renderVideo();syncScriptAvailability();};
      box.appendChild(b);
    });
  }

  function applyScenarioChannels(){
    var id=currentScenario();
    if(id==='fresh-email-only')leadState.channels={phone:false,email:true,text:false};
    else if(id==='fresh-text-only')leadState.channels={phone:false,email:false,text:true};
    else if(id==='bad-contact'){leadState.channels.phone=false;leadState.channels.text=false;}
    else if(id==='first-voicemail'||id==='first-no-voicemail')leadState.channels.phone=true;
    else if(id==='video-email-notice')leadState.channels.email=true;
    else if(id==='video-text-notice')leadState.channels.text=true;
  }

  function renderStageOps(){
    var section=$('executionSection'),panel=$('leadOps'),st=currentStage();
    var relevant=operationalStage();
    if(section)section.style.display=relevant?'':'none';
    if(panel)panel.style.display=relevant?'':'none';
    if(!relevant){syncScriptAvailability();return;}

    var owner=st==='outbound';
    if($('leadOpsTitle'))$('leadOpsTitle').textContent=owner?'Owner / outbound execution':'Lead setup and execution';
    if($('leadOpsSub'))$('leadOpsSub').textContent=owner?'Use the behavior above for the owner response. Keep only the channels you can actually use, then work the matching wordtrack below.':'Use the behavior above as the single source of truth for what happened. Timing, channels, video delivery and logging live directly under it.';
    if($('leadTimingBox'))$('leadTimingBox').style.display=owner?'none':'';
    if($('videoOps'))$('videoOps').style.display=owner?'none':'';
    renderChannels();renderVideo();renderLog();syncScriptAvailability();
  }

  function minsOld(){if(!leadState.leadAt)return null;var d=new Date(leadState.leadAt);if(isNaN(d))return null;return Math.max(0,Math.round((Date.now()-d.getTime())/60000));}
  function renderAge(){
    var pill=$('leadAge'),hint=$('leadAgeHint');if(!pill)return;
    var m=minsOld();pill.className='agepill';
    if(m==null){pill.textContent='Set arrival time';hint.textContent='Fresh lead speed matters. Set the actual arrival time when you want the urgency cue.';return;}
    if(m<=15){pill.classList.add('hot');pill.textContent=m+'m old · call now';hint.textContent='This is the strongest response window. Use the available channels immediately, then send the video.';return;}
    if(m<=120){pill.classList.add('warm');pill.textContent=Math.max(1,Math.round(m/60))+'h old';hint.textContent='Still live. Be useful quickly and avoid a long first message.';return;}
    if(m<=1440){pill.classList.add('cool');pill.textContent=Math.max(1,Math.round(m/60))+'h old';hint.textContent='Other stores may already have contacted them. Give one useful reason to respond.';return;}
    pill.classList.add('cold');pill.textContent=Math.max(1,Math.round(m/1440))+'d old';hint.textContent='Do not pretend this is fresh. Use the Trying to Reach behavior that matches what actually happened.';
  }

  function setSelectOptions(sel,items,wanted){
    sel.innerHTML='';
    items.forEach(function(x){var o=document.createElement('option');o.value=x;o.textContent=x.charAt(0).toUpperCase()+x.slice(1);sel.appendChild(o);});
    if(items.indexOf(wanted)>-1)sel.value=wanted;
    return sel.value;
  }

  function canonicalNotice(){
    var vv=$('videoVia'),nv=$('notifyVia');
    if(!vv||!nv||vv.value==='none'||nv.value==='none')return 'No usable video delivery channel is selected.';
    var id=vv.value==='text'?'video-text-notice':'video-email-notice',s=scenario(id);if(!s)return '';
    if(nv.value==='email')return 'Subject: '+fill(s.subject)+'\n\n'+fill(s.email);
    return fill(s.sms);
  }

  function renderVideo(){
    var vv=$('videoVia'),nv=$('notifyVia');if(!vv||!nv)return;
    var avail=[];if(leadState.channels.email)avail.push('email');if(leadState.channels.text)avail.push('text');if(!avail.length)avail=['none'];
    var oldV=vv.value||'email',oldN=nv.value||'text';
    setSelectOptions(vv,avail,oldV);setSelectOptions(nv,avail.slice(),oldN);
    if(avail.length===2&&nv.value===vv.value)nv.value=vv.value==='email'?'text':'email';
    $('videoNotice').textContent=canonicalNotice();
  }

  function fallbackCopy(text){var ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}catch(e){}ta.remove();}
  function copyText(text,btn){function done(){var o=btn.textContent;btn.textContent='Copied';setTimeout(function(){btn.textContent=o;},900);}if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(done,function(){fallbackCopy(text);done();});else{fallbackCopy(text);done();}}
  function loadLog(){try{return JSON.parse(localStorage.getItem(LOG_KEY)||'[]');}catch(e){return [];}}
  function saveLog(a){try{localStorage.setItem(LOG_KEY,JSON.stringify(a));}catch(e){}}
  function addLog(what,result){var a=loadLog();a.push({id:'l'+Date.now(),who:field('name',''),what:what,res:result||'No response yet',at:new Date().toISOString()});if(a.length>100)a=a.slice(a.length-100);saveLog(a);renderLog();}
  function renderLog(){
    var box=$('leadLog');if(!box)return;
    var all=loadLog(),a=all.slice().reverse().slice(0,8),sum=$('attemptSummary');if(sum)sum.textContent='Attempt log'+(all.length?' · '+all.length+' saved':'');
    if(!a.length){box.innerHTML='<div class="channel-note">No attempts logged on this browser yet.</div>';return;}
    box.innerHTML='';
    a.forEach(function(e){
      var d=new Date(e.at),row=document.createElement('div');row.className='logitem';
      row.innerHTML='<div><b>'+esc(e.who||'Lead')+'</b> · '+esc(e.what)+'<div class="logmeta">'+esc(e.res)+' · '+d.toLocaleDateString('en-US',{month:'short',day:'numeric'})+' '+d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})+'</div></div>';
      var rm=document.createElement('button');rm.className='logrm';rm.textContent='Remove';rm.onclick=function(){saveLog(loadLog().filter(function(x){return x.id!==e.id;}));renderLog();};
      row.appendChild(rm);box.appendChild(row);
    });
  }

  function syncScriptAvailability(){
    var relevant=operationalStage();
    document.querySelectorAll('#scripts .card').forEach(function(card){
      if(!relevant){card.style.display='';return;}
      var c=card.querySelector('.channel');if(!c)return;
      var label=(c.childNodes[0]&&c.childNodes[0].nodeValue||c.textContent||'').trim().toLowerCase(),show=true;
      if(label.indexOf('call')===0||label.indexOf('voicemail')===0)show=leadState.channels.phone;
      else if(label.indexOf('sms')===0)show=leadState.channels.text;
      else if(label.indexOf('email')===0)show=leadState.channels.email;
      else if(label.indexOf('video')===0)show=leadState.channels.email||leadState.channels.text;
      card.style.display=show?'':'none';
    });
  }

  function renderAllOps(){applyScenarioChannels();renderChannels();renderAge();renderStageOps();renderVideo();renderLog();syncScriptAvailability();}

  function reset(){
    leadState.channels={phone:true,email:true,text:false};leadState.leadAt='';
    if($('leadAt'))$('leadAt').value='';
    applyScenarioChannels();renderAllOps();
  }

  function bind(){
    $('leadAt').addEventListener('input',function(){leadState.leadAt=this.value;renderAge();});
    $('leadNow').onclick=function(){var d=new Date(),z=d.getTimezoneOffset()*60000;$('leadAt').value=new Date(d-z).toISOString().slice(0,16);leadState.leadAt=$('leadAt').value;renderAge();};
    $('leadReset').onclick=reset;
    $('videoVia').addEventListener('change',renderVideo);$('notifyVia').addEventListener('change',renderVideo);
    $('copyNotice').onclick=function(){copyText(canonicalNotice(),this);};
    $('logVideo').onclick=function(){var v=$('videoVia').value;if(v!=='none')addLog('Sent video by '+v,'No response yet');};
    $('logNotice').onclick=function(){var v=$('notifyVia').value;if(v!=='none')addLog('Video notice by '+v,'No response yet');};
    $('logAdd').onclick=function(){addLog($('logWhat').value,$('logResult').value);};

    var behavior=$('behavior');
    if(behavior)behavior.addEventListener('change',function(){setTimeout(function(){applyScenarioChannels();renderStageOps();renderVideo();syncScriptAvailability();},0);});
    document.addEventListener('click',function(e){if(e.target&&e.target.matches&&e.target.matches('#stages .stage'))setTimeout(function(){applyScenarioChannels();renderStageOps();renderVideo();syncScriptAvailability();},0);});
    document.addEventListener('input',function(e){if(e.target&&e.target.matches&&e.target.matches('[data-f]'))setTimeout(renderVideo,0);});

    var scripts=$('scripts');
    if(scripts&&g.MutationObserver){var queued=false;new MutationObserver(function(){if(queued)return;queued=true;setTimeout(function(){queued=false;syncScriptAvailability();},0);}).observe(scripts,{childList:true,subtree:true});}
    setInterval(renderAge,30000);
  }

  function inject(){
    if($('leadOps'))return;
    var mount=$('stageOpsMount');
    if(!mount)return;
    var holder=document.createElement('div');holder.innerHTML=panelHtml();mount.appendChild(holder.firstChild);bind();renderAllOps();
  }

  function start(){addStyles();inject();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})(window);
