import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SettingsDialog } from '../../shared/components/SettingsDialog';

const TOOLS = [
  { path: '/tools/story-generator', label: 'Story Generator' },
  { path: '/tools/text-polisher', label: 'Text Polisher' },
];

function KeyIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

export function TopNav() {
  const { logout, apiKey } = useAuth();
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  return (
    <>
      {/*
       * TopNav: persistente Tool-Navigation nach dem Login.
       * Enthält Tool-Switcher, API-Key-Status, Einstellungen und Abmelden.
       * Ersetzt die Settings/Logout-Buttons aus der Story-Generator-Sidebar,
       * damit diese Aktionen tool-übergreifend verfügbar sind.
       */}
      <header className="shrink-0 h-12 flex items-center px-4 gap-6 bg-surface border-b border-edge z-20">
        {/* Brand */}
        <NavLink
          to="/tools"
          className="font-serif text-sm font-semibold text-ink hover:text-brand transition-colors focus:outline-none focus:ring-2 focus:ring-brand rounded shrink-0"
        >
          AI Tools
        </NavLink>

        {/* Tool-Navigation */}
        <nav aria-label="Tool-Navigation" className="flex items-center gap-1">
          {TOOLS.map((tool) => (
            <NavLink
              key={tool.path}
              to={tool.path}
              className={({ isActive }) =>
                [
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand',
                  isActive
                    ? 'bg-brand-light text-brand'
                    : 'text-ink-secondary hover:text-ink hover:bg-edge-2',
                ].join(' ')
              }
            >
              {tool.label}
            </NavLink>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Rechte Seite: API-Key-Status + Einstellungen + Logout */}
        <div className="flex items-center gap-1">
          {/* API-Key-Indikator */}
          <span
            aria-label={apiKey ? 'Anthropic API-Key aktiv' : 'Kein API-Key konfiguriert'}
            className={`flex items-center gap-1.5 text-xs mr-1 select-none ${apiKey ? 'text-green-700' : 'text-ink-tertiary'}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${apiKey ? 'bg-green-500' : 'bg-edge'}`}
              aria-hidden="true"
            />
            <span className="hidden sm:inline">API</span>
          </span>

          {/* Einstellungen */}
          <button
            onClick={() => setSettingsOpen(true)}
            aria-label="API-Key-Einstellungen öffnen"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-ink-secondary hover:text-ink hover:bg-edge-2 transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <KeyIcon />
            <span className="hidden sm:inline">Einstellungen</span>
          </button>

          {/* Abmelden */}
          <button
            onClick={handleLogout}
            aria-label="Abmelden"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-ink-secondary hover:text-ink hover:bg-edge-2 transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <LogoutIcon />
            <span className="hidden sm:inline">Abmelden</span>
          </button>
        </div>
      </header>

      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
