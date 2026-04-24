import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { ToolSelectionPage } from './pages/ToolSelectionPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { TextPolisherPage } from './pages/TextPolisherPage';
import { TopNav } from './components/layout/TopNav';

/*
 * ProtectedLayout: gemeinsamer Shell für alle authentifizierten Seiten.
 * Enthält die persistente TopNav und stellt h-screen + flex-Spalte bereit,
 * sodass untergeordnete Layouts (AppShell, ToolLayout) h-full nutzen können.
 */
function ProtectedLayout() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopNav />
      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <>
      {/*
       * WCAG 2.4.1 – Bypass Blocks (AA): Skip-Navigation als erstes
       * fokussierbares Element der Seite. Ziel: #main-content in AppShell.
       */}
      <a
        href="#main-content"
        className="
          sr-only
          focus:not-sr-only
          focus:fixed focus:top-4 focus:left-4 focus:z-50
          focus:px-4 focus:py-2
          focus:bg-brand focus:text-white
          focus:rounded-lg focus:text-sm focus:font-medium
          focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand
          focus:outline-none
        "
      >
        Zum Inhalt springen
      </a>

      <Routes>
        <Route path="/auth" element={<AuthPage />} />

        <Route element={<ProtectedLayout />}>
          <Route index element={<Navigate to="/tools" replace />} />
          <Route path="/tools" element={<ToolSelectionPage />} />
          <Route path="/tools/story-generator" element={<WorkspacePage />} />
          <Route path="/tools/story-generator/:id" element={<WorkspacePage />} />
          <Route path="/tools/text-polisher" element={<TextPolisherPage />} />
          {/* Weitere Tools werden hier als neue Routes ergänzt (AK-9). */}
        </Route>

        {/* Legacy-URLs weiterleiten */}
        <Route path="/stories/:id" element={<Navigate to="/tools/story-generator" replace />} />
        <Route path="*" element={<Navigate to="/tools" replace />} />
      </Routes>
    </>
  );
}
