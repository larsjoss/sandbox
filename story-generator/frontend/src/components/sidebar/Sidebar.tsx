import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStories } from '../../hooks/useStories';
import { SearchBox } from './SearchBox';
import { StoryListItem } from './StoryListItem';
import { SettingsDialog } from '../layout/SettingsDialog';

function SettingsIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  );
}

export function Sidebar() {
  const [q, setQ] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { data, isLoading } = useStories(q);
  const navigate = useNavigate();
  const { logout, apiKey } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  return (
    <>
      <aside className="flex flex-col h-full">
        <div className="px-4 pt-5 pb-3 flex items-center justify-between shrink-0">
          <h1 className="font-serif text-lg font-semibold text-ink">Story Generator</h1>
          {apiKey && (
            <span
              aria-label="Anthropic API-Key aktiv"
              className="flex items-center gap-1.5 text-xs text-green-700 select-none"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" aria-hidden="true" />
              <span className="hidden lg:inline">API</span>
            </span>
          )}
        </div>

        {/* Story list with search pinned to top */}
        <nav aria-label="Gespeicherte Stories" className="flex-1 overflow-hidden flex flex-col">
          <div className="px-3 pt-3 pb-2 shrink-0">
            <SearchBox onSearch={setQ} />
          </div>
          <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                <span className="sr-only">Wird geladen…</span>
              </div>
            )}
            {!isLoading && data?.stories.length === 0 && (
              <p className="text-xs text-ink-tertiary text-center py-8 px-3 leading-relaxed">
                {q ? 'Keine Stories gefunden.' : 'Noch keine Stories.\nErstelle deine erste!'}
              </p>
            )}
            {data?.stories.map((story) => <StoryListItem key={story.id} story={story} />)}
          </div>
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-edge flex flex-col gap-1.5 shrink-0">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-brand bg-brand-light hover:bg-brand-light/70 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Neue Story
          </button>

          {/* Touch-Target: min 44×44 px (WCAG 2.5.5 AAA / 2.5.8 AA) */}
          <button
            onClick={() => setSettingsOpen(true)}
            aria-label="Einstellungen öffnen"
            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-ink-tertiary hover:text-ink hover:bg-edge-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand text-left"
          >
            <SettingsIcon />
            Einstellungen
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-tertiary hover:text-ink hover:bg-edge-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand text-left"
          >
            <LogoutIcon />
            Abmelden
          </button>
        </div>
      </aside>

      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
