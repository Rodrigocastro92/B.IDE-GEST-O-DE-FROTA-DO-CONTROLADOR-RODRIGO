'use strict';
// Servidor próprio (opcional). Para usar no Vercel, veja o LEIA-ME.
const http=require('http'),https=require('https'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const {create,mkhash,ROLES}=require('./lib/app');
const DATA=process.env.DATA_DIR||path.join(__dirname,'data'),PORT=+process.env.PORT||3000;
if(!fs.existsSync(DATA))fs.mkdirSync(DATA,{recursive:true});
const store=require('./lib/store-file')(DATA);
const a=process.argv.slice(2);
(async()=>{
if(a[0]==='user'){const [cmd,nome,senha,papel]=a.slice(1);
  if(cmd==='add'||cmd==='passwd'){if(!nome||!senha||senha.length<6||(cmd==='add'&&!ROLES.includes(papel))){console.log('Uso: node server.js user add NOME SENHA controlador|cliente   (senha com 6+ caracteres)');process.exit(1)}
    const old=await store.getUser(nome.toLowerCase());await store.setUser(nome.toLowerCase(),Object.assign({},mkhash(senha),{role:cmd==='add'?papel:(old&&old.role)||'cliente',name:nome}));console.log((cmd==='add'?'Usuário criado: ':'Senha alterada: ')+nome)}
  else if(cmd==='del'){await store.delUser((nome||'').toLowerCase());console.log('Removido: '+nome)}
  else if(cmd==='list'){const l=await store.listUsers();l.forEach(u=>console.log(u.user+'  ('+u.role+')'));if(!l.length)console.log('Nenhum usuário.')}
  else console.log('Comandos: add | passwd | del | list');
  process.exit(0)}
if(a[0]==='setup'){const dest=path.join(__dirname,'public','vendor','xlsx.full.min.js');
  if(fs.existsSync(dest)&&fs.statSync(dest).size>100000){console.log('Biblioteca de Excel já instalada.');process.exit(0)}
  const urls=['https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js','https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js','https://unpkg.com/xlsx@0.18.5/dist/xlsx.full.min.js'];
  const get=i=>{if(i>=urls.length){console.log('Não consegui baixar a biblioteca de Excel. Baixe xlsx.full.min.js (0.18.5) e coloque em public/vendor/.');process.exit(0)}
    https.get(urls[i],{timeout:15000},r=>{if(r.statusCode!==200){r.resume();return get(i+1)}const c=[];r.on('data',d=>c.push(d));r.on('end',()=>{const b=Buffer.concat(c);if(b.length<100000)return get(i+1);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,b);console.log('Biblioteca de Excel instalada.');process.exit(0)})}).on('error',()=>get(i+1)).on('timeout',function(){this.destroy()})};
  get(0);return}
const kf=path.join(DATA,'secret.key');if(!fs.existsSync(kf))fs.writeFileSync(kf,crypto.randomBytes(32).toString('hex'),{mode:0o600});
const app=create(store,fs.readFileSync(kf,'utf8').trim());
http.createServer((req,res)=>app.handle(req,res,new URL(req.url,'http://x').pathname)).listen(PORT,()=>{console.log('Painel rodando em http://localhost:'+PORT);if(!store.hasUsers())console.log('Nenhum usuário ainda. Crie um: node server.js user add NOME SENHA controlador')});
})();
