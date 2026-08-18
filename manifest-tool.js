/* ============================================================
   SHEEHY SALES HQ - outbound program manifest tool

   Loads an approved .xlsx/.xls/.csv owner list in memory, keeps a
   small per-row progress record on this browser and hands the
   selected owner into the canonical Funnel. DriveCentric remains
   the system of record.
============================================================ */
(function(g){
  'use strict';
  var MOUNT_ID='manifestMount';
  var PROGRESS_KEY='shq_manifest_progress_v1';
  var PROFILE_KEY='shq_fill_v1';
  var rows=[],keys=[],map={},query='',campaignId='';

  function $(id){return document.getElementById(id);}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function findCol(pats,avoid){
    var bad=avoid||[],ok=function(k){return !bad.some(function(b){return k.toLowerCase().indexOf(b)>-1;});};
    var i,p,k;
    for(i=0;i<pats.length;i++){p=pats[i];k=keys.filter(function(x){return x.trim().toLowerCase()===p&&ok(x);})[0];if(k)return k;}
    for(i=0;i<pats.length;i++){p=pats[i];k=keys.filter(function(x){return x.trim().toLowerCase().indexOf(p)>-1&&ok(x);})[0];if(k)return k;}
    return '';
  }
  function detect(){
    map={
      first:findCol(['first name','firstname','fname','given name','buyer first','customer first','contact first','first']),
      last:findCol(['last name','lastname','lname','surname','family name','buyer last','customer last','last']),
      fullname:findCol(['full name','customer name','contact name','buyer name','name']),
      phone:findCol(['cell phone','mobile phone','mobile','phone number','phone']),
      year:findCol(['vehicle year','current year','year']),
      model:findCol(['vehicle model','current model','model','vehicle','owned vehicle','current vehicle']),
      miles:findCol(['mileage','miles','odometer'])
    };
  }
  function val(r,f){var k=map[f];return k&&r[k]!=null?String(r[k]).trim():'';}
  function nameOf(r){var f=val(r,'first'),l=val(r,'last');if(f||l)return (f+' '+l).trim();return val(r,'fullname')||'(no name)';}
  function currentOf(r){var y=val(r,'year'),m=val(r,'model');return (y+' '+m).trim();}
  function keyOf(r){return [nameOf(r).toLowerCase(),val(r,'phone').replace(/\D/g,''),currentOf(r).toLowerCase()].join('|');}
  function loadProgress(){try{return JSON.parse(localStorage.getItem(PROGRESS_KEY)||'{}');}catch(e){return {};}}
  function saveProgress(p){try{localStorage.setItem(PROGRESS_KEY,JSON.stringify(p));}catch(e){}}
  function hydrate(){var p=loadProgress();rows.forEach(function(r){var x=p[keyOf(r)];if(x){r['Call Outcome']=x.outcome||r['Call Outcome']||'';r['Call Notes']=x.notes||r['Call Notes']||'';r['Worked At']=x.at||r['Worked At']||'';}});}
  function persistRow(r){var p=loadProgress(),k=keyOf(r);p[k]={outcome:r['Call Outcome']||'',notes:r['Call Notes']||'',at:r['Worked At']||new Date().toLocaleString()};saveProgress(p);}

  function eligiblePrograms(){
    if(!g.SHQPrograms||typeof g.SHQPrograms.active!=='function')return [];
    return g.SHQPrograms.active('owner').filter(function(p){return !!p.verified&&!!p.ends&&!g.SHQPrograms.isExpired(p);});
  }
  function selectedProgram(){var a=eligiblePrograms();for(var i=0;i<a.length;i++)if(a[i].id===campaignId)return a[i];return null;}

  function addStyles(){var s=document.createElement('style');s.textContent=[
    '.manifest-panel .mtools{display:flex;gap:8px;align-items:center;flex-wrap:wrap}',
    '.manifest-panel .mstat{font-size:12px;color:#6b7889;margin:9px 0;line-height:1.5}',
    '.manifest-panel .campaignpick{border:1px solid #d8e2fb;background:#f8faff;border-radius:9px;padding:9px 10px;margin:9px 0}',
    '.manifest-panel .campaignpick label{display:flex;flex-direction:column;gap:4px;font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:#6b7889}',
    '.manifest-panel .campaignpick select{width:100%;margin:0;font-size:13px}.manifest-panel .campaignpick span{display:block;font-size:11.5px;color:#6b7889;margin-top:5px}',
    '.manifest-panel .mmap{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:8px;margin:10px 0}',
    '.manifest-panel .mmap label{font-size:10px}.manifest-panel .mmap select{width:100%;margin-top:4px}',
    '.manifest-panel .msearch{width:100%;margin:8px 0 10px}',
    '.manifest-panel .mlist{display:grid;gap:7px;max-height:560px;overflow:auto}',
    '.manifest-panel .mrow{display:grid;grid-template-columns:minmax(0,1fr) 170px auto;gap:9px;align-items:center;border:1px solid #e4e8ee;border-radius:9px;padding:9px 10px;background:#fff}',
    '.manifest-panel .mname{font-weight:700;font-size:13px}.manifest-panel .mdetail{font-size:11.5px;color:#6b7889;margin-top:2px;overflow-wrap:anywhere}',
    '.manifest-panel .mrow select{width:100%;margin:0;font-size:12px;padding:7px 8px}',
    '.manifest-panel .done{border-color:#b8dfc8;background:#f5fbf7}',
    '.manifest-panel .mempty{font-size:13px;color:#6b7889;padding:12px 0}',
    '@media(max-width:650px){.manifest-panel .mrow{grid-template-columns:1fr}.manifest-panel .mrow .primary{width:100%}}'
  ].join('');document.head.appendChild(s);}

  function markup(){return '<div class="panel manifest-panel"><h2>Outbound program manifest</h2>'
    +'<div class="mtools"><input type="file" id="manifestFile" accept=".xlsx,.xls,.csv"><button class="primary" id="manifestExport" type="button" disabled>Export progress</button><button class="ghostb" id="manifestClearProgress" type="button">Clear saved progress</button></div>'
    +'<div class="mstat" id="manifestStat">No manifest loaded. Load the approved program file when you are ready to work the list.</div>'
    +'<div class="campaignpick"><label>Funnel campaign context<select id="manifestProgram"></select></label><span>Optional. Only verified, active owner programs appear here. The Funnel will not lead with the program; it uses this context only when the customer asks or it becomes relevant.</span></div>'
    +'<div id="manifestMap"></div><input class="msearch" id="manifestSearch" placeholder="Search name, phone, vehicle or outcome" autocomplete="off" style="display:none"><div class="mlist" id="manifestList"></div>'
    +'<div class="note">The loaded manifest stays in this browser tab. Only your outcome/progress metadata is remembered locally on this device. <b>Open Funnel</b> loads the owner name, current vehicle and selected campaign context into Owner / Outbound without creating a second CRM.</div></div>';}

  function renderCampaign(){
    var sel=$('manifestProgram');if(!sel)return;var a=eligiblePrograms(),html='<option value="">Owner outreach · no named program</option>';
    a.forEach(function(p){html+='<option value="'+esc(p.id)+'">'+esc(p.name)+'</option>';});sel.innerHTML=html;
    if(a.some(function(p){return p.id===campaignId;}))sel.value=campaignId;else{campaignId='';sel.value='';}
  }
  function optionHtml(field){return '<option value="">(none)</option>'+keys.map(function(k){return '<option value="'+esc(k)+'"'+(map[field]===k?' selected':'')+'>'+esc(k)+'</option>';}).join('');}
  function renderMap(){
    var host=$('manifestMap');if(!rows.length){host.innerHTML='';return;}
    var defs=[['first','First name'],['last','Last name'],['fullname','Full name'],['phone','Phone'],['year','Current year'],['model','Current model'],['miles','Mileage']];
    host.innerHTML='<div class="mmap">'+defs.map(function(d){return '<label>'+d[1]+'<select data-mf="'+d[0]+'">'+optionHtml(d[0])+'</select></label>';}).join('')+'</div>';
    host.querySelectorAll('[data-mf]').forEach(function(sel){sel.addEventListener('change',function(){map[this.getAttribute('data-mf')]=this.value;hydrate();renderAll();});});
  }
  function renderStat(){
    var worked=rows.filter(function(r){return !!r['Call Outcome'];}).length,named=rows.filter(function(r){return nameOf(r)!=='(no name)';}).length;
    $('manifestStat').innerHTML=rows.length+' rows loaded · '+named+' with names · '+worked+' worked'+(named===0?' · <b>No names detected. Fix the column mapping below.</b>':'');
    $('manifestExport').disabled=!rows.length;$('manifestSearch').style.display=rows.length?'':'none';
  }
  function detail(r){var bits=[],p=val(r,'phone'),cur=currentOf(r),mi=val(r,'miles');if(cur)bits.push(cur);if(mi)bits.push(mi+' miles');if(p)bits.push(p);if(r['Worked At'])bits.push('Last worked '+r['Worked At']);return bits.join(' · ');}
  var OUTCOMES=['','No answer','Left voicemail','Connected','Callback scheduled','Appointment set','Not interested','Bad contact info'];
  function openFunnel(r){
    var profile={};try{profile=JSON.parse(localStorage.getItem(PROFILE_KEY)||'{}');}catch(e){}
    var n=nameOf(r);if(n&&n!=='(no name)')profile.name=n.split(/\s+/)[0];
    var c=currentOf(r);if(c)profile.current=c;
    var prog=selectedProgram();
    if(prog){profile.program=prog.name||'';profile.programdesc=prog.desc||'';}else{delete profile.program;delete profile.programdesc;}
    try{localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));}catch(e){}
    window.open('funnel.html?stage=outbound&scenario=owner-first-contact','_blank','noopener');
  }
  function renderList(){
    var box=$('manifestList');if(!rows.length){box.innerHTML='';return;}
    var q=query.trim().toLowerCase(),shown=rows.filter(function(r){return !q||Object.keys(r).map(function(k){return String(r[k]||'');}).join(' ').toLowerCase().indexOf(q)>-1||nameOf(r).toLowerCase().indexOf(q)>-1||currentOf(r).toLowerCase().indexOf(q)>-1;}).slice(0,100);
    if(!shown.length){box.innerHTML='<div class="mempty">No rows match that search.</div>';return;}
    box.innerHTML='';shown.forEach(function(r){
      var row=document.createElement('div');row.className='mrow'+(r['Call Outcome']?' done':'');
      var left=document.createElement('div');left.innerHTML='<div class="mname">'+esc(nameOf(r))+'</div><div class="mdetail">'+esc(detail(r))+'</div>';
      var sel=document.createElement('select');OUTCOMES.forEach(function(o){var op=document.createElement('option');op.value=o;op.textContent=o||'Mark outcome...';if((r['Call Outcome']||'')===o)op.selected=true;sel.appendChild(op);});
      sel.onchange=function(){r['Call Outcome']=this.value;r['Worked At']=this.value?new Date().toLocaleString():'';persistRow(r);renderStat();row.classList.toggle('done',!!this.value);};
      var btn=document.createElement('button');btn.className='primary';btn.type='button';btn.textContent='Open Funnel';btn.onclick=function(){openFunnel(r);};
      row.appendChild(left);row.appendChild(sel);row.appendChild(btn);box.appendChild(row);
    });
    if(rows.length>100&&!q){var n=document.createElement('div');n.className='mempty';n.textContent='Showing the first 100 rows. Search to jump to a specific owner.';box.appendChild(n);}
  }
  function renderAll(){renderStat();renderMap();renderList();}

  async function loadFile(file){
    if(!file)return;
    if(!g.XLSX){$('manifestStat').textContent='Spreadsheet engine did not load. Reload the page and try again.';return;}
    try{
      var buf=await file.arrayBuffer();var wb=g.XLSX.read(buf);var ws=wb.Sheets[wb.SheetNames[0]];
      rows=g.XLSX.utils.sheet_to_json(ws,{defval:''});keys=rows.length?Object.keys(rows[0]):[];detect();hydrate();query='';$('manifestSearch').value='';renderAll();
    }catch(e){$('manifestStat').textContent='Could not read that file. Confirm it is a normal .xlsx, .xls or .csv export and try again.';}
  }
  function exportFile(){
    if(!rows.length||!g.XLSX)return;
    var clean=rows.map(function(r){var o={};Object.keys(r).forEach(function(k){if(k.indexOf('__')!==0)o[k]=r[k];});return o;});
    var wb=g.XLSX.utils.book_new();g.XLSX.utils.book_append_sheet(wb,g.XLSX.utils.json_to_sheet(clean),'Leads');g.XLSX.writeFile(wb,'sheehy-program-manifest-progress.xlsx');
  }
  function clearProgress(){if(!confirm('Clear the saved manifest outcomes on this browser? The original file is not changed.'))return;try{localStorage.removeItem(PROGRESS_KEY);}catch(e){}rows.forEach(function(r){r['Call Outcome']='';r['Call Notes']='';r['Worked At']='';});renderAll();}

  function start(){
    var mount=$(MOUNT_ID);if(!mount)return;addStyles();mount.innerHTML=markup();renderCampaign();
    $('manifestFile').addEventListener('change',function(){var f=this.files&&this.files[0];loadFile(f);this.value='';});
    $('manifestExport').onclick=exportFile;$('manifestClearProgress').onclick=clearProgress;
    $('manifestSearch').addEventListener('input',function(){query=this.value;renderList();});
    $('manifestProgram').addEventListener('change',function(){campaignId=this.value||'';});
    g.addEventListener('shq:programs-changed',renderCampaign);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})(window);
