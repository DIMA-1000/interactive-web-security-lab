function show(safe, outcome, explanation) { const result = document.getElementById('result'); result.className = 'result ' + (safe ? 'good' : 'bad'); result.textContent = (safe ? '🟢 PROTECTED' : '🔴 VULNERABLE') + '\n\n' + outcome + '\n\n' + explanation; }
function run(safe) {
const origin = document.getElementById('origin').value.trim();
const token = document.getElementById('token').value;
const allowed = !safe || (origin === 'https://bank.example' && token === 'demo-token-123');
show(safe, allowed ? 'ACTION ACCEPTED: notification email changed in the fictional account.' : 'REQUEST BLOCKED: origin or CSRF token is invalid.', safe ? 'The protected handler requires the trusted origin and the session token. Real validation belongs on the server; SameSite cookies provide additional protection.' : 'The vulnerable handler trusts the simulated session cookie without checking request origin or a CSRF token. A forged request can change account settings.');
}
document.getElementById('action-0').addEventListener('click', () => run(false));
document.getElementById('action-1').addEventListener('click', () => run(true));
