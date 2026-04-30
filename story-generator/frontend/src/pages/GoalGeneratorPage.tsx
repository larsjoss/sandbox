import { useState } from 'react';
import type { GoalMode } from '../types';
import { GoalTabSelector } from '../components/goal-generator/GoalTabSelector';

export function GoalGeneratorPage() {
  const [tab, setTab] = useState<GoalMode>('sprint-goal');

  // Wird in späteren Phasen auf echten Input/Output-State verdrahtet
  function hasContent(): boolean {
    return false;
  }

  function handleTabChange(newTab: GoalMode) {
    if (newTab === tab) return;
    if (hasContent() && !window.confirm('Beim Wechsel des Tabs gehen Eingaben und Output verloren. Fortfahren?')) {
      return;
    }
    setTab(newTab);
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
          <div
            id="gg-panel-sprint-goal"
            role="tabpanel"
            aria-labelledby="gg-tab-sprint-goal"
          >
            <Placeholder
              title="Sprint Goal"
              description="Formuliere outcome-orientierte Sprint Goals basierend auf deiner Idee und optionalem Backlog-Screenshot."
            />
          </div>
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
