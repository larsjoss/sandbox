import { useState, FormEvent, useEffect } from 'react';
import { useGenerateStory, useRefineStory } from '../../hooks/useStory';
import type { Story } from '../../types';

interface Props {
  activeStory?: Story;
  onGeneratingChange?: (generating: boolean) => void;
}

export function StoryInputPanel({ activeStory, onGeneratingChange }: Props) {
  const [rawInput, setRawInput] = useState('');
  const [refinementInstruction, setRefinementInstruction] = useState('');

  const generateStory = useGenerateStory();
  const refineStory = useRefineStory(activeStory?.id ?? '');

  const isGenerating = generateStory.isPending;
  const isRefining = refineStory.isPending;
  const generateError = generateStory.error;
  const refineError = refineStory.error;

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

  const handleRefine = (e: FormEvent) => {
    e.preventDefault();
    if (!refinementInstruction.trim() || !activeStory) return;
    refineStory.mutate(refinementInstruction.trim(), {
      onSuccess: () => setRefinementInstruction(''),
    });
  };

  return (
    <div className="p-5 flex flex-col gap-6 min-h-full">
      <section aria-labelledby="anforderung-heading">
        <h2
          id="anforderung-heading"
          className="text-xs font-semibold text-ink-secondary uppercase tracking-widest mb-4"
        >
          Anforderung
        </h2>

        <form onSubmit={handleGenerate} className="space-y-3">
          <div>
            <label htmlFor="anforderung-input" className="sr-only">
              Anforderung beschreiben
            </label>
            <textarea
              id="anforderung-input"
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="Slack-Nachricht, Sticky Note oder spontane Idee — einfach in eigenen Worten beschreiben."
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
            className="w-full bg-brand hover:bg-brand-dark text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-surface"
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

      {activeStory && (
        <section aria-labelledby="refinement-heading" className="border-t border-edge pt-5">
          <h2
            id="refinement-heading"
            className="text-xs font-semibold text-ink-secondary uppercase tracking-widest mb-4"
          >
            Refinement-Anweisung
          </h2>
          <form onSubmit={handleRefine} className="space-y-3">
            <div>
              <label htmlFor="refinement-input" className="sr-only">
                Refinement-Anweisung eingeben
              </label>
              <textarea
                id="refinement-input"
                value={refinementInstruction}
                onChange={(e) => setRefinementInstruction(e.target.value)}
                placeholder="z. B. «Mach AK-2 spezifischer» oder «Berücksichtige den Offline-Fall»"
                rows={4}
                className="w-full resize-none border border-edge rounded-lg px-3.5 py-3 text-sm text-ink bg-surface placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent leading-relaxed"
              />
            </div>

            {refineError && (
              <p role="alert" className="text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
                {refineError instanceof Error ? refineError.message : 'Fehler beim Verfeinern.'}
              </p>
            )}

            {/* WCAG 2.4.7 – Focus Visible: expliziter Fokus-Ring */}
            <button
              type="submit"
              disabled={isRefining || !refinementInstruction.trim()}
              aria-busy={isRefining}
              className="w-full bg-surface border border-brand text-brand hover:bg-brand-light font-medium py-2.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-surface"
            >
              {isRefining ? (
                <>
                  <span className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                  Story wird verfeinert…
                </>
              ) : (
                'Story verfeinern'
              )}
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
