// Educational framework inspired by publicly discussed trend/VCP analysis.
// Do not imply endorsement, official J Law curriculum, or verified proprietary rules.
const units=[
 ['1. 大盘环境','先看上证、深证及适合的行业基准是否处于上涨、下跌或整理。','在每日大盘报告记录两个指数与MA20的相对位置。','大盘走弱时，个股突破是否必然失败？','不必然，但需要提高风险意识并寻找反证。'],
 ['2. 价格趋势','观察连续高点和低点，而不是只看今天红绿。','在最近60根K线上标出三个高点和三个低点。','一根阳线能确认上涨趋势吗？','不能，趋势需要一段价格结构。'],
 ['3. 均线排列','综合MA5、MA20、MA50、MA200的位置和方向，注意均线滞后。','记录价格与MA20/MA50的位置，说明是否一致。','站上MA20等于买入信号吗？','不等于，需要其他证据。'],
 ['4. 相对强度','把个股同期表现与沪深指数或合适的行业基准比较。','比较同一20个交易日个股与基准的百分比变化。','个股涨3%，指数涨8%，相对表现如何？','相对落后5个百分点。'],
 ['5. 成交量背景','观察上涨放量、回调缩量与异常成交量，不把量当作单独预测。','计算今日成交量相对前20个交易日均量的倍数。','放量是否保证上涨？','不保证。'],
 ['6. VCP波动收缩','学习波动区间逐步收窄、成交量收缩及形态不确定性。','用历史图标出连续三段回调幅度，寻找收缩和失败例子。','VCP形态出现就一定突破吗？','不一定。'],
 ['7. Pivot参考位置','识别整理区间的关键突破参考位，并明确识别口径。','在历史区间标注上沿及收盘是否站稳。','盘中突破Pivot就证明有效吗？','不能，只是观察线索。'],
 ['8. 突破与假突破','核对突破后的收盘位置、量能、次日延续与跌回区间风险。','挑一段突破后跌回区间的历史行情，写出反例。','放量突破会不会失败？','会。'],
 ['9. 回踩与失效条件','记录回踩时的支撑区间及哪些变化推翻原判断。','事先写出趋势失效的条件，不记录真实买卖指令。','回踩必定反弹吗？','不必然。'],
 ['10. 多重证据清单','将大盘、趋势、相对强度、量能、形态与风险整合，而非机械打分。','选一只关注股，逐项记录支持证据和反证。','单一指标足以保证方向吗？','不足以。'],
 ['11. A股交易制度风险','结合T+1、涨跌幅限制、停牌、跳空和流动性，认识止损执行风险。','为历史案例写出无法按计划退出的情景。','设定止损就保证成交吗？','不保证。'],
 ['12. 历史回放与完整复盘','只使用当时已知数据，写下判断，再推进下一根K线验证。','用历史回放完成一份事实、假设、反证和复盘报告。','可以用未来行情来解释过去的判断吗？','不可以，会产生前视偏差。']
];
const escapeHtml=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function setupJLawGuide({getState,save}){
 const root=document.querySelector('#jlawGuide');if(!root)return;
 function render(){
  const state=getState(),done=state.jlawExercises||{};
  root.innerHTML='<p class="notice">这是独立编写的看图训练，不是J Law官方课程，也不代表其完整或独创策略。VCP与趋势分析包含其他公开体系的共通知识。所有案例均为教学练习，不构成交易建议。</p><p>已完成练习 '+Object.keys(done).length+' / '+units.length+'</p>'+units.map((u,i)=>'<details class="summary-card"><summary>'+escapeHtml(u[0])+(done[i]?' ✓':'')+'</summary><p><strong>学习要点：</strong>'+escapeHtml(u[1])+'</p><p><strong>动手练习：</strong>'+escapeHtml(u[2])+'</p><p><strong>思考题：</strong>'+escapeHtml(u[3])+'</p><label>我的回答<textarea data-jlaw-note="'+i+'" rows="3" placeholder="先写自己的判断，再看讲解">'+escapeHtml(done[i]?.note||'')+'</textarea></label><button data-jlaw-save="'+i+'">保存并查看老师讲解</button><div id="jlawAnswer'+i+'" aria-live="polite">'+(done[i]?'<p><strong>老师讲解：</strong>'+escapeHtml(u[4])+'</p>':'')+'</div></details>').join('');
  root.querySelectorAll('[data-jlaw-save]').forEach(b=>b.onclick=()=>{
   const i=Number(b.dataset.jlawSave),note=root.querySelector('[data-jlaw-note="'+i+'"]').value.trim();
   if(!note){root.querySelector('#jlawAnswer'+i).textContent='请先写下自己的理解或疑问。';return}
   const st=getState();st.jlawExercises=st.jlawExercises||{};
   st.jlawExercises[i]={note:note.slice(0,2000),at:new Date().toISOString()};
   save();root.querySelector('#jlawAnswer'+i).innerHTML='<p><strong>老师讲解：</strong>'+escapeHtml(units[i][4])+'</p>';
  });
 }
 render();return render;
}
