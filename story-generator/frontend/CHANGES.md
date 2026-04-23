# Accessibility & Responsive Improvements

All changes target WCAG 2.1 Level AA compliance.

---

## Round 1 – API-Key-Integration, Mobile Layout, Ladeindikator

### API-Key-Feld im Login-Formular (`LoginForm.tsx`)
- Drittes Feld (type=password) mit Sichtbarkeits-Toggle hinzugefügt.
- Key wird nach Login in `sessionStorage` gespeichert (nicht localStorage – Tab-Session-Scope).
- `AuthContext.tsx`: `login(email, password, apiKey?)` Signatur erweitert; `apiKey`-State und `setApiKey()` ergänzt.
- `api/client.ts`: Request-Interceptor injiziert `X-Anthropic-Api-Key`-Header aus sessionStorage.

### Status-Indikator & Settings-Dialog (`Sidebar.tsx`, `SettingsDialog.tsx`)
- Header-Input entfernt; stattdessen grüner Punkt + «API verbunden»-Text im Sidebar-Header.
- `<dialog>`-Element mit `showModal()` für nativen Focus-Trap; Escape-Taste über `cancel`-Event abgefangen.
- Gear-Icon-Button öffnet Dialog für In-Session-Key-Wechsel.

### Mobile Responsive Layout (`AppShell.tsx`)
- Unter 768 px: ARIA-Tablist-Pattern mit drei Tabs (Anforderung / Story / Refinement).
- Tastatur-Navigation: Arrow-Links/Rechts, Home, End wechseln aktiven Tab (WCAG 2.1.1 Keyboard).
- `aria-selected`, `role="tab"`, `role="tabpanel"`, `id`/`aria-controls`-Verknüpfung korrekt gesetzt.

### Ladeindikator (`StoryInputPanel.tsx`, `StoryOutputPanel.tsx`)
- `aria-busy={isGenerating}` auf Submit-Button und Output-Div.
- Spinner-`<span>` mit `aria-hidden="true"` (dekorativ).
- Nach Abschluss der Generierung: programmatischer `.focus()` auf Output-Div (WCAG 2.4.3 Focus Order).

---

## Round 4 – Client-Side Auth (`AuthContext.tsx`, `LoginForm.tsx`)
- Backend-Authentifizierung entfernt; hardcodierter Client-Check (E-Mail + Passwort).
- Session-User in `sessionStorage` (nicht localStorage) – wird beim Tab-Schliessen geleert.
- Register-Link aus LoginForm entfernt.
- Fehlerbehandlung: `err instanceof Error ? err.message : 'Login fehlgeschlagen'` statt `axios.isAxiosError`.

---

## Round 5 – Formular-Accessibility, Kontrast, Landmarks, Touch-Targets

### WCAG 1.3.1 – Info and Relationships
- `LoginForm.tsx`: Alle Inputs haben jetzt `<label htmlFor>` statt reinem `placeholder`.
- `StoryInputPanel.tsx`: Beide Textareas mit `<label htmlFor>` (sr-only) + `aria-describedby` auf Hinweistext.
- `SettingsDialog.tsx`: `<label htmlFor="settings-apikey">` für das API-Key-Feld.

### WCAG 1.4.3 – Contrast (Minimum, AA: 4.5:1 Normal Text)
- Spalten-Header «ANFORDERUNG», «STORY», «REFINEMENT-ANWEISUNG»: `text-gray-400` (2.35:1 ✗) → `text-gray-600` (7.56:1 ✓).
- Placeholder-Farbe: `placeholder:text-gray-400` → `placeholder:text-gray-500` (4.83:1 ✓).

### WCAG 2.4.3 / 4.1.2 – Landmark-Struktur
- `AuthPage.tsx`: `<main aria-label="Anmeldung">` Landmark ergänzt.
- `AppShell.tsx`: `<main id="main-content">` wrapping all content panels (Skip-Link-Ziel).
- `Sidebar.tsx`: `<nav aria-label="Gespeicherte Stories">` um Story-Liste.

### WCAG 2.5.5 / 2.5.8 – Touch Target Size (min 44×44 px)
- Settings-Icon-Button: `min-h-[44px] min-w-[44px]` ergänzt.
- Abmelden-Button: `min-h-[44px] px-3` ergänzt.
- RevealButton in `LoginForm.tsx` und `SettingsDialog.tsx`: `min-h-[44px] min-w-[44px] flex items-center justify-center`.

---

## Round 6 – Fokus-Management, Screenreader-Texte, Skip Navigation

### WCAG 2.4.1 – Bypass Blocks (`App.tsx`)
- Skip-Navigation-Link `<a href="#main-content">` als erstes gerenderte Element eingefügt.
- Versteckt per `sr-only`; sichtbar bei Fokus via `focus:not-sr-only focus:fixed ...`.
- Ziel: `<main id="main-content">` in `AppShell.tsx`.

**Tab-Flow (Desktop):**
1. Skip-Link (sichtbar bei erstem Tab)
2. Settings-Icon (Sidebar-Header)
3. Abmelden-Button (Sidebar-Header)
4. Suchfeld (Sidebar)
5. Story-Listeneinträge (Navigations-Button → Löschen-Button je Eintrag)
6. Anforderung-Textarea
7. «Story generieren»-Button
8. Refinement-Textarea (nur wenn Story aktiv)
9. «Story verfeinern»-Button (nur wenn Story aktiv)
10. «Story kopieren»-Button (Output-Header)
11. Output-Div (tabIndex=-1, nur programmatisch fokussiert nach Generierung)

### WCAG 2.4.7 / 2.4.11 – Focus Visible (`index.css`)
- Globaler `:focus-visible`-Fallback: `outline: 2px solid #6366f1; outline-offset: 2px`.
- Greift für alle Elemente, die kein komponentenspezifisches `focus:ring-*` haben.

### WCAG 1.3.1 – Decorative Icons (`CopyButton.tsx`, `SearchBox.tsx`, `StoryListItem.tsx`, `SettingsDialog.tsx`)
- Alle dekorativen SVG-Icons mit `aria-hidden="true"` versehen.
- Bedeutung der Icons wird ausschliesslich über `aria-label` des übergeordneten Buttons kommuniziert.

### WCAG 4.1.2 – Name, Role, Value (`CopyButton.tsx`)
- `aria-label` dynamisch: «Story kopieren» / «Story kopiert».
- `aria-live="polite"` auf Button: Screenreader liest Zustandsänderung vor.

### WCAG 4.1.2 – Name, Role, Value (`SearchBox.tsx`)
- `aria-label="Stories durchsuchen"` auf Input (kein visuelles Label, aber programmatisch korrekt).

### WCAG 4.1.1 – Parsing / No Nested Interactives (`StoryListItem.tsx`)
- **Kritischer Fix**: `<button>` enthielt zuvor einen weiteren `<button>` (Löschen) → invalides HTML.
- Lösung: Äusserer Container ist jetzt `<div role="listitem">` mit `position: relative`.
  - Navigations-Button und Löschen-Button sind Geschwister, nicht verschachtelt.
- Löschen-Button: `opacity-0 group-hover:opacity-100 focus:opacity-100` – bei Tastatur-Fokus sichtbar (vorher unsichtbar-aber-fokussierbar → WCAG 2.4.7 Verstoß).
- `aria-label="Story öffnen: {title}"` auf Navigations-Button.
- `aria-label="Story löschen: {title}"` auf Löschen-Button.
- `aria-current="page"` auf aktivem Navigations-Button.

### WCAG 2.4.7 – Focus Visible (`StoryOutputPanel.tsx`)
- Output-Div: `focus:outline-none` → `outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset`.
- `tabIndex={-1}`: Nur programmatisch fokussierbar (nach Story-Generierung), nicht per Tab erreichbar.
- `focus-visible:` verhindert sichtbaren Ring bei Maus-Klick (`.focus()` via JS löst `:focus-visible` je nach Browser aus).
