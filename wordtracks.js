/* ============================================================
   SHEEHY SALES HQ - canonical wordtrack adapter

   funnel-data.js is the source of truth for migrated scripts.
   This adapter lets older pages consume those scripts without a
   risky rewrite of each standalone page all at once.

   Phase 1 rules:
   - Funnel scenarios win when a page/scenario has been mapped.
   - Unmapped specialty templates continue using their local copy.
   - Reconnect keeps its richer age-aware call coaching for now.
   - Blank page fields remain visible tokens so nothing is guessed.
   - [alt time] falls back to "another time" on library pages.
============================================================ */
(function(g){
  'use strict';

  if(!g.SHQFunnel || !Array.isArray(g.SHQFunnel.scenarios)) return;

  var BY_ID={};
  g.SHQFunnel.scenarios.forEach(function(s){ BY_ID[s.id]=s; });

  function get(id){ return BY_ID[id] || null; }

  function field(name, fallback){
    var el=document.querySelector('[data-f="'+name+'"]');
    var v=el && typeof el.value==='string' ? el.value.trim() : '';
    return v || fallback;
  }

  function pageVars(){
    var daytime=field('daytime','[day/time]');
    return {
      name:field('name','[Name]'),
      vehicle:field('vehicle','[vehicle]'),
      current:field('current','[current]'),
      agent:field('agent','[agent]'),
      number:field('number','[number]'),
      email:field('email','[email]'),
      daytime:daytime,
      altTime:'another time'
    };
  }

  function fill(text, vars){
    vars=vars||pageVars();
    return String(text==null?'':text)
      .replace(/\[Name\]/g,vars.name||'[Name]')
      .replace(/\[vehicle\]/g,vars.vehicle||'[vehicle]')
      .replace(/\[current\]/g,vars.current||'[current]')
      .replace(/\[agent\]/g,vars.agent||'[agent]')
      .replace(/\[number\]/g,vars.number||'[number]')
      .replace(/\[email\]/g,vars.email||'[email]')
      .replace(/\[day\/time\]/g,vars.daytime||'[day/time]')
      .replace(/\[alt time\]/g,vars.altTime||'another time');
  }

  function text(id, channel, vars){
    var s=get(id);
    if(!s) return '';
    var raw='';
    if(channel==='subject') raw=s.subject;
    else if(channel==='email') raw=s.email;
    else if(channel==='sms') raw=s.sms;
    else if(channel==='vm') raw=s.vm;
    else if(channel==='call') raw=s.call;
    else if(channel==='video') raw=s.video;
    else if(channel==='goal') raw=s.goal;
    else if(channel==='next') raw=s.next;
    return fill(raw,vars);
  }

  function emailText(id, vars){
    var subj=text(id,'subject',vars), body=text(id,'email',vars);
    return (subj?'Subject: '+subj+'\n\n':'')+body;
  }

  /* ------------------------------------------------------------
     Library migration map
     Keys intentionally use existing category + card title so the
     old pages can be migrated progressively without changing their
     search/filter UI or deleting specialty templates.
  ------------------------------------------------------------ */
  var LIBRARY_MAP={
    sms:{
      'New lead|Fast first touch':'fresh-standard',
      'No reply|Day one nudge':'no-response-day1',
      'No reply|Last touch, 1 or 2':'final-nudge',
      'Price shopper|Real number, not a guess':'price-first',
      'Payment focused|No guessing on payment':'payment-apr',
      'Trade interest|Appraise it properly':'trade-value',
      'Credit rebuild|No judgment':'credit-concern',
      'Family decision|Bring everyone':'decision-maker',
      'Competitor compare|Straight comparison':'competitor-shop',
      'Appt confirm|You are set':'booked',
      'No-show|No worries, reschedule':'no-show',
      'After test drive|How did it sit':'unsure-after-drive',
      'Left with proposals|Same-day recap':'left-with-numbers',
      'Sold or swap|It sold, here is close':'unit-gone',
      'Post-sale|Thank you':'sold-thankyou'
    },
    email:{
      'New lead|First intro':'fresh-standard',
      'No reply|Follow-up, no reply':'no-response-day1',
      'No reply|Last email, easy exit':'final-nudge',
      'Price shopper|Real number, one call':'price-first',
      'Payment focused|No guessing on payment':'payment-apr',
      'Trade interest|Appraise it properly':'trade-value',
      'Credit rebuild|No judgment, real options':'credit-concern',
      'Family decision|Bring everyone in':'decision-maker',
      'Competitor compare|Straight comparison':'competitor-shop',
      'Appt confirm|Confirmation':'booked',
      'No-show|Reschedule, no worries':'no-show',
      'After test drive|How did it sit':'unsure-after-drive',
      'Left with proposals|Same-day recap':'left-with-numbers',
      'Sold or swap|It sold, here is close':'unit-gone',
      'Post-sale|Thank you and check-in':'sold-thankyou'
    }
  };

  function libraryId(channel, cat, title){
    var map=LIBRARY_MAP[channel]||{};
    return map[String(cat||'')+'|'+String(title||'')] || '';
  }

  function applyLibrary(channel){
    var vars=pageVars();
    document.querySelectorAll('.card').forEach(function(card){
      var catEl=card.querySelector('.tag'), titleEl=card.querySelector('.card-title');
      if(!catEl||!titleEl) return;
      var id=libraryId(channel,catEl.textContent.trim(),titleEl.textContent.trim());
      if(!id) return;

      if(channel==='sms'){
        var msg=card.querySelector('textarea.msg');
        if(msg) msg.value=text(id,'sms',vars);
      }else{
        var subj=card.querySelector('input.subject');
        var body=card.querySelector('textarea.body');
        if(subj) subj.value=text(id,'subject',vars);
        if(body) body.value=text(id,'email',vars);
      }
      card.dataset.canonicalWordtrack=id;
    });
  }

  function wrapGlobalRender(name, after){
    var fn=g[name];
    if(typeof fn!=='function' || fn.__shqCanonicalWordtracks) return false;
    var wrapped=function(){
      var r=fn.apply(this,arguments);
      after();
      return r;
    };
    wrapped.__shqCanonicalWordtracks=true;
    g[name]=wrapped;
    return true;
  }

  function installLibrary(channel){
    wrapGlobalRender('render',function(){ applyLibrary(channel); });
    applyLibrary(channel);
  }

  /* ------------------------------------------------------------
     Leads migration
     Keep the page's multi-step coaching flow, but make the shared
     Funnel source authoritative for the direct channel wordtracks
     that are genuine duplicates.
  ------------------------------------------------------------ */
  function applyLeads(){
    var vars=pageVars();
    var out=document.getElementById('out');
    var outcome=(typeof g.outcome==='string') ? g.outcome : '';

    if(out){
      var steps=out.querySelectorAll('.step');
      if(outcome==='vm' && steps.length){
        var vmLine=steps[0].querySelector('.line');
        if(vmLine){ vmLine.textContent=text('fresh-standard','vm',vars); vmLine.dataset.canonicalWordtrack='fresh-standard'; }
      }
      if(outcome==='nophone' && steps.length){
        var emailLine=steps[0].querySelector('.line');
        if(emailLine){ emailLine.textContent=emailText('fresh-email-only',vars); emailLine.dataset.canonicalWordtrack='fresh-email-only'; }
      }
      if(outcome==='textonly' && steps.length){
        var smsLine=steps[0].querySelector('.line');
        if(smsLine){ smsLine.textContent=text('fresh-standard','sms',vars); smsLine.dataset.canonicalWordtrack='fresh-standard'; }
      }
    }

    var vf=document.getElementById('videoFollowBox');
    var videoSel=document.getElementById('videoVia');
    var notifySel=document.getElementById('notifyVia');
    if(vf&&videoSel&&notifySel){
      var scenario=videoSel.value==='text'?'video-text-notice':'video-email-notice';
      var notice=vf.querySelector('.line.ask');
      if(notice){
        notice.textContent=notifySel.value==='email' ? emailText(scenario,vars) : text(scenario,'sms',vars);
        notice.dataset.canonicalWordtrack=scenario;
      }
    }
  }

  function installLeads(){
    wrapGlobalRender('renderAll',applyLeads);
    applyLeads();
  }

  /* ------------------------------------------------------------
     Reconnect migration
     The page's long call script intentionally remains age-aware.
     Phase 1 moves the duplicated quick VM/SMS/email wordtracks for
     the two strongest overlaps into Funnel for leads <= 30 days.
     Older reconnect language stays local until age variants are
     represented in the canonical model.
  ------------------------------------------------------------ */
  var RECONNECT_MAP={
    pencil:'left-with-numbers',
    quiet:'ghost-after-visit'
  };

  function reconnectAgeDays(){
    var el=document.getElementById('leadDate');
    if(!el||!el.value) return null;
    var d=new Date(el.value+'T12:00:00');
    if(isNaN(d)) return null;
    return Math.max(0,Math.floor((Date.now()-d.getTime())/86400000));
  }

  function applyReconnect(){
    var sc=document.getElementById('scenario');
    if(!sc) return;
    var id=RECONNECT_MAP[sc.value];
    if(!id) return;
    var age=reconnectAgeDays();
    if(age!=null && age>30) return;

    var vars=pageVars();
    var vm=document.getElementById('vmOut'), sms=document.getElementById('smsOut');
    var subj=document.getElementById('subjOut'), body=document.getElementById('bodyOut');
    if(vm){ vm.value=text(id,'vm',vars); vm.dataset.canonicalWordtrack=id; }
    if(sms){ sms.value=text(id,'sms',vars); sms.dataset.canonicalWordtrack=id; }
    if(subj){ subj.value=text(id,'subject',vars); subj.dataset.canonicalWordtrack=id; }
    if(body){ body.value=text(id,'email',vars); body.dataset.canonicalWordtrack=id; }
  }

  function installReconnect(){
    wrapGlobalRender('renderAll',applyReconnect);
    applyReconnect();
  }

  function install(page){
    page=String(page||'').toLowerCase();
    if(page==='sms-library.html') installLibrary('sms');
    else if(page==='email-library.html') installLibrary('email');
    else if(page==='leads.html') installLeads();
    else if(page==='reconnect.html') installReconnect();
  }

  g.SHQWordtracks={
    get:get,
    text:text,
    emailText:emailText,
    fill:fill,
    pageVars:pageVars,
    libraryMap:LIBRARY_MAP,
    libraryId:libraryId,
    applyLibrary:applyLibrary,
    applyLeads:applyLeads,
    applyReconnect:applyReconnect,
    install:install
  };
})(window);
