/**
 * Tag selection for the README and the dashboard.
 *
 * Both used to render `tags.slice(0, 5)` in whatever order the YAML happened
 * to hold, which is alphabetical — so TPOT, a genetic-programming AutoML
 * library, advertised itself as `adsp · ag066833 · aiml · alzheimer ·
 * alzheimers`: four NIH grant identifiers and a disease name, chosen purely
 * because they sort first. Ludwig printed `deep · deep-learning`.
 *
 * The fix is corpus-derived rather than a hand-maintained stoplist, because a
 * stoplist is exactly the kind of thing the weekly regeneration cannot keep
 * current. A tag is useful to a reader when it is shared with some other
 * entries but not with most of them:
 *
 *   - appears once in the whole corpus  -> no shared meaning (grant IDs,
 *     one-off project slugs). 625 of 947 tags are in this bucket.
 *   - appears on more than a tenth of entries -> too broad to tell entries
 *     apart (`llm` is on 104, `python` on 95).
 *
 * What survives is ranked most-shared first, so the tags a reader has already
 * seen elsewhere come first. Ties break alphabetically, keeping output stable
 * across runs.
 */

/** Tags on more than this share of entries are too broad to discriminate. */
const TOO_COMMON_SHARE = 0.1;

/** A tag seen fewer times than this carries no cross-entry signal. */
const MIN_OCCURRENCES = 2;

export interface TagCorpus {
  count: Map<string, number>;
  entryCount: number;
}

/** Frequency of every tag across all entries; pass the result to selectTags. */
export function buildTagCorpus(entriesTags: (string[] | undefined)[]): TagCorpus {
  const count = new Map<string, number>();
  for (const tags of entriesTags) {
    // Count each tag once per entry even if the entry repeats it.
    for (const tag of new Set(tags ?? [])) {
      count.set(tag, (count.get(tag) ?? 0) + 1);
    }
  }
  return { count, entryCount: entriesTags.length };
}

/**
 * Rank one entry's tags and return at most `limit`. Returning two good tags
 * beats returning two good ones padded with three rejects, so a short result
 * is kept short; only an entry left with nothing falls back (see below).
 */
export function selectTags(tags: string[] | undefined, corpus: TagCorpus, limit = 5): string[] {
  const unique = [...new Set(tags ?? [])];
  if (unique.length === 0) return [];

  const tooCommon = Math.max(2, Math.floor(corpus.entryCount * TOO_COMMON_SHARE));
  const freq = (t: string): number => corpus.count.get(t) ?? 0;

  const useful = unique.filter((t) => {
    const f = freq(t);
    return f >= MIN_OCCURRENCES && f <= tooCommon;
  });

  // Most-shared first; alphabetical tie-break keeps the output deterministic.
  useful.sort((a, b) => freq(b) - freq(a) || a.localeCompare(b, "en"));

  const chosen = dropRedundant(useful).slice(0, limit);
  if (chosen.length > 0) return chosen;

  // Nothing survived, so this entry shares no tag with any other. Frequency
  // cannot rank what is all ones, and padding the good list with rejects
  // would put the grant identifiers straight back — so fall back to the
  // curator's own order, which at least reflects a human decision.
  return dropRedundant(unique).slice(0, limit);
}

/**
 * Drops a tag that is only a truncation of one already chosen — `deep` next to
 * `deep-learning`, `alzheimer` next to `alzheimers`. Keeps the longer, more
 * specific form, which is the one that reads as deliberate.
 */
function dropRedundant(sorted: string[]): string[] {
  const out: string[] = [];
  for (const tag of sorted) {
    const redundant = out.some((kept) => kept.startsWith(tag) || tag.startsWith(kept));
    if (!redundant) out.push(tag);
  }
  return out;
}
