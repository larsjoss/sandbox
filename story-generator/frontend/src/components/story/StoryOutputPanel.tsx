import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import type { Story } from '../../types';

interface Props {
  story?: Story;
  isLoading?: boolean;
  isGenerating?: boolean;
  isRefining?: boolean;
}

// Visual formatting applied at render time (stored data is unchanged).
// 1. Standalone bold headers **Foo** → **Foo:**
// 2. Title line **Titel** — text → **Titel:** — text
// 3. AK list items  - AK-1: text → - **AK-1:** text
function formatStoryMarkdown(raw: string): string {
  return raw
    .replace(/^(\*\*[^*\n]+?)\*\*(\s*—)/gm, '$1:**$2')
    .replace(/^\*\*([^*\n]+?)\*\*\s*$/gm, '**$1:**')
    .replace(/^([ \t]*[-*][ \t]+)(AK-\d+):/gm, '$1**$2:**');
}

export function StoryOutputPanel({ story, isLoading, isGenerating, isRefining }: Props) {
  const outputRef = useRef<HTMLDivElement>(null);
  const wasGenerating = useRef(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (wasGenerating.current && !isGenerating && story) {
      outputRef.current?.focus();
    }
    wasGenerating.current = isGenerating ?? false;
  }, [isGenerating, story]);

  const handleCopy = async () => {
    if (!story) return;
    try {
      await navigator.clipboard.writeText(story.generatedStory);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Kopieren fehlgeschlagen. Bitte manuell kopieren.');
    }
  };

  const busy = isGenerating ?? false;

  return (
    <div className="flex flex-col h-full">
      {/* Header always visible so the border aligns with the other panels */}
      <div className="px-5 py-3.5 border-b border-edge shrink-0">
        <h2 className="text-xs font-semibold text-ink-secondary uppercase tracking-widest">Story</h2>
      </div>

      {/* Non-blocking refinement banner — keeps story text visible (ANF-06) */}
      {isRefining && (
        <div className="shrink-0 px-5 py-2 bg-brand-light border-b border-brand/20 flex items-center gap-2" role="status" aria-live="polite">
          <span className="w-3.5 h-3.5 border-2 border-brand border-t-transparent rounded-full animate-spin shrink-0" aria-hidden="true" />
          <span className="text-xs font-medium text-brand">Story wird verfeinert…</span>
        </div>
      )}

      {/*
       * WCAG 2.4.7 – tabIndex={-1}: nur programmatisch fokussierbar.
       * focus-visible:ring zeigt Ring wenn Browser :focus-visible auslöst.
       * WCAG 1.3.1 – aria-label benennt den Bereich für Screenreader.
       */}
      <div
        ref={outputRef}
        tabIndex={-1}
        aria-busy={busy}
        aria-live="polite"
        aria-label="Generierte Story"
        className="flex-1 overflow-y-auto outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
      >
        {/* Initial load skeleton */}
        {isLoading && (
          <div className="animate-pulse space-y-3 px-6 py-5" aria-hidden="true">
            <div className="h-4 bg-edge rounded w-2/3" />
            <div className="h-3 bg-edge/60 rounded w-full" />
            <div className="h-3 bg-edge/60 rounded w-5/6" />
            <div className="h-3 bg-edge/60 rounded w-4/6" />
            <div className="h-4 bg-edge rounded w-1/3 mt-5" />
            <div className="h-3 bg-edge/60 rounded w-full" />
            <div className="h-3 bg-edge/60 rounded w-full" />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !story && !busy && (
          <div className="flex flex-col items-center justify-center h-full min-h-64 text-center p-10">
            <div className="w-11 h-11 bg-edge-2 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-ink-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm text-ink-tertiary leading-relaxed">
              Gib eine Anforderung ein und klicke auf „Story generieren".
            </p>
          </div>
        )}

        {/* Generating skeleton */}
        {!isLoading && busy && !story && (
          <div className="animate-pulse space-y-3 px-6 py-5" aria-hidden="true">
            <div className="h-4 bg-edge rounded w-2/3" />
            <div className="h-3 bg-edge/60 rounded w-full" />
            <div className="h-3 bg-edge/60 rounded w-5/6" />
            <div className="h-3 bg-edge/60 rounded w-4/6" />
            <div className="h-4 bg-edge rounded w-1/3 mt-5" />
            <div className="h-3 bg-edge/60 rounded w-full" />
            <div className="h-3 bg-edge/60 rounded w-full" />
          </div>
        )}

        {/* Story content + copy button scrolling together */}
        {!isLoading && story && (
          <div className="px-6 py-5">
            <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-strong:font-semibold prose-p:text-ink prose-li:text-ink prose-headings:text-ink prose-strong:text-ink leading-relaxed">
              <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                {formatStoryMarkdown(story.generatedStory)}
              </ReactMarkdown>
            </div>

            {/*
             * Copy button scrolls with the story content.
             * WCAG 4.1.2 – aria-label benennt die Aktion; aria-live="polite" meldet Zustandsänderung.
             * WCAG 2.4.7 – Focus Visible: expliziter Fokus-Ring.
             */}
            <button
              onClick={handleCopy}
              aria-label={copied ? 'Story kopiert' : 'Story kopieren'}
              aria-live="polite"
              className="mt-6 w-full bg-brand hover:bg-brand-dark text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-canvas"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Kopiert!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Kopieren
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
