import { useState, FormEvent } from 'react';
import { useGenerateStory, useRefineStory } from '../../hooks/useStory';
import type { Story } from '../../types';

interface Props {
  activeStory?: Story;
}

export function StoryInputPanel({ activeStory }: Props) {
  const [rawInput, setRawInput] = useState('');
  const [refinementInstruction, setRefinementInstruction] = useState('');

  const generateStory = useGenerateStory();
  const refineStory = useRefineStory(activeStory?.id ?? '');

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

  const isGenerating = generateStory.isPending;
  const isRefining = refineStory.isPending;

  return (
    <div className="p-4 flex flex-col gap-4 min-h-full">
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Anforderung
        </h2>

        <form onSubmit={handleGenerate} className="space-y-3">
          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder="Beschreibe die Anforderung in deinen eigenen Worten — Slack-Nachricht, Sticky Note, spontane Idee…"
            rows={8}
            className="w-full resize-none border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
          />
          <button
            type="submit"
            disabled={isGenerating || !rawInput.trim()}
            className="w-full bg-brand hover:bg-brand-dark text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Story wird generiert…
              </>
            ) : (
              'Story generieren'
            )}
          </button>
        </form>
      </div>

      {activeStory && (
        <div className="border-t border-gray-100 pt-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Refinement-Anweisung
          </h2>
          <form onSubmit={handleRefine} className="space-y-3">
            <textarea
              value={refinementInstruction}
              onChange={(e) => setRefinementInstruction(e.target.value)}
              placeholder='z.B. "Mach AK-2 spezifischer" oder "Berücksichtige den Offline-Fall"'
              rows={4}
              className="w-full resize-none border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
            />
            <button
              type="submit"
              disabled={isRefining || !refinementInstruction.trim()}
              className="w-full bg-white border border-brand text-brand hover:bg-brand-light font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isRefining ? (
                <>
                  <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                  Story wird verfeinert…
                </>
              ) : (
                'Story verfeinern'
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
