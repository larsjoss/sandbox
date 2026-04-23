import { useNavigate, useParams } from 'react-router-dom';
import type { Story } from '../../types';
import { useDeleteStory } from '../../hooks/useStories';

interface Props {
  story: Story;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffDays === 0) return 'Heute';
  if (diffDays === 1) return 'Gestern';
  if (diffDays < 7) return `vor ${diffDays} Tagen`;
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

/*
 * WCAG 4.1.1 – Parsing (A): Ein <button> darf keine anderen interaktiven
 * Elemente (z.B. weiteren <button>) enthalten. Vorher war der Löschen-Button
 * ein Kind des Navigations-Buttons → invalides HTML.
 * Fix: Äusseres Element ist nun ein <div role="listitem"> mit relativem
 * Positioning. Navigations-Button und Löschen-Button sind Geschwister.
 */
export function StoryListItem({ story }: Props) {
  const navigate = useNavigate();
  const { id } = useParams();
  const deleteStory = useDeleteStory();
  const isActive = id === story.id;

  const handleDelete = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (confirm(`Story "${story.title}" wirklich löschen?`)) {
      deleteStory.mutate(story.id, {
        onSuccess: () => {
          if (isActive) navigate('/');
        },
      });
    }
  };

  return (
    /*
     * WCAG 4.1.1 – kein <button> in <button>: Wrapper ist <div>,
     * Navigations-Button und Löschen-Button sind Geschwister.
     */
    <div className="relative group">
      {/*
       * WCAG 2.4.7 – Focus Visible: expliziter Fokus-Ring.
       * WCAG 4.1.2 – Name, Role, Value: aria-label mit Story-Titel,
       * aria-current für aktive Story.
       */}
      <button
        onClick={() => navigate(`/stories/${story.id}`)}
        aria-label={`Story öffnen: ${story.title}`}
        aria-current={isActive ? 'page' : undefined}
        className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors pr-9 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-inset ${
          isActive ? 'bg-brand-light text-brand-dark' : 'hover:bg-gray-100 text-gray-700'
        }`}
      >
        <span className="text-sm font-medium line-clamp-2 block">{story.title}</span>
        {/* WCAG 1.3.1 – dekorativ: Datum hat keine Icon-SVG, nur Text */}
        <p className="text-xs text-gray-500 mt-1">{formatDate(story.updatedAt)}</p>
      </button>

      {/*
       * WCAG 2.4.7 – Focus Visible: opacity-0 per default, aber
       * sichtbar bei Hover UND bei Tastatur-Fokus (focus:opacity-100).
       * Ohne focus:opacity-100 wäre der Button für Tastatur-Nutzer
       * unsichtbar-aber-fokussierbar → WCAG-Verstoß.
       * WCAG 1.3.1 – aria-hidden auf dekorativem Trash-Icon.
       * WCAG 4.1.2 – aria-label beschreibt die Aktion mit Story-Titel.
       */}
      <button
        onClick={handleDelete}
        aria-label={`Story löschen: ${story.title}`}
        className="
          absolute right-1.5 top-1/2 -translate-y-1/2
          opacity-0 group-hover:opacity-100 focus:opacity-100
          p-1.5 rounded
          text-gray-400 hover:text-red-500
          transition-all
          focus:outline-none focus:ring-2 focus:ring-red-400
        "
      >
        {/* WCAG 1.3.1 – dekoratives Icon, Bedeutung via aria-label des Buttons */}
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}
