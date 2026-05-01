import { useCallback, useEffect, useRef, useState } from 'react';
import type { ToolDef } from '../../constants/tools';
import { ToolTile } from './ToolTile';

interface Props {
  tools: ToolDef[];
}

const SCROLL_AMOUNT = 216;

export function TileStrip({ tools }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState]);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? SCROLL_AMOUNT : -SCROLL_AMOUNT, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll('left')}
          aria-label="Weiter links scrollen"
          className="absolute left-0 top-0 bottom-0 z-10 flex items-center pl-1 pr-6
                     bg-gradient-to-r from-canvas to-transparent
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-surface border border-edge shadow-sm">
            <svg className="w-3.5 h-3.5 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </span>
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1
                   [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {tools.map((tool) => (
          <ToolTile key={tool.id} tool={tool} />
        ))}
      </div>

      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll('right')}
          aria-label="Weiter rechts scrollen"
          className="absolute right-0 top-0 bottom-0 z-10 flex items-center pr-1 pl-6
                     bg-gradient-to-l from-canvas to-transparent
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-surface border border-edge shadow-sm">
            <svg className="w-3.5 h-3.5 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
