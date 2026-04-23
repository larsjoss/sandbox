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
    <div className="animate-pulse space-y-3 p-4" aria-hidden="true">
      <div className="h-5 bg-gray-200 rounded w-2/3" />
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="h-3 bg-gray-100 rounded w-5/6" />
      <div className="h-3 bg-gray-100 rounded w-4/6" />
      <div className="h-5 bg-gray-200 rounded w-1/3 mt-4" />
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="h-3 bg-gray-100 rounded w-full" />
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
      <div className="flex flex-col items-center justify-center h-full min-h-64 text-center p-8">
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-sm text-gray-500">
          Gib eine Anforderung ein und klicke auf „Story generieren".
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        {/* text-gray-600 on white #fff ≈ 7.56:1 (WCAG AA ✓, vorher text-gray-400 ≈ 2.35:1 ✗) */}
        <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Story</h2>
        {story && <CopyButton text={story.generatedStory} />}
      </div>

      {/*
       * WCAG 2.4.7 – Focus Visible (AA)
       * tabIndex={-1}: nur programmatisch fokussierbar (nicht per Tab erreichbar).
       * outline-none ist hier legitim, da kein Tastatur-Nutzer diesen Fokus
       * selbst auslösen kann. focus-visible:ring zeigt trotzdem einen Ring,
       * falls Browser :focus-visible bei programmatischem Fokus auslöst.
       * WCAG 1.3.1 – aria-label benennt den Bereich für Screenreader.
       */}
      <div
        ref={outputRef}
        tabIndex={-1}
        aria-busy={busy}
        aria-live="polite"
        aria-label="Generierte Story"
        className="flex-1 overflow-y-auto px-6 py-4 outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
      >
        {busy && !story && (
          <div className="animate-pulse space-y-3" aria-hidden="true">
            <div className="h-5 bg-gray-200 rounded w-2/3" />
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-5/6" />
            <div className="h-3 bg-gray-100 rounded w-4/6" />
            <div className="h-5 bg-gray-200 rounded w-1/3 mt-4" />
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-full" />
          </div>
        )}
        {story && (
          <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-strong:font-semibold">
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
              {formatStoryMarkdown(story.generatedStory)}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
