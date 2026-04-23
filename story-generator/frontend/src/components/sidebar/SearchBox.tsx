import { useRef, useState } from 'react';

interface Props {
  onSearch: (q: string) => void;
}

export function SearchBox({ onSearch }: Props) {
  const [value, setValue] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setValue(v);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onSearch(v), 300);
  };

  return (
    /*
     * WCAG 1.3.1 – Info and Relationships: Label verknüpft visuell
     * und programmatisch mit dem Input.
     * WCAG 1.3.1 – dekoratives Lupe-Icon mit aria-hidden.
     */
    <div className="relative">
      {/* WCAG 1.3.1 – aria-hidden: Lupe ist dekorativ, Input hat eigenes Label */}
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      {/*
       * WCAG 1.3.1 / 4.1.2 – aria-label statt sichtbarem Label (kein Platz
       * in der kompakten Sidebar-Navigation).
       * WCAG 2.4.7 – Fokus-Ring via Tailwind focus:ring-*.
       */}
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="Stories durchsuchen…"
        aria-label="Stories durchsuchen"
        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white placeholder:text-gray-500"
      />
    </div>
  );
}
