(() => {
 if (!('serviceWorker' in navigator) || !window.isSecureContext) return;
 const box=document.createElement('aside'); box.className='offline-status';box.setAttribute('aria-label','Offline availability');
 const label=document.createElement('span');label.setAttribute('role','status');label.textContent='Preparing offline copy…';box.append(label);
 const button=document.createElement('button');button.type='button';button.textContent='Update';button.hidden=true;box.append(button);document.body.append(box);
 let registration, updating=false;
 const ready=()=>{label.textContent=navigator.onLine?'Ready for offline use':'Offline · saved version';};
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(updating) location.reload();else ready();});
 button.addEventListener('click',()=>{if(registration?.waiting){updating=true;button.disabled=true;registration.waiting.postMessage({type:'ACTIVATE_UPDATE'});}});
 const offer=()=>{if(registration.waiting){label.textContent='New version downloaded';button.hidden=false;}};
 const check=()=>{if(registration && navigator.onLine)registration.update().catch(()=>{});};
 window.addEventListener('online',()=>{if(navigator.serviceWorker.controller)ready();check();});
 window.addEventListener('offline',()=>{if(navigator.serviceWorker.controller)ready();});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)check();});
 navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'}).then(reg=>{
  registration=reg;if(navigator.serviceWorker.controller)ready();offer();
  reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{
   if(worker.state==='installed'){if(navigator.serviceWorker.controller)offer();}
   if(worker.state==='redundant'&&!navigator.serviceWorker.controller)label.textContent='Offline copy unavailable · retry online';
  });});
  navigator.serviceWorker.ready.then(()=>{ready();offer();});check();
 }).catch(()=>{label.textContent='Offline copy unavailable';});
})();
