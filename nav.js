/* SHEEHY SALES HQ - shared navigation and common loaders. */
(function(){
'use strict';
try{var t=localStorage.getItem('shq_theme_v1');if(t!=='light'&&t!=='monokai')t=(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'monokai':'light';document.documentElement.setAttribute('data-shq-theme',t);document.documentElement.style.colorScheme=t==='monokai'?'dark':'light';}catch(e){}
var LINKS=[
  {href:'otd-calculator.html',label:'OTD Calculator'},
  {href:'funnel.html',label:'Funnel'},
  {href:'video-scripts.html',label:'Video Scripts'},
  {href:'objection-library.html',label:'Objections'},
  {href:'reconnect.html',label:'Reconnect'},
  {href:'after-sale.html',label:'After Sale'},
  {href:'survey.html',label:'Survey'},
  {href:'sister-store.html',label:'Shared Inventory'},
  {href:'programs.html',label:'Programs'}
];
var here=(location.pathname.split('/').pop()||'index.html').toLowerCase();
function load(id,src,done){if(document.getElementById(id)){if(done)done();return;}var s=document.createElement('script');s.id=id;s.src=src;s.onload=function(){if(done)done();};s.onerror=function(){if(window.console&&console.warn)console.warn('Sales HQ could not load '+src);};(document.head||document.documentElement).appendChild(s);}
var css=[
'.shq-nav{position:sticky;top:0;z-index:9999;background:#fff;border-bottom:1px solid #e4e8ee;font-family:"Space Grotesk",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}',
'.shq-nav *{box-sizing:border-box}',
'.shq-inner{max-width:1180px;margin:0 auto;display:flex;align-items:center;gap:9px;padding:8px 14px;flex-wrap:wrap}',
'.shq-brand{text-decoration:none;color:#1a2330;font-size:16px;font-weight:700;white-space:nowrap}.shq-brand b{color:#2f5fe0}',
'.shq-clock{display:flex;align-items:center;gap:7px;border:1px solid #e4e8ee;border-radius:9px;padding:5px 8px;background:#f7f9fc;white-space:nowrap}',
'.shq-clock-time{font-size:12px;font-weight:750;color:#536174;font-variant-numeric:tabular-nums}.shq-clock-status{font-size:11px;font-weight:850;color:#536174}',
'.shq-clock.on{background:#edf8f1;border-color:#b8dfc8}.shq-clock.on .shq-clock-status{color:#16794a}.shq-clock.soon{background:#fff7e8;border-color:#efd294}.shq-clock.soon .shq-clock-status{color:#9a5b00}',
'.shq-theme-toggle{display:inline-flex;align-items:center;gap:6px;border:1px solid #e4e8ee;border-radius:9px;padding:6px 9px;background:#fff;color:#536174;font-family:"Space Grotesk",sans-serif;font-size:11.5px;font-weight:750;cursor:pointer;white-space:nowrap}',
'.shq-links{display:flex;gap:6px;flex-wrap:wrap;margin-left:auto}.shq-links a{text-decoration:none;font-size:12px;font-weight:650;color:#6b7889;border:1px solid #e4e8ee;border-radius:8px;padding:6px 10px;background:#fff;white-space:nowrap}.shq-links a:hover{border-color:#2f5fe0;color:#2f5fe0}.shq-links a.on{color:#fff;background:#2f5fe0;border-color:#2f5fe0}',
'@media(max-width:720px){.shq-inner{gap:7px}.shq-clock{order:2;margin-left:auto}.shq-theme-toggle{order:2}.shq-links{order:3;width:100%;margin-left:0;flex-wrap:nowrap;overflow-x:auto;padding-bottom:2px}.shq-links a{flex:0 0 auto}}'
].join('');
var st=document.createElement('style');st.textContent=css;(document.head||document.documentElement).appendChild(st);
function build(){if(document.getElementById('shqNav'))return;var links=LINKS.map(function(l){return '<a href="'+l.href+'"'+(l.href.toLowerCase()===here?' class="on"':'')+'>'+l.label+'</a>';}).join('');var b=document.createElement('div');b.className='shq-nav';b.id='shqNav';b.innerHTML='<div class="shq-inner"><a class="shq-brand" href="funnel.html">Sheehy <b>Sales HQ</b></a><div class="shq-clock" id="shqUpClock" title="Strategic UP windows, Eastern Time"><span class="shq-clock-time" id="shqClockTime">--:--</span><span class="shq-clock-status" id="shqClockStatus">UP schedule</span></div><button type="button" class="shq-theme-toggle" id="shqThemeToggle" aria-pressed="false" aria-label="Switch Sales HQ theme"><span id="shqThemeIcon" aria-hidden="true">☀</span><span id="shqThemeLabel">Day</span></button><div class="shq-links">'+links+'</div></div>';document.body.insertBefore(b,document.body.firstChild);startClock();}
var W={0:[[650,870],[930,1050]],1:[[690,780],[990,1125]],2:[[690,780],[990,1125]],3:[[690,780],[990,1125]],4:[[690,780],[990,1125]],5:[[660,810],[930,1140]],6:[[530,690],[750,990]]},DS={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6},DN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
function east(){var p=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',weekday:'short',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).formatToParts(new Date()),o={day:0,h:0,m:0};p.forEach(function(x){if(x.type==='weekday')o.day=DS[x.value];if(x.type==='hour')o.h=parseInt(x.value,10)%24;if(x.type==='minute')o.m=parseInt(x.value,10);});return o;}
function clock(){return new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hour:'numeric',minute:'2-digit',second:'2-digit'}).format(new Date());}
function fm(m){var h=Math.floor(m/60),n=m%60,ap=h>=12?'PM':'AM';return (h%12||12)+':'+String(n).padStart(2,'0')+' '+ap;}function left(m){if(m<60)return m+'m';var h=Math.floor(m/60),n=m%60;return h+'h'+(n?' '+n+'m':'');}
function status(n){var cur=n.h*60+n.m,t=W[n.day]||[],i,d,day,list,j,diff;for(i=0;i<t.length;i++)if(cur>=t[i][0]&&cur<t[i][1])return {mode:'on',text:'UP NOW · '+left(t[i][1]-cur)+' left',title:fm(t[i][0])+' to '+fm(t[i][1])};for(d=0;d<=7;d++){day=(n.day+d)%7;list=W[day]||[];for(j=0;j<list.length;j++){diff=d===0?list[j][0]-cur:(1440-cur)+((d-1)*1440)+list[j][0];if(diff>0){var when=(d===0?'Today':d===1?'Tomorrow':DN[day])+' '+fm(list[j][0]);return {mode:diff<=10?'soon':'later',text:diff<=10?'UP IN '+diff+'m':'Next UP '+when+' · '+left(diff),title:when+' to '+fm(list[j][1])};}}}return {mode:'later',text:'UP schedule',title:'Strategic UP schedule'};}
function startClock(){var b=document.getElementById('shqUpClock'),t=document.getElementById('shqClockTime'),s=document.getElementById('shqClockStatus');if(!b||!t||!s)return;function tick(){var x=status(east());t.textContent=clock();s.textContent=x.text;b.title=x.title+' · Eastern Time';b.classList.remove('on','soon');if(x.mode==='on')b.classList.add('on');if(x.mode==='soon')b.classList.add('soon');}tick();setInterval(tick,1000);}
function salesVoice(){if(['objection-library.html','reconnect.html','after-sale.html','survey.html'].indexOf(here)>-1)load('shqSalesVoiceScript','./sales-voice.js');}
function reconnectWordtracks(){if(here!=='reconnect.html'){salesVoice();return;}function voice(){salesVoice();}function words(){if(window.SHQWordtracks){window.SHQWordtracks.install(here);voice();return;}load('shqWordtracksScript','./wordtracks.js',function(){if(window.SHQWordtracks)window.SHQWordtracks.install(here);voice();});}function warm(){load('shqFunnelWarmConfidenceScript','./funnel-warm-confidence.js',words);}function confidence(){load('shqFunnelConfidenceScript','./funnel-confidence.js',warm);}if(window.SHQFunnel)confidence();else load('shqFunnelDataScript','./funnel-data.js',confidence);}
function voc(){if(here==='survey.html'||here==='after-sale.html')load('shqVocSalesSurvey','./voc-sales-survey.js');}
function init(){build();load('shqThemeScript','./theme-monokai.js',function(){if(window.SHQTheme&&window.SHQTheme.bind)window.SHQTheme.bind();});load('shqWorkflowUpgrades','./hq-workflow-upgrades.js');reconnectWordtracks();voc();}
if(document.body)init();else document.addEventListener('DOMContentLoaded',init);
})();
