import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from '../api/client';
import type { StoriesResponse } from '../types';

export function useStories(q: string) {
  return useQuery({
    queryKey: ['stories', q],
    queryFn: async () => {
      const params = q.trim() ? { q } : {};
      const res = await client.get<StoriesResponse>('/stories', { params });
      return res.data;
    },
  });
}

export function useDeleteStory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => client.delete(`/stories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    },
  });
}
