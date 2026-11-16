// Educational candlestick diagram: illustrative prices, never historical data.
export function candleDiagram(){
 return `<div class="candle-learning"><svg viewBox="0 0 540 300" role="img" aria-label="示意K线：开盘9元，收盘11元，最高12元，最低8元">
 <rect width="540" height="300" rx="14" fill="#13243c"/>
 <g stroke="#30435e" stroke-dasharray="4 6"><line x1="18" x2="522" y1="58" y2="58"/><line x1="18" x2="522" y1="112" y2="112"/><line x1="18" x2="522" y1="185" y2="185"/><line x1="18" x2="522" y1="250" y2="250"/></g>
 <line x1="220" y1="50" x2="220" y2="255" stroke="#f16969" stroke-width="5"/>
 <rect x="190" y="113" width="60" height="75" fill="#f16969" rx="2"/>
 <g fill="#fff" font-family="system-ui,sans-serif" font-size="20">
 <text x="272" y="57">最高价 12 元</text><text x="272" y="119">收盘价 11 元</text><text x="272" y="191">开盘价 9 元</text><text x="272" y="259">最低价 8 元</text></g>
 <text x="22" y="286" fill="#b3c6dc" font-size="15">教学示意，不是真实股票行情</text></svg>
 <p class="small">在常见的 A 股红涨绿跌配色中：红色实体表示收盘价高于开盘价；实体上下端对应开盘与收盘，上下影线对应最高与最低价。</p></div>`;
}
export function stageOverview(lessons,completed){
 const stages=[...new Set(lessons.map(l=>l.stage))];
 return `<div class="stage-grid">${stages.map((name,i)=>{const all=lessons.filter(l=>l.stage===name),done=all.filter(l=>completed[l.id]).length;return `<div class="stage-card"><strong>第${i+1}阶段 · ${name}</strong><p>${done} / ${all.length} 课完成</p><div class="track"><div style="width:${Math.round(done/all.length*100)}%"></div></div></div>`}).join('')}</div>`;
}
