Erstelle eine neue React-Komponente für das Story-Generator-Frontend.

Argumente: $ARGUMENTS
(Erwartet: "<KomponentenName> <kategorie>" — z.B. "ConfirmDialog story" oder "ExportButton shared")

Kategorien und Zielpfade:
- shared    → src/shared/components/<Name>.tsx  (+ Export in src/shared/components/index.ts ergänzen)
- auth      → src/components/auth/<Name>.tsx
- layout    → src/components/layout/<Name>.tsx
- sidebar   → src/components/sidebar/<Name>.tsx
- story     → src/components/story/<Name>.tsx
- text-polisher → src/components/text-polisher/<Name>.tsx
- test-case-generator → src/components/test-case-generator/<Name>.tsx

Pflichtkonventionen — halte diese ohne Ausnahme ein:

STYLING
- Ausschliesslich Design-Tokens: brand/brand-dark/brand-light, canvas, surface, ink/ink-secondary/ink-tertiary, edge/edge-2
- Keine hardcodierten Hex-Farben in der Komponente
- Fokusring: focus-visible:ring-2 (NICHT focus:ring-2)

ACCESSIBILITY
- aria-live="polite/assertive" NIE direkt auf <button> — immer auf einem inneren <span>
- Akkordeons / Disclosure: <details>/<summary> bevorzugen statt eigenem State
- Radiogruppen: role="radiogroup" + role="radio" + Arrow-Key-Navigation (Muster aus ToneSelector)
- Touch-Targets: min-h-[44px] min-w-[44px] für interaktive Elemente (WCAG 2.5.5)
- Programmatischer Fokus nach asynchroner Aktion: tabIndex={-1} auf Ziel-Element + useEffect mit ref.current?.focus()

IMPORTS
- Shared-Komponenten ausschliesslich via Barrel-Export: import { Button, TextArea } from '@/shared/components'
- Keine direkten Pfad-Imports aus shared/components/<Datei>

TYPESCRIPT
- Props-Interface direkt über der Komponente definieren
- Keine any-Typen

Erstelle die Datei, füge bei Kategorie "shared" den Export in index.ts ein, und zeige den finalen Code.
