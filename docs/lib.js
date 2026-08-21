// docs/lib.js — pure helpers shared across app.js + lazy modules.
// No DOM mutation here (except for the Range used to parse HTML strings).
// No state ownership. Free of side effects on import.

// ── Safe HTML helpers ─────────────────────────────────────────────────
const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const escapeText = (s) => String(s ?? "").replace(/[&<>"']/g, (ch) => ESC[ch]);

export const RANGE = document.createRange();

// Tagged template that escapes interpolations and returns a DocumentFragment.
// Pass `raw(string)` for trusted pre-rendered HTML.
export const html = (strings, ...vals) => {
  let out = "";
  strings.forEach((s, i) => {
    out += s;
    if (i < vals.length) {
      const v = vals[i];
      if (v && typeof v === "object" && v.__raw) out += v.__raw;
      else out += escapeText(v);
    }
  });
  return RANGE.createContextualFragment(out);
};
export const raw = (s) => ({ __raw: String(s) });

// Render fragment to a host (replaces children).
export const render = (host, frag) => {
  host.replaceChildren(...frag.childNodes);
};

// ── DOM helpers ──────────────────────────────────────────────────────
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// ── Formatters ───────────────────────────────────────────────────────
export const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const fmtStars = (n) => {
  if (n == null) return "—";
  if (n >= 10000) return `${(n / 1000).toFixed(0)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
};

export const fmtTrend = (t) => {
  if (t == null || t === 0) return { txt: "", cls: "na" };
  const cls = t > 0 ? "up" : "down";
  const abs = Math.abs(t);
  const txt = abs >= 1000 ? abs.toLocaleString() : String(abs);
  return { txt, cls };
};

export const fmtAge = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.valueOf())) return "—";
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days < 1) return "today";
  if (days < 7) return `${days}d`;
  if (days < 30) return `${Math.floor(days / 7)}w`;
  if (days < 365) return `${Math.floor(days / 30)}mo`;
  return `${Math.floor(days / 365)}y`;
};

// ── Entry predicates ─────────────────────────────────────────────────
// `status` ("active" | "quiet" | "dead") is precomputed by src/status.ts
// and baked into data.json — never re-derive it from dates here.
export const isAlive = (e) => e.status === "active";

export const magnitude = (e) => {
  if (e.archived) return "extinct";
  if (e.external) return "paper";
  const s = e.stars ?? 0;
  if (s >= 10000) return "5";
  if (s >= 1000) return "4";
  if (s >= 100) return "3";
  return "2";
};

// Hot = absolute or relative momentum. Top ~25% of alive entries.
//  - 500+ stars in 30d for established repos, OR
//  - 5%+ growth in 30d (catches small repos going viral).
export const isHot = (e) => {
  if (e.archived) return false;
  const trend = e.trend ?? 0;
  if (trend < 1) return false;
  if (trend >= 500) return true;
  const stars = e.stars ?? 0;
  return stars > 0 && trend / stars >= 0.05;
};

// ── Avatar: GitHub org logo for repos, letter chip for papers ──────
// Letter is always rendered behind the img; if the image fails, letter shows.
export function avatarHtml(e, mag, hot) {
  const trendAttr = hot ? "hot" : "";
  const letter = escapeText((e.name || "?").charAt(0));
  if (e.repo && !e.external) {
    const owner = escapeText(e.repo.split("/")[0]);
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

// ── Sparkline: measured star history, plotted verbatim ──────────────
// `e.history` is the entry's measured weekly snapshots (src/db/client.ts
// getSnapshotSeries, which filters on DB.MEASURED) as [date, stars] tuples,
// oldest first. Every point drawn is a recorded measurement — nothing here
// interpolates, smooths or imputes, and nothing upstream does either now that
// star-history reconstruction is retired. Entries with fewer than three
// measurements render the dashed placeholder rather than a curve.
const SPARK_MIN_POINTS = 3;

function sparkPoints(e) {
  if (e.external || e.archived) return null;
  const history = Array.isArray(e.history) ? e.history : null;
  if (!history || history.length < SPARK_MIN_POINTS) return null;
  const pts = [];
  for (const [date, stars] of history) {
    const t = Date.parse(date);
    if (Number.isNaN(t) || typeof stars !== "number") continue;
    pts.push({ t, v: stars });
  }
  return pts.length >= SPARK_MIN_POINTS ? pts : null;
}

export function sparkSvg(e, mag) {
  const pts0 = sparkPoints(e);
  if (!pts0) {
    return `<svg class="spark" viewBox="0 0 50 14" width="50" height="14" aria-hidden="true">
      <line x1="2" y1="7" x2="48" y2="7" stroke="var(--shadow-ink)" stroke-width="1" stroke-dasharray="2 3" opacity="0.5"/>
    </svg>`;
  }
  const w = 50,
    h = 14,
    pad = 1;
  const vals = pts0.map((p) => p.v);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  // x is proportional to elapsed time, not index, so a missed weekly
  // snapshot reads as a gap rather than a compressed step.
  const t0 = pts0[0].t;
  const span = pts0.at(-1).t - t0 || 1;
  const pts = pts0.map((p) => {
    const x = pad + ((p.t - t0) / span) * (w - 2 * pad);
    const y = h - pad - ((p.v - min) / range) * (h - 2 * pad);
    return [x, y];
  });
  const linePath = pts.map((p, i) => `${(i ? "L" : "M") + p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${pts.at(-1)[0].toFixed(1)},${h} L${pts[0][0].toFixed(1)},${h} Z`;
  const last = pts.at(-1);
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true"
              style="--spark-stroke: var(--mag-${mag}); --spark-fill: var(--mag-${mag});">
    <path class="spark__area" d="${areaPath}"/>
    <path class="spark__line" d="${linePath}" stroke="var(--mag-${mag})"/>
    <circle class="spark__dot" cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="1.5"/>
  </svg>`;
}
