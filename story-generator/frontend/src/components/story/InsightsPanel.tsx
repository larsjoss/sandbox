import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import type { Story } from '../../types';

interface Props {
  story?: Story;
  isLoading?: boolean;
}

export function InsightsPanel({ story, isLoading }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-3.5 border-b border-edge">
        <h2 className="text-xs font-semibold text-ink-secondary uppercase tracking-widest">
          Refinement Hinweise
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        {isLoading && (
          <div className="animate-pulse space-y-2" aria-hidden="true">
            <div className="h-3 bg-edge rounded w-full" />
            <div className="h-3 bg-edge/60 rounded w-5/6" />
            <div className="h-3 bg-edge/60 rounded w-4/6" />
          </div>
        )}

        {!isLoading && !story && (
          <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
            <div className="w-9 h-9 bg-edge-2 rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 text-ink-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
              </svg>
            </div>
            <p className="text-xs text-ink-tertiary leading-relaxed">
              KI-Hinweise erscheinen hier nach der Generierung.
            </p>
          </div>
        )}

        {!isLoading && story && !story.refinementHints && (
          <p className="text-xs text-ink-tertiary leading-relaxed">Keine offenen Punkte identifiziert.</p>
        )}

        {!isLoading && story?.refinementHints && (
          <div className="prose prose-xs max-w-none prose-headings:text-ink prose-strong:text-ink prose-li:text-ink prose-p:text-ink leading-relaxed">
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
              {story.refinementHints}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
