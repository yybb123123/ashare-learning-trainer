import test from 'node:test';
import assert from 'node:assert/strict';
import {buildSummary,summaryText} from '../src/session-summary.js';
const lessons=[{id:'l0',title:'红绿K线',stage:'K线基础'},{id:'l1',title:'均线',stage:'趋势与均线'}];
test('summary uses actual recorded attempts and keeps weak topics',()=>{
 const events=[{type:'answer',lessonId:'l0',correct:false},{type:'answer',lessonId:'l0',correct:true},{type:'answer',lessonId:'l1',correct:true}];
 const s=buildSummary(events,lessons,'2026-11-16T10:00:00Z','2026-11-16T10:30:00Z');
 assert.equal(s.attempts,3);assert.equal(s.correct,2);assert.equal(s.accuracy,67);
 assert.deepEqual(s.weakTopics,['红绿K线']);assert.equal(s.duration,30);
 assert.match(summaryText(s),/红绿K线/);
});
test('empty session does not invent accuracy',()=>{
 const s=buildSummary([],lessons,'2026-11-16T10:00:00Z','2026-11-16T10:01:00Z');
 assert.equal(s.accuracy,null);assert.equal(s.attempts,0);
});
