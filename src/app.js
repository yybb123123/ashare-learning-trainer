import {config} from './config.js';
import {renderDailyMarket} from './daily-market.js';
import {setupMacroGuide} from './macromicro-guide.js';
import {extendedLessons} from './extended-lessons.js';
import {setupHalfYearPlan} from './half-year-plan.js';
import {setupJLawGuide} from './jlaw-guide.js';
import {setupChartMethod} from './jlaw-method.js';
import {candleDiagram,stageOverview} from './learning-visuals.js';
import {deepLessons,dailySchedule} from './deep-lessons.js';
import {buildSummary,summaryText} from './session-summary.js';
const $=s=>document.querySelector(s),pages=['home','plan','jlaw','lesson','macro','daily','market','watchlist','notes','account','ai'];
const raw=[
['K线基础','红绿K线','中国A股常用红涨绿跌：收盘高于开盘为红色。','开盘9元，收盘11元是什么颜色？','红色|绿色|十字星',0],
['K线基础','开盘价与收盘价','开盘与收盘价决定K线实体两端。','K线实体由哪两个价格构成？','最高与最低|开盘与收盘|昨天与明天',1],
['K线基础','最高价与最低价','上下影线反映交易日最高最低成交价格。','最高12元最低8元，相差多少？','2元|4元|12元',1],
['K线基础','实体和影线','长上影线表示盘中曾达到较高价格，但不保证明天下跌。','长上影线说明什么？','盘中曾上涨但未在最高价收盘|明天必跌|必然涨停',0],
['K线基础','十字星','开盘收盘接近，实体较小，须结合趋势与量能。','十字星出现后应当？','立即买入|立即卖出|结合趋势继续观察',2],
['K线基础','连续K线','趋势要看一段时间的高点低点，而非单根颜色。','判断趋势主要看？','单根颜色|连续高低点|股票名称',1],
['趋势与均线','上涨下跌与横盘','高点和低点逐步抬高是常见上升趋势特征。','高点低点持续抬高通常是？','上升|下跌|无法判断',0],
['趋势与均线','支撑与阻力','支撑与阻力是价格反应区域，不是不可突破的线。','跌破支撑说明？','永不再跌|支撑可能失效|一定反弹',1],
['趋势与均线','MA20均线','MA20是最近20个交易日收盘价的简单平均。','MA20是？','预测未来|20日收盘价平均|股价20元',1],
['趋势与均线','均线与趋势','均线是滞后指标，不能保证盈利。','股价站上MA20代表？','稳赚|可能偏强仍需验证|必须满仓',1],
['趋势与均线','相对强度','同一时期个股表现要与基准指数比较。','股票涨5%，指数涨10%，相对表现？','偏弱|偏强|一样',0],
['成交量','成交量是什么','成交量是某时段成交股票数量。','低于20日平均量通常叫？','缩量|涨停|除权',0],
['成交量','突破与假突破','突破前高后跌回区间可能是假突破。','突破后迅速跌回区间是？','假突破|必涨|停牌',0],
['成交量','量价关系','成交量反映活跃程度，不能单独决定方向。','放量一定上涨吗？','一定|不一定|一定下跌',1],
['VCP形态','VCP基础','VCP关注调整幅度逐步收窄、量能收缩。','VCP核心特征？','波动收缩|天天涨停|低价股',0],
['VCP形态','Pivot突破点','Pivot是整理形态附近的关键参考位置。','Pivot更像什么？','突破参考位|注册地址|保证盈利点',0],
['VCP形态','VCP失败案例','形态可能突破失败；不能只研究成功股票。','VCP一定上涨吗？','一定|不一定',1],
['J Law理念','先看市场环境','借鉴公开趋势交易理念，先看大盘再看个股。','先研究什么？','市场趋势|代码吉利|聊天热度',0],
['J Law理念','多重优势','趋势、相对强度、量能、位置和风险需共同核对。','只有一个信号时？','忽略风险|继续核对证据|借钱买入',1],
['J Law理念','突破后回踩','回踩不保证成功，重点观察支撑与风险。','回踩时最重要？','观察支撑与风险|保证反弹|永不止损',0],
['A股规则与风险','T+1规则','普通A股当天买入通常不能当天卖出。','当天买的普通A股何时最早卖？','当天|下个交易日|一年后',1],
['A股规则与风险','涨跌停与流动性','涨跌停、停牌可能导致无法按止损价成交。','跌停时止损一定成交？','一定|不一定',1],
['A股规则与风险','仓位与风险','单笔风险预算不等于保证最大亏损，考虑费用与滑点。','10万元账户风险1%是多少？','100元|1000元|10000元',1],
['A股规则与风险','避免未来数据','历史回放只能使用当时已知行情。','训练时可提前看未来价格吗？','可以|不可以',1]
];
const lessons=[...raw.map((r,i)=>({id:'l'+i,stage:r[0],title:r[1],body:r[2],q:r[3],options:r[4].split('|'),a:r[5]})),...extendedLessons.slice(0,76).map((x,i)=>({id:'l'+(i+24),stage:x.stage,title:x.title,body:x.concept,q:x.question,options:[x.answer,'只凭单一信号就能保证未来走势'],a:0,extra:x}))];

// Detailed beginner explanations are authored teaching material, not live AI advice.
const explanations=[
'红色阳线表示收盘价高于开盘价。注意：当天收涨不等于比昨天收盘价上涨。',
'实体两端由开盘价与收盘价决定；影线则延伸至最高价与最低价。',
'最高价减最低价是当天的价格振幅（金额差），12－8＝4元。',
'长上影线说明盘中曾到达更高价格后回落，但单根K线不能预测次日。',
'十字星代表开收盘接近，可能是犹豫；要结合位置、趋势与成交量。',
'观察连续多个高点、低点的变化，比只看一天红绿更可靠。',
'高点和低点逐步抬高通常属于上升趋势；仍可能出现回调。',
'支撑是历史价格反应区域，跌破意味着原判断可能需要修正。',
'MA20取最近20个交易日的收盘价相加，再除以20；它会随新数据变化。',
'均线反映过去走势，站上均线不能保证未来继续上涨。',
'同期股票涨幅低于指数，意味着相对表现偏弱，不等于股价一定下跌。',
'缩量是成交量相对比较小，比较基准可以是过去20个交易日平均量。',
'突破后回到原整理区间，可能属于假突破，不能只凭突破瞬间判断。',
'放量只说明交易活跃程度提高，买卖双方都可能非常积极。',
'VCP通常关注波动逐步收窄及量能趋于收缩，不是保证上涨的图形。',
'Pivot是观察突破是否发生的参考价格，不是自动买入指令。',
'失败形态也必须学习，避免只看成功案例产生幸存者偏差。',
'大盘环境可能影响个股走势；先看市场，再看个股的证据。',
'多个相互独立的证据共同支持判断，比单一信号更稳健，但仍有风险。',
'回踩可能守住支撑，也可能继续下跌；必须事先考虑判断失效的条件。',
'普通A股买入后通常要到下一交易日才能卖出，节假日不算交易日。',
'跌停或停牌时可能无法及时成交，止损单不保证按目标价执行。',
'10万元的1%是1000元；这只是计划风险预算，实际亏损可能超过它。',
'回放时必须隐藏未来K线，否则会产生前视偏差，训练结果不可信。'
];

const fresh=()=>({completed:{},mistakes:[],notes:'',decisions:[],summaries:[],activeSession:null,watchlist:[],watchEntries:[],lastLesson:'l0',updatedAt:null});
let state=fresh(),current=0,selected=-1,market=null,barIndex=0,cloud=null;
try{const s=JSON.parse(localStorage.getItem('ashare_learning_v4'));if(s&&typeof s==='object')state={...fresh(),...s}}catch{}
let largeText=localStorage.getItem('ashare_large_text')==='1';
function setLargeText(on){largeText=on;document.documentElement.classList.toggle('large-text',on);$('#fontToggle').textContent=on?'恢复标准字体 A−':'字体放大 A+';$('#fontToggle').setAttribute('aria-pressed',String(on));try{localStorage.setItem('ashare_large_text',on?'1':'0')}catch{}}
$('#fontToggle').onclick=()=>setLargeText(!largeText);
setLargeText(largeText);
function ensureSession(){if(!state.activeSession||!Array.isArray(state.activeSession.events))state.activeSession={startedAt:new Date().toISOString(),events:[]}}
function logSession(event){ensureSession();state.activeSession.events.push({...event,at:new Date().toISOString()});save()}
function renderSummaries(){
 const el=$('#sessionSummaryList');if(!el)return;
 const list=Array.isArray(state.summaries)?state.summaries:[];
 el.innerHTML=list.length?list.slice().reverse().map((s,i)=>'<details class="summary-card"><summary>'+esc(new Date(s.endedAt).toLocaleString('zh-CN'))+' · '+s.attempts+'次答题 · '+(s.accuracy===null?'无正确率':s.accuracy+'%')+'</summary><div class="summary-body"><pre>'+esc(summaryText(s))+'</pre></div></details>').join(''):'尚无学习总结。完成答题后，点击首页「结束本次学习并生成总结」。';
}
$('#finishSession').onclick=()=>{
 ensureSession();
 const session=state.activeSession;
 if(!session.events.length&&!confirm('本次还没有答题记录，仍然生成空白学习总结吗？'))return;
 const summary=buildSummary(session.events,lessons,session.startedAt,new Date().toISOString());
 state.summaries=Array.isArray(state.summaries)?state.summaries:[];
 state.summaries.push(summary);
 state.activeSession=null;save();show('notes');
};
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function save(){state.updatedAt=new Date().toISOString();try{localStorage.setItem('ashare_learning_v4',JSON.stringify(state));$('#saveState').textContent='已保存本机；云端状态请查看账号页'}catch{$('#saveState').textContent='本机保存失败，请导出备份'}progress()}
function progress(){const n=Object.keys(state.completed).filter(x=>state.completed[x]).length;$('#progressText').textContent='已完成 '+n+' / '+lessons.length+' 课';$('#progressBar').style.width=(n/lessons.length*100)+'%';const st=$('#stageOverview');if(st)st.innerHTML=stageOverview(lessons,state.completed)}
const renderJLawMethod=()=>setupChartMethod({getState:()=>state,save:()=>save()});
const renderJLawGuide=setupJLawGuide({getState:()=>state,save:()=>save()});
const renderHalfYearPlan=setupHalfYearPlan({getState:()=>state,save:()=>save(),lessons});
const renderMacroGuide=setupMacroGuide({getState:()=>state,save:()=>save()});
function renderDailySchedule(){
 const target=$('#dailySchedule');if(!target)return;
 target.innerHTML=dailySchedule.map((x,i)=>'<div class="schedule-item"><span class="schedule-time">'+esc(x.minutes)+'分钟</span><div><strong>'+esc(x.title)+'</strong><p>'+esc(x.detail)+'</p></div></div>').join('');
}
renderDailySchedule();
$('#nav').innerHTML=[['home','🏠 首页'],['plan','🗓️ 半年每日计划'],['jlaw','📉 J Law看图训练'],['lesson','📖 零基础课程'],['macro','📚 图表阅读课'],['daily','📅 每日大盘报告'],['market','📊 真实历史行情'],['watchlist','📈 我的股票'],['notes','📝 笔记与错题'],['account','☁️ 云端账号'],['ai','🤖 AI老师']].map(([id,t])=>'<button class="nav" data-page="'+id+'">'+t+'</button>').join('');
function show(id){for(const p of pages)$('#'+p).hidden=p!==id;document.querySelectorAll('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===id));if(id==='plan')renderHalfYearPlan();if(id==='jlaw'){renderJLawGuide();renderJLawMethod();}if(id==='lesson')renderLesson();if(id==='daily')renderDailyMarket();if(id==='macro')renderMacroGuide();if(id==='notes')renderNotes();if(id==='watchlist')renderWatchlist();if(id==='account')renderAccount()}
$('#nav').onclick=e=>{const b=e.target.closest('[data-page]');if(b)show(b.dataset.page)};
$('#resume').onclick=()=>{current=Math.max(0,lessons.findIndex(l=>l.id===state.lastLesson));show('lesson')};
function renderLesson(){const l=lessons[current];selected=-1;$('#lessonBody').innerHTML='<span class="pill">'+esc(l.stage)+' · 第'+(current+1)+'课 / '+lessons.length+'课</span><h2>'+esc(l.title)+'</h2>'+(current===0?candleDiagram():'')+'<div class="panel">'+esc(l.body)+'</div><h3>想一想</h3><p>'+esc(l.q)+'</p><div class="choices">'+l.options.map((o,i)=>'<button class="choice" data-choice="'+i+'">'+esc(o)+'</button>').join('')+'</div><div class="actions"><button id="check" disabled>提交答案</button><button id="previousLesson" class="secondary">上一课</button><button id="nextLesson" class="secondary">下一课</button></div><div id="feedback" aria-live="polite"></div><div id="lessonExplanation" class="panel" hidden><strong>老师讲解</strong><p>'+esc(l.extra?'理解要点：'+l.extra.concept+'。这是一条分析线索，不能独立推断下一交易日涨跌。':explanations[current])+'</p><h3>举个例子</h3><p>'+esc(l.extra?l.extra.example:deepLessons[current].example)+'</p><h3>容易误解的地方</h3><p>'+esc(l.extra?'常见误区：把单一技术或经济信号当成确定预测。应结合数据来源、市场环境与反例检查。':deepLessons[current].pitfall)+'</p><h3>动手练习</h3><p>'+esc(l.extra?'在每日市场报告或妈妈关注的一只股票中，寻找与「'+l.extra.title+'」有关的真实证据。记录日期、数据来源、支持证据和一条反证；没有数据就写「暂无法判断」。':deepLessons[current].practice)+'</p><p class="small">以上数字均为教学示意，不代表真实A股历史价格。</p></div>';
$('#lessonBody').querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{selected=Number(b.dataset.choice);$('#check').disabled=false;$('#lessonBody').querySelectorAll('[data-choice]').forEach(x=>x.classList.toggle('selected',x===b))});
$('#check').onclick=()=>{const ok=selected===l.a;$('#lessonExplanation').hidden=false;$('#feedback').className=ok?'success':'error';$('#feedback').textContent=(ok?'回答正确！':'再试一次。')+' 正确答案：'+l.options[l.a];if(ok){state.completed[l.id]=true;state.lastLesson=lessons[Math.min(current+1,lessons.length-1)].id}else state.mistakes.push({question:l.q,answer:l.options[selected],correct:l.options[l.a],at:new Date().toISOString()});logSession({type:'answer',lessonId:l.id,correct:ok})};
$('#previousLesson').disabled=current===0;$('#nextLesson').disabled=current===lessons.length-1;$('#previousLesson').onclick=()=>move(-1);$('#nextLesson').onclick=()=>move(1)}
function move(d){current=Math.max(0,Math.min(lessons.length-1,current+d));state.lastLesson=lessons[current].id;save();renderLesson()}
function renderWatchlist(){
 const list=Array.isArray(state.watchlist)?state.watchlist:[];
 $('#watchList').innerHTML=list.length?list.map(x=>'<div class="panel watch-item"><strong>'+esc(x.symbol)+' '+esc(x.name||'')+'</strong><span class="pill">'+esc(x.type)+'</span><button class="secondary" data-remove-watch="'+esc(x.symbol)+'">移除</button></div>').join(''):'还没有添加股票。';
 $('#watchPick').innerHTML='<option value="">选择股票</option>'+list.map(x=>'<option value="'+esc(x.symbol)+'">'+esc(x.symbol+' '+(x.name||''))+'</option>').join('');
 const entries=Array.isArray(state.watchEntries)?state.watchEntries:[];
 $('#watchHistory').innerHTML=entries.length?entries.slice().reverse().map(x=>'<details class="summary-card"><summary>'+esc(x.date)+' · '+esc(x.symbol)+'</summary><p><strong>观察事实：</strong>'+esc(x.observation)+'</p><p><strong>判断与疑问：</strong>'+esc(x.thought)+'</p></details>').join(''):'暂无观察记录。';
 $('#watchList').querySelectorAll('[data-remove-watch]').forEach(b=>b.onclick=()=>{
  if(!confirm('从学习列表移除 '+b.dataset.removeWatch+'？历史观察记录仍保留。'))return;
  state.watchlist=state.watchlist.filter(x=>x.symbol!==b.dataset.removeWatch);save();renderWatchlist();
 });
}
$('#addWatch').onclick=()=>{
 const symbol=$('#watchSymbol').value.trim(),name=$('#watchName').value.trim(),type=$('#watchType').value;
 if(!/^[036][0-9]{5}$/.test(symbol))return $('#watchMsg').textContent='请输入以0、3或6开头的6位A股代码；该格式检查不代表上市状态已验证。';
 state.watchlist=Array.isArray(state.watchlist)?state.watchlist:[];
 if(state.watchlist.some(x=>x.symbol===symbol))return $('#watchMsg').textContent='已在学习列表中';
 state.watchlist.push({symbol,name,type});save();renderWatchlist();
 $('#watchMsg').textContent='已加入本机学习列表（非实时行情）';$('#watchSymbol').value='';$('#watchName').value='';
};
$('#watchDate').value=new Date().toLocaleDateString('en-CA');
$('#saveWatchEntry').onclick=()=>{
 const symbol=$('#watchPick').value,date=$('#watchDate').value,observation=$('#watchObservation').value.trim(),thought=$('#watchThought').value.trim();
 if(!symbol||!/^\\d{4}-\\d{2}-\\d{2}$/.test(date)||(!observation&&!thought))return $('#watchEntryMsg').textContent='请选择股票、日期，并填写至少一项观察或判断。';
 state.watchEntries=Array.isArray(state.watchEntries)?state.watchEntries:[];
 state.watchEntries.push({symbol,date,observation:observation.slice(0,3000),thought:thought.slice(0,3000),savedAt:new Date().toISOString()});
 save();renderWatchlist();$('#watchEntryMsg').textContent='今日观察已保存，可在历史档案反复查看';
 $('#watchObservation').value='';$('#watchThought').value='';
};
function renderNotes(){renderSummaries();$('#noteText').value=state.notes;$('#mistakes').innerHTML=state.mistakes.length?state.mistakes.slice(-20).reverse().map(x=>'<div class="panel"><b>'+esc(x.question)+'</b><p>我的答案：'+esc(x.answer)+'<br>正确答案：'+esc(x.correct)+'</p></div>').join(''):'暂无错题';$('#decisions').innerHTML=state.decisions.length?state.decisions.slice(-20).reverse().map(x=>'<p>'+esc(x.symbol)+' '+esc(x.date)+' '+esc(x.decision)+'</p>').join(''):'暂无历史练习记录'}
$('#saveNote').onclick=()=>{state.notes=$('#noteText').value.slice(0,20000);save();$('#noteStatus').textContent='已保存到本机'};
$('#exportProgress').onclick=()=>{const b=new Blob([JSON.stringify({format:'ashare-learning-backup',state},null,2)],{type:'application/json'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='A股学习进度备份.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)};
$('#importProgress').onchange=async e=>{try{const f=e.target.files[0];if(!f)return;if(f.size>2e6)throw Error('文件过大');const d=JSON.parse(await f.text());if(d.format!=='ashare-learning-backup'||!d.state)throw Error('格式错误');if(!confirm('覆盖当前本机进度？'))return;state={...fresh(),...d.state};save();$('#backupStatus').textContent='导入成功'}catch(err){$('#backupStatus').textContent=err.message}};
function validate(d){if(!d||d.verified!==true||!d.source?.url||!d.source?.retrievedAt||!d.symbol||!['none','qfq','hfq'].includes(d.adjustment)||!Array.isArray(d.bars)||d.bars.length<20)throw Error('缺少真实行情来源、复权信息或20条日线');let prev='';for(const b of d.bars){if(!/^\d{4}-\d{2}-\d{2}$/.test(b.date)||b.date<=prev||b.date<'2015-01-01'||b.date>new Date().toISOString().slice(0,10))throw Error('日期错误');prev=b.date;for(const k of ['open','high','low','close','volume'])if(!Number.isFinite(b[k])||b[k]<0)throw Error('行情数值错误');if(b.low<=0||b.high<Math.max(b.open,b.close)||b.low>Math.min(b.open,b.close))throw Error('OHLC异常')}return d}
function load(d){market=validate(d);barIndex=19;$('#marketStatus').textContent='已加载 '+d.symbol+'，来源：'+d.source.url+'。来源核验标记由导入者声明，本站不能独立证明。';draw()}
function draw(){if(!market)return;const bars=market.bars.slice(Math.max(0,barIndex-59),barIndex+1),hi=Math.max(...bars.map(b=>b.high)),lo=Math.min(...bars.map(b=>b.low)),span=Math.max(hi-lo,.01),w=900,h=360,dx=820/bars.length,py=v=>25+(hi-v)/span*240;let out='<svg viewBox="0 0 900 360" aria-label="历史K线图"><rect width="900" height="360" fill="#f5f9fc"/>';bars.forEach((b,i)=>{const x=60+(i+.5)*dx,c=b.close>=b.open?'#d94c4c':'#25865b',top=Math.min(py(b.open),py(b.close));out+='<line x1="'+x+'" y1="'+py(b.high)+'" x2="'+x+'" y2="'+py(b.low)+'" stroke="'+c+'"/><rect x="'+(x-dx*.3)+'" y="'+top+'" width="'+Math.max(2,dx*.6)+'" height="'+Math.max(1,Math.abs(py(b.open)-py(b.close)))+'" fill="'+c+'"/>'});$('#chart').innerHTML=out+'</svg>';const b=market.bars[barIndex];$('#barInfo').textContent=b.date+' 开'+b.open+' 高'+b.high+' 低'+b.low+' 收'+b.close+' 量'+b.volume;$('#chartCaption').textContent='来源：'+market.source.url+'；复权：'+market.adjustment+'；未来数据隐藏';$('#prevBar').disabled=barIndex<=19;$('#nextBar').disabled=barIndex>=market.bars.length-1;$('#recordDecision').disabled=false}
$('#prevBar').onclick=()=>{barIndex--;draw()};$('#nextBar').onclick=()=>{barIndex++;draw()};
$('#recordDecision').onclick=()=>{if(!market||!$('#decision').value)return;state.decisions.push({symbol:market.symbol,date:market.bars[barIndex].date,decision:$('#decision').value});save();$('#decisionStatus').textContent='判断已记录'};
async function loadAutomaticMarket(){
 const status=$('#marketStatus');
 status.textContent='正在自动加载已发布的历史行情，不需要上传文件…';
 try{
  const response=await fetch('./data/daily-market.json',{cache:'no-store'});
  if(!response.ok)throw Error('后台尚未成功生成行情文件');
  const data=await response.json();
  if(data.verificationLevel!=='structural-only'||!Array.isArray(data.items))throw Error('数据结构未通过检查');
  const items=data.items.filter(x=>Array.isArray(x.bars)&&x.bars.length>=50);
  if(!items.length)throw Error('暂无可使用的历史数据');
  const choice=$('#dataset');
  choice.innerHTML=items.map((x,i)=>'<option value="'+i+'">'+esc(x.name)+' '+esc(x.symbol)+'</option>').join('');
  const open=i=>{
   const x=items[i];
   if(!x)return;
   const bars=x.bars.filter(b=>b.date<='2026-11-16').map(b=>({...b}));
   const dataset={verified:true,symbol:x.symbol,adjustment:x.adjustment==='qfq'?'qfq':'none',source:{url:x.source||'AKShare',retrievedAt:data.generatedAt},bars};
   load(dataset);
   status.textContent='已自动载入 '+x.name+'（截至 '+data.asOf+'）。第三方数据仅做结构检查，非实时行情。';
  };
  $('#loadDataset').disabled=false;
  $('#loadDataset').textContent='切换图表';
  $('#loadDataset').onclick=()=>open(Number(choice.value));
  choice.onchange=()=>open(Number(choice.value));
  open(0);
 }catch(err){
  status.textContent='自动行情暂不可用：'+err.message+'。不需要妈妈上传文件；请等待后台数据更新。';
 }
}
$('#marketFile').onchange=async e=>{try{const f=e.target.files[0];if(!f)return;if(f.size>12e6)throw Error('文件超过12MB');load(JSON.parse(await f.text()));$('#importStatus').textContent='文件结构检查通过，请自行核对真实来源'}catch(err){$('#importStatus').textContent='导入失败：'+err.message}};
/* Legacy manually curated manifest remains optional for developers only. */
/* fetch(config.marketManifest).then(r=>r.json()).then(m=>{if(!m.verified||!m.datasets?.length)throw Error();$('#dataset').innerHTML='<option value="">选择数据集</option>'+m.datasets.map((d,i)=>'<option value="'+i+'">'+esc(d.symbol)+' '+esc(d.name)+'</option>').join('');$('#loadDataset').disabled=false;$('#loadDataset').onclick=async()=>{try{const d=m.datasets[Number($('#dataset').value)];if(d)load(await (await fetch(d.path)).json())}catch(e){$('#marketStatus').textContent=e.message}}}).catch(()=>{$('#marketStatus').textContent='尚未导入2015—2026年真实A股行情，历史回放暂不可用。'}); */
loadAutomaticMarket();
function renderAccount(){$('#cloudStatus').textContent=cloud?.user?'已登录 '+cloud.user.email:'Supabase 尚未配置或未登录；本地记录可以导出备份';$('#logout').hidden=!cloud?.user}
async function initCloud(){if(!config.supabaseUrl||!config.supabasePublishableKey){renderAccount();return}try{const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');cloud={db:createClient(config.supabaseUrl,config.supabasePublishableKey),user:null};const {data:{user}}=await cloud.db.auth.getUser();cloud.user=user;renderAccount()}catch(e){$('#cloudStatus').textContent='云端连接失败：'+e.message}}
$('#login').onclick=async()=>{if(!cloud)return $('#authMsg').textContent='请先配置Supabase';const {data,error}=await cloud.db.auth.signInWithPassword({email:$('#email').value,password:$('#password').value});$('#authMsg').textContent=error?error.message:'登录成功';if(!error){cloud.user=data.user;renderAccount()}};
$('#signup').onclick=async()=>{if(!cloud)return $('#authMsg').textContent='请先配置Supabase';const {error}=await cloud.db.auth.signUp({email:$('#email').value,password:$('#password').value});$('#authMsg').textContent=error?error.message:'注册已提交，请按邮件提示确认'};
$('#logout').onclick=async()=>{if(cloud){await cloud.db.auth.signOut();cloud.user=null;renderAccount()}};
$('#syncNow').onclick=async()=>{if(!cloud?.user)return $('#backupStatus').textContent='请先登录';const {error}=await cloud.db.from('learning_state').upsert({user_id:cloud.user.id,payload:state,updated_at:new Date().toISOString()});$('#backupStatus').textContent=error?'同步失败：'+error.message:'已同步到云端'};
// Explicit cloud recovery is opt-in: never overwrite unsaved local work silently.
$('#restoreCloud').onclick=async()=>{
 if(!cloud?.user)return $('#backupStatus').textContent='请先登录云端账号';
 const {data,error}=await cloud.db.from('learning_state').select('payload,updated_at').eq('user_id',cloud.user.id).maybeSingle();
 if(error)return $('#backupStatus').textContent='读取失败：'+error.message;
 if(!data?.payload)return $('#backupStatus').textContent='云端暂无学习记录';
 if(!confirm('将云端记录覆盖当前本机记录？请先导出本机备份。'))return;
 const p=data.payload;if(!p||typeof p!=='object'||!p.completed||!Array.isArray(p.mistakes)||!Array.isArray(p.decisions))return $('#backupStatus').textContent='云端数据格式异常';
 state={...fresh(),...p};save();renderAccount();$('#backupStatus').textContent='云端进度已恢复到本机';
};
progress();$('#saveState').textContent=state.updatedAt?'已读取本机学习进度（上次保存：'+new Date(state.updatedAt).toLocaleString('zh-CN')+'）；尚未云端同步':'尚无学习记录；完成答题后将自动保存在本机（尚未云端同步）';show('home');initCloud();