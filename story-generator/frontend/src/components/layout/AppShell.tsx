import { ReactNode } from 'react';
import { Sidebar } from '../sidebar/Sidebar';

interface Props {
  leftPanel: ReactNode;
  centerPanel: ReactNode;
  rightPanel: ReactNode;
}

export function AppShell({ leftPanel, centerPanel, rightPanel }: Props) {
  return (
    <div className="h-screen overflow-hidden flex flex-col lg:grid lg:grid-cols-[260px_1fr_320px]">
      {/* Sidebar — always visible on desktop, top on mobile */}
      <div className="lg:h-screen lg:overflow-hidden hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar (collapsed top bar) */}
      <div className="lg:hidden border-b border-gray-200 bg-white">
        <Sidebar />
      </div>

      {/* Main area — stacks vertically on mobile */}
      <div className="flex flex-col lg:flex-row lg:contents flex-1 overflow-hidden">
        {/* Left panel: Input */}
        <div className="lg:h-screen lg:overflow-y-auto border-r border-gray-200 bg-white">
          {leftPanel}
        </div>

        {/* Center panel: Story output */}
        <div className="flex-1 lg:h-screen lg:overflow-y-auto bg-white">
          {centerPanel}
        </div>

        {/* Right panel: AI Insights */}
        <div className="lg:h-screen lg:overflow-y-auto border-l border-gray-200 bg-amber-50">
          {rightPanel}
        </div>
      </div>
    </div>
  );
}
