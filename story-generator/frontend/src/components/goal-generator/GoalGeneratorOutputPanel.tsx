import type { RefObject } from 'react';
import type { GoalVariant } from '../../types';
import { Button, InlineError, LoadingSkeleton, PanelHeader } from '../../shared/components';
import { GoalVariantCard } from './GoalVariantCard';

interface Props {
  variants: GoalVariant[];
  isLoading: boolean;
  error: Error | null;
  onRegenerate: () => void;
  onReset: () => void;
  contentRef: RefObject<HTMLDivElement>;
}

export function GoalGeneratorOutputPanel({
  variants,
  isLoading,
  error,
  onRegenerate,
  onReset,
  contentRef,
}: Props) {
  return (
    <div
      className="max-w-3xl mx-auto px-6 py-8"
      role="region"
      aria-label="Generierte Sprint Goal Varianten"
    >
      <div
        ref={contentRef}
        tabIndex={-1}
        aria-live="polite"
        aria-busy={isLoading}
        className="outline-none"
      >
        {isLoading && (
          <div className="py-5">
            <p className="text-sm text-ink-secondary mb-4">Vorschläge werden generiert…</p>
            <LoadingSkeleton lines={8} />
          </div>
        )}

        {!isLoading && variants.length > 0 && (
          <div className="space-y-6">
            <PanelHeader title="Generierte Varianten" />

            <div className="space-y-4">
              {variants.map((variant, idx) => (
                <GoalVariantCard key={idx} variant={variant} index={idx} />
              ))}
            </div>

            {error && <InlineError message={error.message} />}

            <div className="space-y-3 pt-2">
              <Button
                onClick={onRegenerate}
                variant="secondary"
                disabled={isLoading}
                className="w-full"
              >
                Neu generieren
              </Button>
              <Button
                onClick={onReset}
                variant="outline"
                disabled={isLoading}
                className="w-full"
              >
                Zurücksetzen
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
