import type { RefObject } from 'react';
import { CopyButton, LoadingSkeleton, MarkdownOutput, PanelHeader } from '../../shared/components';

interface Props {
  output?: string;
  isLoading: boolean;
  /** Ref auf den scrollbaren Inhaltsbereich für programmatischen Fokus nach Generierung. */
  contentRef?: RefObject<HTMLDivElement>;
}

export function TextPolisherOutputPanel({ output, isLoading, contentRef }: Props) {
  const hasOutput = !!output;

  return (
    /*
     * WCAG 1.3.6 – role="region" + aria-label macht den Output-Bereich zu einem
     * navigierbaren Landmark, den Screen Reader per Schnellnavigation ansteuern können.
     */
    <div className="flex flex-col h-full" role="region" aria-label="Aufbereiteter Text">
      <PanelHeader
        title="Aufbereiteter Text"
        action={hasOutput && !isLoading ? <CopyButton text={output!} label="Aufbereiteter Text" /> : undefined}
      />

      {/*
       * WCAG 4.1.3 – aria-live="polite": neue Inhalte werden Screen Readern gemeldet.
       * tabIndex={-1}: ermöglicht programmatischen Fokus nach Generierung (AK-8).
       */}
      <div
        ref={contentRef}
        tabIndex={-1}
        aria-live="polite"
        aria-busy={isLoading}
        className="flex-1 overflow-y-auto outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
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
            <MarkdownOutput>{output!}</MarkdownOutput>
          </div>
        )}
      </div>
    </div>
  );
}
