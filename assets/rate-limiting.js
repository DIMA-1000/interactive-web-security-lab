function show(safe, outcome, explanation) { const result = document.getElementById('result'); result.className = 'result ' + (safe ? 'good' : 'bad'); result.textContent = (safe ? '🟢 PROTECTED' : '🔴 VULNERABLE') + '\n\n' + outcome + '\n\n' + explanation; }
function run(safe) {
const raw = document.getElementById('count').value;
const count = Number(raw);
if (!raw.trim() || !Number.isInteger(count) || count < 1 || count > 1000) { show(safe, 'INVALID INPUT: enter an integer from 1 to 1000.', 'No simulated requests were processed.'); return; }
const accepted = safe ? Math.min(count, 5) : count;
const rejected = count - accepted;
show(safe, 'SIMULATED REQUESTS: '+count+'\nAccepted (200): '+accepted+'\nBlocked (429): '+rejected+(rejected ? '\nRetry-After: 60 seconds' : ''), safe ? 'A per-user quota rejects requests beyond five in this simulated window. Real limits must be enforced server-side, with shared counters when needed.' : 'Every request is accepted without throttling. This permits repeated attempts and resource abuse. This is a logic simulation, not a load test or proof of server capacity.');
}
document.getElementById('action-0').addEventListener('click', () => run(false));
document.getElementById('action-1').addEventListener('click', () => run(true));
