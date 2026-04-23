import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

function EyeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

export function SettingsDialog({ open, onClose }: Props) {
  const { apiKey, setApiKey } = useAuth();
  const [value, setValue] = useState('');
  const [showKey, setShowKey] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      setValue(apiKey ?? '');
      setShowKey(false);
      dialog.showModal();
      // defer focus so the dialog is rendered first
      requestAnimationFrame(() => inputRef.current?.focus());
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open, apiKey]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [onClose]);

  const handleSave = () => {
    const trimmed = value.trim();
    if (trimmed) setApiKey(trimmed);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      aria-labelledby="settings-dialog-title"
      className="m-auto rounded-xl shadow-xl border border-edge bg-surface p-0 w-full max-w-sm backdrop:bg-ink/40"
    >
      <div className="p-5">
        <h2 id="settings-dialog-title" className="font-serif text-base font-semibold text-ink mb-4">
          API-Key ändern
        </h2>

        <div>
          <label htmlFor="settings-apikey" className="block text-sm font-medium text-ink mb-1">
            Anthropic API-Key
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              id="settings-apikey"
              type={showKey ? 'text' : 'password'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="sk-ant-…"
              autoComplete="off"
              className="w-full border border-edge rounded-lg px-3 py-2 pr-10 text-sm text-ink bg-surface placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            {/*
             * WCAG 2.5.5 – Target Size (AA): min-h/min-w 44 px für Touch-Ziele.
             * WCAG 2.4.7 – Focus Visible: expliziter Fokus-Ring.
             * WCAG 4.1.2 – Name, Role, Value: aria-label beschreibt den Zustand.
             */}
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              aria-label={showKey ? 'API-Key verbergen' : 'API-Key anzeigen'}
              className="absolute right-1 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center text-ink-tertiary hover:text-ink-secondary rounded focus:outline-none focus:ring-2 focus:ring-brand"
            >
              {showKey ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          <p className="mt-1.5 text-xs text-ink-tertiary">
            Deinen API-Key findest du unter{' '}
            <a
              href="https://console.anthropic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              console.anthropic.com
            </a>
          </p>
        </div>

        {/* WCAG 2.4.7 – Focus Visible: explizite Fokus-Ringe auf beiden Dialog-Buttons */}
        <div className="flex gap-2 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-edge text-ink-secondary font-medium py-2 rounded-lg text-sm hover:bg-edge-2 transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
          >
            Abbrechen
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!value.trim()}
            className="flex-1 bg-brand hover:bg-brand-dark text-white font-medium py-2 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
          >
            Speichern
          </button>
        </div>
      </div>
    </dialog>
  );
}
