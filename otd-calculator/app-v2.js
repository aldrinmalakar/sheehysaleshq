import {states,stateProfiles,automaticStateRate,amount,money,nearest50,paymentAprPresets,autoLoanPayment,calculate} from './calc-v2.js?v=20260915-1';

const $ = (id) => document.getElementById(id);
const stateNames=Object.fromEntries(states);
const stateSelect=$('state');
const d={state:'VA',vehicle:'used',program:'none',price:30998,priceBasis:'rebated',admin:998,discount:0,trade:0,payoff:0};
const stateDraft={};
let result=null;
let paymentResult=null;
const payment={creditTier:'market',term:72,cashDown:0,apr:paymentAprPresets.market.used};
const wholeMoney=value=>'$'+Math.round(value).toLocaleString('en-US');
const paymentRange=(low,high,suffix='')=>high!==null&&high!==low?`${wholeMoney(low)}–${wholeMoney(high)}${suffix}`:`${wholeMoney(low)}${suffix}`;
function presetApr(){
  const preset=paymentAprPresets[payment.creditTier];
  return preset?preset[d.vehicle]:payment.apr;
}
function syncPresetApr(){
  const rate=presetApr();
  if(Number.isFinite(rate)){payment.apr=rate;$('apr').value=rate.toFixed(2);}
}
function updatePayment(complete){
  const validApr=Number.isFinite(payment.apr)&&payment.apr>=0&&payment.apr<=40;
  if(!complete||!validApr){
    paymentResult=null;
    $('monthlyPayment').textContent='—';
    $('paymentVerbal').textContent=!complete?'Complete the OTD estimate first.':'Enter an APR from 0% to 40%.';
    for(const id of ['amountFinanced','totalPayments','financeCharge','pay60','pay72','pay84'])$(id).textContent='—';
    $('paymentAprBadge').textContent=validApr?`${payment.apr.toFixed(2)}% APR`:'APR needed';
    return;
  }
  const balanceLow=Math.max(result.total-payment.cashDown,0);
  const balanceHigh=result.totalMax===null?null:Math.max(result.totalMax-payment.cashDown,0);
  const monthlyLow=autoLoanPayment(balanceLow,payment.apr,payment.term);
  const monthlyHigh=balanceHigh===null?null:autoLoanPayment(balanceHigh,payment.apr,payment.term);
  const verbal=Math.ceil((monthlyHigh??monthlyLow)/10)*10;
  const totalLow=monthlyLow*payment.term;
  const totalHigh=monthlyHigh===null?null:monthlyHigh*payment.term;
  paymentResult={balanceLow,balanceHigh,monthlyLow,monthlyHigh,verbal,totalLow,totalHigh};
  $('monthlyPayment').textContent=paymentRange(monthlyLow,monthlyHigh,' / mo');
  $('paymentVerbal').textContent=`Verbal: about ${wholeMoney(verbal)} per month`;
  $('paymentAprBadge').textContent=`${payment.apr.toFixed(2)}% APR · ${payment.term} mo`;
  $('amountFinanced').textContent=paymentRange(balanceLow,balanceHigh);
  $('totalPayments').textContent=paymentRange(totalLow,totalHigh);
  $('financeCharge').textContent=paymentRange(Math.max(totalLow-balanceLow,0),totalHigh===null?null:Math.max(totalHigh-balanceHigh,0));
  for(const term of [60,72,84]){
    const low=autoLoanPayment(balanceLow,payment.apr,term);
    const high=balanceHigh===null?null:autoLoanPayment(balanceHigh,payment.apr,term);
    $(`pay${term}`).textContent=paymentRange(low,high,' / mo');
    $(`term${term}`).classList.toggle('selected',payment.term===term);
  }
  const preset=paymentAprPresets[payment.creditTier];
  const period=payment.creditTier==='market'?'Q2 2026':payment.creditTier==='custom'?null:'Q1 2026';
  $('paymentBasis').innerHTML=`Uses estimated OTD less cash down. ${preset?preset.label:'Custom APR'}${period?` · Experian ${period}`:''} for a ${d.vehicle} vehicle. <a href="https://www.experian.com/blogs/ask-experian/auto-loan-rates-by-credit-score/" target="_blank" rel="noopener noreferrer">APR data ↗</a>`;
}
const sources={
  VA:{url:'https://www.dmv.virginia.gov/vehicles/taxes-fees/sut',name:'Virginia DMV tax'},
  MD:{url:'https://mva.maryland.gov/your-mva-guide/businesses/bulletins-businesses/new-vehicle-registration-fees-and-term',name:'Maryland MVA excise tax'},
  DC:{url:'https://dmv.dc.gov/node/155452',name:'DC DMV tax & registration'},
  NC:{url:'https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/ByArticle/Chapter_105/Article_5A.html',name:'NC highway use tax'},
  DE:{url:'https://www.services.dmv.de.gov/VehicleServices/titles/index.shtml?dc=ve_title_leased',name:'Delaware DMV document fee'},
  GA:{url:'https://dor.georgia.gov/motor-vehicles/vehicle-registration-license-plates/vehicle-taxes-title-ad-valorem-tax-tavt-and',name:'Georgia TAVT'},
  TX:{url:'https://comptroller.texas.gov/taxes/publications/96-254/mv-sales.php',name:'Texas motor vehicle tax'},
  WA:{url:'https://dor.wa.gov/taxes-rates/other-taxes/motor-vehicle-salesuse-tax',name:'Washington motor vehicle tax'}
};
const nationalSources='<a href="https://floridarevenue.com/taxes/tips/Documents/TIP_26A01-01.pdf" target="_blank" rel="noopener noreferrer">2026 vehicle-tax chart ↗</a> · <a href="https://taxfoundation.org/data/all/state/sales-tax-rates/" target="_blank" rel="noopener noreferrer">2026 local-rate data ↗</a> · <a href="https://caredge.com/guides/car-dealer-doc-fee-by-state" target="_blank" rel="noopener noreferrer">2026 title and registration data ↗</a>';

for(const [label,subset] of [['DMV AREA',states.slice(0,3)],['OTHER STATES',states.slice(3)]]){
  const group=document.createElement('optgroup');group.label=label;
  for(const [code,name] of subset){const option=document.createElement('option');option.value=code;option.textContent=name;group.append(option);}
  stateSelect.append(group);
}
stateSelect.value='VA';
function newStateDraft(){return {dmvOverride:null,manualRate:null,taxOverride:null,adminTaxable:true,tradeTaxCredit:false,weight:null,mpg:null,fmv:null,fuel:'gas',financed:false,hufMode:'proposal',hufFuel:'gas',hufMpg:null,hufYears:1,highwayFee:null};}
function active(){return stateDraft[d.state]??(stateDraft[d.state]=newStateDraft());}
function dollars(v){return v===null||v===''?'':String(v);}
function input(label,id,value='',placeholder='',options={}){
  const prefix=options.prefix??'$';
  return `<label class="field ${options.wide?'span-2':''}"><span>${label}</span><span class="input-wrap ${prefix?'leading':''}">${prefix?`<span aria-hidden="true">${prefix}</span>`:''}<input type="number" id="${id}" data-state-input="${id}" inputmode="decimal" min="0" step="${options.step??'0.01'}" value="${dollars(value)}" placeholder="${placeholder}" aria-label="${label}"></span></label>`;
}
function renderStateFields(){
  const s=active();let html='';
  switch(d.state){
    case 'VA':
      html=`<p class="context span-2">4.15% vehicle tax + 0.20% proposal fee. Other DMV fees: $89.75. VA highway-use amount is listed separately.</p>
      <label class="field span-2"><span>VA highway-use amount</span><select id="hufMode" data-state-input="hufMode"><option value="proposal" ${s.hufMode==='proposal'?'selected':''}>Use store proposal estimate · $88.20</option><option value="calculated" ${s.hufMode==='calculated'?'selected':''}>Calculate from vehicle MPG</option><option value="manual" ${s.hufMode==='manual'?'selected':''}>Enter confirmed amount</option><option value="none" ${s.hufMode==='none'?'selected':''}>No fee · $0</option></select></label>
      ${s.hufMode==='calculated'?`<label class="field"><span>Powertrain</span><select id="hufFuel" data-state-input="hufFuel"><option value="gas" ${s.hufFuel==='gas'?'selected':''}>Gas or hybrid</option><option value="ev" ${s.hufFuel==='ev'?'selected':''}>Electric</option></select></label>${s.hufFuel==='ev'?'':input('Combined MPG','hufMpg',s.hufMpg,'e.g. 32',{prefix:'',step:'0.1'})}<label class="field"><span>Registration term</span><select id="hufYears" data-state-input="hufYears">${[1,2,3].map(year=>`<option value="${year}" ${s.hufYears===year?'selected':''}>${year} year${year===1?'':'s'}</option>`).join('')}</select></label>`:''}
      ${s.hufMode==='manual'?input('Confirmed VA highway-use amount','highwayFee',s.highwayFee,'Enter amount'):''}
      ${input('Override other DMV fees','dmvOverride',s.dmvOverride,'89.75')}`;
      break;
    case 'MD':
      html=`<p class="context span-2">6.5% vehicle excise tax. Registration estimate: $543–$561.</p>${input('Override DMV / tags','dmvOverride',s.dmvOverride,'543–561')}`;
      break;
    case 'NC':
      html=`<p class="context span-2">Automatic estimate: 3% highway-use tax after trade credit, capped at $2,000. Registration allowance: $543.</p>${input('Optional tax amount override','taxOverride',s.taxOverride,'Auto')}${input('Optional DMV / tags override','dmvOverride',s.dmvOverride,'543')}`;
      break;
    case 'DC':
      html=`<p class="context span-2">DC excise tax uses DMV fair market value, unladen weight, and city MPG.</p>
      ${input('Unladen weight (lb)','weight',s.weight,'e.g. 3,500',{prefix:'',step:'1'})}
      <label class="field"><span>Powertrain</span><select id="fuel" data-state-input="fuel"><option value="gas" ${s.fuel!=='ev'?'selected':''}>Gas or hybrid</option><option value="ev" ${s.fuel==='ev'?'selected':''}>Electric</option></select></label>
      ${s.fuel==='ev'?'':input('City MPG','mpg',s.mpg,'e.g. 27',{prefix:'',step:'1'})}
      ${input('DMV fair market value','fmv',s.fmv,'Enter value')}
      <label class="checkline span-2"><input id="financed" data-state-input="financed" type="checkbox" ${s.financed?'checked':''}>Financed vehicle ($20 lien fee)</label>
      ${input('Override DMV / tags','dmvOverride',s.dmvOverride,'Auto from weight')}`;
      break;
    default:
      const profile=stateProfiles[d.state],autoRate=automaticStateRate(d.state,d.vehicle,d.price);
      html=`<p class="context span-2">Automatic 2026 estimate: ${profile.detail}. Default rate: ${autoRate.toFixed(3).replace(/0+$/,'').replace(/\.$/,'')}%. DMV / registration allowance: ${money(profile.dmv)}.</p>
      ${input('Optional exact tax-rate override','manualRate',s.manualRate,autoRate.toFixed(3).replace(/0+$/,'').replace(/\.$/,''),{prefix:'%',step:'0.001'})}
      ${input('Optional DMV / title / tags override','dmvOverride',s.dmvOverride,money(profile.dmv).replace('$',''))}`;
  }
  $('stateFields').innerHTML=html;
}
function setState(code){d.state=code;stateSelect.value=code;for(const chip of document.querySelectorAll('.chip')){const selected=chip.dataset.state===code;chip.classList.toggle('selected',selected);chip.setAttribute('aria-pressed',String(selected));}renderStateFields();update();}
function update(){
  result=calculate({...d,...active()});
  $('resultCaption').textContent=`${stateNames[d.state]} · ${d.vehicle==='new'?'New':'Used'} vehicle`;
  $('totalLabel').textContent=d.trade||d.payoff?'ESTIMATED BALANCE WITH TRADE':'ESTIMATED OTD';
  const complete=result.total!==null;
  $('total').textContent=complete?(result.totalMax===null?money(result.total):`${money(result.total)}–${money(result.totalMax)}`):'—';
  $('rounding').textContent=complete?(result.totalMax===null?`Customer-safe: about ${nearest50(result.total)}`:`Customer-safe: about ${nearest50(result.total)}–${nearest50(result.totalMax)}`):result.missing;
  $('rowPrice').textContent=money(result.price);
  $('rowPriceLabel').textContent=d.priceBasis==='msrp'?'MSRP':'Provided price';
  $('priceHint').textContent=d.priceBasis==='msrp'?'Enter verified rebates and savings below.':'Enter only discounts not already reflected in this price.';
  $('rowProgram').textContent=result.incentive?`−${money(result.incentive)}`:'—';
  $('rowDiscount').textContent=result.discount?`−${money(result.discount)}`:'—';
  $('rowAdmin').textContent=money(result.admin);
  $('rowHighwayFee').textContent=money(result.highwayFee);
  $('highwayFeeRow').hidden=d.state!=='VA';
  $('rowTax').textContent=result.tax===null?'—':money(result.tax);
  $('rowExtraTax').textContent=money(result.extraTax);
  $('extraTaxRow').hidden=d.state!=='VA';
  $('rowDmv').textContent=result.dmv===null?'—':result.dmvMax===null?money(result.dmv):`${money(result.dmv)}–${money(result.dmvMax)}`;
  $('tradeRow').hidden=!d.trade&&!d.payoff;
  $('rowTrade').textContent=money(result.payoff-result.trade);
  $('formula').textContent=result.formula;
  const src=sources[d.state];$('sourceLink').innerHTML=src?`Tax reference: <a href="${src.url}" target="_blank" rel="noopener noreferrer">${src.name} ↗</a>${d.state==='VA'?' · <a href="https://www.dmv.virginia.gov/sites/default/files/documents/HUF-fee-chart.pdf" target="_blank" rel="noopener noreferrer">VA 2026–27 highway-use schedule ↗</a>':''}`:`References: ${nationalSources}`;
  $('program').disabled=d.vehicle==='used';
  $('programHint').textContent=d.vehicle==='new'?'New vehicles only · Select one program.':'Programs available only for new vehicles.';
  updatePayment(complete);
}
document.querySelectorAll('.chip').forEach(chip=>chip.addEventListener('click',()=>setState(chip.dataset.state)));
stateSelect.addEventListener('change',event=>setState(event.target.value));
for(const id of ['price','priceBasis','admin','discount','trade','payoff','vehicle','program']){
  $(id).addEventListener('input',event=>{
    d[id]=['vehicle','program','priceBasis'].includes(id)?event.target.value:amount(event.target.value);
    if(id==='vehicle'){
      if(d.vehicle==='used'){d.program='none';$('program').value='none';}
      if(payment.creditTier!=='custom')syncPresetApr();
    }
    if((id==='trade'&&d.state==='NC')||(['vehicle','price'].includes(id)&&stateProfiles[d.state]))renderStateFields();
    update();
  });
}
$('creditTier').addEventListener('change',event=>{
  payment.creditTier=event.target.value;
  if(payment.creditTier!=='custom')syncPresetApr();
  update();
});
$('term').addEventListener('change',event=>{payment.term=Number(event.target.value);update();});
document.querySelectorAll('[data-payment-term]').forEach(button=>button.addEventListener('click',()=>{
  payment.term=Number(button.dataset.paymentTerm);
  $('term').value=String(payment.term);
  update();
}));
$('cashDown').addEventListener('input',event=>{payment.cashDown=amount(event.target.value);update();});
$('apr').addEventListener('input',event=>{
  payment.apr=event.target.value===''?null:Number(event.target.value);
  payment.creditTier='custom';
  $('creditTier').value='custom';
  update();
});
$('stateFields').addEventListener('input',event=>{
  const key=event.target.dataset.stateInput;if(!key)return;
  active()[key]=event.target.type==='checkbox'?event.target.checked:['fuel','hufMode','hufFuel'].includes(key)?event.target.value:event.target.value===''?null:Number(event.target.value);
  if(['fuel','hufMode','hufFuel'].includes(key))renderStateFields();
  update();
});
renderStateFields();update();

// Expose the visible calculation workflow to supporting agent browsers when available.
if(document.modelContext?.registerTool){
  const tool={
    name:'configure_otd_estimate',title:'Configure OTD and payment estimate',
    description:'Set vehicle, registration and optional retail-finance details in the visible Sheehy calculator. Return the current OTD and payment estimate or the next required field.',
    inputSchema:{type:'object',properties:{state:{type:'string',enum:states.map(([code])=>code)},price:{type:'number',minimum:0.01},priceBasis:{type:'string',enum:['msrp','rebated']},vehicle:{type:'string',enum:['new','used']},program:{type:'string',enum:['none','military','college']},admin:{type:'number',minimum:0},hufMode:{type:'string',enum:['proposal','calculated','manual','none']},highwayFee:{type:'number',minimum:0},combinedMpg:{type:'number',minimum:1},hufFuel:{type:'string',enum:['gas','ev']},registrationYears:{type:'integer',minimum:1,maximum:3},discount:{type:'number',minimum:0},trade:{type:'number',minimum:0},payoff:{type:'number',minimum:0},taxRate:{type:'number',minimum:0,maximum:100},dmv:{type:'number',minimum:0},weight:{type:'number',minimum:1},cityMpg:{type:'number',minimum:1},fairMarketValue:{type:'number',minimum:0.01},fuel:{type:'string',enum:['gas','ev']},creditTier:{type:'string',enum:['market','superprime','prime','nearprime','subprime','deep','custom']},apr:{type:'number',minimum:0,maximum:40},term:{type:'integer',enum:[36,48,60,72,84]},cashDown:{type:'number',minimum:0}},required:['state','price'],additionalProperties:false},
    annotations:{readOnlyHint:false,untrustedContentHint:false},
    execute(value){
      if(!states.some(([code])=>code===value.state)||!Number.isFinite(value.price)||value.price<=0)throw new Error('Enter a valid state and positive price.');
      if(value.vehicle==='used'&&value.program&&value.program!=='none')throw new Error('Sheehy military and college programs are for new vehicles only.');
      for(const key of ['vehicle','program','price','priceBasis','admin','discount','trade','payoff'])if(value[key]!==undefined){d[key]=value[key];$(key).value=value[key];}
      if(d.vehicle==='used'){d.program='none';$('program').value='none';}
      if(value.vehicle!==undefined&&payment.creditTier!=='custom')syncPresetApr();
      if(value.creditTier!==undefined){payment.creditTier=value.creditTier;$('creditTier').value=value.creditTier;if(value.creditTier!=='custom')syncPresetApr();}
      if(value.apr!==undefined){payment.apr=value.apr;payment.creditTier='custom';$('creditTier').value='custom';$('apr').value=value.apr;}
      if(value.term!==undefined){payment.term=value.term;$('term').value=value.term;}
      if(value.cashDown!==undefined){payment.cashDown=value.cashDown;$('cashDown').value=value.cashDown;}
      const s=stateDraft[value.state]??(stateDraft[value.state]=newStateDraft());
      for(const [from,to] of [['taxRate','manualRate'],['dmv','dmvOverride'],['weight','weight'],['cityMpg','mpg'],['fairMarketValue','fmv'],['fuel','fuel'],['hufMode','hufMode'],['highwayFee','highwayFee'],['combinedMpg','hufMpg'],['hufFuel','hufFuel'],['registrationYears','hufYears']])if(value[from]!==undefined)s[to]=value[from];
      if(value.highwayFee!==undefined&&value.hufMode===undefined)s.hufMode='manual';
      setState(value.state);
      return {state:d.state,estimatedOtd:result.total,estimatedOtdHigh:result.totalMax,estimatedMonthlyPayment:paymentResult?.monthlyLow??null,estimatedMonthlyPaymentHigh:paymentResult?.monthlyHigh??null,verbalMonthlyPayment:paymentResult?.verbal??null,apr:payment.apr,term:payment.term,amountFinanced:paymentResult?.balanceLow??null,missing:result.missing};
    }
  };
  try{Promise.resolve(document.modelContext.registerTool(tool)).catch(()=>{});}catch{}
}
