/* SHEEHY SALES HQ - per-customer After Sale memory + compact timeline */
(function(){
'use strict';
var BOOK_KEY='shq_after_sale_customer_book_v1';
var ACTIVE_KEY='shq_after_sale_active_customer_v1';
var FILL_KEY='shq_fill_v1';
var SALE_KEY='shq_after_sale_v1';
var book=load(BOOK_KEY,{records:{},order:[]});
var activeId=safeGet(ACTIVE_KEY)||'';
var loading=false,autoTimer=null;
function $(id){return document.getElementById(id);}
function load(k,fb){try{var v=JSON.parse(localStorage.getItem(k)||'null');return v||fb;}catch(e){return fb;}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
function safeGet(k){try{return localStorage.getItem(k)||'';}catch(e){return '';}}
function safeSet(k,v){try{if(v)localStorage.setItem(k,v);else localStorage.removeItem(k);}catch(e){}}
function value(sel){var e=document.querySelector(sel);return e&&e.value?String(e.value).trim():'';}
function currentCaseKey(name,vehicle,date){return [name||'[Name]',vehicle||'[vehicle]',date||'no-date'].join('|');}
function id(){if(window.crypto&&crypto.randomUUID)return crypto.randomUUID();return 'cust_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8);}
function status(msg,kind){var e=$('memoryStatus');if(!e)return;e.textContent=msg;e.className='memory-status'+(kind?' '+kind:'');}
function currentSaleState(){return load(SALE_KEY,{progress:{}});}
function snapshot(){
  var name=value('[data-f="name"]'),vehicle=value('[data-f="vehicle"]'),date=$('deliveryDate')?$('deliveryDate').value:'',sale=currentSaleState(),key=currentCaseKey(name,vehicle,date);
  return {
    id:activeId||id(),name:name,vehicle:vehicle,deliveryDate:date,
    purchaseType:$('purchaseType')?$('purchaseType').value:'new-nissan',
    issueState:$('issueState')?$('issueState').value:'clear',
    surveyState:$('surveyState')?$('surveyState').value:'unknown',
    personalCue:$('personalCue')?$('personalCue').value.trim():'',
    notes:$('ownershipNotes')?$('ownershipNotes').value.trim():'',
    selected:sale.selected||'delivery',caseKey:key,
    progress:sale.progress&&sale.progress[key]?sale.progress[key]:{},
    updatedAt:new Date().toISOString()
  };
}
function upsert(rec){book.records=book.records||{};book.order=book.order||[];book.records[rec.id]=rec;book.order=book.order.filter(function(x){return x!==rec.id;});book.order.unshift(rec.id);save(BOOK_KEY,book);activeId=rec.id;safeSet(ACTIVE_KEY,activeId);renderCustomerSelect();status('Saved · changes now auto-update for this customer.','saved');}
function saveCurrent(){var rec=snapshot();if(!rec.name||!rec.vehicle){status('Add customer name and vehicle before saving.','warn');return;}upsert(rec);}
function scheduleAutosave(){if(!activeId||loading)return;clearTimeout(autoTimer);autoTimer=setTimeout(function(){var r=snapshot();r.id=activeId;if(r.name&&r.vehicle)upsert(r);},450);}
function recordLabel(r){var bits=[r.name||'Unnamed',r.vehicle||'Vehicle'];if(r.deliveryDate)bits.push(r.deliveryDate);return bits.join(' · ');}
function renderCustomerSelect(){var s=$('savedCustomer');if(!s)return;var current=activeId;s.innerHTML='<option value="">New / unsaved customer</option>';var seen={};(book.order||[]).forEach(function(rid){var r=book.records&&book.records[rid];if(!r||seen[rid])return;seen[rid]=true;var o=document.createElement('option');o.value=rid;o.textContent=recordLabel(r);s.appendChild(o);});s.value=current&&book.records[current]?current:'';}
function loadCustomer(rid){var r=book.records&&book.records[rid];if(!r)return;var fill=load(FILL_KEY,{}),sale=currentSaleState();fill.name=r.name||'';fill.vehicle=r.vehicle||'';save(FILL_KEY,fill);sale.deliveryDate=r.deliveryDate||'';sale.purchaseType=r.purchaseType||'new-nissan';sale.issueState=r.issueState||'clear';sale.surveyState=r.purchaseType==='new-nissan'?(r.surveyState||'unknown'):'unknown';sale.selected=r.selected||'delivery';sale.progress=sale.progress||{};sale.progress[currentCaseKey(r.name,r.vehicle,r.deliveryDate)]=r.progress||{};save(SALE_KEY,sale);safeSet(ACTIVE_KEY,rid);location.reload();}
function newCustomer(){safeSet(ACTIVE_KEY,'');activeId='';if($('clearCase'))$('clearCase').click();if($('ownershipNotes'))$('ownershipNotes').value='';renderCustomerSelect();status('New unsaved customer. Save once you have the ownership context.','');}
function restoreActiveExtras(){var r=activeId&&book.records?book.records[activeId]:null;if(!r)return;if($('personalCue')){$('personalCue').value=r.personalCue||'';$('personalCue').dispatchEvent(new Event('input',{bubbles:true}));}if($('ownershipNotes'))$('ownershipNotes').value=r.notes||'';status('Loaded '+recordLabel(r)+'. Changes auto-save locally.','saved');}
function syncVocVisibility(){var isNew=$('purchaseType')&&$('purchaseType').value==='new-nissan',panel=$('kpiPanel');if(panel)panel.style.display=isNew?'block':'none';var surveyLabel=$('surveyState')&&$('surveyState').closest('label');if(surveyLabel)surveyLabel.style.display=isNew?'block':'none';document.querySelectorAll('#quickLinks .survey').forEach(function(a){a.style.display=isNew?'inline-flex':'none';});}
function cardData(card){if(!card)return null;var title=card.querySelector('h3'),day=card.querySelector('.timeline-day'),date=card.querySelector('.timeline-date'),pill=card.querySelector('.pill'),desc=card.querySelector('p');return {title:title?title.textContent.trim():'Milestone',day:day?day.textContent.trim():'',date:date?date.textContent.trim():'',status:pill?pill.textContent.trim():'',desc:desc?desc.textContent.trim():''};}
function syncMilestoneMeta(card){var m=$('milestoneMeta'),d=cardData(card);if(!m||!d)return;m.innerHTML='<b>'+escapeHtml(d.status||'Planned')+'</b> · '+escapeHtml([d.day,d.date].filter(Boolean).join(' · '))+(d.desc?'<span>'+escapeHtml(d.desc)+'</span>':'');}
function escapeHtml(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function populateMilestones(){var host=$('timeline'),sel=$('milestoneSelect');if(!host||!sel)return;var cards=[].slice.call(host.querySelectorAll('.timeline-card'));if(!cards.length)return;var currentTitle=$('workTitle')?$('workTitle').textContent.trim():'';sel.innerHTML='';cards.forEach(function(card,i){var d=cardData(card),o=document.createElement('option');o.value=String(i);o.textContent=[d.day,d.title,d.status].filter(Boolean).join(' · ');sel.appendChild(o);if(d.title===currentTitle)sel.value=String(i);});var chosen=cards[parseInt(sel.value||'0',10)]||cards[0];syncMilestoneMeta(chosen);}
function openSelectedMilestone(){var host=$('timeline'),sel=$('milestoneSelect');if(!host||!sel)return;var cards=host.querySelectorAll('.timeline-card'),card=cards[parseInt(sel.value||'0',10)];if(!card)return;syncMilestoneMeta(card);var b=card.querySelector('.open');if(b)b.click();scheduleAutosave();}
function bindTimeline(){var t=$('timeline');if(!t)return;populateMilestones();if(window.MutationObserver){var queued=false;new MutationObserver(function(){if(queued)return;queued=true;setTimeout(function(){queued=false;populateMilestones();scheduleAutosave();},0);}).observe(t,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});}}
function bind(){loading=true;renderCustomerSelect();restoreActiveExtras();syncVocVisibility();bindTimeline();if($('savedCustomer'))$('savedCustomer').addEventListener('change',function(){if(this.value)loadCustomer(this.value);else newCustomer();});if($('saveCustomerRecord'))$('saveCustomerRecord').addEventListener('click',saveCurrent);if($('newCustomerRecord'))$('newCustomerRecord').addEventListener('click',newCustomer);if($('milestoneSelect'))$('milestoneSelect').addEventListener('change',openSelectedMilestone);if($('clearCase'))$('clearCase').addEventListener('click',function(){safeSet(ACTIVE_KEY,'');activeId='';setTimeout(function(){renderCustomerSelect();status('Case cleared. Saved customers remain available in the dropdown.','');},0);});['deliveryDate','purchaseType','issueState','surveyState','personalCue','ownershipNotes'].forEach(function(x){var e=$(x);if(e)e.addEventListener(e.tagName==='SELECT'?'change':'input',function(){if(x==='purchaseType')syncVocVisibility();scheduleAutosave();});});document.querySelectorAll('[data-f="name"],[data-f="vehicle"]').forEach(function(e){e.addEventListener('input',scheduleAutosave);});if($('markDone'))$('markDone').addEventListener('click',function(){setTimeout(scheduleAutosave,25);});loading=false;setTimeout(function(){populateMilestones();syncVocVisibility();},30);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();
