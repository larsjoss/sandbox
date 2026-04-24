import type { ReactNode } from 'react';

interface ToolLayoutProps {
  children: ReactNode;
  maxWidth?: 'md' | 'lg' | 'xl' | '2xl' | '5xl';
}

const MAX_WIDTHS: Record<string, string> = {
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-5xl',
  '2xl': 'max-w-6xl',
  '5xl': 'max-w-screen-xl',
};

/*
 * Scrollbarer Seiten-Wrapper für Tools, die kein eigenes AppShell-Layout verwenden
 * (z.B. ToolSelectionPage, TextPolisherPage). Der übergeordnete ProtectedLayout
 * stellt flex-1 + overflow-hidden bereit; ToolLayout macht den Inhalt scrollbar.
 */
export function ToolLayout({ children, maxWidth = 'xl' }: ToolLayoutProps) {
  return (
    <div className="flex-1 overflow-auto bg-canvas">
      <div className={`${MAX_WIDTHS[maxWidth]} mx-auto px-6 py-8 md:px-8`}>{children}</div>
    </div>
  );
}
