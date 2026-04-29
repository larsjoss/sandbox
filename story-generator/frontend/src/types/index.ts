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

// ─── Test Case Generator ─────────────────────────────────────────────────────

export type TestCaseType =
  | 'happy_path'
  | 'unhappy_path'
  | 'edge_case'
  | 'ui_responsiveness'
  | 'multilingual'
  | 'analytics'
  | 'backwards_compatibility'
  | 'accessibility';

export type TestLevel = 'ENTW' | 'INTG' | 'ENTW+INTG';
export type TestCaseSource = 'story_ak' | 'screenshot' | 'test_context' | 'model_addition';
export type FlagType = 'open_question' | 'dependency' | 'risk' | 'assumption';

export interface TestCaseFlag {
  type: FlagType;
  message: string;
}

export interface TestCaseStep {
  step: number;
  action: string;
}

export interface TestCase {
  id: string;
  title: string;
  type: TestCaseType;
  level: TestLevel;
  preconditions: string[];
  steps: TestCaseStep[];
  expected_result: string;
  linked_aks: string[];
  source: TestCaseSource;
  flag?: TestCaseFlag;
}

export interface AkCoverage {
  ak_id: string;
  covered: boolean;
  tc_count: number;
}

export interface TestPlanSummary {
  total_count: number;
  by_type: Partial<Record<TestCaseType, number>>;
  by_level: Partial<Record<TestLevel, number>>;
  ak_coverage: AkCoverage[];
  gaps: string[];
  risk_flags: string[];
}

export interface TestPlan {
  story_id: string | null;
  story_title: string;
  generated_at: string;
  input_sources: {
    has_screenshot: boolean;
    has_test_context: boolean;
    screenshot_count: number;
  };
  test_cases: TestCase[];
  summary: TestPlanSummary;
}

export interface UploadedFile {
  id: string;
  file: File;
  previewUrl: string; // URL.createObjectURL — bei Remove/Unmount revoken
  base64: string;     // reines Base64 ohne data-URL-Präfix
}
