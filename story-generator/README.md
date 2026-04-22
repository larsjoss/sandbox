# Story Generator

Wandelt rohe Anforderungen (Slack-Nachrichten, Notizen, E-Mails) per AI in entwicklungsreife User Stories mit Akzeptanzkriterien um.

## Stack

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS + TanStack Query
- **Backend**: Node.js + Express + Prisma + PostgreSQL
- **AI**: Anthropic Claude API (`claude-sonnet-4-5`), serverseitig
- **Auth**: JWT via HTTP-only Cookies + bcrypt

## Voraussetzungen

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Anthropic API Key (`sk-ant-...`)

## Schnellstart (Docker)

```bash
cd story-generator

# 1. Umgebungsvariablen konfigurieren
cp .env.example .env
# .env bearbeiten: JWT_SECRET und ANTHROPIC_API_KEY eintragen

# 2. Starten
docker compose up --build
```

Danach:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Prisma Studio**: `docker compose exec backend npm run db:studio` → http://localhost:5555

## Lokale Entwicklung (ohne Docker)

### Voraussetzungen
- Node.js 20+
- PostgreSQL lokal laufend

### Backend

```bash
cd backend
cp .env.example .env
# .env anpassen (DATABASE_URL, JWT_SECRET, ANTHROPIC_API_KEY)

npm install
npm run db:migrate    # Datenbankschema anlegen
npm run dev           # startet auf Port 3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev           # startet auf Port 5173
```

## Umgebungsvariablen

### Root `.env` (für Docker Compose)

| Variable | Beschreibung |
|---|---|
| `JWT_SECRET` | Langer, zufälliger String (mind. 32 Zeichen) |
| `ANTHROPIC_API_KEY` | Anthropic API Key (`sk-ant-...`) |

### `backend/.env` (für lokale Entwicklung)

| Variable | Beschreibung |
|---|---|
| `DATABASE_URL` | PostgreSQL-Verbindungsstring |
| `JWT_SECRET` | Langer, zufälliger String |
| `ANTHROPIC_API_KEY` | Anthropic API Key |
| `NODE_ENV` | `development` oder `production` |
| `PORT` | Backend-Port (Standard: `3001`) |
| `CORS_ORIGIN` | Frontend-URL (Standard: `http://localhost:5173`) |

## Features (MVP)

- Freitext-Eingabe → strukturierte User Story
- Festes Output-Template: Titel, Ausgangslage, Akzeptanzkriterien, Weitere Informationen, Refinement Hinweise
- Gezielte Refinement-Anweisungen (Multi-Turn-Conversation)
- Story-History mit Volltextsuche (serverseitig, PostgreSQL)
- E-Mail/Passwort-Authentifizierung
- 3-Panel-Layout (Input | Story | AI Insights)
- Copy-to-Clipboard

## AI System-Prompt

Der System-Prompt ist fest und nicht durch den Nutzer veränderbar:

> Du bist ein erfahrener Senior Software Engineer, der einem Product Owner dabei hilft, Anforderungen zu strukturieren. Du denkst kritisch wie jemand, der das Feature später implementieren muss. Du klärst Mehrdeutigkeiten, formulierst testbare Akzeptanzkriterien und identifizierst fehlende Informationen. Deine Outputs folgen immer exakt dem vorgegebenen Template. Sprache: Deutsch.

## Deployment

### Railway / Render (empfohlen)

1. Backend als Node.js-Service deployen (aus `story-generator/backend/`)
2. PostgreSQL-Addon anhängen
3. Umgebungsvariablen konfigurieren
4. Frontend als Static Site deployen (aus `story-generator/frontend/`, Build-Command: `npm run build`)

### VPS (Hetzner/DigitalOcean)

`docker compose up -d` auf dem Server, Nginx als Reverse Proxy vor Port 5173/3001.
