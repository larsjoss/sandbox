export interface User {
  id: string;
  email: string;
}

export interface Story {
  id: string;
  userId: string;
  title: string;
  rawInput: string;
  generatedStory: string;
  refinementHints: string;
  createdAt: string;
  updatedAt: string;
}

export interface RefinementLog {
  id: string;
  storyId: string;
  instruction: string;
  resultStory: string;
  createdAt: string;
}

export interface StoriesResponse {
  stories: Story[];
  total: number;
}

export interface StoryDetailResponse {
  story: Story;
  refinements: RefinementLog[];
}
