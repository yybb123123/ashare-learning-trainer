import test from 'node:test';import assert from 'node:assert/strict';import {spawn} from 'node:child_process';import {once} from 'node:events';
const port=19537;const password='local-test-password-123456';
const child=spawn(process.execPath,['server.mjs'],{env:{...process.env,PORT:String(port),SITE_USERNAME:'mother',SITE_PASSWORD:password},stdio:'ignore'});
try{
 let ready=false;
 for(let i=0;i<40;i++){try{const r=await fetch('http://127.0.0.1:'+port+'/');if(r.status===401){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,100))}
 if(!ready)throw Error('gateway did not start');
 const base='http://127.0.0.1:'+port;
 const auth='Basic '+Buffer.from('mother:'+password).toString('base64');
 test('rejects anonymous homepage and assets',async()=>{for(const path of ['/','/src/app.js','/data/manifest.json'])assert.equal((await fetch(base+path)).status,401)});
 test('rejects incorrect password',async()=>assert.equal((await fetch(base+'/',{headers:{Authorization:'Basic '+Buffer.from('mother:wrong').toString('base64')}})).status,401));
 test('serves authenticated homepage and assets',async()=>{for(const path of ['/','/src/app.js','/data/manifest.json'])assert.equal((await fetch(base+path,{headers:{Authorization:auth}})).status,200)});
 test('blocks sensitive project files',async()=>{for(const path of ['/schema.sql','/server.mjs','/.github/workflows/check.yml','/tools/import_ashare_csv.py'])assert.equal((await fetch(base+path,{headers:{Authorization:auth}})).status,404)});
}finally{process.on('exit',()=>child.kill());setTimeout(()=>child.kill(),1500).unref()}
