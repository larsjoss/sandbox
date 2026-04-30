# AI Tools — Frontend (PO Suite)

React 18 + TypeScript + Vite Single-Page-Application. Vier Tools: **Story Generator** (User-Stories aus Anforderungen), **Text Polisher** (Rohtexte aufbereiten), **Test Case Generator** (Testpläne aus User Stories + Screenshots) und **Doc Generator** (fachtechnische Dokumentation für Confluence). Build läuft vollständig im Browser; kein Backend ausser der Anthropic API.

## Aktueller Stand

**Repo:** `larsjoss/sandbox` — **Branch:** `claude/review-project-status-i1G7u`

**Alle vier Module vollständig implementiert und getestet.** 189 Tests grün, Build sauber.

**Offene Aufgaben:**
- Merge des Feature-Branches in `main` + GitHub Pages Deployment prüfen
- Zusätzliche Tests: `DocGeneratorOutputPanel`, `docGenerator.ts` Service (buildUserText, Timeout)
- Evtl. Code-Splitting (Chunk > 500 kB, Vite-Warning)

**Wichtige Konventionen:**
- Modell überall: `claude-sonnet-4-5`
- Neues Tool anlegen: Service → Hook → Komponenten → Page → Navigation (App.tsx + TopNav + ToolSelectionPage)
- State-Machine-Pattern für neue Tools: `'input' | 'output'` wie TCG/DocGenerator
- Pflichtfeld-Validierung: Submit-Button `disabled`, kein Toast/Alert
- Fehlerbehandlung: `InlineError` im Formular (Input-Screen) und im Output-Panel (bei Regenerierung)
- Keine direkten sessionStorage-Zugriffe in Komponenten — nur via `getApiClient()`
- WCAG 2.1 AA: `focus-visible:ring-2 ring-brand`, `aria-live="polite"` auf `<span>` im Button, `tabIndex={-1}` + `useEffect` für Output-Fokus

## Entwicklung

```bash
npm install
npm run dev      # Vite Dev-Server auf http://localhost:5173
npm run build    # tsc + Vite Production Build
npm run preview  # Build lokal vorschauen
```

## Stack

| Layer | Technologie |
|---|---|
| UI | React 18, TypeScript, JSX |
| Styling | Tailwind CSS v3 (eigene Design-Tokens) |
| Routing | React Router v6 |
| Server-State | TanStack Query v5 (Mutations + Query-Invalidierung) |
| API | @anthropic-ai/sdk (`dangerouslyAllowBrowser: true`) |
| Persistenz | localStorage (Stories), sessionStorage (Auth + API-Key) |
| Markdown | react-markdown + rehype-sanitize |

## Auth

Hardcodierte Credentials in `src/context/AuthContext.tsx` (Prototype). Login setzt `session_user` + `anthropic_api_key` in sessionStorage. Logout löscht beides. Der API-Key ist optional beim Login; er kann nachträglich über das Settings-Dialog in der TopNav geändert werden.

## Ordnerstruktur

```
src/
├── App.tsx                     Router + ProtectedLayout (TopNav + Outlet)
├── index.css                   Global: focus-visible, tabpanel-fade, summary
├── main.tsx                    ReactDOM root, QueryClient, Provider-Stack
├── types/index.ts              Story, User, RefinementLog, Response-Typen
│
├── context/
│   └── AuthContext.tsx         Auth-State, login/logout, setApiKey
│
├── shared/
│   ├── services/
│   │   └── apiClient.ts        getApiClient(), extractTextContent()
│   └── components/             Shared Component Library (siehe unten)
│
├── services/
│   ├── claude.ts               Story Generator API (generate, refineWithHints, refine, formatStoryMarkdown)
│   ├── textPolisher.ts         Text Polisher API (polishText, 3 System-Prompts)
│   ├── testCaseGenerator.ts    Test Case Generator API (multimodal, buildJiraMarkdown, buildSingleTcMarkdown)
│   ├── docGenerator.ts         Doc Generator API (multimodal, buildStoryText, buildFeatureText)
│   └── storage.ts              localStorage CRUD für Stories + Refinements
│
├── hooks/
│   ├── useStory.ts             useStory, useGenerateStory, useRefineStoryWithHints, useRefineStory
│   ├── useStories.ts           useStories (Liste), useDeleteStory
│   ├── useTextPolisher.ts      usePolishText Mutation
│   ├── useTestCaseGenerator.ts useGenerateTestCases Mutation
│   ├── useDebounce.ts          useDebounce (debounced side-effect)
│   ├── useSessionState.ts      sessionStorage-backed useState
│   └── useDocGenerator.ts      useGenerateDoc Mutation
│
├── pages/
│   ├── AuthPage.tsx            Login-Seite → /tools
│   ├── ToolSelectionPage.tsx   Dashboard mit Tool-Cards
│   ├── WorkspacePage.tsx       Story Generator (3-Panel via AppShell)
│   ├── TextPolisherPage.tsx    Text Polisher (Split-View, Use-Case-Tabs)
│   ├── TestCaseGeneratorPage.tsx  Test Case Generator (2-Screen: Input → Output)
│   └── DocGeneratorPage.tsx    Doc Generator (2-Screen: Input → Output)
│
└── components/
    ├── auth/LoginForm.tsx
    ├── layout/AppShell.tsx     3-Spalten Desktop + Mobile Tabs (fade-animiert)
    ├── layout/TopNav.tsx       Tool-Nav, API-Key-Indikator, Settings, Logout
    ├── sidebar/                Sidebar, SearchBox, StoryListItem
    ├── story/                  StoryInputPanel, StoryOutputPanel, InsightsPanel
    ├── text-polisher/          TextPolisherInputPanel, TextPolisherOutputPanel,
    │                           UseCaseSelector, ToneSelector
    ├── test-case-generator/    TestCaseInputPanel, TestCaseOutputPanel,
    │                           TestCaseCard, TestCaseSummaryBlock,
    │                           TestCaseFilterBar, constants.ts
    └── doc-generator/          DocGeneratorInputPanel, DocGeneratorOutputPanel,
                                DocModeSelector
```

## Shared Component Library

`src/shared/components/` — alle via Barrel-Export `index.ts` importierbar.

| Komponente | Props (Auswahl) | Verwendung |
|---|---|---|
| `Button` | `variant` (primary/secondary/outline/ghost), `size` (sm/md), `loading`, `disabled` | Überall |
| `TextArea` | `rows`, `autoGrow` (auto-height via scrollHeight), `disabled` | Input-Panels |
| `CopyButton` | `text`, `label` | StoryOutputPanel, TextPolisherOutputPanel (vollbreiter Primary-Button am Ende des Outputs) |
| `LoadingSkeleton` | `lines` | Output- und Insights-Panel |
| `InlineError` | `message` | Formulare, Output-Panels |
| `SettingsDialog` | `open`, `onClose` | TopNav |
| `MarkdownOutput` | `children: string` | Beide Output-Panels |
| `PanelHeader` | `title`, `id?`, `action?` (ReactNode) | Alle 5 Panels |
| `RevealButton` | `show`, `onToggle`, `label` | LoginForm, SettingsDialog |
| `ScreenshotUpload` | `files`, `onChange`, `disabled`, `maxFiles` | TestCaseInputPanel, DocGeneratorInputPanel (max 3 Story / max 1 Feature) |

## Design-Tokens (Tailwind)

```
brand        #1C2B1E  (dark green) / brand-dark / brand-light #E8EFE9
canvas       #F5F0E8  (Hintergrund Seiten)
surface      #FAFAF8  (Karten, Panels, Inputs)
ink          #1C2420  / ink-secondary #5C5852 / ink-tertiary #6B6860
edge         #DDD8CF  (Rahmen) / edge-2 #EBE6DA (hover-Flächen)
font-serif   Playfair Display (Überschriften)
font-sans    Inter (Fliesstext)
```

## API-Klient

`src/shared/services/apiClient.ts`:
- `getApiClient()` — liest `anthropic_api_key` aus sessionStorage, wirft bei fehlendem Key
- `extractTextContent(content)` — filtert TextBlock-Typen aus der Anthropic-Response

Alle Services importieren ausschliesslich `getApiClient()` — kein direkter sessionStorage-Zugriff in Komponenten.

## Story Generator

**Modell:** `claude-sonnet-4-5`, `max_tokens: 2048`

**Output-Format:** Markdown-Template mit fixen Sektionen (`**Titel**`, `**Ausgangslage**`, `**Akzeptanzkriterien**`, `**Weitere Informationen**`, `**Refinement Hinweise**`). Die Sektion `**Refinement Hinweise**` wird beim Parsen (`claude.ts: parseOutput`) vom Haupt-Story-Text abgetrennt und separat in `Story.refinementHints` gespeichert.

**Refinement-Flow:**
1. `useRefineStoryWithHints` — übergibt beantwortete Hint-Paare (Frage + Antwort)
2. `useRefineStory` — freie Instruktion, baut vollständige Conversation-History auf

**Persistenz:** localStorage (`sg_stories`, `sg_refinements`). Keys sind `crypto.randomUUID()`.

## Text Polisher

**Modell:** `claude-sonnet-4-5`, `max_tokens: 2048`

**Use Cases:** `email` (dynamischer System-Prompt mit Ton-Parameter), `meeting` (Protokoll-Format), `freetext` (Lektor-Modus). Die drei System-Prompts verbieten explizit das Erfinden von Inhalten; unklare Stellen werden mit `[Prüfen]` markiert.

**Ton-Auswahl** (`formell` / `neutral` / `informell`) ist nur beim `email` Use-Case sichtbar.

**Output-Formate:**
- `email`: `Betreff: [Zeile]` (Zeile 1), Leerzeile, dann Fliesstext-Body (Anrede + Haupttext + Grussformel + `[Absender]`). Kein Markdown, keine Labels.
- `meeting`: Markdown-Protokoll mit Abschnitten `**Datum**`, `**Teilnehmer**`, `**Kernpunkte**`, `**Beschlüsse**`, `**Next Steps**` — nur Abschnitte mit vorhandenen Infos.
- `freetext`: Bullet Points (`•`), jeder auf eigener Zeile mit nachfolgender Leerzeile.

## Test Case Generator

**Modell:** `claude-sonnet-4-5`, `max_tokens: 4000`

**Multimodal:** Akzeptiert bis zu 3 Screenshots (PNG/JPG/WebP, max. 5 MB) als Base64-Image-Content-Blöcke. Erster Browser-Service in der Codebase mit Vision-Calls.

**Timeout:** 60 Sekunden via `Promise.race` (längerer Call als Story Generator wegen JSON-Ausgabe).

**Output:** JSON-Objekt (`TestPlan`) — kein Markdown. Code-Fence-Stripping im Parser (`/^```json\s*/i`).

**Input-Quellen:** `story_ak` (Pflichtfeld Story-Text), `screenshot` (optional), `test_context` (optionales Accordion).

**Export:** `buildJiraMarkdown(plan)` (vollständiger Plan), `buildSingleTcMarkdown(tc)` (einzelner TC).

**Filter:** Type-Chips + Level-Segmented-Control (interner State, kein Persist). "Alles kopieren" exportiert immer den ungefilterten Plan.

## Doc Generator

**Modell:** `claude-sonnet-4-5`, `max_tokens: 4000` (Story) / `6000` (Feature)

**Modi:** `story` (Story-Dokumentation) und `feature` (Feature-Dokumentation). Moduswahl via `DocModeSelector` (`role="tablist"`, Arrow-Key-Navigation).

**Multimodal:** Akzeptiert Screenshots als Base64-Image-Content-Blöcke (max. 3 für Story, max. 1 für Feature). Identisches Muster wie Test Case Generator.

**Timeout:** 60 Sekunden via `Promise.race`.

**Output:** Reines Markdown (kein JSON-Parsing). Sektionen des Outputs werden durch optionale Felder gesteuert — leere optionale Felder im Input führen dazu, dass die entsprechenden Sektionen im Output weggelassen werden.

**Pflichtfelder:** Story = Titel + Beschreibung; Feature = Titel + Beschreibung + Enthaltene Stories. Submit-Button ist `disabled` bis Pflichtfelder gefüllt.

**Fehlerbehandlung:** API-Fehler auf Input-Screen via `InlineError` (unter Submit-Button). Fehler nach "Neu generieren" auf Output-Screen via `error`-Prop in `DocGeneratorOutputPanel` (unter dem "Neu generieren"-Button).

**Layout:** 2-Screen State-Machine (`'input' | 'output'`) — konsistent mit TCG. Mode-Wechsel mit `window.confirm()` wenn Eingaben vorhanden.

**Typen:** `DocMode`, `StoryDocInput`, `FeatureDocInput`, `GenerateDocParams` (Discriminated Union) in `src/types/index.ts`.

**Service:** `src/services/docGenerator.ts` — `buildStoryText()`, `buildFeatureText()`, `generateDoc()`.

**Hook:** `src/hooks/useDocGenerator.ts` — `useGenerateDoc()` (TanStack Query `useMutation`).

## Accessibility (WCAG 2.1 AA)

- Skip-Link auf `#main-content` (App.tsx, erstes fokussierbares Element)
- `<header aria-label>`, `<main id="main-content">`, `role="region"` auf Output-Panels
- `role="tablist/tab"` in AppShell (Mobile), UseCaseSelector; Arrow-Key-Navigation
- `role="radiogroup/radio"` in ToneSelector; Arrow-Key-Navigation
- `role="alert" aria-live="assertive"` auf InlineError
- `role="status" aria-live="polite"` auf LoadingSkeleton und Refinement-Banner
- Programmatischer Fokus nach Generierung (beide Output-Panels, `tabIndex={-1}`)
- `RevealButton`: `min-h-[44px] min-w-[44px]` (WCAG 2.5.5 Touch Target)
- Fokus-Ring: weiss (`ring-white`) auf dunklem Brand-Hintergrund (ToneSelector aktiver Button)

## Tests

Vitest + @testing-library/react + jsdom. Konfiguration: `vitest.config.ts`, Setup: `src/test/setup.ts`.

```bash
npm run test          # Watch-Mode
npm run test:run      # Single-Run
npm run test:coverage # Coverage-Report
```

| Datei | Was getestet |
|---|---|
| `UseCaseSelector.test.tsx` | Tab-Rendering, ARIA, Keyboard-Navigation |
| `ToneSelector.test.tsx` | Radio-Gruppe, ARIA, Keyboard-Navigation |
| `useCopyToClipboard.test.ts` | copied-State, Timeout, Clipboard-API |
| `claude.test.ts` | `parseOutput` — Story/Hints-Trennung |
| `storage.test.ts` | localStorage CRUD für Stories + Refinements |
| `ScreenshotUpload.test.tsx` | Upload, Validierung, Remove, ARIA |
| `TestCaseCard.test.tsx` | Stammdaten, Flags, Copy |
| `TestCaseFilterBar.test.tsx` | Typ-Filter, Level-Filter, Ergebnis-Zähler |
| `DocModeSelector.test.tsx` | Tab-Rendering, ARIA, Keyboard-Navigation (ArrowLeft/Right/Home/End) |
| `DocGeneratorInputPanel.test.tsx` | Pflichtfelder Story/Feature, Ladezustand, Fehleranzeige, Moduswechsel |

**Gesamt: 189 Tests in 14 Test-Dateien** (Stand: Phase 6 + Review-Commit)

## Claude Code Konfiguration

**Hooks** (`.claude/settings.json`):

| Hook | Auslöser | Aktion |
|---|---|---|
| `SessionStart` | Sitzungsstart | `session-start.sh` — führt `npm install` aus, wenn `CLAUDE_CODE_REMOTE=true` |
| `PostToolUse` | Bash-Call mit `git commit*` | Automatischer Test-Run nach Commit; Ergebnis als `systemMessage` |

**Slash Commands** (`.claude/commands/`):

| Command | Zweck |
|---|---|
| `/new-component` | Konventionen für neue React-Komponenten (Design-Tokens, ARIA, Imports) |
| `/new-service` | Konventionen für neue API-Services (`getApiClient()`, Modell, max_tokens, Parsing) |

## Bekannte Einschränkungen

- **Auth ist ein Prototype**: Credentials werden aus `VITE_AUTH_EMAIL` / `VITE_AUTH_PASSWORD` gelesen (Fallback: hardcodierte Werte). Für Multi-User-Betrieb durch echte Authentifizierung ersetzen (Supabase empfohlen).
- **API-Key im Browser**: `dangerouslyAllowBrowser: true` — nur für Single-User-Prototypen geeignet.
- **Text Polisher Zustand**: Wird via `useSessionState` in sessionStorage persistiert — bleibt innerhalb einer Browser-Session erhalten, wird beim Tab-Schliessen verworfen.
- **Test Case Generator Zustand**: Ephemer (kein Persist). Screenshots sind nicht JSON-serialisierbar; State lebt nur in der aktuellen Page-Instanz.
