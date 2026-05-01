import { CATEGORY_LABELS, CATEGORY_ORDER, TOOLS } from '../constants/tools';
import { TileStrip } from '../components/home/TileStrip';

export function ToolSelectionPage() {
  return (
    <main
      id="main-content"
      className="flex-1 overflow-auto bg-canvas"
    >
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-ink mb-1">Welches Tool brauchst du?</h1>
          <p className="text-sm text-ink-secondary">Wähle ein Tool, um loszulegen.</p>
        </div>

        {CATEGORY_ORDER.map((cat) => {
          const catTools = TOOLS.filter((t) => t.category === cat);
          return (
            <section key={cat} aria-labelledby={`cat-${cat}`}>
              <h2
                id={`cat-${cat}`}
                className="text-xs font-semibold text-brand uppercase tracking-wider mb-3"
              >
                {CATEGORY_LABELS[cat]}
              </h2>
              <TileStrip tools={catTools} />
            </section>
          );
        })}
      </div>
    </main>
  );
}
