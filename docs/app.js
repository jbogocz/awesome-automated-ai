// Awesome Automated AI/ML — Catalog
// Modern static UI, no framework, no build step.
// Standards: ES modules, OKLCH, View Transitions, container queries, native dialog patterns.

const DATA_URL = './data.json';

// ── Safe HTML helpers ─────────────────────────────────────────────────
// All dynamic data is escaped at the boundary; templates are author-controlled.
const ESC = { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' };
const escapeText = (s) => String(s ?? '').replace(/[&<>"']/g, ch => ESC[ch]);

// Tagged template that auto-escapes interpolations and returns a DocumentFragment.
// Uses Range.createContextualFragment — no .innerHTML assignment on live elements.
const RANGE = document.createRange();
const html = (strings, ...vals) => {
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
const raw = (s) => ({ __raw: String(s) });

// Render fragment to a host element (replaces children).
const render = (host, frag) => { host.replaceChildren(...frag.childNodes); };

// ── DOM refs ──────────────────────────────────────────────────────────
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const els = {
  brandSubText: $('#brand-sub-text'),
  sectionGroups: $('#section-groups'),
  catAll:      $('#cat-all'),
  catAllCount: $('#cat-all-count'),
  chipAlive:   $('[data-filter="alive"]'),
  chipAliveCount: $('#chip-alive-count'),
  stream:      $('#stream'),
  resultCount: $('#result-count'),
  sortGroup:   $('.sort-group'),
  chips:       $$('.chip'),
  lenses:      $$('.lens'),
  lensCaption: $('#lens-caption'),

  sheet:       $('#sheet'),
  sheetTitle:  $('#sheet-title'),
  sheetBody:   $('#sheet-body'),
  sheetClose:  $('#sheet-close'),
  scrim:       $('#scrim'),

  cmdk:        $('#cmdk'),
  cmdkTrigger: $('#cmdk-trigger'),
  cmdkInput:   $('#cmdk-input'),
  cmdkList:    $('#cmdk-list'),

  themeToggle: $('#theme-toggle'),
  menuTrigger: $('#menu-trigger'),
  sidebar:     $('#sidebar'),
};

// ── State ─────────────────────────────────────────────────────────────
const state = {
  raw: null,
  entries: [],
  sections: [],
  categoryById: new Map(),
  filters: { categoryId: null, lens: 'all', alive: false, commercial: false, oss: false, archived: false, q: '' },
  sort: 'score',
  selected: null,
};

// ── Helpers ───────────────────────────────────────────────────────────
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const fmtStars = (n) => {
  if (n == null) return '—';
  if (n >= 10000) return (n / 1000).toFixed(0) + 'k';
  if (n >= 1000)  return (n / 1000).toFixed(1) + 'k';
  return String(n);
};

const fmtTrend = (t) => {
  if (t == null || t === 0) return { txt: '', cls: 'na' };
  const cls = t > 0 ? 'up' : 'down';
  return { txt: Math.abs(t).toFixed(0), cls };
};

const fmtAge = (iso) => {
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

const isAlive = (e) => {
  if (e.archived) return false;
  if (!e.lastCommit) return false;
  const days = (Date.now() - new Date(e.lastCommit).getTime()) / 86400000;
  return days < 180;
};

const magnitude = (e) => {
  if (e.archived) return 'extinct';
  if (e.external) return 'paper';
  const s = e.stars ?? 0;
  if (s >= 10000) return '5';
  if (s >= 1000)  return '4';
  if (s >= 100)   return '3';
  return '2';
};

const isHot = (e) => !e.archived && (e.trend ?? 0) >= 15;

// ── Curated lenses ────────────────────────────────────────────────────
// Each lens is a curatorial verdict, not a checkbox.
// "What should a serious ML engineer look at right now?"
const LENSES = {
  all: {
    test: () => true,
    caption: (n) => `The full frontier — <b>${n}</b> tools across 25 categories. Sorted by composite score.`,
  },
  frontier: {
    // Composite score is the repo's own quality verdict; elite tier only.
    test: (e) => isAlive(e) && (e.score ?? 0) >= 80,
    caption: (n) => `<b>${n}</b> elite tools by composite score — proven AND active.`,
  },
  rising: {
    // High trend but still small — the real "watch list".
    test: (e) => !e.archived && (e.trend ?? 0) >= 60 && (e.stars ?? 0) < 2500,
    caption: (n) => `<b>${n}</b> small but accelerating — under-the-radar work to watch.`,
  },
  foundations: {
    // Big, stable, and still maintained.
    test: (e) => isAlive(e) && (e.stars ?? 0) >= 10000,
    caption: (n) => `<b>${n}</b> heavy hitters still maintained — the bedrock.`,
  },
  quiet: {
    // Mature tools holding steady: solid base, no fireworks.
    test: (e) => isAlive(e) && (e.trend ?? 0) < 30 && (e.stars ?? 0) >= 500,
    caption: (n) => `<b>${n}</b> mature and steady — tools that don't need to move.`,
  },
  fresh: {
    test: (e) => {
      if (!e.lastCommit) return false;
      const days = (Date.now() - new Date(e.lastCommit).getTime()) / 86400000;
      return days < 30;
    },
    caption: (n) => `<b>${n}</b> shipped this month — the live edge of the catalog.`,
  },
};

// ── Sparkline: synthesize 30-day star trajectory ─────────────────────
// Real data is the latest stars + 30d trend %. We rebuild the curve from
// that with a deterministic monotonic-with-noise shape so each row has
// its own light curve, but ordering matches the trend direction.
function sparkPoints(e, n = 10) {
  const stars = e.stars ?? 0;
  if (!stars || e.external || e.archived) return null;
  const t = (e.trend ?? 0) / 100;
  if (Math.abs(t) < 0.001 && stars < 50) return null;
  const start = stars / (1 + t);
  // Deterministic small noise from a string hash so each row is distinct.
  const seed = [...(e.name || '')].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const noise = (i) => (((seed ^ (i * 2654435761)) >>> 0) % 1000 / 1000 - 0.5) * 0.06;
  const out = [];
  for (let i = 0; i < n; i++) {
    const k = i / (n - 1);
    const eased = k * k * (3 - 2 * k);
    const v = start + (stars - start) * eased;
    out.push(v * (1 + noise(i)));
  }
  // anchor exact endpoints
  out[0] = start;
  out[n - 1] = stars;
  return out;
}

// Avatar: GitHub org logo for repos, initial-letter chip for papers/external.
// Letter is always rendered behind the img; if the image fails, letter shows.
function avatarHtml(e, mag, hot) {
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

function sparkSvg(e, mag) {
  const vals = sparkPoints(e);
  if (!vals) {
    // Dim flat line for entries without trend data
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

// ── Data load ─────────────────────────────────────────────────────────
async function load() {
  const r = await fetch(DATA_URL, { cache: 'no-cache' });
  if (!r.ok) throw new Error(`fetch ${DATA_URL}: ${r.status}`);
  const data = await r.json();
  state.raw = data;

  const sectionMap = new Map();
  for (const cat of data.categories) {
    const id = slug(cat.name);
    const c = {
      id,
      name: cat.name,
      section: cat.section || 'Other',
      description: cat.description,
      entries: cat.entries ?? [],
    };
    state.categoryById.set(id, c);
    if (!sectionMap.has(c.section)) sectionMap.set(c.section, []);
    sectionMap.get(c.section).push(c);
    for (const e of c.entries) {
      state.entries.push({ ...e, categoryId: id, categoryName: c.name, section: c.section });
    }
  }
  state.sections = [...sectionMap.entries()].map(([name, categories]) => ({ name, categories }));
}

// ── Render: sidebar ───────────────────────────────────────────────────
function renderSidebar() {
  const frag = document.createDocumentFragment();
  for (const sec of state.sections) {
    const totalCount = sec.categories.reduce((n, c) => n + c.entries.length, 0);
    const catsHtml = sec.categories.map(c =>
      `<button class="cat" type="button" data-cat="${escapeText(c.id)}" aria-pressed="false">
        <span>${escapeText(c.name)}</span>
        <span class="cat__count">${c.entries.length}</span>
      </button>`).join('');

    const groupFrag = html`
      <div class="section-group" data-open="true">
        <button class="section-group__head" type="button" aria-expanded="true">
          <svg class="section-group__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
          <span>${sec.name}</span>
          <span class="section-group__count">${totalCount}</span>
        </button>
        <div class="section-group__list">${raw(catsHtml)}</div>
      </div>`;
    frag.appendChild(groupFrag);
  }
  render(els.sectionGroups, frag);
}

function bindSidebar() {
  els.catAll.addEventListener('click', () => setCategory(null));
  els.sectionGroups.addEventListener('click', (ev) => {
    const head = ev.target.closest('.section-group__head');
    if (head) {
      const g = head.parentElement;
      const open = g.dataset.open === 'true';
      g.dataset.open = open ? 'false' : 'true';
      head.setAttribute('aria-expanded', open ? 'false' : 'true');
      return;
    }
    const cat = ev.target.closest('.cat');
    if (cat) setCategory(cat.dataset.cat);
  });
  els.menuTrigger.addEventListener('click', () => {
    const open = els.sidebar.dataset.open === 'true';
    els.sidebar.dataset.open = open ? 'false' : 'true';
    els.menuTrigger.setAttribute('aria-expanded', open ? 'false' : 'true');
  });
}

// ── Render: filter bar counts ─────────────────────────────────────────
function renderCounts() {
  els.catAllCount.textContent = String(state.entries.length);
  const alive = state.entries.filter(isAlive).length;
  els.chipAliveCount.textContent = String(alive);
  els.brandSubText.textContent = `Catalog · ${state.entries.length} tools · refreshed weekly`;

  // Lens counts — count entries that pass the lens AND archived rule.
  for (const lensName of Object.keys(LENSES)) {
    const n = state.entries.filter(e => {
      if (e.archived && !state.filters.archived) return false;
      return LENSES[lensName].test(e);
    }).length;
    const node = document.querySelector(`.lens__count[data-count="${lensName}"]`);
    if (node) node.textContent = String(n);
  }
}

function renderLensCaption() {
  const lens = LENSES[state.filters.lens] ?? LENSES.all;
  const n = filtered().length;
  const captionHtml = lens.caption(n);
  // Caption contains author-controlled HTML (only <b> tags); render via fragment.
  const frag = RANGE.createContextualFragment(captionHtml);
  els.lensCaption.replaceChildren(...frag.childNodes);
}

// ── Filter + sort ─────────────────────────────────────────────────────
function filtered() {
  const f = state.filters;
  const q = f.q.trim().toLowerCase();
  const lensTest = LENSES[f.lens]?.test ?? (() => true);
  return state.entries.filter(e => {
    if (f.categoryId && e.categoryId !== f.categoryId) return false;
    if (!f.archived && e.archived) return false;
    if (f.alive && !isAlive(e)) return false;
    if (f.commercial && !e.commercial) return false;
    if (f.oss && (e.commercial || !e.repo)) return false;
    if (!lensTest(e)) return false;
    if (q) {
      const hay = `${e.name} ${e.tagline ?? ''} ${e.description ?? ''} ${(e.tags||[]).join(' ')} ${e.vendor ?? ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

const SORTERS = {
  score:  (a, b) => (b.score ?? 0) - (a.score ?? 0),
  stars:  (a, b) => (b.stars ?? 0) - (a.stars ?? 0),
  trend:  (a, b) => (b.trend ?? -Infinity) - (a.trend ?? -Infinity),
  recent: (a, b) => new Date(b.lastCommit || 0) - new Date(a.lastCommit || 0),
  name:   (a, b) => a.name.localeCompare(b.name),
};

// ── Row template ──────────────────────────────────────────────────────
function rowHtml(e) {
  const mag = magnitude(e);
  const hot = isHot(e) ? 'hot' : '';
  const t = fmtTrend(e.trend);
  const tagsToShow = (e.tags || []).slice(0, 3);
  const tagsHtml = tagsToShow.map(tag => `<span class="tag">${escapeText(tag)}</span>`).join('');
  const badges = [
    e.commercial ? '<span class="badge badge--commercial">comm.</span>' : '',
    e.archived ? '<span class="badge badge--archived">archived</span>' : '',
    e.external ? '<span class="badge badge--paper">paper</span>' : '',
  ].join('');
  const vendorHtml = e.vendor ? `<span class="vendor">${escapeText(e.vendor)}</span>` : '';

  const sparkHtml = sparkSvg(e, mag);

  return `
  <a class="row" role="listitem"
     data-cat="${escapeText(e.categoryId)}"
     data-name="${escapeText(e.name)}"
     href="${escapeText(e.url || '#')}"
     target="_blank" rel="noopener"
     data-archived="${e.archived ? 'true' : 'false'}">
    <span class="row__marker">${avatarHtml(e, mag, hot)}</span>
    <span class="row__name">${escapeText(e.name)}${vendorHtml}${badges}</span>
    <span class="row__tagline">${escapeText(e.tagline || e.description || '')}</span>
    <span class="row__tags">${tagsHtml}</span>
    <span class="row__spark">${sparkHtml}</span>
    <span class="row__metric row__metric--stars">${fmtStars(e.stars)}</span>
    <span class="row__metric row__metric--trend ${t.cls}">${t.txt}</span>
    <span class="row__metric row__metric--age">${fmtAge(e.lastCommit)}</span>
  </a>`;
}

// ── Render: results stream ────────────────────────────────────────────
function renderStream() {
  const items = filtered();
  items.sort(SORTERS[state.sort]);
  els.resultCount.textContent = `${items.length} of ${state.entries.length}`;

  const byCat = new Map();
  for (const e of items) {
    if (!byCat.has(e.categoryId)) byCat.set(e.categoryId, []);
    byCat.get(e.categoryId).push(e);
  }

  if (items.length === 0) {
    const emptyFrag = html`
      <div class="empty">
        <p class="empty__title">No constellations match.</p>
        <p class="empty__hint">Try removing a filter or hitting <kbd>⌘K</kbd> to search.</p>
      </div>`;
    render(els.stream, emptyFrag);
    return;
  }

  const parts = [];
  for (const sec of state.sections) {
    for (const c of sec.categories) {
      const list = byCat.get(c.id);
      if (!list || !list.length) continue;
      parts.push(`
        <section class="constellation">
          <header class="constellation__head">
            <span class="constellation__sec">${escapeText(sec.name)}</span>
            <h2 class="constellation__name">${escapeText(c.name)}</h2>
            <span class="constellation__count">${list.length}</span>
          </header>
          ${c.description ? `<p class="constellation__desc">${escapeText(c.description)}</p>` : ''}
          <div class="constellation__rows">${list.map(rowHtml).join('')}</div>
        </section>`);
    }
  }
  const frag = html`${raw(parts.join(''))}`;

  const apply = () => {
    render(els.stream, frag);
    renderLensCaption();
    renderCounts();
  };
  if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.startViewTransition(apply);
  } else {
    apply();
  }
}

// ── Row interaction: open sheet on click (modifier-click opens GitHub) ─
function bindStream() {
  els.stream.addEventListener('click', (ev) => {
    const row = ev.target.closest('.row');
    if (!row) return;
    if (ev.metaKey || ev.ctrlKey || ev.button === 1 || ev.shiftKey) return;
    ev.preventDefault();
    const name = row.dataset.name;
    const catId = row.dataset.cat;
    const entry = state.entries.find(e => e.categoryId === catId && e.name === name);
    if (entry) openSheet(entry);
  });
}

// ── Detail sheet ──────────────────────────────────────────────────────
function openSheet(e) {
  state.selected = e;
  const t = fmtTrend(e.trend);
  const mag = magnitude(e);
  const hot = isHot(e) ? 'hot' : '';
  const status = e.archived ? 'Archived' : isAlive(e) ? 'Active' : 'Quiet';
  const statusColVar = e.archived ? '--mag-extinct' : isAlive(e) ? '--life' : '--copper';

  const titleFrag = html`${raw(avatarHtml(e, mag, hot))}<span>${e.name}</span>`;
  render(els.sheetTitle, titleFrag);

  const tagsHtml = (e.tags || []).map(tag => `<span class="tag">${escapeText(tag)}</span>`).join('');
  const trendVal = e.trend != null ? `${e.trend > 0 ? '+' : ''}${e.trend}%` : '—';

  const bodyParts = [];
  if (e.tagline) bodyParts.push(`<p class="sheet__tagline">${escapeText(e.tagline)}</p>`);
  if (e.description) bodyParts.push(`<p class="sheet__desc">${escapeText(e.description)}</p>`);
  if (e.note) bodyParts.push(`<p class="sheet__desc" style="color:var(--copper);font-style:italic;">${escapeText(e.note)}</p>`);

  bodyParts.push(`
    <div class="sheet__stats">
      <div class="stat__label">Stars</div>
      <div class="stat__label">Trend (30d)</div>
      <div class="stat__val">${e.stars != null ? fmtStars(e.stars) : '—'}</div>
      <div class="stat__val stat__val--trend ${t.cls}">${trendVal}</div>

      <div class="stat__label">License</div>
      <div class="stat__label">Last commit</div>
      <div class="stat__val">${escapeText(e.license || '—')}</div>
      <div class="stat__val">${fmtAge(e.lastCommit)} ago</div>

      <div class="stat__label">Status</div>
      <div class="stat__label">Score</div>
      <div class="stat__val" style="color:var(${statusColVar});">${status}</div>
      <div class="stat__val">${e.score != null ? e.score : '—'}</div>
    </div>`);

  if (e.tags && e.tags.length) {
    bodyParts.push(`<div class="sheet__tags">${tagsHtml}</div>`);
  }

  if (e.url) {
    bodyParts.push(`
      <a class="sheet__cta" href="${escapeText(e.url)}" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.11.82-.26.82-.58v-2.1c-3.34.72-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.09-.74.08-.72.08-.72 1.21.08 1.85 1.24 1.85 1.24 1.08 1.84 2.82 1.31 3.5 1 .11-.78.42-1.31.77-1.61-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.4 1.24-3.24-.12-.31-.54-1.54.12-3.2 0 0 1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.89.12 3.2.77.84 1.24 1.92 1.24 3.24 0 4.63-2.81 5.65-5.48 5.95.43.37.81 1.1.81 2.22v3.29c0 .33.22.7.83.58A12 12 0 0 0 12 .3"/></svg>
        View on GitHub
      </a>`);
  }

  bodyParts.push(`
    <div class="sheet__cat">
      <b>${escapeText(e.section)}</b> · <a href="#cat=${escapeText(e.categoryId)}" style="color:var(--moonlight);">${escapeText(e.categoryName)}</a>
    </div>`);

  const bodyFrag = html`${raw(bodyParts.join(''))}`;
  render(els.sheetBody, bodyFrag);

  els.sheet.dataset.open = 'true';
  els.sheet.setAttribute('aria-hidden', 'false');
  els.scrim.dataset.open = 'true';
}

function closeSheet() {
  els.sheet.dataset.open = 'false';
  els.sheet.setAttribute('aria-hidden', 'true');
  els.scrim.dataset.open = 'false';
  state.selected = null;
}

function bindSheet() {
  els.sheetClose.addEventListener('click', closeSheet);
  els.scrim.addEventListener('click', () => {
    if (els.cmdk.dataset.open === 'true') closeCmdk();
    closeSheet();
  });
}

// ── Filter chips + sort ───────────────────────────────────────────────
function bindLenses() {
  for (const lens of els.lenses) {
    lens.addEventListener('click', () => {
      const name = lens.dataset.lens;
      for (const l of els.lenses) l.setAttribute('aria-pressed', l === lens ? 'true' : 'false');
      state.filters.lens = name;
      writeHash();
      renderStream();
    });
  }
}

function bindFilterbar() {
  for (const chip of els.chips) {
    chip.addEventListener('click', () => {
      const f = chip.dataset.filter;
      const on = chip.getAttribute('aria-pressed') === 'true';
      chip.setAttribute('aria-pressed', on ? 'false' : 'true');
      if (!on && f === 'commercial') {
        $('[data-filter="oss"]').setAttribute('aria-pressed', 'false');
        state.filters.oss = false;
      }
      if (!on && f === 'oss') {
        $('[data-filter="commercial"]').setAttribute('aria-pressed', 'false');
        state.filters.commercial = false;
      }
      state.filters[f] = !on;
      writeHash();
      renderStream();
    });
  }

  els.sortGroup.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.sort-btn');
    if (!btn) return;
    for (const b of $$('.sort-btn', els.sortGroup)) b.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-pressed', 'true');
    state.sort = btn.dataset.sort;
    writeHash();
    renderStream();
  });
}

// ── Category selection (sidebar ↔ state) ──────────────────────────────
function setCategory(id) {
  state.filters.categoryId = id;
  $$('.cat', els.sidebar).forEach(btn => {
    const match = btn.dataset.cat === id || (btn === els.catAll && !id);
    btn.setAttribute('aria-pressed', match ? 'true' : 'false');
  });
  if (window.matchMedia('(max-width: 900px)').matches) {
    els.sidebar.dataset.open = 'false';
  }
  writeHash();
  renderStream();
}

// ── Theme toggle ──────────────────────────────────────────────────────
function bindTheme() {
  els.themeToggle.addEventListener('click', () => {
    const cur = document.documentElement.dataset.theme
             || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    const next = cur === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
  });
}

// ── Command palette ───────────────────────────────────────────────────
let cmdkIdx = 0;
let cmdkItems = [];

function openCmdk() {
  els.cmdk.dataset.open = 'true';
  els.cmdk.setAttribute('aria-hidden', 'false');
  els.scrim.dataset.open = 'true';
  els.cmdkInput.value = '';
  renderCmdk('');
  setTimeout(() => els.cmdkInput.focus(), 30);
}

function closeCmdk() {
  els.cmdk.dataset.open = 'false';
  els.cmdk.setAttribute('aria-hidden', 'true');
  if (!state.selected) els.scrim.dataset.open = 'false';
}

function renderCmdk(q) {
  q = q.trim().toLowerCase();
  const groups = [];

  if (q === '' || q.startsWith(':') || q.startsWith('>')) {
    const cleanQ = q.replace(/^[:>]\s*/, '');
    const cats = [...state.categoryById.values()]
      .filter(c => !cleanQ || c.name.toLowerCase().includes(cleanQ))
      .slice(0, 8);
    if (cats.length) groups.push({ label: 'Categories', items: cats.map(c => ({
      key: `cat-${c.id}`,
      name: c.name,
      meta: `${c.entries.length} · ${c.section}`,
      action: () => { setCategory(c.id); closeCmdk(); closeSheet(); },
    })) });
  }

  if (q !== '' && !q.startsWith(':') && !q.startsWith('>')) {
    const matched = state.entries.filter(e => {
      const hay = `${e.name} ${e.tagline ?? ''} ${(e.tags||[]).join(' ')}`.toLowerCase();
      return hay.includes(q);
    }).slice(0, 8);
    if (matched.length) groups.push({ label: 'Projects', items: matched.map(e => ({
      key: `e-${e.categoryId}-${e.name}`,
      name: e.name,
      meta: `${fmtStars(e.stars)} · ${e.categoryName}`,
      action: () => { openSheet(e); closeCmdk(); },
    })) });
  }

  if (groups.length === 0) {
    const emptyFrag = html`<div class="cmdk__empty">No matches. Try a project name, or <code>:cat</code> to jump.</div>`;
    render(els.cmdkList, emptyFrag);
    cmdkItems = [];
    return;
  }

  const parts = [];
  for (const g of groups) {
    parts.push(`<div class="cmdk__group-label">${escapeText(g.label)}</div>`);
    for (const it of g.items) {
      parts.push(`
        <button class="cmdk__item" type="button" data-key="${escapeText(it.key)}">
          <span class="cmdk__item-name">${escapeText(it.name)}</span>
          <span class="cmdk__item-meta">${escapeText(it.meta)}</span>
        </button>`);
    }
  }
  const frag = html`${raw(parts.join(''))}`;
  render(els.cmdkList, frag);

  cmdkItems = groups.flatMap(g => g.items);
  cmdkIdx = 0;
  updateCmdkActive();
}

function updateCmdkActive() {
  const btns = $$('.cmdk__item', els.cmdkList);
  btns.forEach((b, i) => { b.dataset.active = i === cmdkIdx ? 'true' : 'false'; });
  btns[cmdkIdx]?.scrollIntoView({ block: 'nearest' });
}

function bindCmdk() {
  els.cmdkTrigger.addEventListener('click', openCmdk);

  document.addEventListener('keydown', (ev) => {
    if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 'k') {
      ev.preventDefault();
      if (els.cmdk.dataset.open === 'true') closeCmdk(); else openCmdk();
      return;
    }
    if (ev.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) {
      ev.preventDefault();
      openCmdk();
      return;
    }
    if (ev.key === 'Escape') {
      if (els.cmdk.dataset.open === 'true') { closeCmdk(); return; }
      if (els.sheet.dataset.open === 'true') { closeSheet(); return; }
    }
  });

  els.cmdkInput.addEventListener('input', (ev) => renderCmdk(ev.target.value));

  els.cmdkInput.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      cmdkIdx = Math.min(cmdkIdx + 1, cmdkItems.length - 1);
      updateCmdkActive();
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      cmdkIdx = Math.max(cmdkIdx - 1, 0);
      updateCmdkActive();
    } else if (ev.key === 'Enter') {
      ev.preventDefault();
      cmdkItems[cmdkIdx]?.action();
    }
  });

  els.cmdkList.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.cmdk__item');
    if (!btn) return;
    const it = cmdkItems.find(i => i.key === btn.dataset.key);
    it?.action();
  });
}

// ── URL hash state (shareable filters) ────────────────────────────────
function readHash() {
  const h = location.hash.replace(/^#/, '');
  if (!h) return;
  const params = new URLSearchParams(h);
  if (params.has('cat')) state.filters.categoryId = params.get('cat');
  if (params.has('lens') && LENSES[params.get('lens')]) state.filters.lens = params.get('lens');
  if (params.has('sort')) state.sort = params.get('sort');
  if (params.get('alive') === '1') state.filters.alive = true;
  if (params.get('archived') === '1') state.filters.archived = true;
  if (params.get('commercial') === '1') state.filters.commercial = true;
  if (params.get('oss') === '1') state.filters.oss = true;
  if (params.has('q')) state.filters.q = params.get('q');
}

function writeHash() {
  const f = state.filters;
  const params = new URLSearchParams();
  if (f.categoryId) params.set('cat', f.categoryId);
  if (f.lens && f.lens !== 'all') params.set('lens', f.lens);
  if (state.sort !== 'score') params.set('sort', state.sort);
  if (f.alive) params.set('alive', '1');
  if (f.archived) params.set('archived', '1');
  if (f.commercial) params.set('commercial', '1');
  if (f.oss) params.set('oss', '1');
  if (f.q) params.set('q', f.q);
  const s = params.toString();
  history.replaceState(null, '', s ? `#${s}` : '#');
}

function applyHashToUI() {
  for (const b of $$('.sort-btn', els.sortGroup)) {
    b.setAttribute('aria-pressed', b.dataset.sort === state.sort ? 'true' : 'false');
  }
  for (const c of els.chips) {
    c.setAttribute('aria-pressed', state.filters[c.dataset.filter] ? 'true' : 'false');
  }
  for (const l of els.lenses) {
    l.setAttribute('aria-pressed', l.dataset.lens === state.filters.lens ? 'true' : 'false');
  }
  $$('.cat', els.sidebar).forEach(btn => {
    const match = btn.dataset.cat === state.filters.categoryId
              || (btn === els.catAll && !state.filters.categoryId);
    btn.setAttribute('aria-pressed', match ? 'true' : 'false');
  });
}

// ── Boot ──────────────────────────────────────────────────────────────
async function main() {
  try {
    await load();
  } catch (err) {
    const frag = html`<div class="empty">
      <p class="empty__title">Couldn't load catalog.</p>
      <p class="empty__hint">${err.message}</p>
    </div>`;
    render(els.stream, frag);
    console.error(err);
    return;
  }
  renderSidebar();
  renderCounts();
  bindSidebar();
  bindLenses();
  bindFilterbar();
  bindStream();
  bindSheet();
  bindCmdk();
  bindTheme();
  readHash();
  applyHashToUI();
  renderStream();

  window.addEventListener('hashchange', () => {
    readHash();
    applyHashToUI();
    renderStream();
  });
}

main();
