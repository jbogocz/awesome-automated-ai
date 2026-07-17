// docs/app.js — orchestrator + critical render path.
// Architecture (2026): vanilla ES modules, no build step, no framework.
// - Pure helpers + visual primitives in ./lib.js
// - Command palette in ./cmdk.js  (lazy-loaded on first ⌘K / '/' / click)
// - Detail sheet in   ./sheet.js  (lazy-loaded on first row click)
// LCP-critical code stays here; everything user-triggered defers parse cost.

import {
  $,
  $$,
  avatarHtml,
  escapeText,
  fmtAge,
  fmtStars,
  fmtTrend,
  html,
  isAlive,
  isHot,
  magnitude,
  RANGE,
  raw,
  render,
  slug,
  sparkSvg,
} from "./lib.js";

const DATA_URL = "./data.json";

// ── DOM refs ─────────────────────────────────────────────────────────
const els = {
  brandSubText: $("#brand-sub-text"),
  freshnessDot: $("#freshness-dot"),
  cmdkFreshness: $("#cmdk-freshness"),
  sectionGroups: $("#section-groups"),
  catAll: $("#cat-all"),
  catAllCount: $("#cat-all-count"),
  chipAliveCount: $("#chip-alive-count"),
  stream: $("#stream"),
  resultCount: $("#result-count"),
  sortGroup: $(".sort-group"),
  chips: $$(".chip"),
  lenses: $$(".lens"),
  lensCaption: $("#lens-caption"),
  cmdkTrigger: $("#cmdk-trigger"),
  scrim: $("#scrim"),
  themeToggle: $("#theme-toggle"),
  menuTrigger: $("#menu-trigger"),
  sidebar: $("#sidebar"),
};

// ── State ────────────────────────────────────────────────────────────
const state = {
  raw: null,
  entries: [],
  sections: [],
  categoryById: new Map(),
  filters: { categoryId: null, lens: "all", alive: false, commercial: false, oss: false, archived: false, q: "" },
  sort: "score",
};

// ── Curated lenses ───────────────────────────────────────────────────
// Each lens answers one specific ML-engineer question with one click.
// Predicates are tuned against the actual data distribution:
//   score p90 = 80, stars p50 = 4302, trend p90 = 1125, lastCommit p25 = 5d.
const LENSES = {
  all: {
    test: () => true,
    caption: (n) => `All <b>${n}</b> tools in the catalog. Sorted by composite quality score.`,
  },
  top: {
    // Highest composite score AND still maintained.
    test: (e) => isAlive(e) && (e.score ?? 0) >= 80,
    caption: (n) => `<b>${n}</b> highest-scoring tools that are still actively maintained.`,
  },
  trending: {
    // Big star growth in the last 30 days (any size).
    test: (e) => isAlive(e) && (e.trend ?? 0) >= 200,
    caption: (n) => `<b>${n}</b> tools with major star growth in the last 30 days.`,
  },
  gems: {
    // High curator score but under-median popularity — quality below the radar.
    test: (e) => isAlive(e) && (e.score ?? 0) >= 70 && (e.stars ?? 0) < 5000,
    caption: (n) => `<b>${n}</b> high-quality tools flying under the radar (under 5k stars).`,
  },
};

// Whole-days since data.json was regenerated. null if not loaded yet.
function dataAgeDays() {
  const t = state.raw?.generated;
  if (!t) return null;
  const d = new Date(t);
  if (Number.isNaN(d.valueOf())) return null;
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}

// ── Data load ────────────────────────────────────────────────────────
async function load() {
  // Default HTTP caching: GitHub Pages serves ETag + short max-age, and the
  // data only changes weekly — a forced revalidation on the LCP path buys nothing.
  const r = await fetch(DATA_URL);
  if (!r.ok) throw new Error(`fetch ${DATA_URL}: ${r.status}`);
  const data = await r.json();
  state.raw = data;

  const sectionMap = new Map();
  for (const cat of data.categories) {
    const id = slug(cat.name);
    const c = {
      id,
      name: cat.name,
      section: cat.section || "Other",
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

// ── Render: sidebar ──────────────────────────────────────────────────
function renderSidebar() {
  const frag = document.createDocumentFragment();
  for (const sec of state.sections) {
    const totalCount = sec.categories.reduce((n, c) => n + c.entries.length, 0);
    const catsHtml = sec.categories
      .map(
        (c) =>
          `<button class="cat" type="button" data-cat="${escapeText(c.id)}" aria-pressed="false">
        <span>${escapeText(c.name)}</span>
        <span class="cat__count">${c.entries.length}</span>
      </button>`,
      )
      .join("");

    frag.appendChild(html`
      <div class="section-group" data-open="true">
        <button class="section-group__head" type="button" aria-expanded="true">
          <svg class="section-group__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
          <span>${sec.name}</span>
          <span class="section-group__count">${totalCount}</span>
        </button>
        <div class="section-group__list">${raw(catsHtml)}</div>
      </div>`);
  }
  render(els.sectionGroups, frag);
}

// Off-screen drawer on mobile must also leave the tab order — transform alone
// keeps its buttons focusable for keyboard/SR users.
const mqMobile = window.matchMedia("(max-width: 900px)");
function syncSidebarInert() {
  els.sidebar.inert = mqMobile.matches && els.sidebar.dataset.open !== "true";
}

function bindSidebar() {
  els.catAll.addEventListener("click", () => setCategory(null));
  els.sectionGroups.addEventListener("click", (ev) => {
    const head = ev.target.closest(".section-group__head");
    if (head) {
      const g = head.parentElement;
      const open = g.dataset.open === "true";
      g.dataset.open = open ? "false" : "true";
      head.setAttribute("aria-expanded", open ? "false" : "true");
      return;
    }
    const cat = ev.target.closest(".cat");
    if (cat) setCategory(cat.dataset.cat);
  });
  els.menuTrigger.addEventListener("click", () => {
    const open = els.sidebar.dataset.open === "true";
    els.sidebar.dataset.open = open ? "false" : "true";
    els.menuTrigger.setAttribute("aria-expanded", open ? "false" : "true");
    syncSidebarInert();
  });
  mqMobile.addEventListener("change", syncSidebarInert);
  syncSidebarInert();
}

// ── Counts (sidebar + lensbar + brand) ───────────────────────────────
function renderCounts() {
  els.catAllCount.textContent = String(state.entries.length);
  const alive = state.entries.filter(isAlive).length;
  els.chipAliveCount.textContent = String(alive);
  const age = dataAgeDays();
  const ageTxt =
    age == null
      ? "refreshed weekly"
      : age < 1
        ? "updated today"
        : age === 1
          ? "updated yesterday"
          : `updated ${age}d ago`;
  els.brandSubText.textContent = `Catalog · ${state.entries.length} tools · ${ageTxt}`;
  if (els.freshnessDot) els.freshnessDot.dataset.stale = age != null && age > 8 ? "true" : "false";
  if (els.cmdkFreshness) els.cmdkFreshness.textContent = age == null ? "" : `snapshot ${age}d ago`;

  for (const lensName of Object.keys(LENSES)) {
    const n = state.entries.filter((e) => {
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
  // Caption strings contain author-controlled <b> only.
  render(els.lensCaption, RANGE.createContextualFragment(lens.caption(n)));
}

// ── Filter + sort ────────────────────────────────────────────────────
function filtered() {
  const f = state.filters;
  const q = f.q.trim().toLowerCase();
  const lensTest = LENSES[f.lens]?.test ?? (() => true);
  return state.entries.filter((e) => {
    if (f.categoryId && e.categoryId !== f.categoryId) return false;
    if (!f.archived && e.archived) return false;
    if (f.alive && !isAlive(e)) return false;
    if (f.commercial && !e.commercial) return false;
    if (f.oss && (e.commercial || !e.repo)) return false;
    if (!lensTest(e)) return false;
    if (q) {
      const hay =
        `${e.name} ${e.tagline ?? ""} ${e.description ?? ""} ${(e.tags || []).join(" ")} ${e.vendor ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

const SORTERS = {
  score: (a, b) => (b.score ?? 0) - (a.score ?? 0),
  stars: (a, b) => (b.stars ?? 0) - (a.stars ?? 0),
  trend: (a, b) => (b.trend ?? -Infinity) - (a.trend ?? -Infinity),
  recent: (a, b) => new Date(b.lastCommit || 0) - new Date(a.lastCommit || 0),
  name: (a, b) => a.name.localeCompare(b.name),
};

// ── Row template ─────────────────────────────────────────────────────
function rowHtml(e) {
  const mag = magnitude(e);
  const hot = isHot(e) ? "hot" : "";
  const t = fmtTrend(e.trend);
  const tagsToShow = (e.tags || []).slice(0, 3);
  const tagsHtml = tagsToShow.map((tag) => `<span class="tag">${escapeText(tag)}</span>`).join("");
  const badges = [
    e.commercial ? '<span class="badge badge--commercial">comm.</span>' : "",
    e.archived ? '<span class="badge badge--archived">archived</span>' : "",
    e.external ? '<span class="badge badge--paper">paper</span>' : "",
  ].join("");
  const vendorHtml = e.vendor ? `<span class="vendor">${escapeText(e.vendor)}</span>` : "";

  return `
  <a class="row"
     data-cat="${escapeText(e.categoryId)}"
     data-name="${escapeText(e.name)}"
     href="${escapeText(e.url || "#")}"
     target="_blank" rel="noopener"
     data-archived="${e.archived ? "true" : "false"}">
    <span class="row__marker">${avatarHtml(e, mag, hot)}</span>
    <span class="row__name">${escapeText(e.name)}${vendorHtml}${badges}</span>
    <span class="row__tagline">${escapeText(e.tagline || e.description || "")}</span>
    <span class="row__tags">${tagsHtml}</span>
    <span class="row__spark">${sparkSvg(e, mag)}</span>
    <span class="row__metric row__metric--stars">${e.external ? "—" : fmtStars(e.stars)}</span>
    <span class="row__metric row__metric--trend ${t.cls}">${t.txt}</span>
    <span class="row__metric row__metric--age">${e.external ? "—" : fmtAge(e.lastCommit)}</span>
  </a>`;
}

// ── Render: results stream ───────────────────────────────────────────
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
    render(
      els.stream,
      html`
      <div class="empty">
        <p class="empty__title">No constellations match.</p>
        <p class="empty__hint">Try removing a filter or hitting <kbd>⌘K</kbd> to search.</p>
      </div>`,
    );
    return;
  }

  const parts = [];
  for (const sec of state.sections) {
    for (const c of sec.categories) {
      const list = byCat.get(c.id);
      if (!list?.length) continue;
      parts.push(`
        <section class="constellation">
          <header class="constellation__head">
            <span class="constellation__sec">${escapeText(sec.name)}</span>
            <h2 class="constellation__name">${escapeText(c.name)}</h2>
            <span class="constellation__count">${list.length}</span>
          </header>
          ${c.description ? `<p class="constellation__desc">${escapeText(c.description)}</p>` : ""}
          <div class="constellation__rows">${list.map(rowHtml).join("")}</div>
        </section>`);
    }
  }
  const frag = html`${raw(parts.join(""))}`;

  const apply = () => {
    render(els.stream, frag);
    renderLensCaption();
    renderCounts();
  };
  if (document.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.startViewTransition(apply);
  } else {
    apply();
  }
}

// ── Lazy modules: cmdk + sheet ───────────────────────────────────────
// First user intent triggers the dynamic import; subsequent calls reuse.
let _cmdk;
async function ensureCmdk() {
  if (!_cmdk) {
    _cmdk = await import("./cmdk.js");
    _cmdk.initCmdk({ state, setCategory, openSheet: lazyOpenSheet });
  }
  return _cmdk;
}

let _sheet;
async function lazyOpenSheet(entry) {
  if (!_sheet) {
    _sheet = await import("./sheet.js");
    _sheet.initSheet();
  }
  _sheet.openSheet(entry);
}

// ── Bindings ─────────────────────────────────────────────────────────
function bindStream() {
  els.stream.addEventListener("click", (ev) => {
    const row = ev.target.closest(".row");
    if (!row) return;
    if (ev.metaKey || ev.ctrlKey || ev.button === 1 || ev.shiftKey) return;
    ev.preventDefault();
    const name = row.dataset.name;
    const catId = row.dataset.cat;
    const entry = state.entries.find((e) => e.categoryId === catId && e.name === name);
    if (entry) void lazyOpenSheet(entry);
  });
}

function bindFilterbar() {
  for (const chip of els.chips) {
    chip.addEventListener("click", () => {
      const f = chip.dataset.filter;
      const on = chip.getAttribute("aria-pressed") === "true";
      chip.setAttribute("aria-pressed", on ? "false" : "true");
      if (!on && f === "commercial") {
        $('[data-filter="oss"]').setAttribute("aria-pressed", "false");
        state.filters.oss = false;
      }
      if (!on && f === "oss") {
        $('[data-filter="commercial"]').setAttribute("aria-pressed", "false");
        state.filters.commercial = false;
      }
      state.filters[f] = !on;
      writeHash();
      renderStream();
    });
  }

  els.sortGroup.addEventListener("click", (ev) => {
    const btn = ev.target.closest(".sort-btn");
    if (!btn) return;
    for (const b of $$(".sort-btn", els.sortGroup)) b.setAttribute("aria-pressed", "false");
    btn.setAttribute("aria-pressed", "true");
    state.sort = btn.dataset.sort;
    writeHash();
    renderStream();
  });
}

function bindLenses() {
  for (const lens of els.lenses) {
    lens.addEventListener("click", () => {
      const name = lens.dataset.lens;
      for (const l of els.lenses) l.setAttribute("aria-pressed", l === lens ? "true" : "false");
      state.filters.lens = name;
      writeHash();
      renderStream();
    });
  }
}

function setCategory(id) {
  state.filters.categoryId = id;
  $$(".cat", els.sidebar).forEach((btn) => {
    const match = btn.dataset.cat === id || (btn === els.catAll && !id);
    btn.setAttribute("aria-pressed", match ? "true" : "false");
  });
  if (mqMobile.matches) {
    els.sidebar.dataset.open = "false";
    syncSidebarInert();
  }
  writeHash();
  renderStream();
}

function bindTheme() {
  els.themeToggle.addEventListener("click", () => {
    const cur =
      document.documentElement.dataset.theme ||
      (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    const next = cur === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  });
}

// Cmd+K trigger + global keyboard shortcuts. Lazy-loads cmdk.js on first use.
function bindGlobalKeys() {
  els.cmdkTrigger.addEventListener("click", async () => {
    const m = await ensureCmdk();
    m.openCmdk();
  });

  document.addEventListener("keydown", async (ev) => {
    if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === "k") {
      ev.preventDefault();
      const m = await ensureCmdk();
      if (m.isOpen()) m.closeCmdk();
      else m.openCmdk();
      return;
    }
    if (ev.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
      ev.preventDefault();
      const m = await ensureCmdk();
      m.openCmdk();
      return;
    }
    if (ev.key === "Escape") {
      if (_cmdk?.isOpen()) {
        _cmdk.closeCmdk();
        return;
      }
      if (_sheet?.isOpen()) {
        _sheet.closeSheet();
        return;
      }
    }
  });

  els.scrim.addEventListener("click", () => {
    if (_cmdk?.isOpen()) _cmdk.closeCmdk();
    if (_sheet?.isOpen()) _sheet.closeSheet();
  });
}

// ── URL hash state (shareable filters) ───────────────────────────────
function readHash() {
  const h = location.hash.replace(/^#/, "");
  if (!h) return;
  const params = new URLSearchParams(h);
  if (params.has("cat")) state.filters.categoryId = params.get("cat");
  if (params.has("lens") && LENSES[params.get("lens")]) state.filters.lens = params.get("lens");
  if (params.has("sort")) state.sort = params.get("sort");
  if (params.get("alive") === "1") state.filters.alive = true;
  if (params.get("archived") === "1") state.filters.archived = true;
  if (params.get("commercial") === "1") state.filters.commercial = true;
  if (params.get("oss") === "1") state.filters.oss = true;
  if (params.has("q")) state.filters.q = params.get("q");
}

function writeHash() {
  const f = state.filters;
  const params = new URLSearchParams();
  if (f.categoryId) params.set("cat", f.categoryId);
  if (f.lens && f.lens !== "all") params.set("lens", f.lens);
  if (state.sort !== "score") params.set("sort", state.sort);
  if (f.alive) params.set("alive", "1");
  if (f.archived) params.set("archived", "1");
  if (f.commercial) params.set("commercial", "1");
  if (f.oss) params.set("oss", "1");
  if (f.q) params.set("q", f.q);
  const s = params.toString();
  history.replaceState(null, "", s ? `#${s}` : "#");
}

function applyHashToUI() {
  for (const b of $$(".sort-btn", els.sortGroup)) {
    b.setAttribute("aria-pressed", b.dataset.sort === state.sort ? "true" : "false");
  }
  for (const c of els.chips) {
    c.setAttribute("aria-pressed", state.filters[c.dataset.filter] ? "true" : "false");
  }
  for (const l of els.lenses) {
    l.setAttribute("aria-pressed", l.dataset.lens === state.filters.lens ? "true" : "false");
  }
  $$(".cat", els.sidebar).forEach((btn) => {
    const match = btn.dataset.cat === state.filters.categoryId || (btn === els.catAll && !state.filters.categoryId);
    btn.setAttribute("aria-pressed", match ? "true" : "false");
  });
}

// ── Boot ─────────────────────────────────────────────────────────────
async function main() {
  try {
    await load();
  } catch (err) {
    render(
      els.stream,
      html`<div class="empty">
      <p class="empty__title">Couldn't load catalog.</p>
      <p class="empty__hint">${err.message}</p>
    </div>`,
    );
    console.error(err);
    return;
  }
  renderSidebar();
  renderCounts();
  bindSidebar();
  bindLenses();
  bindFilterbar();
  bindStream();
  bindTheme();
  bindGlobalKeys();
  readHash();
  applyHashToUI();
  renderStream();

  window.addEventListener("hashchange", () => {
    readHash();
    applyHashToUI();
    renderStream();
  });
}

void main();
