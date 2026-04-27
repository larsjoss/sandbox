import type { FormEvent } from 'react';
import type { UseCase, Tone } from '../../hooks/useTextPolisher';
import { Button, TextArea, InlineError, PanelHeader } from '../../shared/components';
import { UseCaseSelector } from './UseCaseSelector';
import { ToneSelector } from './ToneSelector';

// ─── Context-specific labels / placeholders ───────────────────────────────────

const LABELS: Record<UseCase, string> = {
  email: 'Dein E-Mail-Entwurf',
  meeting: 'Deine Meeting-Notizen',
  freetext: 'Dein Rohtext',
};

const PLACEHOLDERS: Record<UseCase, string> = {
  email: 'Gib deinen Rohentwurf, Stichworte oder eine unvollständige E-Mail ein.',
  meeting: 'Gib deine Meeting-Notizen, Stichworte oder Bullet Points ein.',
  freetext: 'Gib deinen Rohtext, Notizen oder Entwurf ein.',
};

interface Props {
  useCase: UseCase;
  tone: Tone;
  input: string;
  isLoading: boolean;
  error: Error | null;
  onUseCaseChange: (useCase: UseCase) => void;
  onToneChange: (tone: Tone) => void;
  onInputChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export function TextPolisherInputPanel({
  useCase,
  tone,
  input,
  isLoading,
  error,
  onUseCaseChange,
  onToneChange,
  onInputChange,
  onSubmit,
}: Props) {
  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Eingabe" />

      {/*
       * Use-Case-Auswahl (UI-01): Tab-Navigation mit ARIA tablist.
       * Sticky unter dem Panel-Header, damit sie beim Scrollen sichtbar bleibt.
       */}
      <div className="shrink-0 bg-canvas">
        <UseCaseSelector value={useCase} onChange={onUseCaseChange} disabled={isLoading} />
      </div>

      {/* Scrollbarer Inhalt */}
      <div
        role="tabpanel"
        id={`tp-panel-${useCase}`}
        aria-labelledby={`tp-tab-${useCase}`}
        className="flex-1 overflow-y-auto p-5"
      >
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Textarea (UI-03): min. 12 Zeilen auf Desktop */}
          <TextArea
            id="tp-input"
            label={LABELS[useCase]}
            value={input}
            onChange={onInputChange}
            placeholder={PLACEHOLDERS[useCase]}
            rows={6}
            autoGrow
            disabled={isLoading}
          />

          {/* Ton-Auswahl (UI-03): nur bei E-Mail sichtbar */}
          {useCase === 'email' && (
            <ToneSelector value={tone} onChange={onToneChange} disabled={isLoading} />
          )}

          {/* Fehler (UI-05): InlineError unterhalb Ton-Auswahl / Textarea */}
          {error && (
            <InlineError
              message={error instanceof Error ? error.message : 'Fehler beim Aufbereiten.'}
            />
          )}

          <Button
            type="submit"
            disabled={!input.trim()}
            loading={isLoading}
            className="w-full"
          >
            {isLoading ? 'Wird aufbereitet…' : 'Text aufbereiten'}
          </Button>
        </form>
      </div>
    </div>
  );
}
