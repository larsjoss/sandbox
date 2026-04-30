import { useMutation } from '@tanstack/react-query';
import { generateGoals, refineGoal } from '../services/goalGenerator';
import type {
  GenerateGoalParams,
  GenerateGoalResult,
  RefineSprintGoalParams,
  RefineGoalResult,
} from '../types';

export function useGenerateGoals() {
  return useMutation<GenerateGoalResult, Error, GenerateGoalParams>({
    mutationFn: generateGoals,
  });
}

export function useRefineGoal() {
  return useMutation<RefineGoalResult, Error, RefineSprintGoalParams>({
    mutationFn: refineGoal,
  });
}
