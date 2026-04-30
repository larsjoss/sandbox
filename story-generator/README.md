# PO Suite

KI-gestützte Tool-Suite für Product Owner — vier Werkzeuge, die den Sprint-Zyklus von der Story-Erstellung bis zur Sprintdokumentation abdecken.

**Live:** [larsjoss.github.io/sandbox](https://larsjoss.github.io/sandbox/)

## Tools

| Tool | Route | Beschreibung |
|---|---|---|
| **Story Generator** | `/tools/story-generator` | Wandelt Rohnotizen in strukturierte User Stories mit Akzeptanzkriterien und Refinement-Hinweisen um |
| **Text Polisher** | `/tools/text-polisher` | Bereitet E-Mails, Meeting-Notizen und Freitexte sprachlich und strukturell auf (3 Use Cases) |
| **Test Case Generator** | `/tools/test-case-generator` | Erstellt strukturierte Testpläne mit AK-Coverage aus User Stories — optional mit UI-Screenshots |
| **Doc Generator** | `/tools/doc-generator` | Generiert fachtechnische Confluence-Dokumentation für umgesetzte Stories und Features |

## Architektur

```
Browser
  ├── React 18 + TypeScript + Vite + Tailwind CSS v3 + TanStack Query v5
  ├── Anthropic SDK  → claude-sonnet-4-5 (direkt im Browser, dangerouslyAllowBrowser)
  └── localStorage   → Stories & Refinements  |  sessionStorage → Auth + API-Key
```

Vollständig clientseitig. Kein eigenes Backend. Der Anthropic API-Key wird nur in der laufenden Browser-Session (`sessionStorage`) gehalten.

## Lokale Entwicklung

```bash
cd story-generator/frontend
npm ci
npm run dev        # http://localhost:5173/sandbox/
npm test           # Vitest (189 Tests)
npm run build      # TypeScript + Vite Production Build
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

## Projektstruktur

```
story-generator/
├── frontend/               # React-App (wird deployed)
│   ├── src/
│   │   ├── shared/         # Shared Component Library + API-Client
│   │   ├── components/     # Tool-spezifische Komponenten
│   │   ├── context/        # AuthContext
│   │   ├── hooks/          # TanStack Query Mutations pro Tool
│   │   ├── pages/          # AuthPage, ToolSelectionPage, 4× Tool-Pages
│   │   ├── services/       # claude.ts, textPolisher.ts, testCaseGenerator.ts,
│   │   │                   # docGenerator.ts, storage.ts
│   │   └── types/          # Zentrales types/index.ts
│   ├── CLAUDE.md           # Detaillierte AI-Entwicklerdokumentation
│   └── vite.config.ts
├── backend/                # Express + Prisma (Referenzimplementierung, nicht deployed)
└── frontend-static/        # Vanilla-JS-Prototyp (historisch)
```

## Claude Code Setup

```
.claude/
├── settings.json           # Hooks: SessionStart (npm install), PostToolUse (Tests nach Commit)
├── hooks/
│   └── session-start.sh    # npm install wenn CLAUDE_CODE_REMOTE=true
└── commands/
    ├── new-component.md    # /new-component Slash-Command
    └── new-service.md      # /new-service Slash-Command
```
