import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import type { Story, StoryDetailResponse } from '../types';

export function useStory(id: string | undefined) {
  return useQuery({
    queryKey: ['story', id],
    queryFn: async () => {
      const res = await client.get<StoryDetailResponse>(`/stories/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useGenerateStory() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (rawInput: string) =>
      client.post<{ story: Story }>('/stories', { rawInput }).then((r) => r.data.story),
    onSuccess: (story) => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      navigate(`/stories/${story.id}`);
    },
  });
}

export function useRefineStory(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (instruction: string) =>
      client
        .post<{ story: Story }>(`/stories/${id}/refine`, { instruction })
        .then((r) => r.data.story),
    onSuccess: (story) => {
      queryClient.setQueryData(['story', id], (old: StoryDetailResponse | undefined) => {
        if (!old) return old;
        return { ...old, story };
      });
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    },
  });
}
