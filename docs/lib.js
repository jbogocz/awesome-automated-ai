// docs/lib.js — pure helpers shared across app.js + lazy modules.
// No DOM mutation here (except for the Range used to parse HTML strings).
// No state ownership. Free of side effects on import.

// ── Safe HTML helpers ─────────────────────────────────────────────────
const ESC = { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' };
export const escapeText = (s) => String(s ?? '').replace(/[&<>"']/g, ch => ESC[ch]);

export const RANGE = document.createRange();

// Tagged template that escapes interpolations and returns a DocumentFragment.
// Pass `raw(string)` for trusted pre-rendered HTML.
export const html = (strings, ...vals) => {
  let out = '';
  strings.forEach((s, i) => {
    out += s;
    if (i < vals.length) {
      const v = vals[i];
      if (v && typeof v === 'object' && v.__raw) out += v.__raw;
      else out += escapeText(v);
    }
  });
  return RANGE.createContextualFragment(out);
};
export const raw = (s) => ({ __raw: String(s) });

// Render fragment to a host (replaces children).
export const render = (host, frag) => { host.replaceChildren(...frag.childNodes); };

// ── DOM helpers ──────────────────────────────────────────────────────
export const $  = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// ── Formatters ───────────────────────────────────────────────────────
export const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const fmtStars = (n) => {
  if (n == null) return '—';
  if (n >= 10000) return (n / 1000).toFixed(0) + 'k';
  if (n >= 1000)  return (n / 1000).toFixed(1) + 'k';
  return String(n);
};

export const fmtTrend = (t) => {
  if (t == null || t === 0) return { txt: '', cls: 'na' };
  const cls = t > 0 ? 'up' : 'down';
  return { txt: Math.abs(t).toFixed(0), cls };
};

export const fmtAge = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.valueOf())) return '—';
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days < 1)   return 'today';
  if (days < 7)   return `${days}d`;
  if (days < 30)  return `${Math.floor(days / 7)}w`;
  if (days < 365) return `${Math.floor(days / 30)}mo`;
  return `${Math.floor(days / 365)}y`;
};

// ── Entry predicates ─────────────────────────────────────────────────
export const isAlive = (e) => {
  if (e.archived) return false;
  if (!e.lastCommit) return false;
  const days = (Date.now() - new Date(e.lastCommit).getTime()) / 86400000;
  return days < 180;
};

export const magnitude = (e) => {
  if (e.archived) return 'extinct';
  if (e.external) return 'paper';
  const s = e.stars ?? 0;
  if (s >= 10000) return '5';
  if (s >= 1000)  return '4';
  if (s >= 100)   return '3';
  return '2';
};

export const isHot = (e) => !e.archived && (e.trend ?? 0) >= 15;

// ── Avatar: GitHub org logo for repos, letter chip for papers ──────
// Letter is always rendered behind the img; if the image fails, letter shows.
export function avatarHtml(e, mag, hot) {
  const trendAttr = hot ? 'hot' : '';
  const letter = escapeText((e.name || '?').charAt(0));
  if (e.repo && !e.external) {
    const owner = escapeText(e.repo.split('/')[0]);
    return `<span class="avatar" data-mag="${mag}" data-trend="${trendAttr}" aria-hidden="true">
      <span class="avatar__letter">${letter}</span>
      <img class="avatar__img" loading="lazy" decoding="async"
           src="https://github.com/${owner}.png?size=56" alt="">
    </span>`;
  }
  return `<span class="avatar" data-mag="${mag}" data-trend="${trendAttr}" aria-hidden="true">
    <span class="avatar__letter">${letter}</span>
  </span>`;
}

// ── Sparkline: 30-day star trajectory from stars + 30d star delta ──
// `trend` is the absolute count of stars gained over the last 30 days
// (current - stars30dAgo). The sparkline interpolates a smooth curve
// from (stars - trend) → stars with a touch of seeded jitter.
function sparkPoints(e, n = 10) {
  const stars = e.stars ?? 0;
  const trend = e.trend ?? 0;
  if (!stars || e.external || e.archived) return null;
  if (trend === 0 && stars < 50) return null;
  const start = Math.max(stars - trend, 1);
  const seed = [...(e.name || '')].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const noise = (i) => (((seed ^ (i * 2654435761)) >>> 0) % 1000 / 1000 - 0.5) * 0.06;
  const out = [];
  for (let i = 0; i < n; i++) {
    const k = i / (n - 1);
    const eased = k * k * (3 - 2 * k);
    const v = start + (stars - start) * eased;
    out.push(v * (1 + noise(i)));
  }
  out[0] = start;
  out[n - 1] = stars;
  return out;
}

export function sparkSvg(e, mag) {
  const vals = sparkPoints(e);
  if (!vals) {
    return `<svg class="spark" viewBox="0 0 50 14" width="50" height="14" aria-hidden="true">
      <line x1="2" y1="7" x2="48" y2="7" stroke="var(--shadow-ink)" stroke-width="1" stroke-dasharray="2 3" opacity="0.5"/>
    </svg>`;
  }
  const w = 50, h = 14, pad = 1;
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = (max - min) || 1;
  const pts = vals.map((v, i) => {
    const x = pad + (i / (vals.length - 1)) * (w - 2 * pad);
    const y = (h - pad) - ((v - min) / range) * (h - 2 * pad);
    return [x, y];
  });
  const linePath = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const areaPath = `${linePath} L${pts.at(-1)[0].toFixed(1)},${h} L${pts[0][0].toFixed(1)},${h} Z`;
  const last = pts.at(-1);
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true"
              style="--spark-stroke: var(--mag-${mag}); --spark-fill: var(--mag-${mag});">
    <path class="spark__area" d="${areaPath}"/>
    <path class="spark__line" d="${linePath}" stroke="var(--mag-${mag})"/>
    <circle class="spark__dot" cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="1.5"/>
  </svg>`;
}
