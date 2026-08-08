/* ============================================================
   SHEEHY SALES HQ - shared top nav
   One file, every page. To add a page later, drop one entry in
   LINKS below and add <script src="./nav.js" defer></script> to
   that page. Nothing else to touch.
============================================================ */
(function(){
  var LINKS = [
    { href:'index.html',        label:'Sales HQ' },
    { href:'leads.html',        label:'Leads' },
    { href:'funnel.html',       label:'Funnel' },
    { href:'sms-library.html',  label:'SMS Library' },
    { href:'email-library.html',label:'Email Library' },
    { href:'objection-library.html',label:'Objections' },
    { href:'reconnect.html',    label:'Reconnect' },
    { href:'survey.html',       label:'Survey' },
    { href:'sister-store.html', label:'Sister Store' },
    { href:'programs.html',     label:'Programs' }
  ];

  var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if(here === '') here = 'index.html';

  var css = [
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

  var style = document.createElement('style');
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);

  function build(){
    if(document.getElementById('shqNav')) return;
    var linksHtml = LINKS.map(function(l){
      var on = (l.href.toLowerCase() === here);
      return '<a href="'+l.href+'"'+(on ? ' class="on"' : '')+'>'+l.label+'</a>';
    }).join('');
    var bar = document.createElement('div');
    bar.className = 'shq-nav';
    bar.id = 'shqNav';
    bar.innerHTML = '<div class="shq-inner">'
      + '<a class="shq-brand" href="index.html">Sheehy <b>Sales HQ</b></a>'
      + '<div class="shq-clock" id="shqUpClock" title="Strategic UP windows, Eastern Time"><span class="shq-clock-time" id="shqClockTime">--:--</span><span class="shq-clock-status" id="shqClockStatus">UP schedule</span></div>'
      + '<div class="shq-links">' + linksHtml + '</div>'
      + '</div>';
    document.body.insertBefore(bar, document.body.firstChild);
    startUpClock();
  }

  /* ------------------------------------------------------------
     Strategic UP clock
     Eastern Time schedule from the working weekly floor plan:
     Mon-Thu 11:30-1:00 and 4:30-6:45
     Fri 11:00-1:30 and 3:30-7:00
     Sat 8:50-11:30 and 12:30-4:30
     Sun 10:50-2:30 and 3:30-5:30
  ------------------------------------------------------------ */
  var UP_WINDOWS = {
    0:[[650,870],[930,1050]],
    1:[[690,780],[990,1125]],
    2:[[690,780],[990,1125]],
    3:[[690,780],[990,1125]],
    4:[[690,780],[990,1125]],
    5:[[660,810],[930,1140]],
    6:[[530,690],[750,990]]
  };
  var DAY_SHORT={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};
  var DAY_NAME=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  function eastNow(){
    var d=new Date();
    var parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',weekday:'short',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).formatToParts(d);
    var o={day:0,h:0,m:0,s:0};
    parts.forEach(function(p){
      if(p.type==='weekday') o.day=DAY_SHORT[p.value];
      if(p.type==='hour') o.h=parseInt(p.value,10)%24;
      if(p.type==='minute') o.m=parseInt(p.value,10);
      if(p.type==='second') o.s=parseInt(p.value,10);
    });
    return o;
  }
  function fmtClock(){
    return new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hour:'numeric',minute:'2-digit',second:'2-digit'}).format(new Date());
  }
  function fmtMin(min){
    var h=Math.floor(min/60), m=min%60, ap=h>=12?'PM':'AM', hh=h%12||12;
    return hh+':'+String(m).padStart(2,'0')+' '+ap;
  }
  function fmtLeft(min){
    if(min<60) return min+'m';
    var h=Math.floor(min/60), m=min%60;
    return h+'h'+(m?' '+m+'m':'');
  }
  function upStatus(now){
    var cur=now.h*60+now.m;
    var today=UP_WINDOWS[now.day]||[];
    for(var i=0;i<today.length;i++){
      if(cur>=today[i][0] && cur<today[i][1]){
        return {mode:'on',text:'UP NOW · '+fmtLeft(today[i][1]-cur)+' left',title:'Current window: '+fmtMin(today[i][0])+' to '+fmtMin(today[i][1])};
      }
    }
    for(var d=0;d<=7;d++){
      var day=(now.day+d)%7, list=UP_WINDOWS[day]||[];
      for(var j=0;j<list.length;j++){
        var diff=d===0 ? list[j][0]-cur : (1440-cur)+((d-1)*1440)+list[j][0];
        if(diff>0){
          var soon=diff<=10;
          var when=(d===0?'Today':d===1?'Tomorrow':DAY_NAME[day])+' '+fmtMin(list[j][0]);
          return {mode:soon?'soon':'later',text:(soon?'UP IN '+diff+'m':'Next UP '+when+' · '+fmtLeft(diff)),title:'Next window: '+when+' to '+fmtMin(list[j][1])};
        }
      }
    }
    return {mode:'later',text:'UP schedule',title:'Strategic UP schedule'};
  }
  function startUpClock(){
    var box=document.getElementById('shqUpClock'), t=document.getElementById('shqClockTime'), s=document.getElementById('shqClockStatus');
    if(!box||!t||!s) return;
    function tick(){
      var now=eastNow(), st=upStatus(now);
      t.textContent=fmtClock(); s.textContent=st.text; box.title=st.title+' · Eastern Time';
      box.classList.remove('on','soon'); if(st.mode==='on') box.classList.add('on'); if(st.mode==='soon') box.classList.add('soon');
    }
    tick(); setInterval(tick,1000);
  }

  /* ------------------------------------------------------------
     Retire the unused browser-side AI helper on the legacy main
     page. Removes the UI and clears remembered provider settings.
     The old dead code can be physically deleted during refactor.
  ------------------------------------------------------------ */
  function disableLegacyAI(){
    if(here!=='index.html') return;
    try{
      ['aiKey','aiProvider','aiModel_claude','aiModel_openai','aiModel_gemini'].forEach(function(k){localStorage.removeItem(k);});
    }catch(e){}
    function strip(){
      document.querySelectorAll('.aicard').forEach(function(el){if(el&&el.parentNode) el.parentNode.removeChild(el);});
    }
    strip();
    if(window.MutationObserver&&document.body){
      var obs=new MutationObserver(strip);
      obs.observe(document.body,{childList:true,subtree:true});
    }
  }

  /* ------------------------------------------------------------
     Customer-facing email subject convention
     Applies only to Leads, Reconnect and Email Library.
     Title Case, preserve customer/vehicle casing, maximum one
     relevant emoji and no forced emoji when it adds no value.
  ------------------------------------------------------------ */
  var SUBJECT_PAGES = {
    'leads.html':true,
    'reconnect.html':true,
    'email-library.html':true
  };
  var SUBJECT_EMOJIS = ['🎥','📅','⭐','🚙','🌧️','⚡','🔑','👋'];
  var SMALL_WORDS = {
    a:1, an:1, and:1, as:1, at:1, but:1, by:1, for:1, from:1,
    in:1, into:1, nor:1, of:1, on:1, or:1, per:1, the:1, to:1,
    via:1, vs:1, with:1
  };

  function stripKnownEmoji(s){
    var out=String(s||'').trim();
    SUBJECT_EMOJIS.forEach(function(e){
      if(out.indexOf(e+' ')===0) out=out.slice((e+' ').length).trim();
    });
    return out;
  }

  function splitToken(token){
    var lead=(token.match(/^[^A-Za-z0-9\[]*/) || [''])[0];
    var tail=(token.match(/[^A-Za-z0-9\]\?!.,:;'-]*$/) || [''])[0];
    return {lead:lead, core:token.slice(lead.length, token.length-tail.length), tail:tail};
  }

  function titlePart(part, isFirst, isLast){
    if(!part) return part;
    if(/^\[[^\]]+\]$/.test(part)) return part;
    if(/[A-Z]/.test(part) || /\d/.test(part)) return part;
    var low=part.toLowerCase();
    if(!isFirst && !isLast && SMALL_WORDS[low]) return low;
    return low.charAt(0).toUpperCase()+low.slice(1);
  }

  function titleToken(token, isFirst, isLast){
    var p=splitToken(token);
    if(!p.core) return token;
    if(/^\[[^\]]+\]$/.test(p.core)) return p.lead+p.core+p.tail;
    if(/[A-Z]/.test(p.core) || /\d/.test(p.core)) return p.lead+p.core+p.tail;

    var pieces=p.core.split(/([\/-])/);
    var words=[];
    pieces.forEach(function(x){ if(x!=='/' && x!=='-' && x!=='') words.push(x); });
    var wi=0;
    pieces=pieces.map(function(x){
      if(x==='/' || x==='-' || x==='') return x;
      var result=titlePart(x, isFirst && wi===0, isLast && wi===words.length-1);
      wi++;
      return result;
    });
    return p.lead+pieces.join('')+p.tail;
  }

  function titleCaseSubject(subject){
    var s=stripKnownEmoji(subject);
    var parts=s.split(/(\s+)/);
    var wordIndexes=[];
    parts.forEach(function(p,i){ if(p && !/^\s+$/.test(p)) wordIndexes.push(i); });
    if(!wordIndexes.length) return s;
    var first=wordIndexes[0], last=wordIndexes[wordIndexes.length-1];
    return parts.map(function(p,i){
      if(/^\s+$/.test(p)) return p;
      return titleToken(p, i===first, i===last);
    }).join('');
  }

  function subjectEmoji(subject){
    var s=stripKnownEmoji(subject).toLowerCase();
    if(/video|show you/.test(s)) return '🎥';
    if(/appointment|you are set|set for|today or the weekend|today or tomorrow|reserve a slot/.test(s)) return '📅';
    if(/review/.test(s)) return '⭐';
    if(/back in stock|started arriving|new inventory/.test(s)) return '🚙';
    if(/storm|bad weather|weather turning/.test(s)) return '🌧️';
    if(/fuel|electric|ev\b/.test(s)) return '⚡';
    if(/first night|thank you/.test(s)) return '🔑';
    if(/still thinking|still on your mind|missed you|been a while|close this out|picking .* back up/.test(s)) return '👋';
    return '';
  }

  function formatSubject(subject){
    var clean=stripKnownEmoji(subject);
    if(!clean) return clean;
    var titled=titleCaseSubject(clean);
    var emoji=subjectEmoji(clean);
    return emoji ? emoji+' '+titled : titled;
  }

  function formatSubjectInText(text){
    return String(text==null?'':text).replace(/^Subject:\s*([^\r\n]+)/i,function(_,subj){
      return 'Subject: '+formatSubject(subj);
    });
  }

  function applySubjectStyle(){
    if(!SUBJECT_PAGES[here]) return;

    if(here==='leads.html'){
      document.querySelectorAll('.line').forEach(function(el){
        if(/^Subject:/i.test(el.textContent||'')){
          var next=formatSubjectInText(el.textContent);
          if(next!==el.textContent) el.textContent=next;
        }
      });
    }

    if(here==='reconnect.html'){
      var reconnectSubject=document.getElementById('subjOut');
      if(reconnectSubject && reconnectSubject.value){
        var rs=formatSubject(reconnectSubject.value);
        if(rs!==reconnectSubject.value) reconnectSubject.value=rs;
      }
    }

    if(here==='email-library.html'){
      document.querySelectorAll('input.subject').forEach(function(input){
        if(input.value){
          var es=formatSubject(input.value);
          if(es!==input.value) input.value=es;
        }
      });
    }
  }

  function protectLeadCopy(){
    if(here!=='leads.html' || typeof window.copyText!=='function' || window.copyText.__shqSubjectStyle) return;
    var original=window.copyText;
    var wrapped=function(text,btn){
      return original(formatSubjectInText(text),btn);
    };
    wrapped.__shqSubjectStyle=true;
    window.copyText=wrapped;
  }

  function initSubjectStyle(){
    if(!SUBJECT_PAGES[here]) return;
    protectLeadCopy();
    applySubjectStyle();

    document.addEventListener('change',function(){ setTimeout(applySubjectStyle,0); });
    document.addEventListener('click',function(){ setTimeout(applySubjectStyle,0); });
    document.addEventListener('input',function(e){
      var t=e.target;
      if(t && (t.id==='subjOut' || (t.classList && t.classList.contains('subject')))) return;
      setTimeout(applySubjectStyle,0);
    });

    if(window.MutationObserver && document.body){
      var queued=false;
      var observer=new MutationObserver(function(){
        if(queued) return;
        queued=true;
        setTimeout(function(){ queued=false; applySubjectStyle(); },0);
      });
      observer.observe(document.body,{childList:true,subtree:true,characterData:true});
    }
  }

  /* ------------------------------------------------------------
     Canonical wordtracks
     Funnel is the source of truth for migrated scripts. The shared
     adapter is loaded only on the four legacy wordtrack pages that
     currently contain duplicate language.
  ------------------------------------------------------------ */
  var WORDTRACK_PAGES={
    'leads.html':true,
    'sms-library.html':true,
    'email-library.html':true,
    'reconnect.html':true
  };

  function loadScriptOnce(id,src,done){
    if(document.getElementById(id)){
      if(done) done();
      return;
    }
    var s=document.createElement('script');
    s.id=id;
    s.src=src;
    s.onload=function(){ if(done) done(); };
    s.onerror=function(){ if(window.console&&console.warn) console.warn('Sales HQ could not load '+src); };
    (document.head||document.documentElement).appendChild(s);
  }

  function initCanonicalWordtracks(){
    if(!WORDTRACK_PAGES[here]) return;

    function installAdapter(){
      if(window.SHQWordtracks){ window.SHQWordtracks.install(here); return; }
      loadScriptOnce('shqWordtracksScript','./wordtracks.js',function(){
        if(window.SHQWordtracks) window.SHQWordtracks.install(here);
      });
    }

    if(window.SHQFunnel) installAdapter();
    else loadScriptOnce('shqFunnelDataScript','./funnel-data.js',installAdapter);
  }

  if(document.body){
    build();
    disableLegacyAI();
    initSubjectStyle();
    initCanonicalWordtracks();
  } else {
    document.addEventListener('DOMContentLoaded',function(){
      build();
      disableLegacyAI();
      initSubjectStyle();
      initCanonicalWordtracks();
    });
  }
})();
