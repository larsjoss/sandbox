import { getApiClient, extractTextContent } from '../shared/services/apiClient';

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
Jeden Punkt exakt mit einer dieser Kategorien am Zeilenanfang (Kategorie fett, dann Doppelpunkt, dann Text):
- **KRITISCH:** [Punkt, der für das Refinement unbedingt geklärt werden muss]
- **WICHTIG:** [Punkt, der wichtig aber nicht blockierend ist]
- **EMPFEHLUNG:** [Empfehlung zur Implementierung oder Vorgehensweise]
Wenn keine Punkte vorhanden: "Keine offenen Punkte identifiziert."`;

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface HintAnswer {
  hint: string;
  answer: string;
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

export function extractTitle(generatedStory: string, fallback: string): string {
  const match = /^\*\*Titel\*\*\s*[—–-]\s*(.+)$/m.exec(generatedStory);
  return match ? match[1].trim() : fallback.slice(0, 60);
}

export async function generateStory(
  rawInput: string,
): Promise<{ generatedStory: string; refinementHints: string }> {
  const client = getApiClient();
  const response = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: rawInput }],
  });
  return parseOutput(extractTextContent(response.content));
}

export async function refineStoryWithHints(
  currentStory: string,
  hintAnswers: HintAnswer[],
): Promise<{ generatedStory: string; refinementHints: string }> {
  const client = getApiClient();
  const pairs = hintAnswers
    .map(({ hint, answer }) => `[Hinweis]: ${hint}\n[Antwort]: ${answer}`)
    .join('\n\n');
  const userMessage =
    `Hier ist die aktuelle Story:\n\n${currentStory}\n\n` +
    `Bitte überarbeite die Story auf Basis der folgenden beantworteten Refinement-Hinweise. ` +
    `Behalte das bestehende Output-Template exakt bei.\n\nBeantwortete Hinweise:\n${pairs}`;
  const response = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  });
  return parseOutput(extractTextContent(response.content));
}

export async function refineStory(
  conversationHistory: ConversationMessage[],
): Promise<{ generatedStory: string; refinementHints: string }> {
  const client = getApiClient();
  const response = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: conversationHistory,
  });
  return parseOutput(extractTextContent(response.content));
}
