import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStories } from '../../hooks/useStories';
import { SearchBox } from './SearchBox';
import { StoryListItem } from './StoryListItem';

export function Sidebar() {
  const [q, setQ] = useState('');
  const { data, isLoading } = useStories(q);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  return (
    <aside className="flex flex-col h-full border-r border-gray-200 bg-white">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-sm font-semibold text-gray-900">Story Generator</h1>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            title="Abmelden"
          >
            Abmelden
          </button>
        </div>
        <SearchBox onSearch={setQ} />
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!isLoading && data?.stories.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-8 px-3">
            {q ? 'Keine Stories gefunden.' : 'Noch keine Stories. Erstelle deine erste!'}
          </p>
        )}
        {data?.stories.map((story) => <StoryListItem key={story.id} story={story} />)}
      </div>

      <div className="p-3 border-t border-gray-100">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-brand bg-brand-light hover:bg-indigo-200 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Neue Story
        </button>
      </div>
    </aside>
  );
}
