// 작품마다 링크 미리보기(카톡·메신저 카드)용 페이지를 만듭니다.
// /work/<slug>.html, /en/work/<slug>.html  ← work.html 복사본에 작품 제목·설명·썸네일 메타 태그만 바꿔 넣음
// GitHub Actions가 푸시할 때와 15분마다 실행합니다. 직접 실행: node scripts/build-og.mjs
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://buffuniverse.co.kr';
const cfg = fs.readFileSync('config.js', 'utf8');
const URL_ = cfg.match(/url:'([^']+)'/)[1];
const KEY = cfg.match(/key:'([^']+)'/)[1];

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const clip = (s, n) => { s = String(s ?? '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
const ytId = (u) => (String(u || '').match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/) || [])[1] || '';
function thumb(w) {
  let t = w.thumbnail_url;
  if (!t) for (const v of w.videos || []) { const id = ytId(v && (v.url || v)); if (id) { t = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`; break; } }
  if (!t) t = (w.images || [])[0];
  if (!t) return `${SITE}/og-image.jpg`;
  return /^https?:\/\//.test(t) ? t : `${SITE}/${t.replace(/^\//, '')}`;
}

function page(tpl, w, en) {
  const title = (en ? w.title_en : '') || w.title;
  const desc = clip((en ? w.description_en : '') || w.description || (en ? 'BUFF UNIVERSE — Works' : 'BUFF UNIVERSE 작업물'), 150);
  const url = `${SITE}${en ? '/en' : ''}/work/${w.slug}`;
  const img = thumb(w);
  let h = tpl;
  const rep = (re, s) => { h = h.replace(re, s); };
  rep(/<head>/i, `<head>\n<base href="${en ? '/en/' : '/'}">`);
  rep(/<title>[^<]*<\/title>/, `<title>${esc(title)} — BUFF UNIVERSE</title>`);
  rep(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(desc)}">`);
  rep(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`);
  rep(/<meta property="og:type" content="[^"]*">/, `<meta property="og:type" content="article">`);
  rep(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(title)}">`);
  rep(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(desc)}">`);
  rep(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`);
  rep(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${esc(img)}">`);
  rep(/<meta property="og:image:width" content="[^"]*">\s*/, '');
  rep(/<meta property="og:image:height" content="[^"]*">\s*/, '');
  rep(/<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${esc(img)}"><meta name="twitter:title" content="${esc(title)}">`);
  return h;
}

let rows;
if (process.env.WORKS_JSON) rows = JSON.parse(fs.readFileSync(process.env.WORKS_JSON, 'utf8')); // 로컬 테스트용
else {
  const res = await fetch(`${URL_}/rest/v1/works?select=*&published=eq.true`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
  if (!res.ok) { console.error('fetch failed', res.status, await res.text()); process.exit(1); }
  rows = await res.json();
}
const works = rows.filter((w) => w.slug && /^[a-z0-9-]+$/.test(w.slug));

for (const [tplFile, dir, en] of [['work.html', 'work', false], ['en/work.html', 'en/work', true]]) {
  const tpl = fs.readFileSync(tplFile, 'utf8');
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  for (const w of works) fs.writeFileSync(path.join(dir, `${w.slug}.html`), page(tpl, w, en));
}
console.log(`built ${works.length} work pages`);
