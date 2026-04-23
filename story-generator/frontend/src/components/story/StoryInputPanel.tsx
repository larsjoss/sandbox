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
    <div className="p-4 flex flex-col gap-4 min-h-full">
      <section aria-labelledby="anforderung-heading">
        {/* text-gray-600 on white #fff ≈ 7.56:1 (WCAG AA ✓, vorher text-gray-400 ≈ 2.35:1 ✗) */}
        <h2
          id="anforderung-heading"
          className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3"
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
              placeholder="Anforderung eingeben…"
              rows={8}
              aria-describedby="anforderung-hint"
              /* placeholder:text-gray-500 = #6b7280 on white #fff ≈ 4.83:1 (WCAG AA ✓) */
              className="w-full resize-none border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
            />
            <p id="anforderung-hint" className="mt-1 text-xs text-gray-500">
              Slack-Nachricht, Sticky Note oder spontane Idee — einfach in eigenen Worten beschreiben.
            </p>
          </div>
          {/* WCAG 2.4.7 – Focus Visible: expliziter Fokus-Ring für Submit-Button */}
          <button
            type="submit"
            disabled={isGenerating || !rawInput.trim()}
            aria-busy={isGenerating}
            className="w-full bg-brand hover:bg-brand-dark text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
          >
            {isGenerating ? (
              <>
                <span
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  aria-hidden="true"
                />
                Wird generiert…
              </>
            ) : (
              'Story generieren'
            )}
          </button>
        </form>
      </section>

      {activeStory && (
        <section aria-labelledby="refinement-heading" className="border-t border-gray-100 pt-4">
          {/* text-gray-600 on white #fff ≈ 7.56:1 (WCAG AA ✓) */}
          <h2
            id="refinement-heading"
            className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3"
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
                placeholder="Anweisung eingeben…"
                rows={4}
                aria-describedby="refinement-hint"
                className="w-full resize-none border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              />
              <p id="refinement-hint" className="mt-1 text-xs text-gray-500">
                z.&thinsp;B. «Mach AK-2 spezifischer» oder «Berücksichtige den Offline-Fall»
              </p>
            </div>
            {/* WCAG 2.4.7 – Focus Visible: expliziter Fokus-Ring */}
            <button
              type="submit"
              disabled={isRefining || !refinementInstruction.trim()}
              aria-busy={isRefining}
              className="w-full bg-white border border-brand text-brand hover:bg-brand-light font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
            >
              {isRefining ? (
                <>
                  <span
                    className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin"
                    aria-hidden="true"
                  />
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
