import type { ReactNode } from 'react';
import { CopyButton } from './CopyButton';

interface OutputPanelProps {
  children: ReactNode;
  copyText: string;
  copyLabel?: string;
  className?: string;
}

export function OutputPanel({ children, copyText, copyLabel, className = '' }: OutputPanelProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute top-3 right-3 z-10">
        <CopyButton text={copyText} label={copyLabel} />
      </div>
      <div className="pt-10">{children}</div>
    </div>
  );
}
