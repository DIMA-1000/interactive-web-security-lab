from pathlib import Path
import hashlib,json,re
root=Path(__file__).resolve().parent.parent
files=sorted(p for p in root.rglob('*') if p.is_file() and p.suffix in ('.html','.css','.js','.png','.svg','.webp','.jpg','.jpeg','.ico','.woff','.woff2','.json') and 'verification' not in p.relative_to(root).parts and p.name!='sw.js')
manifest={p.relative_to(root).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in files}
version=hashlib.sha256(json.dumps(manifest,sort_keys=True).encode()).hexdigest()[:16]
p=root/'sw.js';s=p.read_text();s=re.sub(r'const FILES = .*?;\nconst BASE', 'const FILES = '+json.dumps(manifest,indent=2)+';\nconst BASE',s, count=1,flags=re.S);s=re.sub(r"const CACHE = PREFIX \+ '[^']+';", "const CACHE = PREFIX + '"+version+"';",s);p.write_text(s)
(root/'verification/offline-manifest.json').write_text(json.dumps(manifest,indent=2))
print('Offline version:',version)
