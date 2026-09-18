/* Book-informed Funnel diagnostics: customer language + Belfort Three Tens. */
(function(g){
'use strict';
var KEY='shq_fill_v1';
function $(id){return document.getElementById(id);}
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch(e){return {};}}
function saveField(key,val){try{var p=load();p[key]=val||'';localStorage.setItem(KEY,JSON.stringify(p));}catch(e){}}
function scoreOptions(){var s='<option value="">Not scored</option>';for(var i=1;i<=10;i++)s+='<option value="'+i+'">'+i+(i===1?' · very low':i===5?' · uncertain':i===10?' · strong':'')+'</option>';return s;}
function score(id){var e=$(id),n=e?parseInt(e.value,10):0;return isNaN(n)?0:n;}
function gap(){var a=[['Vehicle',score('certaintyVehicle')],['You / trust',score('certaintyYou')],['Dealership / process',score('certaintyStore')]].filter(function(x){return x[1]>0;});if(!a.length)return null;a.sort(function(x,y){return x[1]-y[1];});return a[0];}
function syncExistingContext(){
  var interaction=$('interactionStyle'),priority=$('buyingPriority'),p=load(),loadedInteraction=false;
  if(interaction){
    if(p.interactionstyle&&interaction.value!==p.interactionstyle){interaction.value=p.interactionstyle;loadedInteraction=true;}
    saveField('interactionstyle',interaction.value||'neutral');
    interaction.addEventListener('change',function(){saveField('interactionstyle',this.value||'neutral');refresh();});
    /* funnel-context.js owns its own session state, so notify it when a saved style was restored after its initial bind. */
    if(loadedInteraction)try{interaction.dispatchEvent(new Event('change',{bubbles:true}));}catch(e){}
  }
  if(priority){var labels={unknown:'',value:'price and overall value',comfort:'comfort',reliability:'reliability and ownership confidence',safety:'safety',technology:'technology',space:'space and utility',ownership:'ownership cost'};saveField('prioritytext',labels[priority.value]||'');priority.addEventListener('change',function(){saveField('prioritytext',labels[this.value]||'');refresh();});}
}
function renderRead(){var el=$('certaintyRead');if(!el)return;var g0=gap();if(!g0){el.textContent='Use these only when you have enough information. The lowest certainty is usually the next thing to build before you close.';return;}if(g0[1]>=8){el.textContent='All scored certainties are strong. Ask for the next commitment and stop talking.';return;}el.textContent='Primary certainty gap: '+g0[0]+' ('+g0[1]+'/10). Build that certainty before adding more pitch.';}
function refresh(){try{g.dispatchEvent(new CustomEvent('shq:funnel-context-change'));}catch(e){}var b=$('behavior');if(b)try{b.dispatchEvent(new Event('change',{bubbles:true}));}catch(e){} }
function bindField(id,key){var e=$(id);if(!e)return;var p=load();if(p[key]!==undefined&&p[key]!==null)e.value=p[key];['input','change'].forEach(function(ev){e.addEventListener(ev,function(){saveField(key,e.value);renderRead();refresh();});});}
function install(){if($('bookMethodPanel'))return;var host=$('customerContext');if(!host)return;var wrap=document.createElement('div');wrap.id='bookMethodPanel';wrap.className='context-tools';wrap.style.marginTop='10px';wrap.innerHTML=''
  +'<div class="context-box"><div class="box-title">Customer language</div>'
  +'<label>Exact phrase they used<input id="customerPhrase" data-f="customerphrase" autocomplete="off" placeholder="payment is too high · I need brown interior · not driving 3 hours for a maybe"></label>'
  +'<div class="quiet">Use their word once when it matters. Echo the phrase, then pause. Do not translate their concern into dealership language too early.</div></div>'
  +'<div class="context-box"><div class="box-title">Three certainties</div>'
  +'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(135px,1fr));gap:8px">'
  +'<label>Vehicle<select id="certaintyVehicle" data-f="certvehicle">'+scoreOptions()+'</select></label>'
  +'<label>You / trust<select id="certaintyYou" data-f="certyou">'+scoreOptions()+'</select></label>'
  +'<label>Dealership / process<select id="certaintyStore" data-f="certstore">'+scoreOptions()+'</select></label>'
  +'</div><div class="quiet" id="certaintyRead"></div></div>';
  var tools=host.querySelector('.context-tools');if(tools&&tools.nextSibling)host.insertBefore(wrap,tools.nextSibling);else host.appendChild(wrap);
  bindField('customerPhrase','customerphrase');bindField('certaintyVehicle','certvehicle');bindField('certaintyYou','certyou');bindField('certaintyStore','certstore');syncExistingContext();renderRead();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})(window);
