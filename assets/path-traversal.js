function show(safe, outcome, explanation) { const result = document.getElementById('result'); result.className = 'result ' + (safe ? 'good' : 'bad'); result.textContent = (safe ? '🟢 PROTECTED' : '🔴 VULNERABLE') + '\n\n' + outcome + '\n\n' + explanation; }
function run(safe) {
const raw = document.getElementById('path').value.trim();
let decoded;
try { decoded = decodeURIComponent(raw); } catch { show(safe, 'INVALID INPUT: malformed URL encoding.', 'No file was opened.'); return; }
if (!decoded || decoded.length > 500 || /[\\\u0000]/.test(decoded) || decoded.startsWith('/')) { show(safe, 'INVALID INPUT: unsupported path.', 'Use a relative path with forward slashes.'); return; }
const parts = ['public'];
for (const part of decoded.split('/')) { if (part === '..') parts.pop(); else if (part && part !== '.') parts.push(part); }
const canonical = parts.join('/');
const files = {'public/guide.txt':'Public guide: welcome to the lab.', 'public/notes.txt':'Public notes: safe demo content.', 'private/secrets.txt':'FICTIONAL SECRET: demo-key-0000 (not a real credential)'};
if (safe && !canonical.startsWith('public/')) { show(true, 'ACCESS BLOCKED: path escapes the public directory.', 'The protected handler checks the normalized directory boundary before reading a file. Real servers must also account for symlinks and filesystem rules.'); return; }
show(safe, Object.hasOwn(files, canonical) ? 'FILE: '+canonical+'\n'+files[canonical] : 'FILE NOT FOUND: '+canonical, safe ? 'Normalized path stays inside public/. Only fictional in-memory files are read.' : 'The vulnerable handler joins the base directory with untrusted input without checking the final boundary. ../ can reach a private file.');
}
document.getElementById('action-0').addEventListener('click', () => run(false));
document.getElementById('action-1').addEventListener('click', () => run(true));
