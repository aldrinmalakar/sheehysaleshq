/* ============================================================
   SHEEHY SALES HQ - shared navigation and common helpers
============================================================ */
(function(){
  'use strict';

  var LINKS=[
    {href:'index.html',label:'Home'},
    {href:'funnel.html',label:'Funnel'},
    {href:'sms-library.html',label:'SMS Library'},
    {href:'email-library.html',label:'Email Library'},
    {href:'objection-library.html',label:'Objections'},
    {href:'reconnect.html',label:'Reconnect'},
    {href:'survey.html',label:'Survey'},
    {href:'sister-store.html',label:'Sister Store'},
    {href:'programs.html',label:'Programs'}
  ];
  var here=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  if(!here)here='index.html';

  var css=[
    '.shq-nav{position:sticky;top:0;z-index:9999;background:#fff;border-bottom:1px solid #e4e8ee;font-family:"Space Grotesk",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}',
    '.shq-nav *{box-sizing:border-box}',
    '.shq-inner{max-width:1080px;margin:0 auto;display:flex;align-items:center;gap:10px;padding:8px 14px;flex-wrap:wrap}',
    '.shq-brand{text-decoration:none;color:#1a2330;font-size:16px;font-weight:600;letter-spacing:.01em;white-space:nowrap}',
    '.shq-brand b{color:#2f5fe0}',
    '.shq-clock{display:flex;align-items:center;gap:7px;border:1px solid #e4e8ee;border-radius:9px;padding:5px 8px;background:#f7f9fc;white-space:nowrap}',
    '.shq-clock-time{font-size:12px;font-weight:750;color:#536174;font-variant-numeric:tabular-nums}',
    '.shq-clock-status{font-size:11px;font-weight:850;letter-spacing:.02em;color:#536174}',
    '.shq-clock.on{background:#edf8f1;border-color:#b8dfc8}.shq-clock.on .shq-clock-status{color:#16794a}',
    '.shq-clock.soon{background:#fff7e8;border-color:#efd294}.shq-clock.soon .shq-clock-status{color:#9a5b00}',
    '.shq-links{display:flex;gap:6px;flex-wrap:wrap;margin-left:auto}',
    '.shq-links a{text-decoration:none;font-size:12px;font-weight:600;color:#6b7889;border:1px solid #e4e8ee;border-radius:8px;padding:6px 10px;background:#fff;white-space:nowrap}',
    '.shq-links a:hover{border-color:#2f5fe0;color:#2f5fe0}',
    '.shq-links a.on{color:#fff;background:#2f5fe0;border-color:#2f5fe0}',
    '@media(max-width:720px){.shq-inner{gap:7px}.shq-clock{order:2;margin-left:auto}.shq-links{order:3;width:100%;margin-left:0;flex-wrap:nowrap;overflow-x:auto;padding-bottom:2px}.shq-links a{flex:0 0 auto}}'
  ].join('');
  var style=document.createElement('style');style.textContent=css;(document.head||document.documentElement).appendChild(style);

  function build(){
    if(document.getElementById('shqNav'))return;
    var links=LINKS.map(function(l){return '<a href="'+l.href+'"'+(l.href.toLowerCase()===here?' class="on"':'')+'>'+l.label+'</a>';}).join('');
    var bar=document.createElement('div');bar.className='shq-nav';bar.id='shqNav';
    bar.innerHTML='<div class="shq-inner"><a class="shq-brand" href="index.html">Sheehy <b>Sales HQ</b></a><div class="shq-clock" id="shqUpClock" title="Strategic UP windows, Eastern Time"><span class="shq-clock-time" id="shqClockTime">--:--</span><span class="shq-clock-status" id="shqClockStatus">UP schedule</span></div><div class="shq-links">'+links+'</div></div>';
    document.body.insertBefore(bar,document.body.firstChild);startUpClock();
  }

  /* Strategic UP windows, Eastern Time. */
  var UP_WINDOWS={0:[[650,870],[930,1050]],1:[[690,780],[990,1125]],2:[[690,780],[990,1125]],3:[[690,780],[990,1125]],4:[[690,780],[990,1125]],5:[[660,810],[930,1140]],6:[[530,690],[750,990]]};
  var DAY_SHORT={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6},DAY_NAME=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  function eastNow(){var parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',weekday:'short',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).formatToParts(new Date()),o={day:0,h:0,m:0,s:0};parts.forEach(function(p){if(p.type==='weekday')o.day=DAY_SHORT[p.value];if(p.type==='hour')o.h=parseInt(p.value,10)%24;if(p.type==='minute')o.m=parseInt(p.value,10);if(p.type==='second')o.s=parseInt(p.value,10);});return o;}
  function fmtClock(){return new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hour:'numeric',minute:'2-digit',second:'2-digit'}).format(new Date());}
  function fmtMin(min){var h=Math.floor(min/60),m=min%60,ap=h>=12?'PM':'AM';return (h%12||12)+':'+String(m).padStart(2,'0')+' '+ap;}
  function fmtLeft(min){if(min<60)return min+'m';var h=Math.floor(min/60),m=min%60;return h+'h'+(m?' '+m+'m':'');}
  function upStatus(now){var cur=now.h*60+now.m,today=UP_WINDOWS[now.day]||[],i,d,day,list,j,diff,soon,when;for(i=0;i<today.length;i++)if(cur>=today[i][0]&&cur<today[i][1])return {mode:'on',text:'UP NOW · '+fmtLeft(today[i][1]-cur)+' left',title:'Current window: '+fmtMin(today[i][0])+' to '+fmtMin(today[i][1])};for(d=0;d<=7;d++){day=(now.day+d)%7;list=UP_WINDOWS[day]||[];for(j=0;j<list.length;j++){diff=d===0?list[j][0]-cur:(1440-cur)+((d-1)*1440)+list[j][0];if(diff>0){soon=diff<=10;when=(d===0?'Today':d===1?'Tomorrow':DAY_NAME[day])+' '+fmtMin(list[j][0]);return {mode:soon?'soon':'later',text:soon?'UP IN '+diff+'m':'Next UP '+when+' · '+fmtLeft(diff),title:'Next window: '+when+' to '+fmtMin(list[j][1])};}}}return {mode:'later',text:'UP schedule',title:'Strategic UP schedule'};}
  function startUpClock(){var box=document.getElementById('shqUpClock'),t=document.getElementById('shqClockTime'),s=document.getElementById('shqClockStatus');if(!box||!t||!s)return;function tick(){var st=upStatus(eastNow());t.textContent=fmtClock();s.textContent=st.text;box.title=st.title+' · Eastern Time';box.classList.remove('on','soon');if(st.mode==='on')box.classList.add('on');if(st.mode==='soon')box.classList.add('soon');}tick();setInterval(tick,1000);}

  /* Keep the preserved legacy workspace from reviving the retired AI helper. */
  function disableLegacyAI(){if(here!=='legacy-workspace.html')return;try{['aiKey','aiProvider','aiModel_claude','aiModel_openai','aiModel_gemini'].forEach(function(k){localStorage.removeItem(k);});}catch(e){}function strip(){document.querySelectorAll('.aicard').forEach(function(el){if(el.parentNode)el.parentNode.removeChild(el);});}strip();if(window.MutationObserver&&document.body)new MutationObserver(strip).observe(document.body,{childList:true,subtree:true});}

  /* Email subject convention for pages that still generate local subjects. */
  var SUBJECT_PAGES={'reconnect.html':true,'email-library.html':true};
  var EMOJIS=['🎥','📅','⭐','🚙','🌧️','⚡','🔑','👋'],SMALL={a:1,an:1,and:1,as:1,at:1,but:1,by:1,for:1,from:1,in:1,into:1,nor:1,of:1,on:1,or:1,per:1,the:1,to:1,via:1,vs:1,with:1};
  function stripEmoji(s){var out=String(s||'').trim();EMOJIS.forEach(function(e){if(out.indexOf(e+' ')===0)out=out.slice((e+' ').length).trim();});return out;}
  function titleCase(s){var words=stripEmoji(s).split(/(\s+)/),indexes=[];words.forEach(function(w,i){if(w&&!/^\s+$/.test(w))indexes.push(i);});var first=indexes[0],last=indexes[indexes.length-1];return words.map(function(w,i){if(!w||/^\s+$/.test(w))return w;var lead=(w.match(/^[^A-Za-z0-9\[]*/) || [''])[0],tail=(w.match(/[^A-Za-z0-9\]\?!.,:;'-]*$/)||[''])[0],core=w.slice(lead.length,w.length-tail.length);if(!core||/^\[[^\]]+\]$/.test(core)||/[A-Z]/.test(core)||/\d/.test(core))return w;var low=core.toLowerCase();if(i!==first&&i!==last&&SMALL[low])return lead+low+tail;return lead+low.charAt(0).toUpperCase()+low.slice(1)+tail;}).join('');}
  function emojiFor(s){var x=stripEmoji(s).toLowerCase();if(/video|show you/.test(x))return '🎥';if(/appointment|you are set|set for|today or the weekend|today or tomorrow|reserve a slot/.test(x))return '📅';if(/review/.test(x))return '⭐';if(/back in stock|started arriving|new inventory/.test(x))return '🚙';if(/storm|bad weather|weather turning/.test(x))return '🌧️';if(/fuel|electric|ev\b/.test(x))return '⚡';if(/first night|thank you/.test(x))return '🔑';if(/still thinking|still on your mind|missed you|been a while|close this out|picking .* back up/.test(x))return '👋';return '';}
  function formatSubject(s){var clean=stripEmoji(s);if(!clean)return clean;var e=emojiFor(clean),t=titleCase(clean);return e?e+' '+t:t;}
  function applySubjectStyle(){if(!SUBJECT_PAGES[here])return;if(here==='reconnect.html'){var r=document.getElementById('subjOut');if(r&&r.value)r.value=formatSubject(r.value);}if(here==='email-library.html')document.querySelectorAll('input.subject').forEach(function(x){if(x.value)x.value=formatSubject(x.value);});}
  function initSubjectStyle(){if(!SUBJECT_PAGES[here])return;applySubjectStyle();document.addEventListener('change',function(){setTimeout(applySubjectStyle,0);});document.addEventListener('click',function(){setTimeout(applySubjectStyle,0);});document.addEventListener('input',function(e){var t=e.target;if(t&&(t.id==='subjOut'||(t.classList&&t.classList.contains('subject'))))return;setTimeout(applySubjectStyle,0);});if(window.MutationObserver&&document.body){var q=false;new MutationObserver(function(){if(q)return;q=true;setTimeout(function(){q=false;applySubjectStyle();},0);}).observe(document.body,{childList:true,subtree:true,characterData:true});}}

  /* Funnel remains canonical for migrated SMS, Email and Reconnect wordtracks. */
  var WORDTRACK_PAGES={'sms-library.html':true,'email-library.html':true,'reconnect.html':true};
  function loadScriptOnce(id,src,done){if(document.getElementById(id)){if(done)done();return;}var s=document.createElement('script');s.id=id;s.src=src;s.onload=function(){if(done)done();};s.onerror=function(){if(window.console&&console.warn)console.warn('Sales HQ could not load '+src);};(document.head||document.documentElement).appendChild(s);}
  function initCanonicalWordtracks(){
    if(!WORDTRACK_PAGES[here])return;
    function install(){if(window.SHQWordtracks){window.SHQWordtracks.install(here);return;}loadScriptOnce('shqWordtracksScript','./wordtracks.js',function(){if(window.SHQWordtracks)window.SHQWordtracks.install(here);});}
    function loadConfidence(){loadScriptOnce('shqFunnelConfidenceScript','./funnel-confidence.js',install);}
    if(window.SHQFunnel)loadConfidence();else loadScriptOnce('shqFunnelDataScript','./funnel-data.js',loadConfidence);
  }

  function init(){build();disableLegacyAI();initSubjectStyle();initCanonicalWordtracks();}
  if(document.body)init();else document.addEventListener('DOMContentLoaded',init);
})();
