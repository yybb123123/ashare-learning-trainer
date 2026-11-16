const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const avg=(a,n)=>a.length>=n?a.slice(-n).reduce((s,x)=>s+x.close,0)/n:null;
function analysis(item){
 const b=item.bars,latest=b.at(-1),prev=b.at(-2),m5=avg(b,5),m20=avg(b,20),m50=avg(b,50);
 const change=(latest.close/prev.close-1)*100;
 const v20=b.slice(-21,-1).reduce((s,x)=>s+x.volume,0)/20;
 const volumeRatio=v20>0?latest.volume/v20:null;
 const trend=m20===null?'数据不足':latest.close>m20?'收盘价在MA20上方':latest.close<m20?'收盘价在MA20下方':'收盘价接近MA20';
 const tip=latest.close>latest.open?'今天收盘高于开盘，形成阳线；但不代表明天一定上涨。':latest.close<latest.open?'今天收盘低于开盘，形成阴线；不能仅凭一根K线预测后续。':'今天开盘与收盘接近，需结合趋势继续观察。';
 return {latest,change,m5,m20,m50,volumeRatio,trend,tip};
}
export async function renderDailyMarket(){
 const target=document.querySelector('#dailyMarketContent');if(!target)return;
 target.textContent='正在读取每日行情…';
 try{
  const r=await fetch('./data/daily-market.json',{cache:'no-store'});
  if(!r.ok)throw Error('尚未生成行情数据');
  const data=await r.json();
  if(!Array.isArray(data.items)||data.items.length<2||data.verificationLevel!=='structural-only')throw Error('数据格式不符合预期');
  const cards=data.items.map(item=>{
   if(!Array.isArray(item.bars)||item.bars.length<50)return '';
   const a=analysis(item),p=x=>x===null?'—':x.toFixed(2),date=a.latest.date;
   return '<article class="panel"><h3>'+e(item.name)+' · '+e(item.symbol)+'</h3><p class="small">行情日期：'+e(date)+' · '+e(item.adjustment)+' · '+e(item.source)+'</p><p><strong>收盘 '+p(a.latest.close)+'，较上一交易日 '+(a.change>=0?'+':'')+p(a.change)+'%</strong></p><p>开 '+p(a.latest.open)+' · 高 '+p(a.latest.high)+' · 低 '+p(a.latest.low)+' · 成交量 '+e(a.latest.volume)+'</p><p>MA5 '+p(a.m5)+' · MA20 '+p(a.m20)+' · MA50 '+p(a.m50)+'</p><p>成交量/前20日均量：'+(a.volumeRatio===null?'—':p(a.volumeRatio)+'倍')+'</p><p><strong>走势学习：</strong>'+e(a.trend)+'。'+e(a.tip)+'</p><p class="small">观察题：当前价格相对MA20的位置，与成交量变化是否一致？请先独立判断，再记录在「我的股票」。</p></article>';
  }).join('');
  target.innerHTML='<p class="notice">数据生成：'+e(data.generatedAt)+' · 最近行情日：'+e(data.asOf)+'。不是实时行情；第三方数据仅完成结构检查，未经独立真实性核验。若日期落后，请勿当作当天数据。</p>'+cards;
 }catch(err){target.innerHTML='<p class="notice">暂无可核验的每日行情：'+e(err.message)+'。自动采集尚未成功前，不显示虚构数据。</p>'}
}
