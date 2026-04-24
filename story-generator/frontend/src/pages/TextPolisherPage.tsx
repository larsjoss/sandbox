import { useEffect, useRef, useState, type FormEvent } from 'react';
import { usePolishText } from '../hooks/useTextPolisher';
import type { UseCase, Tone } from '../hooks/useTextPolisher';
import { TextPolisherInputPanel } from '../components/text-polisher/TextPolisherInputPanel';
import { TextPolisherOutputPanel } from '../components/text-polisher/TextPolisherOutputPanel';

/*
 * Layout: Split-View.
 * Desktop (lg+): Input links | Output rechts, je 50%, unabhängig scrollbar (UI-02).
 * Mobile: Input oben (immer), Output erscheint darunter erst nach Generierung (UI-02).
 * ProtectedLayout stellt flex-1 bereit; TextPolisherPage füllt diesen Bereich.
 */
export function TextPolisherPage() {
  const [useCase, setUseCase] = useState<UseCase>('email');
  const [tone, setTone] = useState<Tone>('formell');
  const [input, setInput] = useState('');
  const polishMutation = usePolishText();

  const outputRef = useRef<HTMLDivElement>(null);
  const wasLoading = useRef(false);

  const hasOutput = !!polishMutation.data;
  const isLoading = polishMutation.isPending;

  // WCAG 2.4.3 – Focus Order: nach erfolgreicher Generierung Fokus auf Output-Panel.
  useEffect(() => {
    if (wasLoading.current && !isLoading && polishMutation.data) {
      outputRef.current?.focus();
    }
    wasLoading.current = isLoading;
  }, [isLoading, polishMutation.data]);

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
    /*
     * WCAG 2.4.1 – id="main-content" als Ziel des Skip-Links aus App.tsx.
     * WCAG 1.3.6 – <main> als Hauptinhalt-Landmark.
     */
    <main
      id="main-content"
      className="flex-1 overflow-auto lg:overflow-hidden flex flex-col lg:flex-row bg-canvas"
    >
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
       * Desktop (lg): immer sichtbar.
       * Mobile: nur wenn Output vorhanden oder Generierung läuft (UI-02).
       */}
      <div
        className={`flex flex-col lg:flex-1 lg:overflow-y-auto ${!showOutputMobile ? 'hidden lg:flex lg:flex-col' : 'flex flex-col'}`}
      >
        <TextPolisherOutputPanel
          output={polishMutation.data}
          isLoading={isLoading}
          contentRef={outputRef}
        />
      </div>
    </main>
  );
}
