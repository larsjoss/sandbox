import type { GoalVariant } from '../../types';
import { CopyButton, MarkdownOutput } from '../../shared/components';

interface Props {
  variant: GoalVariant;
  index: number;
  // Wenn gesetzt, wird "Verfeinern →"-Button angezeigt
  onRefine?: () => void;
  // Überschreibt "Variante N" im Badge (z.B. für Refinement-View)
  label?: string;
  isSelected?: boolean;
}

export function GoalVariantCard({ variant, index, onRefine, label, isSelected }: Props) {
  const badgeText = label ?? `Variante ${index + 1}`;

  return (
    <article
      className={[
        'bg-surface border rounded-xl p-5 space-y-3 transition-colors',
        isSelected ? 'border-brand ring-2 ring-brand ring-offset-1' : 'border-edge',
      ].join(' ')}
      aria-label={badgeText}
    >
      {/* Header: Badge + Kopieren-Button */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-brand uppercase tracking-wide">
          {badgeText}
        </span>
        <CopyButton text={variant.text} label={badgeText} />
      </div>

      {/* Goal Text — Markdown for PI Objective, plain paragraph sufficient for Sprint Goal */}
      <div className="text-sm text-ink leading-relaxed">
        <MarkdownOutput>{variant.text}</MarkdownOutput>
      </div>

      {/* Qualitätsbegründung */}
      {variant.rationale && (
        <div className="border-t border-edge pt-3 space-y-0.5">
          <p className="text-xs font-medium text-ink-secondary">Qualitätsbegründung</p>
          <p className="text-xs text-ink-tertiary leading-relaxed">{variant.rationale}</p>
        </div>
      )}

      {/* Schwachstelle */}
      {variant.weakness && (
        <div className="space-y-0.5">
          <p className="text-xs font-medium text-amber-700">Schwachstelle</p>
          <p className="text-xs text-amber-700 leading-relaxed">{variant.weakness}</p>
        </div>
      )}

      {/* Verfeinern-Button — nur wenn onRefine übergeben */}
      {onRefine && (
        <div className="pt-1 border-t border-edge">
          <button
            type="button"
            onClick={onRefine}
            className="text-xs font-medium text-brand hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
          >
            Verfeinern →
          </button>
        </div>
      )}
    </article>
  );
}
