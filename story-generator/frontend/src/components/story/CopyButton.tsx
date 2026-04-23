import { useState } from 'react';

interface Props {
  text: string;
}

export function CopyButton({ text }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Kopieren fehlgeschlagen. Bitte manuell kopieren.');
    }
  };

  return (
    /*
     * WCAG 2.4.7 – Focus Visible (AA): expliziter Fokus-Ring.
     * WCAG 4.1.2 – Name, Role, Value: aria-label benennt Aktion für Screenreader.
     * WCAG 1.3.1 – aria-hidden auf dekorativen SVG-Icons.
     */
    <button
      onClick={handleCopy}
      aria-label={copied ? 'Story kopiert' : 'Story kopieren'}
      aria-live="polite"
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1"
    >
      {copied ? (
        <>
          {/* WCAG 1.3.1 – dekoratives Icon, Text trägt die Bedeutung */}
          <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-600">Kopiert!</span>
        </>
      ) : (
        <>
          {/* WCAG 1.3.1 – dekoratives Icon */}
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Kopieren
        </>
      )}
    </button>
  );
}
