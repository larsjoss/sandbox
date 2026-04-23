import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { CopyButton } from './CopyButton';
import type { Story } from '../../types';

interface Props {
  story?: Story;
  isLoading?: boolean;
  isGenerating?: boolean;
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

function Skeleton() {
  return (
    <div className="animate-pulse space-y-3 p-6" aria-hidden="true">
      <div className="h-4 bg-edge rounded w-2/3" />
      <div className="h-3 bg-edge/60 rounded w-full" />
      <div className="h-3 bg-edge/60 rounded w-5/6" />
      <div className="h-3 bg-edge/60 rounded w-4/6" />
      <div className="h-4 bg-edge rounded w-1/3 mt-5" />
      <div className="h-3 bg-edge/60 rounded w-full" />
      <div className="h-3 bg-edge/60 rounded w-full" />
    </div>
  );
}

export function StoryOutputPanel({ story, isLoading, isGenerating }: Props) {
  const outputRef = useRef<HTMLDivElement>(null);
  const wasGenerating = useRef(false);

  useEffect(() => {
    if (wasGenerating.current && !isGenerating && story) {
      outputRef.current?.focus();
    }
    wasGenerating.current = isGenerating ?? false;
  }, [isGenerating, story]);

  if (isLoading) {
    return (
      <div role="status" aria-label="Story wird geladen">
        <Skeleton />
      </div>
    );
  }

  const busy = isGenerating ?? false;

  if (!story && !busy) {
    return (
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
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-edge">
        <h2 className="text-xs font-semibold text-ink-secondary uppercase tracking-widest">Story</h2>
        {story && <CopyButton text={story.generatedStory} />}
      </div>

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
        className="flex-1 overflow-y-auto px-6 py-5 outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
      >
        {busy && !story && (
          <div className="animate-pulse space-y-3" aria-hidden="true">
            <div className="h-4 bg-edge rounded w-2/3" />
            <div className="h-3 bg-edge/60 rounded w-full" />
            <div className="h-3 bg-edge/60 rounded w-5/6" />
            <div className="h-3 bg-edge/60 rounded w-4/6" />
            <div className="h-4 bg-edge rounded w-1/3 mt-5" />
            <div className="h-3 bg-edge/60 rounded w-full" />
            <div className="h-3 bg-edge/60 rounded w-full" />
          </div>
        )}
        {story && (
          <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-strong:font-semibold prose-p:text-ink prose-li:text-ink prose-headings:text-ink prose-strong:text-ink leading-relaxed">
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
              {formatStoryMarkdown(story.generatedStory)}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
