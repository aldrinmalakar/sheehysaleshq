/* SHEEHY SALES HQ - global Day / Night (Monokai) theme. */
(function(g){
'use strict';
var KEY='shq_theme_v1';
function saved(){try{var v=localStorage.getItem(KEY);return v==='light'||v==='monokai'?v:null;}catch(e){return null;}}
function preferred(){try{return g.matchMedia&&g.matchMedia('(prefers-color-scheme: dark)').matches?'monokai':'light';}catch(e){return 'light';}}
function current(){return document.documentElement.getAttribute('data-shq-theme')||saved()||preferred();}
function updateButton(theme){
  var b=document.getElementById('shqThemeToggle'),lab=document.getElementById('shqThemeLabel');if(!b)return;
  var dark=theme==='monokai';
  b.setAttribute('aria-pressed',dark?'true':'false');
  b.setAttribute('aria-label',dark?'Switch Sales HQ to Day theme':'Switch Sales HQ to Night theme');
  b.title=dark?'Switch to Day theme':'Switch to Night theme';
  if(lab)lab.textContent=dark?'Night':'Day';
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
g.SHQTheme={apply:apply,current:current,toggle:toggle};
})(window);
