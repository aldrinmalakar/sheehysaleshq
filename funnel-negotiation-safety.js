/* Keep Contact Control stop states authoritative after the final negotiation resolver. */
(function(g){
'use strict';
var F=g.SHQFunnel;if(!F||typeof F.resolveScenario!=='function'||F.resolveScenario.__shqStopGuard)return;
var prior=F.resolveScenario;
function clone(o){var x={};Object.keys(o||{}).forEach(function(k){x[k]=o[k];});return x;}
function state(){var e=document.getElementById('contactState');return e?String(e.textContent||'').toLowerCase():'';}
var wrapped=function(raw,ctx){var o=clone(prior(raw,ctx)),s=state();if(/outreach stopped|opt-out|dnc/.test(s)){o.call='STOP: customer opted out. Do not call, text or email. Update DriveCentric / DNC before doing anything else.';o.vm=o.call;o.sms=o.call;o.subject='Stop outreach';o.email=o.call;return o;}if(/bad number/.test(s)){o.call='STOP PHONE: the number was marked bad. Do not call it again.';o.vm='STOP PHONE: the number was marked bad. Do not leave another voicemail.';o.sms='STOP TEXT: the number was marked bad. Do not text it again.';}if(/not interested/.test(s)){o.call='No active follow-up script. The customer said they are not interested.';o.vm=o.call;o.sms=o.call;o.subject='No active follow-up';o.email=o.call;}return o;};
wrapped.__shqStopGuard=true;F.resolveScenario=wrapped;
})(window);
