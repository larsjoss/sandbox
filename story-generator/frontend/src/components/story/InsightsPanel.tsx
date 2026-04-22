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
      <div className="px-4 py-3 border-b border-amber-100">
        <h2 className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
          Refinement Hinweise
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isLoading && (
          <div className="animate-pulse space-y-2">
            <div className="h-3 bg-amber-100 rounded w-full" />
            <div className="h-3 bg-amber-100 rounded w-5/6" />
            <div className="h-3 bg-amber-100 rounded w-4/6" />
          </div>
        )}

        {!isLoading && !story && (
          <p className="text-xs text-amber-600/60 text-center py-8">
            KI-Hinweise erscheinen hier nach der Generierung.
          </p>
        )}

        {!isLoading && story && !story.refinementHints && (
          <p className="text-xs text-amber-700/60">Keine offenen Punkte identifiziert.</p>
        )}

        {!isLoading && story?.refinementHints && (
          <div className="prose prose-xs max-w-none text-amber-900 prose-headings:text-amber-800 prose-strong:text-amber-900 prose-li:text-amber-800">
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
              {story.refinementHints}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
