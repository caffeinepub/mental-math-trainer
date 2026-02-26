import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Problem, Score } from '../backend';

export function useGenerateProblem(enabled: boolean) {
  const { actor, isFetching } = useActor();

  return useQuery<Problem>({
    queryKey: ['problem', Date.now()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not ready');
      return actor.generateProblem();
    },
    enabled: !!actor && !isFetching && enabled,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
}

export function useGetLeaderboard() {
  const { actor, isFetching } = useActor();

  return useQuery<Score[]>({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitScore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, numCorrect }: { name: string; numCorrect: number }) => {
      if (!actor) throw new Error('Actor not ready');
      await actor.submitScore(name, BigInt(numCorrect));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
  });
}
