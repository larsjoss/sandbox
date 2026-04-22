import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config';

const anthropic = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Du bist ein erfahrener Senior Software Engineer, der einem Product Owner dabei hilft, Anforderungen zu strukturieren. Du denkst kritisch wie jemand, der das Feature später implementieren muss. Du klärst Mehrdeutigkeiten, formulierst testbare Akzeptanzkriterien und identifizierst fehlende Informationen. Deine Outputs folgen immer exakt dem vorgegebenen Template. Sprache: Deutsch.

Dein Output folgt IMMER exakt diesem Template — ohne Abweichungen:

**Titel** — [kurzer, präziser Titel]

**Ausgangslage**
[Das Problem in klarer Sprache, 2-4 Sätze]

**Akzeptanzkriterien**
- AK-1: [testbares, spezifisches Kriterium]
- AK-2: [testbares, spezifisches Kriterium]
[weitere AKs nach Bedarf]

**Weitere Informationen**
[Links aus dem Input unverändert übernehmen. Kontext, Annahmen, technische Hinweise.]

**Refinement Hinweise**
[Fehlende Informationen, Warnungen und Empfehlungen für das Refinement-Meeting. Wenn keine vorhanden: "Keine offenen Punkte identifiziert."]`;

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

function parseOutput(text: string): { generatedStory: string; refinementHints: string } {
  const parts = text.split(/^\*\*Refinement Hinweise\*\*/m);
  if (parts.length >= 2) {
    return {
      generatedStory: parts[0].trim(),
      refinementHints: parts.slice(1).join('**Refinement Hinweise**').trim(),
    };
  }
  return { generatedStory: text.trim(), refinementHints: '' };
}

export async function generateStory(
  rawInput: string,
): Promise<{ generatedStory: string; refinementHints: string }> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: rawInput }],
  });

  const text = response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');

  return parseOutput(text);
}

export async function refineStory(
  conversationHistory: ConversationMessage[],
): Promise<{ generatedStory: string; refinementHints: string }> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: conversationHistory,
  });

  const text = response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');

  return parseOutput(text);
}

export function extractTitle(generatedStory: string, fallback: string): string {
  const match = /^\*\*Titel\*\*\s*[—–-]\s*(.+)$/m.exec(generatedStory);
  return match ? match[1].trim() : fallback.slice(0, 60);
}
