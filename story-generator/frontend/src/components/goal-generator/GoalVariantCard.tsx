import type { GoalVariant } from '../../types';
import { CopyButton } from '../../shared/components';

interface Props {
  variant: GoalVariant;
  index: number;
}

export function GoalVariantCard({ variant, index }: Props) {
  return (
    <article
      className="bg-surface border border-edge rounded-xl p-5 space-y-3"
      aria-label={`Variante ${index + 1}`}
    >
      {/* Header: Badge + Kopieren-Button */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-brand uppercase tracking-wide">
          Variante {index + 1}
        </span>
        <CopyButton text={variant.text} label={`Variante ${index + 1}`} />
      </div>

      {/* Sprint Goal Text */}
      <p className="text-sm text-ink leading-relaxed">{variant.text}</p>

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
    </article>
  );
}
