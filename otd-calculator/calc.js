export const states = [
  ['VA','Virginia'],['MD','Maryland'],['DC','Washington, DC'],['NC','North Carolina'],
  ['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['CA','California'],['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],['FL','Florida'],['GA','Georgia'],['HI','Hawaii'],['ID','Idaho'],['IL','Illinois'],['IN','Indiana'],['IA','Iowa'],['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],['ME','Maine'],['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],['MS','Mississippi'],['MO','Missouri'],['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],['NH','New Hampshire'],['NJ','New Jersey'],['NM','New Mexico'],['NY','New York'],['ND','North Dakota'],['OH','Ohio'],['OK','Oklahoma'],['OR','Oregon'],['PA','Pennsylvania'],['RI','Rhode Island'],['SC','South Carolina'],['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['UT','Utah'],['VT','Vermont'],['WA','Washington'],['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming']
];
export const amount = (value) => Number.isFinite(Number(value)) ? Math.max(0,Number(value)) : 0;
export const cents = (value) => Math.round((value + Number.EPSILON) * 100) / 100;
export const money = (value) => '$' + cents(value).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
export const nearest50 = (value) => '$' + (Math.round(value / 50)*50).toLocaleString('en-US');

/**
 * 2026 working defaults for dealer sales to residents of every state.
 * Rates are vehicle-specific where a state uses an excise, title, or highway-use tax.
 * Where vehicle tax varies locally, the rate includes a population-weighted local allowance.
 * The DMV amount keeps Sheehy's $543 out-of-state allowance unless normal state costs run higher.
 */
export const stateProfiles = {
  AL:{rate:4.00,dmv:543,tradeCredit:true,label:'estimated combined automotive tax',detail:'2.00% state automotive tax plus a 2.00% local allowance'},
  AK:{rate:1.82,dmv:543,tradeCredit:true,label:'estimated local vehicle tax',detail:'no state sales tax; 1.82% local allowance'},
  AZ:{rate:8.52,dmv:568,tradeCredit:true,label:'estimated combined vehicle tax',detail:'5.60% state rate plus average local tax'},
  AR:{rate:6.50,dmv:543,tradeCredit:true,localRate:6.125,localBaseCap:2500,label:'vehicle sales tax',detail:'6.50% state tax plus a conservative capped local allowance'},
  CA:{rate:8.99,dmv:549,tradeCredit:false,label:'estimated combined vehicle tax',detail:'7.25% state rate plus average local tax'},
  CO:{rate:7.89,dmv:602,tradeCredit:true,label:'estimated combined vehicle tax',detail:'2.90% state rate plus average local tax'},
  CT:{rate:6.35,highPriceRate:7.75,highPriceAt:50000,dmv:543,tradeCredit:true,label:'vehicle sales tax',detail:'6.35%, or 7.75% when vehicle price is over $50,000'},
  DE:{rate:5.25,dmv:543,tradeCredit:true,label:'motor vehicle document fee',detail:'5.25% document fee'},
  FL:{rate:6.00,dmv:543,tradeCredit:true,localRate:.98,localBaseCap:5000,label:'vehicle sales and surtax',detail:'6.00% state tax plus average county surtax on the first $5,000'},
  GA:{rate:7.00,dmv:543,tradeCredit:true,label:'title ad valorem tax',detail:'7.00% TAVT using selling price as the working value'},
  HI:{rate:4.50,dmv:543,tradeCredit:false,label:'estimated general excise tax',detail:'4.00% state GET plus 0.50% county allowance'},
  ID:{rate:6.03,dmv:543,tradeCredit:true,label:'estimated combined vehicle tax',detail:'6.00% state tax plus average local tax'},
  IL:{rate:7.50,dmv:543,tradeCredit:true,label:'conservative vehicle-use tax',detail:'7.50% working rate for Illinois-titled vehicles'},
  IN:{rate:7.00,dmv:543,tradeCredit:true,label:'vehicle sales tax',detail:'7.00% state tax'},
  IA:{rate:5.00,dmv:543,tradeCredit:true,label:'one-time registration fee',detail:'5.00% one-time registration fee'},
  KS:{rate:8.69,dmv:543,tradeCredit:true,label:'estimated combined vehicle tax',detail:'6.50% state rate plus average local tax'},
  KY:{rate:6.00,dmv:543,tradeCredit:true,usedTradeCredit:false,label:'motor vehicle usage tax',detail:'6.00% usage tax; used-vehicle trade credit is not assumed'},
  LA:{rate:10.11,dmv:543,tradeCredit:true,label:'estimated combined vehicle tax',detail:'5.00% state rate plus average local tax'},
  ME:{rate:5.50,dmv:543,tradeCredit:true,label:'vehicle sales tax',detail:'5.50% state tax'},
  MA:{rate:6.25,dmv:543,tradeCredit:true,label:'vehicle sales tax',detail:'6.25% state tax'},
  MI:{rate:6.00,dmv:543,tradeCredit:true,tradeCap:12000,label:'vehicle sales tax',detail:'6.00% state tax with the 2026 trade deduction capped at $12,000'},
  MN:{rate:6.875,dmv:543,tradeCredit:true,label:'motor vehicle sales tax',detail:'6.875% motor vehicle tax'},
  MS:{rate:5.00,dmv:727,tradeCredit:true,label:'vehicle sales tax',detail:'5.00% passenger-vehicle tax'},
  MO:{rate:8.44,dmv:543,tradeCredit:true,label:'estimated combined vehicle tax',detail:'4.225% state rate plus average local tax'},
  MT:{rate:0,dmv:543,tradeCredit:false,label:'vehicle sales tax',detail:'no state vehicle sales tax'},
  NE:{rate:6.98,dmv:543,tradeCredit:true,label:'estimated combined vehicle tax',detail:'5.50% state rate plus average local tax'},
  NV:{rate:8.24,dmv:543,tradeCredit:true,label:'estimated combined vehicle tax',detail:'6.85% state rate plus average local tax'},
  NH:{rate:0,dmv:543,tradeCredit:false,label:'vehicle sales tax',detail:'no state vehicle sales tax'},
  NJ:{rate:6.625,dmv:543,tradeCredit:true,label:'vehicle sales tax',detail:'6.625% state tax'},
  NM:{rate:4.00,dmv:543,tradeCredit:true,label:'motor vehicle excise tax',detail:'4.00% motor vehicle excise tax'},
  NY:{rate:8.54,dmv:543,tradeCredit:true,label:'estimated combined vehicle tax',detail:'4.00% state rate plus average local tax'},
  ND:{rate:5.00,dmv:543,tradeCredit:true,label:'motor vehicle excise tax',detail:'5.00% motor vehicle excise tax'},
  OH:{rate:7.29,dmv:543,tradeCredit:true,label:'estimated combined vehicle tax',detail:'5.75% state rate plus average local tax'},
  OK:{rate:4.50,dmv:543,tradeCredit:true,label:'combined vehicle tax',detail:'1.25% sales tax plus 3.25% excise tax'},
  OR:{rate:0,dmv:543,tradeCredit:false,newRate:.50,label:'vehicle use tax',detail:'0.50% on a new vehicle; no sales tax on a used vehicle'},
  PA:{rate:6.34,dmv:543,tradeCredit:true,label:'estimated combined vehicle tax',detail:'6.00% state rate plus average local tax'},
  RI:{rate:7.00,dmv:543,tradeCredit:true,label:'vehicle sales tax',detail:'7.00% state tax'},
  SC:{rate:5.00,dmv:543,tradeCredit:true,taxCap:500,label:'infrastructure maintenance fee',detail:'5.00% IMF capped at $500'},
  SD:{rate:4.00,dmv:543,tradeCredit:true,label:'motor vehicle excise tax',detail:'4.00% motor vehicle excise tax'},
  TN:{rate:7.00,dmv:543,tradeCredit:true,localRate:2.75,localBaseCap:1600,singleArticleRate:2.75,label:'vehicle sales tax',detail:'7.00% state tax plus capped local and single-article taxes'},
  TX:{rate:6.25,dmv:543,tradeCredit:true,label:'motor vehicle sales tax',detail:'6.25% motor vehicle tax'},
  UT:{rate:7.42,dmv:543,tradeCredit:true,label:'estimated combined vehicle tax',detail:'4.85% state vehicle rate plus local tax allowance'},
  VT:{rate:6.00,dmv:543,tradeCredit:true,label:'purchase and use tax',detail:'6.00% purchase and use tax'},
  WA:{rate:10.01,dmv:543,tradeCredit:true,label:'estimated combined motor vehicle tax',detail:'average state and local rate plus the 0.50% motor vehicle tax'},
  WV:{rate:6.00,dmv:543,tradeCredit:true,label:'motor vehicle sales tax',detail:'6.00% motor vehicle tax'},
  WI:{rate:5.72,dmv:543,tradeCredit:true,label:'estimated combined vehicle tax',detail:'5.00% state rate plus average local tax'},
  WY:{rate:5.56,dmv:631,tradeCredit:true,label:'estimated combined vehicle tax',detail:'4.00% state rate plus average local tax'}
};

export function automaticStateRate(code,vehicle,price){
  const profile=stateProfiles[code];
  if(!profile)return null;
  if(code==='CT'&&amount(price)>profile.highPriceAt)return profile.highPriceRate;
  if(code==='OR'&&vehicle==='new')return profile.newRate;
  return profile.rate;
}

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
    tax=d.taxOverride==null?cents(Math.min(Math.max(netPrice+admin-trade,0)*.03,2000)):amount(d.taxOverride);
    dmv=d.dmvOverride==null?543:amount(d.dmvOverride);
    formula=d.taxOverride==null?'NC: 3% × (adjusted price + admin − trade), capped at $2,000, plus the $543 out-of-state registration allowance.':'NC: entered tax amount + registration.';
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
    const profile=stateProfiles[d.state];
    if(!profile)return {...common,missing:'Select a registration state.'};
    const hasRateOverride=d.manualRate!==null&&d.manualRate!==''&&Number.isFinite(Number(d.manualRate));
    rate=hasRateOverride?amount(d.manualRate):automaticStateRate(d.state,d.vehicle,netPrice);
    if(rate>100) return {...common,missing:'Enter a tax percentage between 0 and 100.'};
    const tradeAllowed=profile.tradeCredit&&(d.vehicle!=='used'||profile.usedTradeCredit!==false);
    const tradeDeduction=tradeAllowed?Math.min(trade,profile.tradeCap??trade):0;
    const base=Math.max(netPrice+admin-tradeDeduction,0);
    tax=cents(base*rate/100);
    if(!hasRateOverride&&profile.localRate){
      const localBase=Math.min(base,profile.localBaseCap??base);
      tax=cents(tax+localBase*profile.localRate/100);
      if(profile.singleArticleRate){
        const singleBase=Math.min(Math.max(base-1600,0),1600);
        tax=cents(tax+singleBase*profile.singleArticleRate/100);
      }
    }
    if(profile.taxCap!=null)tax=Math.min(tax,profile.taxCap);
    dmv=d.dmvOverride==null?profile.dmv:amount(d.dmvOverride);
    const tradeText=tradeDeduction?` after ${money(tradeDeduction)} trade credit`:trade&& !tradeAllowed?' with no trade-tax credit assumed':'';
    const rateText=hasRateOverride?'entered rate':profile.label;
    formula=`${stateProfiles[d.state].detail}; ${rate}% ${rateText} on ${money(base)}${tradeText}. DMV / registration allowance: ${money(dmv)}.`;
  }
  const total=cents(netPrice+admin+tax+extraTax+dmv+highwayFee-trade+payoff);
  const totalMax=dmvMax===null?null:cents(total+(dmvMax-dmv));
  return {...common,highwayFee,tax,extraTax,dmv,dmvMax,total,totalMax,rate,formula};
}
