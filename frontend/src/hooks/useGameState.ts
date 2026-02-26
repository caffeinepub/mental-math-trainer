import { useState, useCallback, useRef, useEffect } from 'react';
import { useActor } from './useActor';
import type { Problem } from '../backend';

export function useGameState() {
  const { actor } = useActor();
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [isLoadingProblem, setIsLoadingProblem] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const actorRef = useRef(actor);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    actorRef.current = actor;
  }, [actor]);

  const fetchNextProblem = useCallback(async () => {
    const currentActor = actorRef.current;
    if (!currentActor) return;
    setIsLoadingProblem(true);
    try {
      const problem = await currentActor.generateProblem();
      setCurrentProblem(problem);
      setAnswer('');
    } catch (err) {
      console.error('Failed to fetch problem:', err);
    } finally {
      setIsLoadingProblem(false);
    }
  }, []);

  const startGame = useCallback(async () => {
    setScore(0);
    setTotalAnswered(0);
    setAnswer('');
    setFeedback(null);
    setIsGameActive(true);
    await fetchNextProblem();
  }, [fetchNextProblem]);

  const submitAnswer = useCallback(async () => {
    if (!currentProblem || answer.trim() === '' || isLoadingProblem) return;

    const userAnswer = parseInt(answer.trim(), 10);
    const correct = userAnswer === Number(currentProblem.correctAnswer);

    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    setTotalAnswered((prev) => prev + 1);
    if (correct) {
      setScore((prev) => prev + 1);
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }

    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedback(null);
    }, 400);

    await fetchNextProblem();
  }, [currentProblem, answer, isLoadingProblem, fetchNextProblem]);

  const endGame = useCallback(() => {
    setIsGameActive(false);
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
  }, []);

  return {
    currentProblem,
    answer,
    setAnswer,
    score,
    totalAnswered,
    isLoadingProblem,
    feedback,
    isGameActive,
    startGame,
    submitAnswer,
    endGame,
  };
}
