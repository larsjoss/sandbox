import type { Story } from '../../types';

interface Props {
  story?: Story;
  isLoading?: boolean;
}

// Priority order and visual config for each category
const CATEGORY_CONFIG: Record<string, { label: string; dot: string; text: string }> = {
  KRITISCH:    { label: 'Kritisch',   dot: 'bg-red-500',         text: 'text-red-700'       },
  WICHTIG:     { label: 'Wichtig',    dot: 'bg-amber-500',       text: 'text-amber-700'     },
  EMPFEHLUNG:  { label: 'Empfehlung', dot: 'bg-brand/60',        text: 'text-ink-secondary' },
  HINWEIS:     { label: 'Hinweis',    dot: 'bg-ink-tertiary/50', text: 'text-ink-secondary' },
};
const CATEGORY_ORDER = ['KRITISCH', 'WICHTIG', 'EMPFEHLUNG', 'HINWEIS'] as const;

interface Category {
  name: string;
  items: string[];
}

function parseHints(raw: string): Category[] {
  const categoryMap = new Map<string, string[]>();

  for (const line of raw.split('\n')) {
    // Strip markdown bold markers and leading list symbols, then try to match a category label
    const cleaned = line
      .trim()
      .replace(/\*+/g, '')   // remove ** bold markers
      .replace(/^[-•]\s*/, '') // remove leading dash / bullet
      .trim();

    const match = cleaned.match(/^(KRITISCH|WICHTIG|EMPFEHLUNG|HINWEIS):\s*(.+)/i);
    if (match) {
      const cat = match[1].toUpperCase();
      const text = match[2].trim();
      if (!categoryMap.has(cat)) categoryMap.set(cat, []);
      categoryMap.get(cat)!.push(text);
    }
  }

  return CATEGORY_ORDER
    .filter((c) => categoryMap.has(c))
    .map((name) => ({ name, items: categoryMap.get(name)! }));
}

function CategorySection({ name, items, defaultOpen }: { name: string; items: string[]; defaultOpen: boolean }) {
  const cfg = CATEGORY_CONFIG[name] ?? { label: name, dot: 'bg-edge', text: 'text-ink-secondary' };

  return (
    /*
     * <details>/<summary> is the semantic HTML pattern for disclosure/accordion.
     * group-open:rotate-180 rotates the chevron via Tailwind's group-open variant.
     * WCAG 4.1.2 – natively exposes expanded/collapsed state to assistive technology.
     */
    <details open={defaultOpen} className="group border border-edge rounded-xl overflow-hidden">
      <summary className="flex items-center justify-between px-4 py-3 cursor-pointer select-none bg-surface hover:bg-edge-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset">
        <div className="flex items-center gap-2.5">
          <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} aria-hidden="true" />
          <span className={`text-xs font-semibold uppercase tracking-wider ${cfg.text}`}>{cfg.label}</span>
          <span className="text-xs text-ink-tertiary tabular-nums">({items.length})</span>
        </div>
        <svg
          className="w-3.5 h-3.5 text-ink-tertiary transition-transform duration-200 group-open:rotate-180"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>

      <div className="divide-y divide-edge border-t border-edge">
        {items.map((item, i) => (
          <div key={i} className="px-4 py-3 flex items-start gap-3">
            <span className="mt-[7px] w-1 h-1 rounded-full bg-ink-tertiary/40 shrink-0" aria-hidden="true" />
            <p className="text-xs text-ink leading-relaxed">{item}</p>
          </div>
        ))}
      </div>
    </details>
  );
}

export function InsightsPanel({ story, isLoading }: Props) {
  const categories = story?.refinementHints ? parseHints(story.refinementHints) : [];
  const hasParsedCategories = categories.length > 0;

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-3.5 border-b border-edge shrink-0">
        <h2 className="text-xs font-semibold text-ink-secondary uppercase tracking-widest">
          Hinweise
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {/* Loading skeleton */}
        {isLoading && (
          <div className="animate-pulse space-y-2" aria-hidden="true">
            <div className="h-10 bg-edge rounded-xl w-full" />
            <div className="h-10 bg-edge/60 rounded-xl w-full" />
            <div className="h-10 bg-edge/40 rounded-xl w-full" />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !story && (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
            <div className="w-9 h-9 bg-edge-2 rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 text-ink-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
              </svg>
            </div>
            <p className="text-xs text-ink-tertiary leading-relaxed">
              AI-Hinweise erscheinen hier nach der Generierung der Story.
            </p>
          </div>
        )}

        {/* No hints identified */}
        {!isLoading && story && !story.refinementHints && (
          <p className="text-xs text-ink-tertiary leading-relaxed px-1">Keine offenen Punkte identifiziert.</p>
        )}

        {/* Accordion: parsed categories */}
        {!isLoading && hasParsedCategories && categories.map((cat) => (
          <CategorySection
            key={cat.name}
            name={cat.name}
            items={cat.items}
            defaultOpen={cat.name === 'KRITISCH'}
          />
        ))}

        {/* Fallback: raw text if categories couldn't be parsed */}
        {!isLoading && story?.refinementHints && !hasParsedCategories && (
          <p className="text-xs text-ink leading-relaxed whitespace-pre-wrap">{story.refinementHints}</p>
        )}
      </div>
    </div>
  );
}
