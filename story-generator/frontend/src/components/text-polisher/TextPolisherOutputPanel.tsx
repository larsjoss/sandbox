import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { CopyButton, LoadingSkeleton } from '../../shared/components';

interface Props {
  output?: string;
  isLoading: boolean;
}

export function TextPolisherOutputPanel({ output, isLoading }: Props) {
  const hasOutput = !!output;

  return (
    <div className="flex flex-col h-full">
      {/* Panel header mit CopyButton (UI-04: oben rechts) */}
      <div className="px-5 py-3.5 border-b border-edge shrink-0 flex items-center justify-between gap-3">
        <h2 className="text-xs font-semibold text-ink-secondary uppercase tracking-widest">
          Aufbereiteter Text
        </h2>
        {hasOutput && !isLoading && (
          <CopyButton text={output!} label="Aufbereiteter Text" />
        )}
      </div>

      {/*
       * WCAG 1.3.1 – aria-live="polite" meldet neue Inhalte an Screen Reader.
       * WCAG 2.4.7 – tabIndex={-1} für programmatischen Fokus nach Generierung.
       */}
      <div
        aria-live="polite"
        aria-busy={isLoading}
        aria-label="Aufbereiteter Text"
        className="flex-1 overflow-y-auto"
      >
        {/* Skeleton während API-Call (UI-04) */}
        {isLoading && (
          <div className="px-6 py-5">
            <LoadingSkeleton lines={8} />
          </div>
        )}

        {/* Leerer Zustand: dezenter Hinweis, kein leeres Panel (UI-04) */}
        {!isLoading && !hasOutput && (
          <div className="flex flex-col items-center justify-center h-full min-h-48 text-center px-8 py-10">
            <div className="w-10 h-10 bg-edge-2 rounded-xl flex items-center justify-center mb-3">
              <svg
                className="w-5 h-5 text-ink-tertiary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <p className="text-sm text-ink-tertiary leading-relaxed">
              Dein aufbereiteter Text erscheint hier nach der Generierung.
            </p>
          </div>
        )}

        {/* Output-Inhalt als Markdown */}
        {!isLoading && hasOutput && (
          <div className="px-6 py-5">
            <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-strong:font-semibold prose-p:text-ink prose-li:text-ink prose-headings:text-ink prose-strong:text-ink leading-relaxed">
              <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{output!}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
