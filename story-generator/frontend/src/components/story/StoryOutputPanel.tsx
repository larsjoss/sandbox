import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { CopyButton } from './CopyButton';
import type { Story } from '../../types';

interface Props {
  story?: Story;
  isLoading?: boolean;
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-3 p-4">
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

export function StoryOutputPanel({ story, isLoading }: Props) {
  if (isLoading) return <Skeleton />;

  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-64 text-center p-8">
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-sm text-gray-500">
          Gib eine Anforderung ein und klicke auf "Story generieren".
        </p>
      </div>
    );
  }

  const fullText = story.generatedStory;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Story</h2>
        <CopyButton text={fullText} />
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-strong:font-semibold">
          <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{fullText}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
