// docs/cmdk.js — Command palette UI.
// Lazy-loaded on first ⌘K / '/' press; never parsed for users who don't open it.
import { $, $$, escapeText, fmtStars, html, raw, render } from "./lib.js";

// Ranked, so a truncated list still shows the best matches. The count is
// surfaced in the group label when the cap bites.
const CMDK_MAX_RESULTS = 12;

let _state, _setCategory, _openSheet;
let els;
let cmdkIdx = 0;
let cmdkItems = [];
let _restoreFocus = null;

export function initCmdk({ state, setCategory, openSheet }) {
  _state = state;
  _setCategory = setCategory;
  _openSheet = openSheet;
  els = {
    cmdk: $("#cmdk"),
    cmdkInput: $("#cmdk-input"),
    cmdkList: $("#cmdk-list"),
    scrim: $("#scrim"),
    app: $(".app"),
  };
  els.cmdkInput.addEventListener("input", (ev) => renderCmdk(ev.target.value));
  els.cmdkInput.addEventListener("keydown", onInputKey);
  els.cmdkList.addEventListener("click", onListClick);
}

export function openCmdk() {
  _restoreFocus = document.activeElement;
  els.cmdk.dataset.open = "true";
  els.cmdk.setAttribute("aria-hidden", "false");
  els.cmdk.inert = false;
  els.app.inert = true; // native focus trap: background leaves the tab order
  els.scrim.dataset.open = "true";
  els.cmdkInput.value = "";
  renderCmdk("");
  setTimeout(() => els.cmdkInput.focus(), 30);
}

export function closeCmdk() {
  els.cmdk.dataset.open = "false";
  els.cmdk.setAttribute("aria-hidden", "true");
  els.cmdk.inert = true;
  els.app.inert = false;
  els.scrim.dataset.open = "false";
  if (_restoreFocus?.isConnected) _restoreFocus.focus();
  _restoreFocus = null;
}

export function isOpen() {
  return els?.cmdk.dataset.open === "true";
}

// ── internals ────────────────────────────────────────────────────────
function renderCmdk(q) {
  q = q.trim().toLowerCase();
  const groups = [];

  if (q === "" || q.startsWith(":") || q.startsWith(">")) {
    const cleanQ = q.replace(/^[:>]\s*/, "");
    const cats = [..._state.categoryById.values()]
      .filter((c) => !cleanQ || c.name.toLowerCase().includes(cleanQ))
      .slice(0, 8);
    if (cats.length)
      groups.push({
        label: "Categories",
        items: cats.map((c) => ({
          key: `cat-${c.id}`,
          name: c.name,
          meta: `${c.entries.length} · ${c.section}`,
          action: () => {
            _setCategory(c.id);
            closeCmdk();
          },
        })),
      });
  }

  if (q !== "" && !q.startsWith(":") && !q.startsWith(">")) {
    // Same corpus the list filter searches — the palette used to omit
    // description and vendor, so a query that filtered the list to 40 rows
    // could return nothing here. Results are ranked rather than taken in
    // catalog order: 76 entries contain "agent", and an unranked slice of 8
    // showed whichever happened to come first.
    const matched = _state.entries
      .map((e) => {
        const name = (e.name || "").toLowerCase();
        const tagline = (e.tagline ?? "").toLowerCase();
        const tags = (e.tags || []).join(" ").toLowerCase();
        const rest = `${e.description ?? ""} ${e.vendor ?? ""}`.toLowerCase();
        let rank;
        if (name === q) rank = 0;
        else if (name.startsWith(q)) rank = 1;
        else if (name.includes(q)) rank = 2;
        else if (tags.split(/\s+/).includes(q)) rank = 3;
        else if (tagline.includes(q)) rank = 4;
        else if (tags.includes(q)) rank = 5;
        else if (rest.includes(q)) rank = 6;
        else return null;
        return { e, rank };
      })
      .filter(Boolean)
      // Ties break on score, so the strongest project wins a crowded term.
      .sort((a, b) => a.rank - b.rank || (b.e.score ?? 0) - (a.e.score ?? 0))
      .slice(0, CMDK_MAX_RESULTS)
      .map((m) => m.e);
    if (matched.length)
      groups.push({
        label: matched.length === CMDK_MAX_RESULTS ? `Projects (top ${CMDK_MAX_RESULTS})` : "Projects",
        items: matched.map((e) => ({
          key: `e-${e.categoryId}-${e.name}`,
          name: e.name,
          meta: `${fmtStars(e.stars)} · ${e.categoryName}`,
          action: () => {
            _openSheet(e);
            closeCmdk();
          },
        })),
      });
  }

  if (groups.length === 0) {
    render(
      els.cmdkList,
      html`<div class="cmdk__empty">No matches. Try a project name, or <code>:cat</code> to jump.</div>`,
    );
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
  render(els.cmdkList, html`${raw(parts.join(""))}`);

  cmdkItems = groups.flatMap((g) => g.items);
  cmdkIdx = 0;
  updateCmdkActive();
}

function updateCmdkActive() {
  const btns = $$(".cmdk__item", els.cmdkList);
  btns.forEach((b, i) => {
    b.dataset.active = i === cmdkIdx ? "true" : "false";
  });
  btns[cmdkIdx]?.scrollIntoView({ block: "nearest" });
}

function onInputKey(ev) {
  if (ev.key === "ArrowDown") {
    ev.preventDefault();
    cmdkIdx = Math.min(cmdkIdx + 1, cmdkItems.length - 1);
    updateCmdkActive();
  } else if (ev.key === "ArrowUp") {
    ev.preventDefault();
    cmdkIdx = Math.max(cmdkIdx - 1, 0);
    updateCmdkActive();
  } else if (ev.key === "Enter") {
    ev.preventDefault();
    cmdkItems[cmdkIdx]?.action();
  }
}

function onListClick(ev) {
  const btn = ev.target.closest(".cmdk__item");
  if (!btn) return;
  const it = cmdkItems.find((i) => i.key === btn.dataset.key);
  it?.action();
}
