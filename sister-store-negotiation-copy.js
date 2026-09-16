/* Keep Sister Store copy buttons aligned with the final displayed negotiation copy. */
(function(){
'use strict';
if((location.pathname.split('/').pop()||'').toLowerCase()!=='sister-store.html')return;
function fallback(text){var ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}catch(e){}ta.remove();}
function write(text,b){var done=function(){var old=b.textContent;b.textContent='Copied';setTimeout(function(){b.textContent=old;},850);};if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(done).catch(function(){fallback(text);done();});else{fallback(text);done();}}
document.addEventListener('click',function(e){var b=e.target&&e.target.closest?e.target.closest('#scripts .copy'):null;if(!b)return;var card=b.closest('.card');if(!card)return;e.preventDefault();e.stopImmediatePropagation();var subj=card.querySelector('.subject'),body=card.querySelector('.body'),points=card.querySelectorAll('.point'),text='';if(subj&&body)text='Subject: '+subj.textContent+'\n\n'+body.textContent;else if(body)text=body.textContent;else if(points.length)text=Array.prototype.map.call(points,function(p){var a=p.querySelector('b'),s=p.querySelector('span');return (a?a.textContent:'')+'\n'+(s?s.textContent:'');}).join('\n\n');if(text)write(text,b);},true);
})();
