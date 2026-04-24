import { useState, type FormEvent } from 'react';
import { usePolishText } from '../hooks/useTextPolisher';
import type { UseCase, Tone } from '../hooks/useTextPolisher';
import { TextPolisherInputPanel } from '../components/text-polisher/TextPolisherInputPanel';
import { TextPolisherOutputPanel } from '../components/text-polisher/TextPolisherOutputPanel';

/*
 * Layout-Entscheidung: Split-View (kein AppShell).
 * Desktop (lg+): Input links | Output rechts, je 50%, unabhängig scrollbar.
 * Mobile: Input oben (immer), Output erscheint darunter erst nach Generierung (UI-02).
 * ProtectedLayout stellt flex-1 + overflow-hidden bereit; TextPolisherPage
 * füllt diesen Bereich mit overflow-auto (mobile) / overflow-hidden (desktop).
 */
export function TextPolisherPage() {
  const [useCase, setUseCase] = useState<UseCase>('email');
  const [tone, setTone] = useState<Tone>('formell');
  const [input, setInput] = useState('');
  const polishMutation = usePolishText();

  const hasOutput = !!polishMutation.data;
  const isLoading = polishMutation.isPending;

  // UI-01: Bei Use-Case-Wechsel mit bestehendem Output Bestätigung einholen.
  const handleUseCaseChange = (newCase: UseCase) => {
    if (newCase === useCase) return;
    if (
      hasOutput &&
      !window.confirm(
        'Beim Wechsel des Use Cases wird der aktuelle Output gelöscht. Fortfahren?',
      )
    ) {
      return;
    }
    polishMutation.reset();
    setUseCase(newCase);
    setTone('formell');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    polishMutation.mutate({ input: input.trim(), useCase, tone });
  };

  // Mobile: Output-Panel erst nach Generierung anzeigen (UI-02).
  const showOutputMobile = hasOutput || isLoading;

  return (
    <div className="flex-1 overflow-auto lg:overflow-hidden flex flex-col lg:flex-row bg-canvas">
      {/* Input-Panel */}
      <div className="flex flex-col lg:flex-1 lg:overflow-y-auto border-b lg:border-b-0 lg:border-r border-edge">
        <TextPolisherInputPanel
          useCase={useCase}
          tone={tone}
          input={input}
          isLoading={isLoading}
          error={polishMutation.error instanceof Error ? polishMutation.error : null}
          onUseCaseChange={handleUseCaseChange}
          onToneChange={setTone}
          onInputChange={setInput}
          onSubmit={handleSubmit}
        />
      </div>

      {/*
       * Output-Panel:
       * Desktop (lg): immer sichtbar (flex-1 lg:flex).
       * Mobile: nur wenn Output vorhanden oder lädt (UI-02).
       */}
      <div
        className={`flex flex-col lg:flex-1 lg:overflow-y-auto ${!showOutputMobile ? 'hidden lg:flex lg:flex-col' : 'flex flex-col'}`}
      >
        <TextPolisherOutputPanel output={polishMutation.data} isLoading={isLoading} />
      </div>
    </div>
  );
}
