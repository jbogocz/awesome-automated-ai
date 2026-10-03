// docs/sheet.js — Detail sheet UI.
// Lazy-loaded on first row click; never parsed for users who only scan the list.
import {
  $,
  avatarHtml,
  escapeText,
  fmtAge,
  fmtStars,
  fmtTrend,
  html,
  httpUrl,
  isAlive,
  isHot,
  magnitude,
  raw,
  render,
} from "./lib.js";

let els;
let _opened = null;
let _restoreFocus = null;
let _syncModal;

const GITHUB_PATH =
  "M12 .3a12 12 0 0 0-3.8 23.38c.6.11.82-.26.82-.58v-2.1c-3.34.72-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.09-.74.08-.72.08-.72 1.21.08 1.85 1.24 1.85 1.24 1.08 1.84 2.82 1.31 3.5 1 .11-.78.42-1.31.77-1.61-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.4 1.24-3.24-.12-.31-.54-1.54.12-3.2 0 0 1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.89.12 3.2.77.84 1.24 1.92 1.24 3.24 0 4.63-2.81 5.65-5.48 5.95.43.37.81 1.1.81 2.22v3.29c0 .33.22.7.83.58A12 12 0 0 0 12 .3";

// The CTA is labelled by where it goes: 33 entries link to a paper, a vendor
// site or project docs, and "View on GitHub" on those was simply wrong.
function ctaHtml(e, url) {
  if (new URL(url).hostname === "github.com") {
    return `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${GITHUB_PATH}"/></svg> View on GitHub`;
  }
  const label = e.authors ? "Read paper" : "Visit website";
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg> ${label}`;
}

export function initSheet({ syncModal }) {
  // Scrim and background inertness are shared with the palette; app.js
  // derives them from both layers.
  _syncModal = syncModal;
  els = {
    sheet: $("#sheet"),
    sheetTitle: $("#sheet-title"),
    sheetBody: $("#sheet-body"),
    sheetClose: $("#sheet-close"),
  };
  els.sheetClose.addEventListener("click", closeSheet);
  // Category link inside the sheet filters the stream behind it — close the
  // sheet so the result is visible (the hashchange handler does the filtering).
  els.sheetBody.addEventListener("click", (ev) => {
    if (ev.target.closest('a[href^="#"]')) closeSheet();
  });
}

export function openSheet(e) {
  // Re-opening over an already open sheet (palette pick on top of it) keeps
  // the original return target; focus is inside the sheet by then.
  const wasOpen = _opened !== null;
  _opened = e;
  const t = fmtTrend(e.trend);
  const mag = magnitude(e);
  const hot = isHot(e) ? "hot" : "";

  // External entries aren't repos so don't get an active/quiet label: papers
  // are references, the rest are commercial products.
  const status = e.external
    ? e.commercial
      ? "Commercial product"
      : "Reference"
    : e.archived
      ? "Archived"
      : e.status === "dead"
        ? "Dormant"
        : isAlive(e)
          ? "Active"
          : "Quiet";
  const statusColVar = e.external
    ? e.commercial
      ? "--copper"
      : "--moonlight"
    : e.archived || e.status === "dead"
      ? "--mag-extinct"
      : isAlive(e)
        ? "--life"
        : "--copper";

  render(els.sheetTitle, html`${raw(avatarHtml(e, mag, hot))}<span>${e.name}</span>`);

  const tagsHtml = (e.tags || []).map((tag) => `<span class="tag">${escapeText(tag)}</span>`).join("");
  // Score / stars / age are unscored for externals; for archived repos the
  // quality formula returns 0 by design, but showing "0" next to "Archived"
  // reads as a quality verdict — display "—" instead.
  const showStars = !e.external && e.stars != null;
  const showScore = !e.external && !e.archived && e.score != null;
  const showAge = !e.external && e.lastCommit;
  const showRelease = !e.external && e.lastRelease;
  const trendVal = !e.external && e.trend != null ? `${e.trend > 0 ? "+" : ""}${e.trend.toLocaleString()}` : "—";

  const parts = [];
  if (e.tagline) parts.push(`<p class="sheet__tagline">${escapeText(e.tagline)}</p>`);
  if (e.description) parts.push(`<p class="sheet__desc">${escapeText(e.description)}</p>`);
  if (e.note)
    parts.push(`<p class="sheet__desc" style="color:var(--copper);font-style:italic;">${escapeText(e.note)}</p>`);

  parts.push(`
    <div class="sheet__statusbar" style="border-left:2px solid var(${statusColVar});color:var(${statusColVar});">${status}</div>
    <div class="sheet__stats">
      <div class="stat__label">Stars</div>
      <div class="stat__label">Stars gained ${e.trendDays ? `(${e.trendDays}d)` : "(since last snapshot)"}</div>
      <div class="stat__val">${showStars ? fmtStars(e.stars) : "—"}</div>
      <div class="stat__val stat__val--trend ${t.cls}">${trendVal}</div>

      <div class="stat__label">License</div>
      <div class="stat__label">Score</div>
      <div class="stat__val">${escapeText(e.license || "—")}</div>
      <div class="stat__val">${showScore ? e.score : "—"}</div>

      <div class="stat__label">Last commit</div>
      <div class="stat__label">Last release</div>
      <div class="stat__val">${showAge ? `${fmtAge(e.lastCommit)} ago` : "—"}</div>
      <div class="stat__val">${showRelease ? `${fmtAge(e.lastRelease)} ago` : "—"}</div>
    </div>`);

  if (e.tags?.length) {
    parts.push(`<div class="sheet__tags">${tagsHtml}</div>`);
  }

  const url = httpUrl(e.url);
  if (url) {
    parts.push(`
      <a class="sheet__cta" href="${escapeText(url)}" target="_blank" rel="noopener">${ctaHtml(e, url)}</a>`);
  }

  // The category link swaps only `cat` in the current hash; a bare
  // `#cat=…` dropped the sort, query, lens and chips the user had set.
  const catParams = new URLSearchParams(location.hash.replace(/^#/, ""));
  catParams.set("cat", e.categoryId);
  parts.push(`
    <div class="sheet__cat">
      <b>${escapeText(e.section)}</b> · <a href="#${escapeText(catParams.toString())}" style="color:var(--moonlight);">${escapeText(e.categoryName)}</a>
    </div>`);

  render(els.sheetBody, html`${raw(parts.join(""))}`);

  if (!wasOpen) _restoreFocus = document.activeElement;
  els.sheet.dataset.open = "true";
  els.sheet.setAttribute("aria-hidden", "false");
  _syncModal(); // native focus trap: background leaves the tab order
  els.sheetClose.focus();
}

export function closeSheet() {
  if (!els || _opened === null) return;
  const entry = _opened;
  els.sheet.dataset.open = "false";
  els.sheet.setAttribute("aria-hidden", "true");
  _opened = null;
  _syncModal();
  focusAfterClose(entry);
  _restoreFocus = null;
}

// Back to whatever opened the sheet. When that is gone or was nothing (a
// palette pick made with no prior focus, a stream re-rendered by the
// category link) fall back to the entry's row, then the palette trigger —
// never let focus drop to <body>.
function focusAfterClose(entry) {
  const prev = _restoreFocus;
  if (prev?.isConnected && prev !== document.body && !prev.closest("[inert]")) {
    prev.focus();
    return;
  }
  const row = document.querySelector(
    `.row[data-cat="${CSS.escape(entry.categoryId)}"][data-name="${CSS.escape(entry.name)}"]`,
  );
  (row ?? $("#cmdk-trigger"))?.focus();
}

export function isOpen() {
  return _opened !== null;
}
