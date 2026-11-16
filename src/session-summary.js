// Deterministic study-session reports, based only on recorded activity.
export function buildSummary(events,lessons,startedAt,endedAt){
 const answers=events.filter(x=>x.type==='answer');
 const correct=answers.filter(x=>x.correct);
 const wrong=answers.filter(x=>!x.correct);
 const ids=[...new Set(answers.map(x=>x.lessonId))];
 const topics=ids.map(id=>lessons.find(l=>l.id===id)).filter(Boolean);
 const byStage=[...new Set(topics.map(l=>l.stage))];
 const missed=[...new Set(wrong.map(x=>x.lessonId))].map(id=>lessons.find(l=>l.id===id)).filter(Boolean);
 const accuracy=answers.length?Math.round(correct.length/answers.length*100):null;
 const duration=Math.max(0,Math.round((Date.parse(endedAt)-Date.parse(startedAt))/60000));
 const advice=!answers.length?'本次没有答题记录，建议下次先复习一节课程并完成练习。':
 accuracy<60?'本次错题较多，建议下次先复习错误知识点，再进行同类练习。':
 accuracy<85?'已有一定掌握，建议重做错题，并尝试用自己的话解释答案。':
 '本次答题表现较好，建议增加跨章节应用练习，确认能够独立解释概念。';
 return {id:endedAt,startedAt,endedAt,duration,attempts:answers.length,correct:correct.length,wrong:wrong.length,accuracy,lessonIds:ids,stages:byStage,weakTopics:missed.map(l=>l.title),advice,notes:'',type:'local-rule-based'};
}
export function summaryText(s){
 return ['学习时间：'+new Date(s.startedAt).toLocaleString('zh-CN'),
 '学习时长（估计）：'+s.duration+'分钟',
 '答题：'+s.attempts+'次；正确：'+s.correct+'次；错误：'+s.wrong+'次',
 '本次正确率：'+(s.accuracy===null?'暂无答题':'约'+s.accuracy+'%'),
 '涉及章节：'+(s.stages.join('、')||'暂无'),
 '建议复习：'+(s.weakTopics.join('、')||'暂无本次错题知识点'),
 '下次建议：'+s.advice,
 '个人感想：'+(s.notes||'未填写')].join('\n');
}
