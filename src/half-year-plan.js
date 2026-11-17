// 180 calendar-day learning plan. Each day has a concrete task; no live price claims.
const phases=[
 {name:'A股规则与K线基础',focus:'理解股票市场规则、K线结构和风险边界',practice:'在图表中指出开高低收、实体与影线，记录一条无法确定的结论'},
 {name:'趋势、均线与成交量',focus:'区分上涨、下跌、横盘以及量价变化',practice:'记录上证和深证指数的MA20位置、前高前低和量能变化'},
 {name:'形态、突破与失败案例',focus:'理解整理、突破、回踩和VCP失败风险',practice:'在历史K线上寻找一个有效形态和一个反例，写出失效条件'},
 {name:'宏观图表与公司财报',focus:'理解PMI、CPI、社融、财报与价格的区别',practice:'选择一个公开指标，记录单位、公布日期、数据来源和不能推断的内容'},
 {name:'指数、行业与自选股',focus:'比较沪深指数和3–4只关注股票的相对表现',practice:'填写大盘—行业—个股对照表，注明数据日期和复权方式'},
 {name:'综合研究与独立复盘',focus:'形成独立观察、反证、风险与复盘流程',practice:'写一页模拟研究报告，区分事实、假设、反证和待核实问题'}
];
const reviews=['复习本周错题并重做两道题','用自己的话向家人解释本周最重要的概念','挑一张历史图表找出一个反例','对照上一周的观察笔记，指出判断偏差'];
export const PLAN_DAYS=180;
export function planForDay(day,lessons){
 if(!Number.isInteger(day)||day<1||day>PLAN_DAYS)throw Error('invalid day');
 const phase=Math.min(5,Math.floor((day-1)/30));
 const phaseDay=(day-1)%30+1;
 const review=day%7===0;
 const courseCount=lessons.length;
 // Exactly 100 new lessons spread across the first 150 days. The last month consolidates.
 const scheduled=Math.floor(Math.min(day,150)*courseCount/150);
 const previous=Math.floor(Math.min(day-1,150)*courseCount/150);
 const today=lessons.slice(previous,scheduled);
 const stage=phases[phase];
 return {day,phase:phase+1,phaseDay,phaseName:stage.name,focus:stage.focus,
   newLessons:today,review,reviewTask:reviews[Math.floor((day-1)/7)%reviews.length],
   practicalTask:stage.practice,
   duration:review?125:160,
   blocks:review?[
    ['回顾已学知识',30],['本周错题重做',30],['历史图表与市场观察',35],['写周总结',30]
   ]:[
    ['复习昨天与错题',20],['学习新课或精读旧课',45],['图表专项练习',35],
    ['沪深指数和自选股观察',35],['写学习总结与反证',25]
   ],
   note:'所有交易日与非交易日均可学习。非交易日使用最近可核验历史行情，不将旧行情称作当天实时数据。'
 };
}
export function getPlanStatus(state){
 const done=Array.isArray(state.planCompletedDays)?state.planCompletedDays:[];
 return {done:new Set(done.filter(x=>Number.isInteger(x)&&x>=1&&x<=PLAN_DAYS)),count:new Set(done.filter(x=>Number.isInteger(x)&&x>=1&&x<=PLAN_DAYS)).size};
}
export function setupHalfYearPlan({getState,save,lessons}){
 const root=document.querySelector('#halfYearPlan');if(!root)return;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
 let selected=1;
 function render(){
  const state=getState(),status=getPlanStatus(state);
  const current=Math.min(180,Math.max(1,...status.done,0)+1);
  if(!root.dataset.initialized){selected=current;root.dataset.initialized='1'}
  const p=planForDay(selected,lessons);
  root.innerHTML='<div class="panel"><h3>半年学习进度：'+status.count+' / 180 天</h3><p>每天都可以学习，完成情况由妈妈自己确认。已完成的日期可再次查看。</p><label for="studyDaySelect">选择学习日（第1–180天）</label><input type="number" id="studyDaySelect" min="1" max="180" value="'+selected+'" style="max-width:160px"><button id="goStudyDay" class="secondary">查看这一天</button><p><strong>第'+p.phase+'个月：'+esc(p.phaseName)+'</strong> · 第'+p.phaseDay+'天</p><p>'+esc(p.focus)+'</p><h3>今天的学习安排（'+p.duration+'分钟，不含休息）</h3><ol>'+p.blocks.map(x=>'<li>'+esc(x[0])+'：'+x[1]+'分钟</li>').join('')+'</ol><h3>今天的新课</h3>'+(p.newLessons.length?'<ul>'+p.newLessons.map(l=>'<li>'+esc(l.title)+'</li>').join('')+'</ul>':'<p>今天不安排新课，重点复习和实战。</p>')+(p.review?'<p><strong>每周复盘：</strong>'+esc(p.reviewTask)+'</p>':'')+'<h3>每日实际操作</h3><p>'+esc(p.practicalTask)+'</p><p class="small">'+esc(p.note)+'</p><label for="studyReflection">今日学习笔记与疑问</label><textarea id="studyReflection" rows="4" placeholder="今天理解了什么？哪里还不明白？对哪只股票的走势有疑问？"></textarea><button id="saveStudyDay">保存笔记并标记完成</button><p id="studyPlanStatus" aria-live="polite"></p></div><h3>六个月阶段路线</h3>'+phases.map((x,i)=>'<div class="panel"><strong>第'+(i+1)+'个月 · 第'+(i*30+1)+'–'+((i+1)*30)+'天：'+esc(x.name)+'</strong><p>'+esc(x.focus)+'</p></div>').join('');
  const note=(state.planDayNotes||{})[selected]||'';root.querySelector('#studyReflection').value=note;
  root.querySelector('#goStudyDay').onclick=()=>{const v=Number(root.querySelector('#studyDaySelect').value);if(!Number.isInteger(v)||v<1||v>180)return;selected=v;render()};
  root.querySelector('#saveStudyDay').onclick=()=>{const st=getState();st.planDayNotes=st.planDayNotes||{};st.planDayNotes[selected]=root.querySelector('#studyReflection').value.slice(0,5000);st.planCompletedDays=Array.isArray(st.planCompletedDays)?st.planCompletedDays:[];if(!st.planCompletedDays.includes(selected))st.planCompletedDays.push(selected);save();render();root.querySelector('#studyPlanStatus').textContent='已保存当天学习记录';};
 }
 render();return render;
}
