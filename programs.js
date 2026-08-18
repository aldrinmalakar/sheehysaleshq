/* ============================================================
   SHEEHY SALES HQ - shared programs store
   One place for the current owner and customer programs. Every
   page loads this file, so updating a program on the Programs
   page updates the language everywhere at once.

   Compliance by design: a program stores a NAME and a PLAIN
   DESCRIPTION only. There is deliberately no field for a dollar
   amount, a rate, a payment or a percentage, because nothing in
   this app is allowed to quote one. Output language always points
   the customer to a verified conversation, never a number.
============================================================ */
(function(g){
  var KEY='shq_programs_v1';

  function load(){
    try{ var v=JSON.parse(localStorage.getItem(KEY)||'{}');
      if(!v.items) v.items=[];
      return v;
    }catch(e){ return {items:[]}; }
  }
  function save(v){ try{ localStorage.setItem(KEY, JSON.stringify(v)); }catch(e){} }

  function todayYMD(){ var d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }

  function isExpired(p){ return !!(p.ends && p.ends < todayYMD()); }

  function active(audience){
    return load().items.filter(function(p){
      if(!p.on) return false;
      if(isExpired(p)) return false;
      if(audience && p.audience && p.audience!=='both' && p.audience!==audience) return false;
      return true;
    });
  }

  function stale(){
    return load().items.filter(function(p){ return p.on && (isExpired(p) || !p.ends); });
  }

  /* Program language is a support line after the customer gives a reason.
     It is deliberately not written as a cold-call opener. */
  function phraseFor(p, channel){
    var n=p.name||'the current program';
    if(channel==='sms') return 'Since you asked about programs, I can verify whether '+n+' applies to your situation before we count it into anything.';
    if(channel==='email') return 'Since you asked about programs, I can verify the current requirements for '+n+' and whether it applies to your situation before we count it into the deal.';
    return '"Since you asked about programs, '+n+' may be worth checking. I will verify the current eligibility and vehicle rules before we count it into the deal."';
  }

  function line(channel, audience){
    var a=active(audience);
    if(!a.length) return '';
    return phraseFor(a[0], channel);
  }

  function names(audience){
    return active(audience).map(function(p){ return p.name; });
  }

  g.SHQPrograms={
    KEY:KEY, load:load, save:save, active:active, stale:stale,
    isExpired:isExpired, line:line, names:names, phraseFor:phraseFor, todayYMD:todayYMD
  };
})(window);
