import type { FormEvent } from 'react';
import { useState } from 'react';
import type { GoalMode, SprintGoalInput, UploadedFile } from '../types';
import { GoalTabSelector } from '../components/goal-generator/GoalTabSelector';
import { SprintGoalInputPanel } from '../components/goal-generator/SprintGoalInputPanel';

const EMPTY_SPRINT: SprintGoalInput = { idea: '' };

export function GoalGeneratorPage() {
  const [tab, setTab] = useState<GoalMode>('sprint-goal');
  const [sprintInput, setSprintInput] = useState<SprintGoalInput>(EMPTY_SPRINT);
  const [screenshot, setScreenshot] = useState<UploadedFile | null>(null);

  function hasContent(): boolean {
    if (tab === 'sprint-goal') return !!(sprintInput.idea.trim() || screenshot);
    return false; // PI Objective folgt in Phase 3
  }

  function handleTabChange(newTab: GoalMode) {
    if (newTab === tab) return;
    if (hasContent() && !window.confirm('Beim Wechsel des Tabs gehen Eingaben und Output verloren. Fortfahren?')) {
      return;
    }
    setTab(newTab);
    setSprintInput(EMPTY_SPRINT);
    setScreenshot(null);
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
          <div
            id="gg-panel-pi-objective"
            role="tabpanel"
            aria-labelledby="gg-tab-pi-objective"
          >
            <Placeholder
              title="PI Objective"
              description="Generiere strukturierte PI Objectives aus ART-Feature Titel, Beschreibung und optionalen Abnahme-Informationen."
            />
          </div>
        )}
      </div>
    </main>
  );
}

function Placeholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-edge bg-surface px-8 py-12 text-center">
      <p className="font-serif text-base font-semibold text-ink mb-2">{title}</p>
      <p className="text-sm text-ink-tertiary max-w-sm mx-auto">{description}</p>
    </div>
  );
}
