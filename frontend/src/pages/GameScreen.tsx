import { useEffect, useRef, useCallback } from 'react';
import { Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGameTimer } from '../hooks/useGameTimer';
import { useGameState } from '../hooks/useGameState';
import { Operation } from '../backend';

interface GameScreenProps {
  onGameEnd: (score: number) => void;
}

const operationColors: Record<string, string> = {
  [Operation.addition]: 'text-neon',
  [Operation.subtraction]: 'text-orange-accent',
  [Operation.multiplication]: 'text-electric',
  [Operation.division]: 'text-pink-accent',
};

const operationLabels: Record<string, string> = {
  [Operation.addition]: 'Addition',
  [Operation.subtraction]: 'Subtraction',
  [Operation.multiplication]: 'Multiplication',
  [Operation.division]: 'Division',
};

export default function GameScreen({ onGameEnd }: GameScreenProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const gameEndedRef = useRef(false);

  const {
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
  } = useGameState();

  const handleTimeUp = useCallback(() => {
    if (!gameEndedRef.current) {
      gameEndedRef.current = true;
      endGame();
      onGameEnd(score);
    }
  }, [endGame, onGameEnd, score]);

  const { formattedTime, start: startTimer, progress, isUrgent } = useGameTimer(handleTimeUp);

  useEffect(() => {
    const init = async () => {
      await startGame();
      startTimer();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentProblem && !isLoadingProblem) {
      inputRef.current?.focus();
    }
  }, [currentProblem, isLoadingProblem]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitAnswer();
    }
  };

  const accuracy = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;
  const opKey = currentProblem?.operation ? String(currentProblem.operation) : '';
  const opColor = operationColors[opKey] || 'text-foreground';
  const opLabel = operationLabels[opKey] || '';

  return (
    <div className="min-h-screen bg-game-bg flex flex-col">
      {/* Top HUD */}
      <header className="px-4 pt-4 pb-2">
        <div className="max-w-lg mx-auto">
          {/* Timer bar */}
          <div className="relative h-2 bg-game-card rounded-full overflow-hidden mb-4 border border-game-border">
            <div
              className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-linear ${
                isUrgent
                  ? 'bg-destructive shadow-[0_0_8px_oklch(0.704_0.191_22.216/0.8)]'
                  : 'bg-neon shadow-[0_0_8px_oklch(0.85_0.22_145/0.5)]'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className={`font-display text-3xl font-black tabular-nums ${isUrgent ? 'text-destructive animate-pulse' : 'text-foreground'}`}>
                  {formattedTime}
                </div>
                <div className="text-muted-foreground text-xs uppercase tracking-wider">Time</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <img
                src="/assets/generated/mathsprint-logo.dim_256x256.png"
                alt="MathSprint"
                className="w-6 h-6 object-contain opacity-70"
              />
              <span className="font-display font-bold text-muted-foreground text-sm">
                Math<span className="text-neon">Sprint</span>
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="font-display text-3xl font-black text-neon tabular-nums">{score}</div>
                <div className="text-muted-foreground text-xs uppercase tracking-wider">Score</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main game area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-lg space-y-6">
          {/* Problem card */}
          <div
            className={`relative bg-game-card border rounded-2xl p-8 text-center transition-all duration-100 ${
              feedback === 'correct'
                ? 'border-neon shadow-[0_0_30px_oklch(0.85_0.22_145/0.4)]'
                : feedback === 'incorrect'
                ? 'border-destructive shadow-[0_0_30px_oklch(0.704_0.191_22.216/0.4)]'
                : 'border-game-border'
            }`}
          >
            {/* Operation badge */}
            {opLabel && (
              <div className={`absolute top-3 right-3 text-xs font-medium px-2 py-0.5 rounded-full bg-game-bg border border-game-border ${opColor}`}>
                {opLabel}
              </div>
            )}

            {/* Feedback flash */}
            {feedback && (
              <div
                className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-100 ${
                  feedback === 'correct' ? 'bg-neon/5' : 'bg-destructive/5'
                }`}
              />
            )}

            {isLoadingProblem || !currentProblem ? (
              <div className="flex items-center justify-center h-24">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-neon animate-bounce [animation-delay:0ms]" />
                  <div className="w-2 h-2 rounded-full bg-neon animate-bounce [animation-delay:150ms]" />
                  <div className="w-2 h-2 rounded-full bg-neon animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-display text-6xl font-black text-foreground tracking-tight leading-none">
                  {currentProblem.question}
                </p>
                <p className="text-muted-foreground text-sm">= ?</p>
              </div>
            )}
          </div>

          {/* Answer input */}
          <div className="space-y-3">
            <div className="relative">
              <Input
                ref={inputRef}
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Your answer..."
                disabled={isLoadingProblem || !currentProblem || !isGameActive}
                className="h-14 text-center text-2xl font-display font-bold bg-game-card border-game-border text-foreground placeholder:text-muted-foreground/50 rounded-xl focus:border-neon focus:ring-neon/30 focus:ring-2 transition-all duration-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                autoComplete="off"
                autoCorrect="off"
              />
            </div>

            <Button
              onClick={submitAnswer}
              disabled={isLoadingProblem || !currentProblem || answer.trim() === '' || !isGameActive}
              className="w-full h-12 font-display font-bold text-base bg-neon text-game-bg hover:bg-neon/90 rounded-xl transition-all duration-100 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:scale-100 shadow-[0_0_20px_oklch(0.85_0.22_145/0.3)]"
            >
              Submit Answer
              <span className="ml-2 text-game-bg/60 text-sm font-normal">↵ Enter</span>
            </Button>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-game-card border border-game-border rounded-xl p-3 text-center">
              <div className="font-display text-xl font-bold text-neon">{score}</div>
              <div className="text-muted-foreground text-xs mt-0.5">Correct</div>
            </div>
            <div className="bg-game-card border border-game-border rounded-xl p-3 text-center">
              <div className="font-display text-xl font-bold text-foreground">{totalAnswered}</div>
              <div className="text-muted-foreground text-xs mt-0.5">Answered</div>
            </div>
            <div className="bg-game-card border border-game-border rounded-xl p-3 text-center">
              <div className={`font-display text-xl font-bold ${accuracy >= 70 ? 'text-neon' : accuracy >= 40 ? 'text-orange-accent' : 'text-destructive'}`}>
                {accuracy}%
              </div>
              <div className="text-muted-foreground text-xs mt-0.5">Accuracy</div>
            </div>
          </div>

          {/* Tip */}
          <p className="text-center text-muted-foreground text-xs">
            <Target className="w-3 h-3 inline mr-1" />
            Type your answer and press <kbd className="px-1 py-0.5 bg-game-card border border-game-border rounded text-xs">Enter</kbd> or tap Submit
          </p>
        </div>
      </main>
    </div>
  );
}
