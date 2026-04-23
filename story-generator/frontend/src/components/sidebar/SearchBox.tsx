import { useEffect, useRef, useState } from 'react';

interface Props {
  onSearch: (q: string) => void;
}

export function SearchBox({ onSearch }: Props) {
  const [value, setValue] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setValue(v);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onSearch(v), 300);
  };

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-tertiary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="Stories durchsuchen…"
        aria-label="Stories durchsuchen"
        className="w-full pl-8 pr-3 py-2 text-sm border border-edge rounded-lg bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-brand focus:bg-surface placeholder:text-ink-tertiary"
      />
    </div>
  );
}
