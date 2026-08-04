/* ============================================================
   SHEEHY SALES HQ - shared top nav
   One file, every page. To add a page later, drop one entry in
   LINKS below and add <script src="./nav.js" defer></script> to
   that page. Nothing else to touch.
============================================================ */
(function(){
  var LINKS = [
    { href:'index.html',        label:'Sales HQ' },
    { href:'sms-library.html',  label:'SMS Library' },
    { href:'email-library.html',label:'Email Library' },
    { href:'objection-library.html',label:'Objections' },
    { href:'reconnect.html',    label:'Reconnect' }
  ];

  var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if(here === '') here = 'index.html';

  var css = [
    '.shq-nav{position:sticky;top:0;z-index:9999;background:#fff;border-bottom:1px solid #e4e8ee;font-family:"Space Grotesk",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}',
    '.shq-nav *{box-sizing:border-box}',
    '.shq-inner{max-width:960px;margin:0 auto;display:flex;align-items:center;gap:12px;padding:9px 14px;flex-wrap:wrap}',
    '.shq-brand{text-decoration:none;color:#1a2330;font-size:16px;font-weight:600;letter-spacing:.01em;white-space:nowrap}',
    '.shq-brand b{color:#2f5fe0}',
    '.shq-links{display:flex;gap:6px;flex-wrap:wrap;margin-left:auto}',
    '.shq-links a{text-decoration:none;font-size:13px;font-weight:600;color:#6b7889;border:1px solid #e4e8ee;border-radius:8px;padding:6px 12px;background:#fff;white-space:nowrap}',
    '.shq-links a:hover{border-color:#2f5fe0;color:#2f5fe0}',
    '.shq-links a.on{color:#fff;background:#2f5fe0;border-color:#2f5fe0}'
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
      + '<div class="shq-links">' + linksHtml + '</div>'
      + '</div>';
    document.body.insertBefore(bar, document.body.firstChild);
  }

  if(document.body) build();
  else document.addEventListener('DOMContentLoaded', build);
})();
