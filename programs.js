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

  // A program is expired when its end date is in the past.
  function isExpired(p){ return !!(p.ends && p.ends < todayYMD()); }

  // Active = switched on, not expired.
  function active(audience){
    return load().items.filter(function(p){
      if(!p.on) return false;
      if(isExpired(p)) return false;
      if(audience && p.audience && p.audience!=='both' && p.audience!==audience) return false;
      return true;
    });
  }

  // Anything on but expired, or with no end date set. Surfaced as a warning.
  function stale(){
    return load().items.filter(function(p){ return p.on && (isExpired(p) || !p.ends); });
  }

  /* ---- language builders ----
     These never state a value. They name the program and route to
     a verified conversation. */
  function phraseFor(p, channel){
    var n=p.name||'a current program';
    if(channel==='sms') return 'There is also '+n+' running right now that may apply to you. I would want to confirm the details with my manager before I quote anything.';
    if(channel==='email') return 'There is also '+n+' running at the moment that may apply to your situation. I want to give you accurate details rather than a guess, so let me verify exactly what you qualify for.';
    return '"There is also '+n+' running right now, and depending on your situation it may apply to you. I do not want to quote you something wrong, so let me confirm the specifics with my manager and get you the real details."';
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
