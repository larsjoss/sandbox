Erstelle einen neuen API-Service für das Story-Generator-Frontend.

Argumente: $ARGUMENTS
(Erwartet: "<ServiceName> [multimodal]" — z.B. "sprintPlanner" oder "imageAnalyzer multimodal")

Zielpfad: src/services/<ServiceName>.ts

Pflichtkonventionen:

API-CLIENT
- Import ausschliesslich: import { getApiClient } from '../shared/services/apiClient'
- Kein direkter sessionStorage-Zugriff im Service
- Textextraktion via extractTextContent() aus apiClient

MODELL & LIMITS
- Modell: claude-sonnet-4-5
- max_tokens: 2048 (Standard) — 4000 nur wenn der Output strukturiertes JSON mit vielen Einträgen ist (wie TCG)
- Bei multimodal-Flag: Promise.race mit 60s Timeout hinzufügen

JSON-PARSING (nur wenn Output JSON ist)
- Code-Fence-Stripping vor JSON.parse:
  rawText.replace(/^```json\s*/i, '').replace(/\s*```$/, '')

STRUKTUR
- Eine Hauptfunktion die den API-Call macht
- System-Prompt als Konstante oberhalb der Funktion
- Kein State, keine React-Imports — reines TypeScript

Erstelle die Datei mit einem minimalen aber vollständigen Grundgerüst (System-Prompt als Platzhalter, korrekter API-Call-Aufbau, TypeScript-Typen für Input/Output).
