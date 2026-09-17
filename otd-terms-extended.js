/* SHEEHY SALES HQ - extended retail finance term comparisons. */
(function(){
'use strict';
if((location.pathname.split('/').pop()||'').toLowerCase()!=='otd-calculator.html')return;
function $(id){return document.getElementById(id);}
function money(v){return '$'+Math.round(v).toLocaleString('en-US');}
function payment(principal,apr,term){if(term<=0)return 0;var r=(Number(apr)||0)/1200;if(!r)return principal/term;return principal*r/(1-Math.pow(1+r,-term));}
function balanceRange(){var e=$('amountFinanced');if(!e)return null;var s=e.textContent||'';if(/—/.test(s))return null;var nums=(s.match(/[\d,]+(?:\.\d+)?/g)||[]).map(function(x){return Number(x.replace(/,/g,''));}).filter(function(x){return Number.isFinite(x);});if(!nums.length)return null;return [nums[0],nums[1]||nums[0]];}
function formatRange(low,high){return Math.round(low)===Math.round(high)?money(low)+' / mo':money(low)+'–'+money(high)+' / mo';}
function ensure(){var term=$('term');if(term&&!term.querySelector('option[value="96"]')){var o=document.createElement('option');o.value='96';o.textContent='96 months';term.appendChild(o);}var strip=document.querySelector('.term-strip');if(!strip)return;function add(t,before){if($('term'+t))return;var b=document.createElement('button');b.type='button';b.id='term'+t;b.setAttribute('data-payment-term',String(t));b.innerHTML='<span>'+t+' mo</span><strong id="pay'+t+'">—</strong>';b.addEventListener('click',function(){if(term){term.value=String(t);term.dispatchEvent(new Event('change',{bubbles:true}));}update();});if(before&&before.parentNode===strip)strip.insertBefore(b,before);else strip.appendChild(b);}add(36,$('term60'));add(48,$('term60'));add(96,null);strip.setAttribute('aria-label','36 through 96 month term comparison');}
function update(){ensure();var r=balanceRange(),apr=Number(($('apr')||{}).value),term=Number(($('term')||{}).value);[36,48,60,72,84,96].forEach(function(t){var p=$('pay'+t),b=$('term'+t);if(p){if(!r||!Number.isFinite(apr))p.textContent='—';else p.textContent=formatRange(payment(r[0],apr,t),payment(r[1],apr,t));}if(b)b.classList.toggle('selected',term===t);});}
function bind(){ensure();update();document.addEventListener('input',function(e){if(e.target&&['apr','cashDown','price','discount','trade','payoff'].indexOf(e.target.id)>-1)setTimeout(update,0);});document.addEventListener('change',function(){setTimeout(update,0);});var a=$('amountFinanced');if(a&&window.MutationObserver)new MutationObserver(update).observe(a,{childList:true,subtree:true,characterData:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();
