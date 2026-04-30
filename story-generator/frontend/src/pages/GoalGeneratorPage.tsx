import type { FormEvent } from 'react';
import { useState } from 'react';
import type { GoalMode, SprintGoalInput, PiObjectiveInput, UploadedFile } from '../types';
import { GoalTabSelector } from '../components/goal-generator/GoalTabSelector';
import { SprintGoalInputPanel } from '../components/goal-generator/SprintGoalInputPanel';
import { PiObjectiveInputPanel } from '../components/goal-generator/PiObjectiveInputPanel';

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
  const [sprintInput, setSprintInput] = useState<SprintGoalInput>(EMPTY_SPRINT);
  const [screenshot, setScreenshot] = useState<UploadedFile | null>(null);
  const [piInput, setPiInput] = useState<PiObjectiveInput>(EMPTY_PI);

  function hasContent(): boolean {
    if (tab === 'sprint-goal') return !!(sprintInput.idea.trim() || screenshot);
    return !!(piInput.featureTitle.trim() || piInput.featureDescription.trim());
  }

  function handleTabChange(newTab: GoalMode) {
    if (newTab === tab) return;
    if (hasContent() && !window.confirm('Beim Wechsel des Tabs gehen Eingaben und Output verloren. Fortfahren?')) {
      return;
    }
    setTab(newTab);
    setSprintInput(EMPTY_SPRINT);
    setScreenshot(null);
    setPiInput(EMPTY_PI);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // API-Call folgt in Phase 4
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

        <GoalTabSelector value={tab} onChange={handleTabChange} />

        {tab === 'sprint-goal' ? (
          <SprintGoalInputPanel
            input={sprintInput}
            screenshot={screenshot}
            isLoading={false}
            error={null}
            onChange={(patch) => setSprintInput((prev) => ({ ...prev, ...patch }))}
            onScreenshotChange={setScreenshot}
            onSubmit={handleSubmit}
          />
        ) : (
          <PiObjectiveInputPanel
            input={piInput}
            isLoading={false}
            error={null}
            onChange={(patch) => setPiInput((prev) => ({ ...prev, ...patch }))}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </main>
  );
}
