// Original educational material informed by publicly available MacroMicro getting-started documentation.
// No third-party chart data or copyrighted graphics are copied.
const lessons=[
 {title:'第1课：先读图表标题与单位',concept:'先看图表研究哪个国家、哪个指标、使用什么单位。不要看到曲线向上就直接认为股市会上涨。',example:'例如「中国制造业PMI」和「上证指数」不是同一种数据：一个反映调查指标，一个反映股票价格。',question:'读一张经济图表，第一步应当做什么？',options:['先猜明天涨跌','核对标题、单位、日期和来源','只看颜色'],answer:1,reason:'没有确认指标定义、时间与单位，就无法正确解释曲线。'},
 {title:'第2课：横轴与左右纵轴',concept:'横轴通常表示时间；纵轴表示数值。有的图表同时用左轴 L 和右轴 R，不同曲线可能对应不同单位。',example:'指数可能在左轴以点数表示，利率可能在右轴以百分比表示，不能直接比较两条线的高度。',question:'L 与 R 通常表示什么？',options:['左轴和右轴','涨和跌','买入和卖出'],answer:0,reason:'M平方官方新手说明明确区分 L（左轴）与 R（右轴）。'},
 {title:'第3课：年增率与月增率',concept:'YoY 是与去年同期比较；MoM 是与上个月比较；QoQ 是与上一季度比较。它们回答不同问题。',example:'某指标年增率从8%降到3%，仍可能在增长，只是增长速度放缓。',question:'年增率从8%降至3%，一定代表总量下降吗？',options:['一定','不一定'],answer:1,reason:'增长率仍为正时，总量可能继续增加，但增速下降。'},
 {title:'第4课：景气循环四阶段',concept:'M平方以扩张、趋缓、衰退、复苏四阶段介绍景气循环。实际经济阶段边界并不精确，也不能保证股市同步变化。',example:'经济数据走弱时，股票价格可能已经提前反映预期；要分清领先、同步和滞后。',question:'景气循环的某个阶段能保证股票明天上涨吗？',options:['能','不能'],answer:1,reason:'经济指标与市场价格之间不存在确定的一对一关系。'},
 {title:'第5课：领先指标与滞后指标',concept:'看指标公布频率、发布时间、是否修订，以及它与股票走势的历史关系。相关性不等于因果。',example:'月度经济数据通常晚于对应月份公布，不能当作每日实时信号。',question:'分析月度数据时应特别注意什么？',options:['数据公布滞后和修订','只看图表颜色','忽略日期'],answer:0,reason:'发布时间决定当时投资者能否实际知道该数据。'},
 {title:'第6课：把宏观图表用于A股复盘',concept:'先观察上证和深证的趋势，再选一个宏观指标提出假设，最后用实际行情验证，不把宏观变化当成买卖指令。',example:'若宏观指标改善但指数走弱，应同时记录这种不一致，而不是强行解释成利好。',question:'宏观数据与股价走势矛盾时应当？',options:['只相信自己的预测','记录差异并继续验证','立即满仓'],answer:1,reason:'保留反例有助于学习市场不确定性。'}
];
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function setupMacroGuide({getState,save}){
 const root=document.querySelector('#macroGuide');if(!root)return;
 function render(){
  const state=getState(),records=state.macroResults||{},finished=Object.keys(records).length;
  root.innerHTML='<p class="notice">独立原创教学练习，参考财经M平方公开的新手说明；不是官方授权课程，也没有接入M平方付费数据。</p><p>学习进度：'+finished+' / '+lessons.length+' 课。每课阅读讲解、做题后可以随时回来复习。</p>'+lessons.map((l,i)=>'<details class="summary-card"><summary>'+esc(l.title)+(records[i]?' ✓':'')+'</summary><p><strong>核心概念：</strong>'+esc(l.concept)+'</p><p><strong>例子：</strong>'+esc(l.example)+'</p><p><strong>练习：</strong>'+esc(l.question)+'</p>'+l.options.map((o,j)=>'<label class="macro-option"><input type="radio" name="macro'+i+'" value="'+j+'"> '+esc(o)+'</label>').join('')+'<button data-macro-check="'+i+'">提交并查看讲解</button><div class="macro-feedback" id="macroFeedback'+i+'" aria-live="polite">'+(records[i]?'<p>已完成。'+esc(l.reason)+'</p>':'')+'</div></details>').join('');
  root.querySelectorAll('[data-macro-check]').forEach(b=>b.onclick=()=>{
   const i=Number(b.dataset.macroCheck),chosen=root.querySelector('input[name="macro'+i+'"]:checked'),out=root.querySelector('#macroFeedback'+i);
   if(!chosen)return out.textContent='请先选择一个答案。';
   const ok=Number(chosen.value)===lessons[i].answer;
   out.textContent=(ok?'回答正确。':'需要再复习。正确答案：'+lessons[i].options[lessons[i].answer]+'。')+lessons[i].reason;
   const st=getState();st.macroResults=st.macroResults||{};st.macroResults[i]={correct:ok,at:new Date().toISOString()};save();
  });
 }
 render();return render;
}
