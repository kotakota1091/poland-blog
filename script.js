
async function sha256Hex(str) {
  const enc = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  const bytes = Array.from(new Uint8Array(buf));
  return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
}

function setVisible(id, show) {
  const el = document.getElementById(id);
  if (el) el.style.display = show ? '' : 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  // nav active link
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(a => {
    if (a.getAttribute('href') === path) a.style.textDecoration = 'underline';
  });

  // Protected page logic
  const gate = document.getElementById('password-gate');
  const content = document.getElementById('protected-content');
  if (gate && content) {
    const expectedHash = gate.dataset.hash;
    const key = 'blog_auth_c880dd96'; // key per site
    const ok = localStorage.getItem(key) === expectedHash;
    if (ok) {
      setVisible('password-gate', false);
      setVisible('protected-content', true);
    }
    const input = document.getElementById('pw-input');
    const btn = document.getElementById('pw-button');
    const msg = document.getElementById('pw-msg');
    async function tryUnlock() {
      if (!input.value) return;
      btn.disabled = true;
      msg.textContent = '確認中...';
      try {
        const got = await sha256Hex(input.value);
        if (got === expectedHash) {
          localStorage.setItem(key, expectedHash);
          setVisible('password-gate', false);
          setVisible('protected-content', true);
          msg.textContent = '';
        } else {
          msg.textContent = 'パスワードが違います。';
        }
      } finally {
        btn.disabled = false;
        input.value = '';
      }
    }
    btn?.addEventListener('click', tryUnlock);
    input?.addEventListener('keydown', (e) => { if (e.key === 'Enter') tryUnlock(); });
  }
});
