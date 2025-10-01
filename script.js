
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
// --- ここまでが元からある script.js のコード ---
// === Convert "YYYY/MM/DD(…の日記)" -> "SEPT 28, 2025" ===
document.addEventListener("DOMContentLoaded", () => {
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEPT","OCT","NOV","DEC"];
  // 例: 2025/9/7, 2025-09-07, 2025/09/07の日記 すべてマッチ
  const re = /(\d{4})[/-](\d{1,2})[/-](\d{1,2})(?:\s*の日記)?/;

  const convert = (node) => {
    const t = (node.textContent || "").trim();
    const m = t.match(re);
    if (!m) return;
    const y = m[1], mo = parseInt(m[2],10), d = parseInt(m[3],10);
    node.textContent = `${months[mo-1]} ${d}, ${y}`;
  };

  // 本文の見出し（各日記ページ）
  document.querySelectorAll("main h2").forEach(convert);
  // 一覧リンク（protected.html の月別リスト）
  document.querySelectorAll(".diary-list a").forEach(convert);
});
// === "公開日: 2025-09-23" → "PUBLISHED: SEPT 23, 2025" に統一 ===
document.addEventListener("DOMContentLoaded", () => {
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEPT","OCT","NOV","DEC"];

  // 例: 公開日: 2025-09-23 / 公開日：2025/9/23 などを許容
  const reJP = /(公開日)\s*[:：]\s*(\d{4})[/-](\d{1,2})[/-](\d{1,2})/;

  // テキストノードだけを持つ要素をざっと走査（小規模サイトなのでOK）
  document.querySelectorAll("body *:not(script):not(style)").forEach(node => {
    if (!node.firstChild || node.childNodes.length !== 1 || node.firstChild.nodeType !== 3) return;

    const text = node.textContent.trim();
    const m = text.match(reJP);
    if (!m) return;

    const [, /*label*/, y, mo, d] = m;
    const mm = months[parseInt(mo, 10) - 1];
    node.textContent = `PUBLISHED: ${mm} ${parseInt(d, 10)}, ${y}`;
    node.classList.add("meta-date");
  });
});



