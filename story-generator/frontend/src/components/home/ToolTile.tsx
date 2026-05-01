import { useNavigate } from 'react-router-dom';
import type { ToolDef } from '../../constants/tools';

interface Props {
  tool: ToolDef;
}

export function ToolTile({ tool }: Props) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(tool.path)}
      className="flex-shrink-0 w-[200px] text-left bg-surface border border-edge rounded-xl p-5 snap-start
                 hover:border-brand hover:shadow-sm transition-all group
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
    >
      <div className="text-brand mb-3 group-hover:scale-105 transition-transform w-fit" aria-hidden="true">
        <tool.Icon className="w-10 h-10" />
      </div>
      <h3 className="font-serif text-sm font-semibold text-ink mb-1">{tool.title}</h3>
      <p className="text-xs text-ink-secondary leading-relaxed line-clamp-2">{tool.description}</p>
      <div className="mt-3 flex items-center gap-1 text-xs font-medium text-brand" aria-hidden="true">
        <span>Öffnen</span>
        <svg
          className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}
