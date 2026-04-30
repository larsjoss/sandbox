import { useMutation } from '@tanstack/react-query';
import { generateGoals } from '../services/goalGenerator';
import type { GenerateGoalParams, GenerateGoalResult } from '../types';

export function useGenerateGoals() {
  return useMutation<GenerateGoalResult, Error, GenerateGoalParams>({
    mutationFn: generateGoals,
  });
}
