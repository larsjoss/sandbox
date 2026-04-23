import { useState, FormEvent, useEffect } from 'react';
import { useGenerateStory } from '../../hooks/useStory';

interface Props {
  onGeneratingChange?: (generating: boolean) => void;
}

export function StoryInputPanel({ onGeneratingChange }: Props) {
  const [rawInput, setRawInput] = useState('');
  const generateStory = useGenerateStory();
  const isGenerating = generateStory.isPending;
  const generateError = generateStory.error;

  useEffect(() => {
    onGeneratingChange?.(isGenerating);
  }, [isGenerating, onGeneratingChange]);

  const handleGenerate = (e: FormEvent) => {
    e.preventDefault();
    if (!rawInput.trim()) return;
    generateStory.mutate(rawInput.trim(), {
      onSuccess: () => setRawInput(''),
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header — py-3.5 matches StoryOutputPanel and InsightsPanel so borders align */}
      <div className="px-5 py-3.5 border-b border-edge shrink-0">
        <h2
          id="anforderung-heading"
          className="text-xs font-semibold text-ink-secondary uppercase tracking-widest"
        >
          Anforderung
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <section aria-labelledby="anforderung-heading">
          <form onSubmit={handleGenerate} className="space-y-3">
            <div>
              <label htmlFor="anforderung-input" className="sr-only">
                Anforderung beschreiben
              </label>
              <textarea
                id="anforderung-input"
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                placeholder="Anforderung in eigenen Worten beschreiben."
                rows={8}
                className="w-full resize-none border border-edge rounded-lg px-3.5 py-3 text-sm text-ink bg-surface placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent leading-relaxed"
              />
            </div>

            {generateError && (
              <p role="alert" className="text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
                {generateError instanceof Error ? generateError.message : 'Fehler beim Generieren.'}
              </p>
            )}

            {/* WCAG 2.4.7 – Focus Visible: expliziter Fokus-Ring für Submit-Button */}
            <button
              type="submit"
              disabled={isGenerating || !rawInput.trim()}
              aria-busy={isGenerating}
              className="w-full bg-brand hover:bg-brand-dark text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-canvas"
            >
              {isGenerating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                  Wird generiert…
                </>
              ) : (
                'Story generieren'
              )}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
