// Private static-site gateway for a single family account.
// Deploy behind HTTPS (e.g. Zeabur). Never expose the application directly on a public static host.
import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
import {timingSafeEqual} from 'node:crypto';
const root=resolve(process.cwd());
const username=process.env.SITE_USERNAME;
const password=process.env.SITE_PASSWORD;
const port=Number(process.env.PORT||3000);
if(!username||!password||password.length<16){
 console.error('SITE_USERNAME and SITE_PASSWORD (at least 16 characters) are required');
 process.exit(1);
}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon'};
function equal(a,b){const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y)}
function relativePath(file){return file.slice(root.length+1).split(sep).join('/')}
function authorized(header){
 if(!header?.startsWith('Basic '))return false;
 try{
  const decoded=Buffer.from(header.slice(6),'base64').toString('utf8');
  const i=decoded.indexOf(':');if(i<0)return false;
  return equal(decoded.slice(0,i),username)&&equal(decoded.slice(i+1),password);
 }catch{return false}
}
const server=http.createServer(async(req,res)=>{
 res.setHeader('Cache-Control','no-store');
 res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('Referrer-Policy','no-referrer');
 res.setHeader('X-Frame-Options','DENY');
 if(!authorized(req.headers.authorization)){
  res.writeHead(401,{'WWW-Authenticate':'Basic realm="Private A-share Learning", charset="UTF-8"','Content-Type':'text/plain; charset=utf-8'});
  res.end('需要专用账号登录');return;
 }
 if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);res.end();return}
 try{
  const url=new URL(req.url,'http://localhost');
  const pathname=decodeURIComponent(url.pathname);
  if(pathname.includes('\\')||pathname.includes('\0'))throw Error('Invalid path');
  const file=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if(!file.startsWith(root+sep))throw Error('Outside root');
  const blocked=['.git','.github','tools','tests','node_modules'];
  if(['server.mjs','package.json','package-lock.json','schema.sql'].includes(relativePath(file)))throw Error('Not public');
  const relative=file.slice(root.length+1).split(sep);
  if(relative.some(p=>p.startsWith('.')||blocked.includes(p))||['.md','.sql','.py','.yml','.yaml','.env'].includes(extname(file)))throw Error('Not public');
  const info=await stat(file);if(!info.isFile())throw Error('Not a file');
  const data=await readFile(file);
  res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Content-Length':data.length});
  res.end(req.method==='HEAD'?undefined:data);
 }catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('未找到页面')}
});
server.listen(port,'0.0.0.0',()=>console.log('Private learning gateway listening on '+port));
