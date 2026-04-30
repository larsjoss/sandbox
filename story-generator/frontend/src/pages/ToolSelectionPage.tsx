import { useNavigate } from 'react-router-dom';

const TOOLS = [
  {
    path: '/tools/story-generator',
    title: 'Story Generator',
    description:
      'Wandelt Anforderungen in strukturierte Storys mit Akzeptanzkriterien um und liefert Hinweise fürs Refinement.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    path: '/tools/text-polisher',
    title: 'Text Polisher',
    description:
      'Bereitet Texte, Meetingnotizen & E-Mail Entwürfe sprachlich und strukturell auf.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    path: '/tools/test-case-generator',
    title: 'Test Case Generator',
    description:
      'Erstellt strukturierte Testpläne mit AK-Coverage aus User Stories — optional mit UI-Screenshots.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    path: '/tools/doc-generator',
    title: 'Doc Generator',
    description:
      'Fachtechnische Dokumentation aus User Stories und Features für Confluence generieren.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2zm5-16v4a1 1 0 001 1h4M9 13h6M9 17h4" />
      </svg>
    ),
  },
  {
    path: '/tools/goal-generator',
    title: 'Goal Generator',
    description:
      'Outcome-orientierte Sprint Goals und PI Objectives formulieren – mit Qualitätsbegründung und Verfeinerungsloop.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
        <circle cx="12" cy="12" r="5" strokeWidth={1.5} />
        <circle cx="12" cy="12" r="1.5" strokeWidth={1.5} />
      </svg>
    ),
  },
];

export function ToolSelectionPage() {
  const navigate = useNavigate();

  return (
    /*
     * WCAG 2.4.1 – Bypass Blocks: id="main-content" als Ziel des Skip-Links aus App.tsx.
     * WCAG 1.3.6 – Identify Purpose: <main> als Hauptinhalt-Landmark.
     */
    <main
      id="main-content"
      className="flex-1 overflow-auto bg-canvas flex items-start justify-center pt-16 px-6 pb-12"
    >
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl font-semibold text-ink mb-3">Welches Tool brauchst du?</h1>
          <p className="text-sm text-ink-secondary">Wähle ein Tool, um loszulegen.</p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0" aria-label="Verfügbare Tools">
          {TOOLS.map((tool) => (
            <li key={tool.path}>
              <button
                onClick={() => navigate(tool.path)}
                className="w-full text-left bg-surface border border-edge rounded-xl p-6 hover:border-brand hover:shadow-sm transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              >
                <div className="text-brand group-hover:scale-105 transition-transform mb-4 w-fit" aria-hidden="true">
                  {tool.icon}
                </div>
                <h2 className="font-serif text-lg font-semibold text-ink mb-1.5">{tool.title}</h2>
                <p className="text-sm text-ink-secondary leading-relaxed">{tool.description}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-brand" aria-hidden="true">
                  <span>Öffnen</span>
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
