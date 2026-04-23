import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { StoryInputPanel } from '../components/story/StoryInputPanel';
import { StoryOutputPanel } from '../components/story/StoryOutputPanel';
import { InsightsPanel } from '../components/story/InsightsPanel';
import { useStory } from '../hooks/useStory';

export function WorkspacePage() {
  const { id } = useParams<{ id?: string }>();
  const { data, isLoading } = useStory(id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);

  const story = data?.story;

  return (
    <AppShell
      leftPanel={<StoryInputPanel onGeneratingChange={setIsGenerating} />}
      centerPanel={
        <StoryOutputPanel
          story={story}
          isLoading={isLoading && !!id}
          isGenerating={isGenerating}
          isRefining={isRefining}
        />
      }
      rightPanel={
        <InsightsPanel
          story={story}
          isLoading={isLoading && !!id}
          onRefiningChange={setIsRefining}
        />
      }
    />
  );
}
