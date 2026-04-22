import { useNavigate, useParams } from 'react-router-dom';
import type { Story } from '../../types';
import { useDeleteStory } from '../../hooks/useStories';

interface Props {
  story: Story;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffDays === 0) return 'Heute';
  if (diffDays === 1) return 'Gestern';
  if (diffDays < 7) return `vor ${diffDays} Tagen`;
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

export function StoryListItem({ story }: Props) {
  const navigate = useNavigate();
  const { id } = useParams();
  const deleteStory = useDeleteStory();
  const isActive = id === story.id;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Story "${story.title}" wirklich löschen?`)) {
      deleteStory.mutate(story.id, {
        onSuccess: () => {
          if (isActive) navigate('/');
        },
      });
    }
  };

  return (
    <button
      onClick={() => navigate(`/stories/${story.id}`)}
      className={`group w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
        isActive ? 'bg-brand-light text-brand-dark' : 'hover:bg-gray-100 text-gray-700'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium line-clamp-2 flex-1">{story.title}</span>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-0.5 rounded text-gray-400 hover:text-red-500 transition-all"
          title="Story löschen"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-1">{formatDate(story.updatedAt)}</p>
    </button>
  );
}
