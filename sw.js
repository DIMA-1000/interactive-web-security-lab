const FILES = {
  "access-control.html": "fc4fad903134e69dc2a77e3c41d2e4968ac0897756bd675c71d182ac4ad18963",
  "api-validation.html": "97b1357c7a8a5c53410c33901df4ad4860e62a94cf4e3d48191fbbcf0c40183e",
  "assets/access-control-0.css": "16db1caf1439bc8816aa59ac8d98838fbfc2c9d8ca954186ab1b25d1b4ca50b5",
  "assets/access-control-0.js": "ae2047f069beeebf432bb43277d5ebab09d33ab6ae3e2759233b766aa4afc975",
  "assets/antistress-trade-icon.webp": "518ee1c5b6bfd4ec13d5a4d241f0546819e11eabab60fc5ffd31901bb0827a8a",
  "assets/api-validation-0.css": "f0fb07c67334f8df51cc63dfaf4ab739454388c908a8852ce799d67507914fb8",
  "assets/api-validation-0.js": "78e04e047c704db7659d870d35d5dd12c2eefff2720900a814cc20b138a64b8b",
  "assets/audit-background.webp": "070f9796677324c47f5484295c00a53f45c68b6787d461fa6579c5361e074feb",
  "assets/index-0.css": "4d039c016625e832d17409d08b104b65386b84d5f4f65932c066322864898b63",
  "assets/index-0.js": "d25f2edc074a2994555f4995ebab2a73800dbb3a6e2ac0b2c54acf5ea70938e0",
  "assets/language.js": "305cd9e64afde0d41f009aba76f413c64cb8701230e30e4e32fdbb79e624ccbe",
  "assets/offline.css": "a9fd6980cad714b72eaf56fbf3d42f586058e0984fcefd7f07adcf21296f4289",
  "assets/offline.js": "c4e292cb746a7870702f366de89afb679f920e110a39016e58c0d385e9aebb08",
  "assets/security-audit.css": "9e9c027a1be78621123ced87689e150502aa35775f4f24c9100a291e96881af5",
  "assets/sql-injection-0.css": "974226db59af4c12f642f9e1af0aa284b04344530d3cd35be1e53a6efb859eeb",
  "assets/sql-injection-0.js": "b28c5e11f407148a5fa682fd4d10370560ab99d3b5e472881782aa9284aee191",
  "assets/xss-0.css": "6bfa38f23290d1455c1fa34af2675e913668be98465cfbe4e29ee531a3c528b6",
  "assets/xss-0.js": "8969967318435bd3da88f9a738cd21c94897736c1558748c3e96b12eecc90e0d",
  "banner.png": "c9dc109cdedb7aa7438199bb3295b41579cb346630a9ecebb892cc38daef513e",
  "favicon.png": "b8ce71bb1141a5595f0b56c4a23ab01c7b99e4261c9871dee035796fcd57a5d9",
  "index.html": "52eba9ce725a83aee4e006e6cbb600731dd736ddb9c5de80a0c1bf2227c33e04",
  "security-audit.html": "bb03931d5334c4eba4f3bb15e5d1d32289af2c2f6a85eeab3d6b859de9f187af",
  "sql-injection.html": "552f6912b34993edc6ea49780935ca769b525c614d88f012ae3927c464e77862",
  "xss.html": "8ddee9206fcaea9ba3399b1527702570405e8c109125258526dcd383a2070dfa"
};
const BASE = new URL('./', self.location.href);
const PREFIX = 'iwsl-offline-' + BASE.pathname + '-';
const CACHE = PREFIX + '0f950f8e186dfdb5';
self.addEventListener('install', event => event.waitUntil((async () => {
 const cache = await caches.open(CACHE);
 try {
  for (const [path, hash] of Object.entries(FILES)) {
   const response = await fetch(new URL(path, BASE), {cache:'no-store',credentials:'omit',redirect:'error'});
   if (!response.ok) throw new Error('Offline asset unavailable: '+path);
   const digest = await crypto.subtle.digest('SHA-256',await response.clone().arrayBuffer());
   const actual=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
   if (actual!==hash) throw new Error('Offline asset version mismatch: '+path);
   await cache.put(new URL(path,BASE).href,response);
  }
 } catch(error) {await caches.delete(CACHE);throw error;}
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);
 await self.clients.claim();
})()));
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')event.waitUntil(self.skipWaiting());});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==BASE.origin||!url.pathname.startsWith(BASE.pathname))return;
 let path=url.pathname.slice(BASE.pathname.length);if(path==='')path='index.html';
 if(!Object.hasOwn(FILES,path))return;
 event.respondWith((async()=>{
  const saved=await (await caches.open(CACHE)).match(new URL(path,BASE).href);
  if(saved)return saved;
  return fetch(event.request);
 })());
});
