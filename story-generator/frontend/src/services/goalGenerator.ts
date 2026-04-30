import Anthropic from '@anthropic-ai/sdk';
import { getApiClient, extractTextContent } from '../shared/services/apiClient';
import type { GoalVariant, GenerateGoalParams, GenerateGoalResult, SprintGoalInput } from '../types';

// ─── System Prompts ───────────────────────────────────────────────────────────

const SPRINT_GOAL_SYSTEM_PROMPT = `Du bist ein erfahrener Agile Coach und Product Owner in einem Schweizer Versicherungsunternehmen, das im SAFe-Framework arbeitet. Du hilfst dabei, Sprint Goals outcome-orientiert zu formulieren.

Ein gutes Sprint Goal beschreibt nicht was gebaut wird, sondern welchen Nutzen Anwender oder das Business am Ende des Sprints haben. Es ist kurz (1–2 Sätze), fokussiert, prägnant und klar – kein Tasklist, keine Aufzählung von Deliverables.

Erstelle basierend auf dem folgenden Input 2–3 Varianten eines outcome-orientierten Sprint Goals auf Deutsch. Die Varianten sollen sich bedeutsam unterscheiden – in Fokus, Formulierung oder Perspektive.

Für jede Variante lieferst du:
1. Das Sprint Goal (1–2 Sätze)
2. Qualitätsbegründung: Warum ist dieser Vorschlag outcome-orientiert? (1–2 Sätze)
3. Schwachstelle: Wo könnte dieser Vorschlag noch schärfer oder konkreter sein? (1 Satz, nur wenn relevant)

Wenn ein Screenshot des Sprint Backlogs vorhanden ist, berücksichtige die sichtbaren Stories und Themen als zusätzlichen Kontext. Erfinde keine Inhalte, die nicht aus dem Input ableitbar sind.

Formatiere den Output klar strukturiert mit Variante 1, Variante 2, Variante 3.`;

// ─── Output-Parser ────────────────────────────────────────────────────────────

export function parseVariants(raw: string): GoalVariant[] {
  // Aufteilen auf "Variante N" Header — mit oder ohne ** Markdown
  const blocks = raw
    .split(/\n?\*{0,2}Variante\s+\d+\*{0,2}:?\s*\n+/im)
    .map((s) => s.trim())
    .filter(Boolean);

  if (blocks.length === 0) return [{ text: raw.trim(), rationale: '' }];

  return blocks.map(parseVariantBlock).filter((v) => v.text.length > 0);
}

function parseVariantBlock(block: string): GoalVariant {
  // Optionalen --- Trenner am Anfang entfernen
  const cleaned = block.replace(/^---\s*\n?/, '').trim();

  // Trennstelle "Qualitätsbegründung:" finden
  const qIdx = cleaned.search(/\nQualitätsbegründung:/i);
  if (qIdx === -1) return { text: cleaned, rationale: '' };

  const text = cleaned.slice(0, qIdx).trim();
  // "+1" überspringt das führende \n vor "Qualitätsbegründung:"
  const afterQ = cleaned.slice(qIdx + 1);

  // Trennstelle "Schwachstelle:" finden
  const sIdx = afterQ.search(/\nSchwachstelle:/i);

  if (sIdx === -1) {
    const rationale = afterQ.replace(/^Qualitätsbegründung:\s*/i, '').trim();
    return { text, rationale };
  }

  const rationale = afterQ.slice(0, sIdx).replace(/^Qualitätsbegründung:\s*/i, '').trim();
  const weakness = afterQ.slice(sIdx + 1).replace(/^Schwachstelle:\s*/i, '').trim() || undefined;

  return { text, rationale, weakness };
}

// ─── User-Message-Builder ─────────────────────────────────────────────────────

function buildSprintGoalUserText(input: SprintGoalInput): string {
  return `Sprint Goal Idee:\n${input.idea}`;
}

// ─── API-Call ─────────────────────────────────────────────────────────────────

export async function generateGoals(params: GenerateGoalParams): Promise<GenerateGoalResult> {
  if (params.mode === 'pi-objective') {
    // PI Objective folgt in Phase 5
    throw new Error('PI Objective wird in Kürze verfügbar sein.');
  }

  const client = getApiClient();

  const userText = buildSprintGoalUserText(params.input);
  const contentBlocks: Anthropic.Messages.ContentBlockParam[] = [
    { type: 'text', text: userText },
  ];

  if (params.screenshot) {
    const mediaType = params.screenshot.file.type as 'image/png' | 'image/jpeg' | 'image/webp';
    contentBlocks.push({
      type: 'image',
      source: { type: 'base64', media_type: mediaType, data: params.screenshot.base64 },
    });
  }

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () => reject(new Error('Zeitüberschreitung nach 60 Sekunden. Bitte erneut versuchen.')),
      60_000,
    ),
  );

  const apiCall = client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2000,
    system: SPRINT_GOAL_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: contentBlocks }],
  });

  const response = await Promise.race([apiCall, timeoutPromise]);
  const rawText = extractTextContent(response.content);

  if (!rawText.trim()) {
    throw new Error('Es konnten keine Varianten generiert werden. Bitte erneut versuchen.');
  }

  const variants = parseVariants(rawText);
  return { variants, rawText };
}
