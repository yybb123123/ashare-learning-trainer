// Structured teaching workflow, NOT a verified reconstruction of J Law's proprietary system.
export const chartSteps=[
 {name:'市场环境',ask:'上证与深证处于上涨、下跌还是整理？MA20方向是否一致？',evidence:'指数日期、收盘、MA20、前高低点'},
 {name:'趋势结构',ask:'个股最近3个高点和低点如何变化？周线与日线是否一致？',evidence:'日线/周线、三个波峰波谷'},
 {name:'相对强度',ask:'同样20个交易日，这只股票与对应指数谁更强？',evidence:'个股20日涨跌幅、基准20日涨跌幅'},
 {name:'均线位置',ask:'股价在MA20/50/200哪一侧？均线是否向上？',evidence:'相同复权口径的价格及均线'},
 {name:'成交量',ask:'整理时是否缩量？突破日相对前20日均量如何？',evidence:'当日成交量、前20日均量'},
 {name:'VCP与Pivot',ask:'回调幅度是否逐次收窄？关键参考位置如何确定？',evidence:'各段回调百分比、区间上沿与日期'},
 {name:'突破有效性',ask:'收盘是否站稳参考位？后续是否跌回区间？',evidence:'突破前后逐日K线，禁止偷看未来'},
 {name:'失效与风险',ask:'什么价格或事实会推翻原判断？跌停、跳空、停牌会怎样？',evidence:'反证、风险场景、A股制度'},
 {name:'复盘结论',ask:'把事实、解释、疑问与后续验证分开写。',evidence:'下一次复盘日期和待核对事实'}
];
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function setupChartMethod({getState,save}){
 const el=document.querySelector('#jlawMethod');if(!el)return;
 const state=getState(),records=state.jlawReports||[];
 el.innerHTML='<div class="panel"><h3>完整看图分析练习 · 九步法</h3><p>这是为了学习而设计的分析流程，不是J Law官方参数或买卖信号。可以先用历史图练习，所有判断必须标注日期和证据。</p><label for="jlawSymbol">股票代码（6位）</label><input id="jlawSymbol" inputmode="numeric" maxlength="6" placeholder="例如600000"><label for="jlawDate">观察日期</label><input id="jlawDate" type="date"><label for="jlawBasis">行情来源和复权口径</label><input id="jlawBasis" placeholder="例如：数据来源、前复权/不复权、截至日期">'+chartSteps.map((x,i)=>'<details class="summary-card" open><summary>步骤'+(i+1)+'：'+esc(x.name)+'</summary><p>'+esc(x.ask)+'</p><p class="small">需要的证据：'+esc(x.evidence)+'</p><textarea data-chart-step="'+i+'" rows="3" placeholder="写下数据事实、解释、反证；无数据时写「待核实」"></textarea></details>').join('')+'<button id="saveJlawReport">保存完整分析报告</button><p id="jlawReportMessage" aria-live="polite"></p></div><h3>历史分析报告</h3><div id="jlawReportHistory">'+(records.length?records.slice().reverse().slice(0,30).map(r=>'<details class="summary-card"><summary>'+esc(r.date)+' · '+esc(r.symbol)+' · '+esc(r.savedAt.slice(0,10))+'</summary><p>来源：'+esc(r.basis)+'</p>'+r.answers.map((a,i)=>'<p><strong>'+esc(chartSteps[i].name)+'：</strong>'+esc(a)+'</p>').join('')+'</details>').join(''):'还没有分析报告。')+'</div>';
 el.querySelector('#jlawDate').value=new Date().toLocaleDateString('en-CA');
 el.querySelector('#saveJlawReport').onclick=()=>{
  const symbol=el.querySelector('#jlawSymbol').value.trim(),date=el.querySelector('#jlawDate').value,basis=el.querySelector('#jlawBasis').value.trim(),answers=chartSteps.map((_,i)=>el.querySelector('[data-chart-step="'+i+'"]').value.trim());
  const msg=el.querySelector('#jlawReportMessage');
  if(!/^[036][0-9]{5}$/.test(symbol)||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!basis||answers.some(x=>!x)){msg.textContent='请填写6位A股代码、日期、数据来源和九步分析。暂时没有数据时可以写「待核实」。';return}
  const st=getState();st.jlawReports=Array.isArray(st.jlawReports)?st.jlawReports:[];st.jlawReports.push({symbol,date,basis:basis.slice(0,300),answers:answers.map(x=>x.slice(0,2000)),savedAt:new Date().toISOString()});save();msg.textContent='报告已保存到本机';const history=el.querySelector('#jlawReportHistory');history.insertAdjacentHTML('afterbegin','<p>已保存 '+esc(date)+' · '+esc(symbol)+'。刷新页面可在历史报告查看。</p>');
 };
}
