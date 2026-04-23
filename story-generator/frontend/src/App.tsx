import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { WorkspacePage } from './pages/WorkspacePage';

// Tab-Flow (Desktop):
//   1. Skip-Link «Zum Inhalt springen» (nur bei Fokus sichtbar)
//   2. [Sidebar] Story-Generator-Heading (nicht fokussierbar)
//   3. [Sidebar] Einstellungen-Button
//   4. [Sidebar] Abmelden-Button
//   5. [Sidebar] Suchfeld
//   6. [Sidebar] Story-Liste (je ein Button pro Story)
//   7. [Sidebar] «Neue Story»-Button
//   8. [Hauptbereich] Anforderungs-Textarea
//   9. [Hauptbereich] «Story generieren»-Button
//  10. [Hauptbereich] (opt.) Refinement-Textarea + «Story verfeinern»-Button
//  11. [Story-Spalte] «Kopieren»-Button
// Tab-Flow (Mobile): Skip-Link → Sidebar-Header-Buttons → Tab-Buttons (Arrow-Key-Navigation) → aktives Panel

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {/* WCAG 1.3.1 – aria-hidden auf dekorativen Spinner */}
        <div
          className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
        <span className="sr-only">Wird geladen…</span>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <>
      {/*
       * WCAG 2.4.1 – Bypass Blocks (AA)
       * Skip-Navigation als erstes fokussierbares Element der Seite.
       * Sichtbar nur bei Tastatur-Fokus (focus:not-sr-only), sonst sr-only.
       * Ziel: #main-content in AppShell.tsx.
       * Kontrast: Weiss #fff auf brand #6366f1 ≈ 4.47:1 > 3:1 (WCAG 2.4.11 ✓)
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
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <WorkspacePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stories/:id"
          element={
            <ProtectedRoute>
              <WorkspacePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
