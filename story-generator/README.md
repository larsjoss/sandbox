# Story Generator

KI-gestütztes Tool für Product Owner: Wandelt rohe Anforderungen (Notizen, Slack-Nachrichten, E-Mails) in entwicklungsreife User Stories um.

**Live:** [larsjoss.github.io/sandbox](https://larsjoss.github.io/sandbox/)

## Features

- Freitext-Eingabe → strukturierte User Story (Titel, Ausgangslage, Akzeptanzkriterien, Refinement Hinweise)
- Gezielte Refinement-Anweisungen per Multi-Turn-Conversation mit Verlauf
- Story-History mit Volltextsuche (localStorage, kein Backend nötig)
- 4-Panel-Layout: Sidebar | Input | Story | AI Insights
- Responsive: ARIA-Tablist-Navigation auf Mobile
- Copy-to-Clipboard
- WCAG 2.1 AA: Skip-Navigation, ARIA-Landmarks, Fokus-Management, Kontrast ≥ 4.5:1

## Architektur

```
Browser
  ├── React 18 + TypeScript + Vite + Tailwind CSS + TanStack Query
  ├── Anthropic SDK  → claude-sonnet-4-5 (direkt im Browser)
  └── localStorage   → Stories & Refinements (kein eigenes Backend)
```

Die App ist vollständig clientseitig. Der Anthropic API-Key wird
ausschliesslich in der Browser-Session (`sessionStorage`) gespeichert.

## Lokale Entwicklung

```bash
cd story-generator/frontend
npm ci
npm run dev   # http://localhost:5173/sandbox/
```

Beim ersten Anmelden: Login-Zugangsdaten und Anthropic API-Key (`sk-ant-…`) eingeben.
Den Key findest du unter [console.anthropic.com](https://console.anthropic.com).

## Deployment

GitHub Actions deployed automatisch auf GitHub Pages bei jedem Push auf `main`,
wenn Dateien unter `story-generator/frontend/**` geändert wurden.

```
main push → npm ci + npm run build → peaceiris/actions-gh-pages
```

Der Vite base-Pfad `/sandbox/` entspricht dem GitHub-Pages-Pfad des Repositories.

## AI System-Prompt

Festes Template, nicht durch den Nutzer veränderbar. Modell: `claude-sonnet-4-5`.

```
**Titel** — [kurzer, präziser Titel]

**Ausgangslage**
[Das Problem in klarer Sprache, 2–4 Sätze]

**Akzeptanzkriterien**
- AK-1: [testbares, spezifisches Kriterium]
...

**Weitere Informationen**
[Links, Kontext, Annahmen]

**Refinement Hinweise**
[Fehlende Infos und Empfehlungen für das Refinement-Meeting]
```

## Projektstruktur

```
story-generator/
├── frontend/               # React-App (wird deployed)
│   ├── src/
│   │   ├── components/     # UI-Komponenten (auth, layout, sidebar, story)
│   │   ├── context/        # AuthContext (sessionStorage)
│   │   ├── hooks/          # TanStack Query Hooks
│   │   ├── pages/          # AuthPage, WorkspacePage
│   │   ├── services/       # claude.ts (Anthropic API), storage.ts (localStorage)
│   │   └── types/          # TypeScript-Typen
│   └── vite.config.ts
├── backend/                # Express + Prisma (Referenzimplementierung, nicht deployed)
└── frontend-static/        # Vanilla-JS-Prototyp (historisch)
```
