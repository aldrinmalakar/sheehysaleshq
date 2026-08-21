/* SHEEHY SALES HQ - global Day / Night (Monokai) theme. */
(function(g){
'use strict';
var KEY='shq_theme_v1';
var css=[
  '.shq-theme-toggle{display:inline-flex;align-items:center;gap:6px;border:1px solid #e4e8ee;border-radius:9px;padding:6px 9px;background:#fff;color:#536174;font-family:"Space Grotesk",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;font-size:11.5px;font-weight:750;cursor:pointer;white-space:nowrap}',
  '.shq-theme-toggle:hover{border-color:#2f5fe0;color:#2f5fe0}',
  '.shq-theme-toggle:focus-visible{outline:3px solid rgba(47,95,224,.28);outline-offset:2px}',
  '.shq-theme-icon{font-size:13px;line-height:1}',
  'html[data-shq-theme="monokai"]{color-scheme:dark;--ink:#f8f8f2!important;--muted:#b7b7ae!important;--line:#49483e!important;--line-soft:#3c3d36!important;--paper:#272822!important;--card:#2f302a!important;--accent:#66d9ef!important;--good:#a6e22e!important;--bad:#f92672!important;--warn:#fd971f!important;--bg:#1e1f1c!important}',
  'html[data-shq-theme="monokai"] body{background:#1e1f1c!important;color:#f8f8f2!important}',
  'html[data-shq-theme="monokai"] .shq-nav{background:#272822!important;border-bottom-color:#49483e!important}',
  'html[data-shq-theme="monokai"] .shq-brand{color:#f8f8f2!important}',
  'html[data-shq-theme="monokai"] .shq-brand b{color:#66d9ef!important}',
  'html[data-shq-theme="monokai"] .shq-clock,html[data-shq-theme="monokai"] .shq-links a,html[data-shq-theme="monokai"] .shq-theme-toggle{background:#2f302a!important;border-color:#49483e!important;color:#d7d7cf!important}',
  'html[data-shq-theme="monokai"] .shq-clock-time,html[data-shq-theme="monokai"] .shq-clock-status{color:#d7d7cf!important}',
  'html[data-shq-theme="monokai"] .shq-links a:hover,html[data-shq-theme="monokai"] .shq-theme-toggle:hover{border-color:#66d9ef!important;color:#66d9ef!important}',
  'html[data-shq-theme="monokai"] .shq-links a.on{background:#66d9ef!important;border-color:#66d9ef!important;color:#1e1f1c!important}',
  'html[data-shq-theme="monokai"] .shq-clock.on{background:#28301f!important;border-color:#59762a!important}html[data-shq-theme="monokai"] .shq-clock.on .shq-clock-status{color:#a6e22e!important}',
  'html[data-shq-theme="monokai"] .shq-clock.soon{background:#332b1d!important;border-color:#79591f!important}html[data-shq-theme="monokai"] .shq-clock.soon .shq-clock-status{color:#fd971f!important}',
  'html[data-shq-theme="monokai"] input,html[data-shq-theme="monokai"] select,html[data-shq-theme="monokai"] textarea{background:#272822!important;color:#f8f8f2!important;border-color:#49483e!important;caret-color:#66d9ef}',
  'html[data-shq-theme="monokai"] input::placeholder,html[data-shq-theme="monokai"] textarea::placeholder{color:#8f9088!important;opacity:1}',
  'html[data-shq-theme="monokai"] option{background:#272822;color:#f8f8f2}',
  'html[data-shq-theme="monokai"] a{color:#66d9ef}',
  'html[data-shq-theme="monokai"] .panel,html[data-shq-theme="monokai"] .card,html[data-shq-theme="monokai"] .script-card,html[data-shq-theme="monokai"] .weight,html[data-shq-theme="monokai"] .timing,html[data-shq-theme="monokai"] .confirmbox,html[data-shq-theme="monokai"] .confline,html[data-shq-theme="monokai"] .appt,html[data-shq-theme="monokai"] .line,html[data-shq-theme="monokai"] .ownership-card,html[data-shq-theme="monokai"] .manifest-card,html[data-shq-theme="monokai"] .channel-card,html[data-shq-theme="monokai"] .script-box,html[data-shq-theme="monokai"] .output-card{background:#272822!important;border-color:#49483e!important;color:#f8f8f2!important}',
  'html[data-shq-theme="monokai"] .card.soft,html[data-shq-theme="monokai"] .notice,html[data-shq-theme="monokai"] .callout,html[data-shq-theme="monokai"] .progbar,html[data-shq-theme="monokai"] .route,html[data-shq-theme="monokai"] .contact-next,html[data-shq-theme="monokai"] .next-step{background:#2f302a!important;border-color:#49483e!important;color:#e6e6df!important}',
  'html[data-shq-theme="monokai"] .warn,html[data-shq-theme="monokai"] .flag{background:#332b1d!important;border-color:#79591f!important;color:#fdc76d!important}',
  'html[data-shq-theme="monokai"] .stop{background:#351f2a!important;border-color:#7d294d!important;color:#ff7aa8!important}',
  'html[data-shq-theme="monokai"] .good,html[data-shq-theme="monokai"] .success{color:#a6e22e!important}',
  'html[data-shq-theme="monokai"] .sub,html[data-shq-theme="monokai"] .note,html[data-shq-theme="monokai"] .cue,html[data-shq-theme="monokai"] .meta,html[data-shq-theme="monokai"] .foot,html[data-shq-theme="monokai"] .agehint{color:#b7b7ae!important}',
  'html[data-shq-theme="monokai"] .cpy,html[data-shq-theme="monokai"] .copy-btn,html[data-shq-theme="monokai"] .ghostb,html[data-shq-theme="monokai"] .qbtn,html[data-shq-theme="monokai"] .chip{background:#272822!important;border-color:#5a5b50!important;color:#d7d7cf!important}',
  'html[data-shq-theme="monokai"] .cpy:hover,html[data-shq-theme="monokai"] .copy-btn:hover,html[data-shq-theme="monokai"] .ghostb:hover,html[data-shq-theme="monokai"] .qbtn:hover,html[data-shq-theme="monokai"] .chip:hover{border-color:#66d9ef!important;color:#66d9ef!important}',
  'html[data-shq-theme="monokai"] .chip.on,html[data-shq-theme="monokai"] .primary{background:#66d9ef!important;border-color:#66d9ef!important;color:#1e1f1c!important}',
  'html[data-shq-theme="monokai"] [style*="background:#fff"],html[data-shq-theme="monokai"] [style*="background: #fff"],html[data-shq-theme="monokai"] [style*="background:white"],html[data-shq-theme="monokai"] [style*="background: white"]{background:#272822!important;color:#f8f8f2!important;border-color:#49483e!important}',
  'html[data-shq-theme="monokai"] [style*="background:#eef4ff"],html[data-shq-theme="monokai"] [style*="background: #eef4ff"],html[data-shq-theme="monokai"] [style*="background:#eaf1ff"]{background:#253239!important;color:#dff9ff!important;border-color:#3f6872!important}',
  '@media(max-width:720px){.shq-theme-toggle{padding:6px 8px}.shq-theme-toggle .shq-theme-word{display:none}}'
].join('');
var st=document.createElement('style');st.id='shqThemeStyles';st.textContent=css;(document.head||document.documentElement).appendChild(st);
function saved(){try{var v=localStorage.getItem(KEY);return v==='light'||v==='monokai'?v:null;}catch(e){return null;}}
function preferred(){try{return g.matchMedia&&g.matchMedia('(prefers-color-scheme: dark)').matches?'monokai':'light';}catch(e){return 'light';}}
function current(){return document.documentElement.getAttribute('data-shq-theme')||saved()||preferred();}
function updateButton(theme){
  var b=document.getElementById('shqThemeToggle'),lab=document.getElementById('shqThemeLabel'),icon=document.getElementById('shqThemeIcon');if(!b)return;
  var dark=theme==='monokai';
  b.setAttribute('aria-pressed',dark?'true':'false');
  b.setAttribute('aria-label',dark?'Switch Sales HQ to Day theme':'Switch Sales HQ to Night theme');
  b.title=dark?'Switch to Day theme':'Switch to Night theme';
  if(lab)lab.textContent=dark?'Night':'Day';
  if(icon)icon.textContent=dark?'☾':'☀';
}
function apply(theme,persist){
  var t=theme==='monokai'?'monokai':'light';
  document.documentElement.setAttribute('data-shq-theme',t);
  document.documentElement.style.colorScheme=t==='monokai'?'dark':'light';
  if(persist){try{localStorage.setItem(KEY,t);}catch(e){}}
  updateButton(t);
  try{g.dispatchEvent(new CustomEvent('shq:theme-change',{detail:{theme:t}}));}catch(e){}
}
function toggle(){apply(current()==='monokai'?'light':'monokai',true);}
function bind(){var b=document.getElementById('shqThemeToggle');if(b&&!b.dataset.bound){b.dataset.bound='1';b.addEventListener('click',toggle);}updateButton(current());}
apply(saved()||preferred(),false);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
g.SHQTheme={apply:apply,current:current,toggle:toggle,bind:bind};
})(window);
