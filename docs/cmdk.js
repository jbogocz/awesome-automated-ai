// docs/cmdk.js — Command palette UI.
// Lazy-loaded on first ⌘K / '/' press; never parsed for users who don't open it.
import { $, $$, escapeText, fmtStars, html, raw, render } from "./lib.js";

// Ranked, so a truncated list still shows the best matches. The count is
// surfaced in the group label when the cap bites.
const CMDK_MAX_RESULTS = 12;

let _state, _setCategory, _openSheet, _syncModal;
let els;
let cmdkIdx = 0;
let cmdkItems = [];
let _restoreFocus = null;

export function initCmdk({ state, setCategory, openSheet, syncModal }) {
  _state = state;
  _setCategory = setCategory;
  _openSheet = openSheet;
  // Scrim and background inertness are shared with the sheet; app.js
  // derives them from both layers.
  _syncModal = syncModal;
  els = {
    cmdk: $("#cmdk"),
    cmdkInput: $("#cmdk-input"),
    cmdkList: $("#cmdk-list"),
  };
  els.cmdkInput.addEventListener("input", (ev) => renderCmdk(ev.target.value));
  els.cmdkInput.addEventListener("keydown", onInputKey);
  els.cmdkList.addEventListener("click", onListClick);
}

export function openCmdk() {
  if (isOpen()) return;
  _restoreFocus = document.activeElement;
  els.cmdk.dataset.open = "true";
  els.cmdk.setAttribute("aria-hidden", "false");
  els.cmdk.inert = false;
  els.cmdkInput.setAttribute("aria-expanded", "true");
  _syncModal(); // native focus trap: everything behind leaves the tab order
  els.cmdkInput.value = "";
  renderCmdk("");
  setTimeout(() => els.cmdkInput.focus(), 30);
}

export function closeCmdk() {
  els.cmdk.dataset.open = "false";
  els.cmdk.setAttribute("aria-hidden", "true");
  els.cmdk.inert = true;
  els.cmdkInput.setAttribute("aria-expanded", "false");
  els.cmdkInput.removeAttribute("aria-activedescendant");
  // Un-inert whatever is beneath (the sheet, or the page) before focusing it.
  _syncModal();
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
            closeCmdk();
            _setCategory(c.id);
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
          // Close first: the palette hands focus back to where it came from,
          // and the sheet then records that as its own return target. The
          // other order let closeCmdk pull focus out of the fresh sheet.
          action: () => {
            closeCmdk();
            void _openSheet(e);
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
    els.cmdkInput.removeAttribute("aria-activedescendant");
    return;
  }

  // Listbox semantics: focus stays in the input (a combobox) and
  // aria-activedescendant names the highlighted option, so screen readers
  // follow the arrow keys. Options are out of the tab order for the same reason.
  const parts = [];
  let n = 0;
  groups.forEach((g, gi) => {
    parts.push(`<div role="group" aria-labelledby="cmdk-g${gi}">
      <div class="cmdk__group-label" id="cmdk-g${gi}" role="presentation">${escapeText(g.label)}</div>`);
    for (const it of g.items) {
      parts.push(`
        <button class="cmdk__item" type="button" role="option" tabindex="-1" aria-selected="false"
                id="cmdk-opt-${n++}" data-key="${escapeText(it.key)}">
          <span class="cmdk__item-name">${escapeText(it.name)}</span>
          <span class="cmdk__item-meta">${escapeText(it.meta)}</span>
        </button>`);
    }
    parts.push("</div>");
  });
  render(els.cmdkList, html`${raw(parts.join(""))}`);

  cmdkItems = groups.flatMap((g) => g.items);
  cmdkIdx = 0;
  updateCmdkActive();
}

function updateCmdkActive() {
  const btns = $$(".cmdk__item", els.cmdkList);
  btns.forEach((b, i) => {
    b.dataset.active = i === cmdkIdx ? "true" : "false";
    b.setAttribute("aria-selected", i === cmdkIdx ? "true" : "false");
  });
  const cur = btns[cmdkIdx];
  if (cur) els.cmdkInput.setAttribute("aria-activedescendant", cur.id);
  else els.cmdkInput.removeAttribute("aria-activedescendant");
  cur?.scrollIntoView({ block: "nearest" });
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
