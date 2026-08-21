/* ============================================================
   SHEEHY SALES HQ - global Day / Night (Monokai) theme

   Day remains the default. Night is a Monokai-inspired, high-contrast
   palette designed for long dealership shifts and low-light use.
   Preference is browser-local and follows the user across Sales HQ pages.
============================================================ */
(function(){
'use strict';
var KEY='shq_theme_v1';
var root=document.documentElement;

function readTheme(){
  try{return localStorage.getItem(KEY)==='night'?'night':'day';}catch(e){return 'day';}
}
function saveTheme(v){try{localStorage.setItem(KEY,v);}catch(e){}}
function ensureStyle(){
  if(document.getElementById('shqThemeStyle'))return;
  var css=[
    'html[data-shq-theme="night"]{color-scheme:dark;--ink:#f8f8f2!important;--muted:#b6b7ad!important;--line:#4b4c45!important;--line-soft:#3b3c36!important;--paper:#272822!important;--card:#30312c!important;--accent:#66d9ef!important;--good:#a6e22e!important;--bad:#f92672!important;--warn:#fd971f!important;--bg:#1e1f1c!important;--navy:#f8f8f2!important;--blue:#66d9ef!important;--blue2:#66d9ef!important;--cyan:#66d9ef!important;--green:#a6e22e!important;--gold:#fd971f!important;--violet:#ae81ff!important;--coral:#f92672!important;--rose:#f92672!important;--soft-blue:#24333a!important;--soft-green:#28351f!important;--soft-gold:#3a3020!important;--soft-violet:#332b3d!important;--soft-cyan:#20343a!important;--soft-coral:#3b252d!important;--shadow:0 12px 34px rgba(0,0,0,.28)!important}',
    'html[data-shq-theme="night"] body{background:#1e1f1c!important;color:#f8f8f2!important}',
    'html[data-shq-theme="night"] h1,html[data-shq-theme="night"] h2,html[data-shq-theme="night"] h3,html[data-shq-theme="night"] h4{color:#f8f8f2!important}',
    'html[data-shq-theme="night"] .shq-nav{background:#272822!important;border-color:#4b4c45!important}',
    'html[data-shq-theme="night"] .shq-brand{color:#f8f8f2!important}',
    'html[data-shq-theme="night"] .shq-brand b{color:#66d9ef!important}',
    'html[data-shq-theme="night"] .shq-clock{background:#30312c!important;border-color:#4b4c45!important}',
    'html[data-shq-theme="night"] .shq-clock-time,html[data-shq-theme="night"] .shq-clock-status{color:#d7d8cf!important}',
    'html[data-shq-theme="night"] .shq-clock.on{background:#26331f!important;border-color:#6f8f32!important}',
    'html[data-shq-theme="night"] .shq-clock.on .shq-clock-status{color:#a6e22e!important}',
    'html[data-shq-theme="night"] .shq-clock.soon{background:#3a3020!important;border-color:#8f6a2d!important}',
    'html[data-shq-theme="night"] .shq-clock.soon .shq-clock-status{color:#fd971f!important}',
    'html[data-shq-theme="night"] .shq-links a{background:#272822!important;color:#d7d8cf!important;border-color:#4b4c45!important}',
    'html[data-shq-theme="night"] .shq-links a:hover{color:#66d9ef!important;border-color:#66d9ef!important}',
    'html[data-shq-theme="night"] .shq-links a.on{background:#66d9ef!important;color:#1e1f1c!important;border-color:#66d9ef!important}',
    'html[data-shq-theme="night"] input,html[data-shq-theme="night"] select,html[data-shq-theme="night"] textarea{background:#20211e!important;color:#f8f8f2!important;border-color:#4b4c45!important;caret-color:#a6e22e!important}',
    'html[data-shq-theme="night"] input::placeholder,html[data-shq-theme="night"] textarea::placeholder{color:#8f9088!important;opacity:1}',
    'html[data-shq-theme="night"] option{background:#20211e!important;color:#f8f8f2!important}',
    'html[data-shq-theme="night"] .panel,html[data-shq-theme="night"] .card,html[data-shq-theme="night"] .script-card,html[data-shq-theme="night"] .timeline-card,html[data-shq-theme="night"] .weight,html[data-shq-theme="night"] .timing,html[data-shq-theme="night"] .confirmbox,html[data-shq-theme="night"] .confline,html[data-shq-theme="night"] .line,html[data-shq-theme="night"] .appt,html[data-shq-theme="night"] .item{background-color:#272822!important;border-color:#4b4c45!important;color:#f8f8f2!important}',
    'html[data-shq-theme="night"] .context-box,html[data-shq-theme="night"] .script-body,html[data-shq-theme="night"] .body,html[data-shq-theme="night"] .po,html[data-shq-theme="night"] .companion,html[data-shq-theme="night"] .preview,html[data-shq-theme="night"] .progbar .pl,html[data-shq-theme="night"] .kpi,html[data-shq-theme="night"] details.attempts,html[data-shq-theme="night"] details.contact-history,html[data-shq-theme="night"] .contact-metric,html[data-shq-theme="night"] .attempt-status{background:#20211e!important;border-color:#4b4c45!important;color:#f8f8f2!important}',
    'html[data-shq-theme="night"] .contact-control,html[data-shq-theme="night"] .video-panel{background:#272822!important}',
    'html[data-shq-theme="night"] .funnel-jump-nav a,html[data-shq-theme="night"] .channel-chip,html[data-shq-theme="night"] .status-pill,html[data-shq-theme="night"] .mini-btn,html[data-shq-theme="night"] .link-btn,html[data-shq-theme="night"] .pill,html[data-shq-theme="night"] .outcome-btn,html[data-shq-theme="night"] .qbtn,html[data-shq-theme="night"] .ghostb,html[data-shq-theme="night"] .cpy{background:#30312c!important;color:#d7d8cf!important;border-color:#4b4c45!important}',
    'html[data-shq-theme="night"] .funnel-jump-nav a:hover,html[data-shq-theme="night"] .channel-chip:hover,html[data-shq-theme="night"] .mini-btn:hover,html[data-shq-theme="night"] .link-btn:hover,html[data-shq-theme="night"] .outcome-btn:hover:not(:disabled){color:#66d9ef!important;border-color:#66d9ef!important}',
    'html[data-shq-theme="night"] .channel-chip.on[data-channel="phone"],html[data-shq-theme="night"] .outcome-btn.success,html[data-shq-theme="night"] .pill.good{background:#28351f!important;border-color:#6f8f32!important;color:#c9f27d!important}',
    'html[data-shq-theme="night"] .channel-chip.on[data-channel="text"]{background:#20343a!important;border-color:#3f7d89!important;color:#8ce9f8!important}',
    'html[data-shq-theme="night"] .channel-chip.on[data-channel="email"]{background:#332b3d!important;border-color:#6e5689!important;color:#c7a7ff!important}',
    'html[data-shq-theme="night"] .status-pill.good{background:#28351f!important;border-color:#6f8f32!important;color:#c9f27d!important}',
    'html[data-shq-theme="night"] .status-pill.warn,html[data-shq-theme="night"] .outcome-btn.warn,html[data-shq-theme="night"] .pill.warn{background:#3a3020!important;border-color:#8f6a2d!important;color:#ffd27a!important}',
    'html[data-shq-theme="night"] .status-pill.blue,html[data-shq-theme="night"] .pill.blue{background:#24333a!important;border-color:#3f7280!important;color:#8ce9f8!important}',
    'html[data-shq-theme="night"] .status-pill.bad,html[data-shq-theme="night"] .outcome-btn.danger{background:#3a2028!important;border-color:#8c3f5a!important;color:#ff9ab7!important}',
    'html[data-shq-theme="night"] .channel-tag.call{background:#28351f!important;color:#c9f27d!important}',
    'html[data-shq-theme="night"] .channel-tag.vm{background:#3a3020!important;color:#ffd27a!important}',
    'html[data-shq-theme="night"] .channel-tag.sms{background:#20343a!important;color:#8ce9f8!important}',
    'html[data-shq-theme="night"] .channel-tag.email{background:#332b3d!important;color:#d5baff!important}',
    'html[data-shq-theme="night"] .channel-tag.mail,html[data-shq-theme="night"] .channel-tag.gift{background:#3b252d!important;color:#ffabb8!important}',
    'html[data-shq-theme="night"] .b-own{background:#24333a!important;color:#8ce9f8!important}',
    'html[data-shq-theme="night"] .b-cust{background:#28351f!important;color:#c9f27d!important}',
    'html[data-shq-theme="night"] .b-both{background:#332b3d!important;color:#d5baff!important}',
    'html[data-shq-theme="night"] .b-exp{background:#3a2028!important;color:#ff9ab7!important}',
    'html[data-shq-theme="night"] .subject{background:#332b3d!important;border-color:#6e5689!important;color:#d5baff!important}',
    'html[data-shq-theme="night"] .next-action{background:#24333a!important;border-color:#3f7280!important}',
    'html[data-shq-theme="night"] .next-action span,html[data-shq-theme="night"] .next-action b,html[data-shq-theme="night"] .next-action p{color:#e4f7fb!important}',
    'html[data-shq-theme="night"] .notice,html[data-shq-theme="night"] .callout,html[data-shq-theme="night"] .progbar{background:#2c332e!important;border-color:#526b57!important;color:#f8f8f2!important}',
    'html[data-shq-theme="night"] .warn,html[data-shq-theme="night"] .flag,html[data-shq-theme="night"] .item.expired{background:#3a3020!important;border-color:#8f6a2d!important;color:#ffd27a!important}',
    'html[data-shq-theme="night"] .stop,html[data-shq-theme="night"] .empty-channels,html[data-shq-theme="night"] .warnbox,html[data-shq-theme="night"] .issue-banner{background:#3a2028!important;border-color:#8c3f5a!important;color:#ff9ab7!important}',
    'html[data-shq-theme="night"] .line.ask,html[data-shq-theme="night"] .route{background:#26331f!important;border-color:#6f8f32!important;color:#f8f8f2!important}',
    'html[data-shq-theme="night"] .po span,html[data-shq-theme="night"] .timeline-card p,html[data-shq-theme="night"] .timeline-date,html[data-shq-theme="night"] .quiet,html[data-shq-theme="night"] .note,html[data-shq-theme="night"] .sub,html[data-shq-theme="night"] .meta{color:#b6b7ad!important}',
    'html[data-shq-theme="night"] a{color:#66d9ef}',
    'html[data-shq-theme="night"] ::selection{background:#ae81ff;color:#1e1f1c}',
    '.shq-theme-toggle{display:inline-flex;align-items:center;gap:6px;border:1px solid #e4e8ee;border-radius:9px;padding:6px 9px;background:#fff;color:#536174;font-family:"Space Grotesk",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;font-size:11px;font-weight:750;cursor:pointer;white-space:nowrap;min-height:30px}',
    '.shq-theme-toggle:hover{border-color:#2f5fe0;color:#2f5fe0}',
    '.shq-theme-toggle:focus-visible{outline:3px solid rgba(47,95,224,.28);outline-offset:2px}',
    'html[data-shq-theme="night"] .shq-theme-toggle{background:#30312c;color:#f8f8f2;border-color:#4b4c45!important}',
    'html[data-shq-theme="night"] .shq-theme-toggle:hover{border-color:#66d9ef!important;color:#66d9ef!important}',
    'html[data-shq-theme="night"] .shq-theme-toggle:focus-visible{outline-color:rgba(102,217,239,.42)}',
    '@media(max-width:720px){.shq-theme-toggle{order:2;flex:0 0 auto;padding:6px 8px}.shq-theme-label{display:none}}'
  ].join('');
  var style=document.createElement('style');style.id='shqThemeStyle';style.textContent=css;(document.head||root).appendChild(style);
}
function syncButton(theme){
  var b=document.getElementById('shqThemeToggle');if(!b)return;
  var night=theme==='night';
  b.setAttribute('aria-pressed',night?'true':'false');
  b.setAttribute('aria-label',night?'Switch Sales HQ to Day theme':'Switch Sales HQ to Night Monokai theme');
  b.title=night?'Switch to Day theme':'Switch to Night (Monokai)';
  b.innerHTML='<span aria-hidden="true">'+(night?'☾':'☀')+'</span><span class="shq-theme-label">'+(night?'Night':'Day')+'</span>';
}
function apply(theme,persist){
  theme=theme==='night'?'night':'day';
  root.setAttribute('data-shq-theme',theme);
  if(document.body)document.body.setAttribute('data-shq-theme',theme);
  if(persist)saveTheme(theme);
  syncButton(theme);
}
function installToggle(){
  var nav=document.getElementById('shqNav');if(!nav)return false;
  if(document.getElementById('shqThemeToggle')){syncButton(readTheme());return true;}
  var inner=nav.querySelector('.shq-inner'),links=nav.querySelector('.shq-links');if(!inner)return false;
  var b=document.createElement('button');b.type='button';b.id='shqThemeToggle';b.className='shq-theme-toggle';
  b.addEventListener('click',function(){var next=root.getAttribute('data-shq-theme')==='night'?'day':'night';apply(next,true);});
  if(links)inner.insertBefore(b,links);else inner.appendChild(b);
  syncButton(readTheme());return true;
}
function boot(){
  ensureStyle();
  apply(readTheme(),false);
  if(installToggle())return;
  if(window.MutationObserver&&document.documentElement){
    var ob=new MutationObserver(function(){if(installToggle())ob.disconnect();});
    ob.observe(document.documentElement,{childList:true,subtree:true});
  }
}
boot();
})();
