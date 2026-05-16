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
  isAlive,
  isHot,
  magnitude,
  raw,
  render,
} from "./lib.js";

let els;
let _opened = null;

export function initSheet() {
  els = {
    sheet: $("#sheet"),
    sheetTitle: $("#sheet-title"),
    sheetBody: $("#sheet-body"),
    sheetClose: $("#sheet-close"),
    scrim: $("#scrim"),
  };
  els.sheetClose.addEventListener("click", closeSheet);
}

export function openSheet(e) {
  _opened = e;
  const t = fmtTrend(e.trend);
  const mag = magnitude(e);
  const hot = isHot(e) ? "hot" : "";

  // Status: external papers aren't repos so don't get an active/quiet label.
  const status = e.external ? "Reference" : e.archived ? "Archived" : isAlive(e) ? "Active" : "Quiet";
  const statusColVar = e.external ? "--moonlight" : e.archived ? "--mag-extinct" : isAlive(e) ? "--life" : "--copper";

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
      <div class="stat__label">Stars gained (30d)</div>
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

  if (e.url) {
    parts.push(`
      <a class="sheet__cta" href="${escapeText(e.url)}" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.11.82-.26.82-.58v-2.1c-3.34.72-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.09-.74.08-.72.08-.72 1.21.08 1.85 1.24 1.85 1.24 1.08 1.84 2.82 1.31 3.5 1 .11-.78.42-1.31.77-1.61-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.4 1.24-3.24-.12-.31-.54-1.54.12-3.2 0 0 1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.89.12 3.2.77.84 1.24 1.92 1.24 3.24 0 4.63-2.81 5.65-5.48 5.95.43.37.81 1.1.81 2.22v3.29c0 .33.22.7.83.58A12 12 0 0 0 12 .3"/></svg>
        View on GitHub
      </a>`);
  }

  parts.push(`
    <div class="sheet__cat">
      <b>${escapeText(e.section)}</b> · <a href="#cat=${escapeText(e.categoryId)}" style="color:var(--moonlight);">${escapeText(e.categoryName)}</a>
    </div>`);

  render(els.sheetBody, html`${raw(parts.join(""))}`);

  els.sheet.dataset.open = "true";
  els.sheet.setAttribute("aria-hidden", "false");
  els.scrim.dataset.open = "true";
}

export function closeSheet() {
  if (!els) return;
  els.sheet.dataset.open = "false";
  els.sheet.setAttribute("aria-hidden", "true");
  els.scrim.dataset.open = "false";
  _opened = null;
}

export function isOpen() {
  return _opened !== null;
}
