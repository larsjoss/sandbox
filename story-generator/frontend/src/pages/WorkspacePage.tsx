import { useParams } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { StoryInputPanel } from '../components/story/StoryInputPanel';
import { StoryOutputPanel } from '../components/story/StoryOutputPanel';
import { InsightsPanel } from '../components/story/InsightsPanel';
import { useStory } from '../hooks/useStory';

export function WorkspacePage() {
  const { id } = useParams<{ id?: string }>();
  const { data, isLoading } = useStory(id);

  const story = data?.story;

  return (
    <AppShell
      leftPanel={<StoryInputPanel activeStory={story} />}
      centerPanel={<StoryOutputPanel story={story} isLoading={isLoading && !!id} />}
      rightPanel={<InsightsPanel story={story} isLoading={isLoading && !!id} />}
    />
  );
}
