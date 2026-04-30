import type { FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { GoalMode, GoalVariant, SprintGoalInput, PiObjectiveInput, UploadedFile } from '../types';
import { useGenerateGoals } from '../hooks/useGoalGenerator';
import { GoalTabSelector } from '../components/goal-generator/GoalTabSelector';
import { SprintGoalInputPanel } from '../components/goal-generator/SprintGoalInputPanel';
import { PiObjectiveInputPanel } from '../components/goal-generator/PiObjectiveInputPanel';
import { GoalGeneratorOutputPanel } from '../components/goal-generator/GoalGeneratorOutputPanel';

const EMPTY_SPRINT: SprintGoalInput = { idea: '' };

const EMPTY_PI: PiObjectiveInput = {
  featureTitle: '',
  featureDescription: '',
  jiraReference: '',
  acceptedBy: '',
  acceptanceDate: '',
  acceptanceLevel: '',
};

export function GoalGeneratorPage() {
  const [tab, setTab] = useState<GoalMode>('sprint-goal');
  const [screen, setScreen] = useState<'input' | 'output'>('input');
  const [sprintInput, setSprintInput] = useState<SprintGoalInput>(EMPTY_SPRINT);
  const [screenshot, setScreenshot] = useState<UploadedFile | null>(null);
  const [piInput, setPiInput] = useState<PiObjectiveInput>(EMPTY_PI);
  const [variants, setVariants] = useState<GoalVariant[]>([]);

  const outputRef = useRef<HTMLDivElement>(null);
  const mutation = useGenerateGoals();

  // WCAG 2.4.3: Fokus auf Output-Bereich nach Screen-Transition
  useEffect(() => {
    if (screen === 'output') outputRef.current?.focus();
  }, [screen]);

  function hasContent(): boolean {
    if (tab === 'sprint-goal') return !!(sprintInput.idea.trim() || screenshot);
    return !!(piInput.featureTitle.trim() || piInput.featureDescription.trim());
  }

  function handleTabChange(newTab: GoalMode) {
    if (newTab === tab) return;
    const hasAny = hasContent() || screen === 'output';
    if (hasAny && !window.confirm('Beim Wechsel des Tabs gehen Eingaben und Output verloren. Fortfahren?')) {
      return;
    }
    setTab(newTab);
    setScreen('input');
    setSprintInput(EMPTY_SPRINT);
    setScreenshot(null);
    setPiInput(EMPTY_PI);
    setVariants([]);
    mutation.reset();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const result = await mutation.mutateAsync(
        tab === 'sprint-goal'
          ? { mode: 'sprint-goal', input: sprintInput, screenshot }
          : { mode: 'pi-objective', input: piInput },
      );
      setVariants(result.variants);
      setScreen('output');
    } catch {
      // Fehler liegt in mutation.error — wird im InputPanel als InlineError angezeigt
    }
  }

  async function handleRegenerate() {
    try {
      const result = await mutation.mutateAsync(
        tab === 'sprint-goal'
          ? { mode: 'sprint-goal', input: sprintInput, screenshot }
          : { mode: 'pi-objective', input: piInput },
      );
      setVariants(result.variants);
    } catch {
      // Fehler liegt in mutation.error — wird im OutputPanel als InlineError angezeigt
    }
  }

  function handleReset() {
    if (!window.confirm('Formular und Output zurücksetzen?')) return;
    setScreen('input');
    setSprintInput(EMPTY_SPRINT);
    setScreenshot(null);
    setPiInput(EMPTY_PI);
    setVariants([]);
    mutation.reset();
  }

  if (screen === 'output') {
    return (
      <GoalGeneratorOutputPanel
        variants={variants}
        isLoading={mutation.isPending}
        error={mutation.error}
        onRegenerate={handleRegenerate}
        onReset={handleReset}
        contentRef={outputRef}
      />
    );
  }

  return (
    <main id="main-content" className="flex-1 overflow-auto bg-canvas">
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink mb-1">Goal Generator</h1>
          <p className="text-sm text-ink-secondary">
            Outcome-orientierte Sprint Goals und PI Objectives formulieren.
          </p>
        </div>

        <GoalTabSelector
          value={tab}
          onChange={handleTabChange}
          disabled={mutation.isPending}
        />

        {tab === 'sprint-goal' ? (
          <SprintGoalInputPanel
            input={sprintInput}
            screenshot={screenshot}
            isLoading={mutation.isPending}
            error={mutation.error}
            onChange={(patch) => setSprintInput((prev) => ({ ...prev, ...patch }))}
            onScreenshotChange={setScreenshot}
            onSubmit={handleSubmit}
          />
        ) : (
          <PiObjectiveInputPanel
            input={piInput}
            isLoading={mutation.isPending}
            error={mutation.error}
            onChange={(patch) => setPiInput((prev) => ({ ...prev, ...patch }))}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </main>
  );
}
