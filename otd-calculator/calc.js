export const states = [
  ['VA','Virginia'],['MD','Maryland'],['DC','Washington, DC'],['NC','North Carolina'],
  ['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['CA','California'],['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],['FL','Florida'],['GA','Georgia'],['HI','Hawaii'],['ID','Idaho'],['IL','Illinois'],['IN','Indiana'],['IA','Iowa'],['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],['ME','Maine'],['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],['MS','Mississippi'],['MO','Missouri'],['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],['NH','New Hampshire'],['NJ','New Jersey'],['NM','New Mexico'],['NY','New York'],['ND','North Dakota'],['OH','Ohio'],['OK','Oklahoma'],['OR','Oregon'],['PA','Pennsylvania'],['RI','Rhode Island'],['SC','South Carolina'],['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['UT','Utah'],['VT','Vermont'],['WA','Washington'],['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming']
];
export const amount = (value) => Number.isFinite(Number(value)) ? Math.max(0,Number(value)) : 0;
export const cents = (value) => Math.round((value + Number.EPSILON) * 100) / 100;
export const money = (value) => '$' + cents(value).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
export const nearest50 = (value) => '$' + (Math.round(value / 50)*50).toLocaleString('en-US');

/** Virginia DMV's 2026-27 fee schedule, valid July 1, 2026 through June 30, 2027. */
export function virginiaHighwayUseFee(fuel,combinedMpg,years=1) {
  const term=Number(years);
  if(![1,2,3].includes(term)) return null;
  if(fuel==='ev') return cents(135.63*term);
  if(combinedMpg===null || combinedMpg==='' || !Number.isFinite(Number(combinedMpg)) || Number(combinedMpg)<=0) return null;
  const mpg=Number(combinedMpg);
  if(mpg<25) return 0;
  return cents(11600*.326*(1/23.7-1/mpg)*.85*term);
}

/** Unset tax/DMV inputs produce an incomplete calculation, never a silently zero-tax OTD. */
export function calculate(d) {
  const price=amount(d.price), admin=amount(d.admin), trade=amount(d.trade), payoff=amount(d.payoff);
  let highwayFee=0;
  const incentive=d.vehicle==='new' && (d.program==='military'||d.program==='college')?500:0;
  const discount=amount(d.discount);
  const netPrice=cents(price-incentive-discount);
  const common={price,admin,trade,payoff,highwayFee,incentive,discount,netPrice,tax:null,extraTax:0,dmv:null,dmvMax:null,total:null,totalMax:null,rate:null,missing:null,formula:''};
  if(!price) return {...common,missing:'Enter a vehicle selling price.'};
  if(netPrice<0) return {...common,missing:'Discounts exceed the vehicle price.'};
  let tax,extraTax=0,dmv,dmvMax=null,rate,formula='';
  if(d.state==='VA') {
    const mode=d.hufMode??'proposal';
    let hufDescription;
    if(mode==='calculated') {
      const computed=virginiaHighwayUseFee(d.hufFuel,d.hufMpg,d.hufYears??1);
      if(computed===null) return {...common,missing:'Enter VA combined MPG, or choose electric.'};
      highwayFee=computed;
      hufDescription='VA highway-use fee from 2026–27 DMV schedule.';
    } else if(mode==='manual') {
      if(d.highwayFee==null || d.highwayFee==='' || !Number.isFinite(Number(d.highwayFee))) return {...common,missing:'Enter the confirmed VA highway-use amount.'};
      highwayFee=amount(d.highwayFee);
      hufDescription='Entered VA highway-use amount.';
    } else if(mode==='none') {
      hufDescription='No VA highway-use fee selected.';
    } else {
      highwayFee=88.20;
      hufDescription='VA proposal-based highway-use estimate: $88.20.';
    }
    rate=4.15;
    tax=cents((netPrice+admin)*.0415);
    extraTax=cents(Math.max(netPrice-trade,0)*.002);
    // The proposal's $177.95 bundle already included the $88.20 allowance.
    dmv=d.dmvOverride==null?89.75:amount(d.dmvOverride);
    formula=`VA: 4.15% × (adjusted price + admin) + 0.20% × price after trade. Other DMV fees: $42.75 license + $29 filing + $15 title + $3 temp tag. ${hufDescription}`;
  } else if(d.state==='MD') {
    rate=6.5;
    tax=cents(Math.max(netPrice+admin-trade,0)*.065);
    dmv=d.dmvOverride==null?543:amount(d.dmvOverride);
    dmvMax=d.dmvOverride==null?561:null;
    formula='MD: 6.5% × (adjusted price + admin − trade allowance). Registration estimate: $543–$561.';
  } else if(d.state==='NC') {
    rate=3;
    if(trade && d.taxOverride==null) return {...common,rate,dmv:d.dmvOverride==null?543:amount(d.dmvOverride),missing:'Enter NC tax from the deal worksheet for a trade.'};
    tax=d.taxOverride==null?cents((netPrice+admin)*.03):amount(d.taxOverride);
    dmv=d.dmvOverride==null?543:amount(d.dmvOverride);
    formula=d.taxOverride==null?'NC: 3% × (adjusted price + admin) + $543 registration estimate.':'NC: entered tax amount + registration.';
  } else if(d.state==='DC') {
    const weight=Number(d.weight), fmv=Number(d.fmv), mpg=Number(d.mpg),fuel=d.fuel;
    if(!Number.isFinite(weight)||weight<=0) return {...common,missing:'Enter the vehicle’s unladen weight.'};
    if(fuel!=='ev' && (!Number.isFinite(mpg)||mpg<=0)) return {...common,missing:'Enter city MPG or select electric.'};
    if(!Number.isFinite(fmv)||fmv<=0) return {...common,missing:'Enter DC DMV fair market value.'};
    const group=weight<=3499?0:weight<=4999?1:2;
    const col=fuel==='ev'?5:mpg<=20?0:mpg<=25?1:mpg<=30?2:mpg<=39?3:4;
    rate=[[9,5,3.1,2.2,1.5,1],[10,6,4.1,3.2,2.5,2],[11,7,5.1,4.2,3.5,3]][group][col];
    tax=cents(fmv*rate/100);
    let reg=weight<=3499?70:weight<=4999?175:weight<=5999?300:550+(weight>10000?Math.ceil((weight-10000)/1000)*75:0);
    if(fuel==='ev' && d.vehicle==='new' && weight<5000) reg=40;
    dmv=d.dmvOverride==null?reg+30+(d.financed?20:0):amount(d.dmvOverride);
    formula=`DC: ${rate}% × DMV fair market value; ${money(reg)} registration + $30 title${d.financed?' + $20 lien':''}.`;
  } else {
    if(d.manualRate===null || d.manualRate==='' || !Number.isFinite(Number(d.manualRate))) return {...common,missing:'Enter the combined vehicle tax rate for this registration address.'};
    if(d.dmvOverride===null || d.dmvOverride==='' || !Number.isFinite(Number(d.dmvOverride))) return {...common,missing:'Enter the title, tags and registration estimate.'};
    rate=amount(d.manualRate);
    if(rate>100) return {...common,missing:'Enter a tax percentage between 0 and 100.'};
    let base=netPrice+(d.adminTaxable?admin:0)-(d.tradeTaxCredit?trade:0);
    tax=cents(Math.max(base,0)*rate/100);
    dmv=amount(d.dmvOverride);
    formula=`Entered vehicle tax: ${rate}% × ${money(Math.max(base,0))} taxable amount; entered DMV fees ${money(dmv)}.`;
  }
  const total=cents(netPrice+admin+tax+extraTax+dmv+highwayFee-trade+payoff);
  const totalMax=dmvMax===null?null:cents(total+(dmvMax-dmv));
  return {...common,highwayFee,tax,extraTax,dmv,dmvMax,total,totalMax,rate,formula};
}
