import { useState } from 'react';
import { Trophy, RotateCcw, Send, Medal, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetLeaderboard, useSubmitScore } from '../hooks/useQueries';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ResultsScreenProps {
  score: number;
  onPlayAgain: () => void;
}

const rankColors = ['text-yellow-400', 'text-slate-300', 'text-amber-600'];
const rankIcons = [
  <Trophy key="1" className="w-4 h-4 text-yellow-400" />,
  <Medal key="2" className="w-4 h-4 text-slate-300" />,
  <Medal key="3" className="w-4 h-4 text-amber-600" />,
];

function getScoreMessage(score: number): { title: string; subtitle: string } {
  if (score >= 40) return { title: 'Legendary!', subtitle: "You're a mental math machine!" };
  if (score >= 25) return { title: 'Excellent!', subtitle: 'Outstanding calculation speed!' };
  if (score >= 15) return { title: 'Great Job!', subtitle: 'Keep practicing to go faster!' };
  if (score >= 8) return { title: 'Good Start!', subtitle: 'Practice makes perfect!' };
  return { title: 'Keep Going!', subtitle: "Every expert was once a beginner!" };
}

export default function ResultsScreen({ score, onPlayAgain }: ResultsScreenProps) {
  const [playerName, setPlayerName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { data: leaderboard, isLoading: leaderboardLoading } = useGetLeaderboard();
  const submitScore = useSubmitScore();

  const { title, subtitle } = getScoreMessage(score);

  const handleSubmit = async () => {
    if (submitted) return;
    await submitScore.mutateAsync({ name: playerName.trim() || 'Anonymous', numCorrect: score });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-game-bg flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-game-border">
        <div className="flex items-center gap-2">
          <img
            src="/assets/generated/mathsprint-logo.dim_256x256.png"
            alt="MathSprint Logo"
            className="w-9 h-9 object-contain"
          />
          <span className="font-display text-xl font-bold text-foreground tracking-tight">
            Math<span className="text-neon">Sprint</span>
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onPlayAgain}
          className="text-muted-foreground hover:text-foreground gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          Play Again
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-8 overflow-y-auto">
        <div className="w-full max-w-lg space-y-6">
          {/* Score hero */}
          <div className="bg-game-card border border-game-border rounded-2xl p-8 text-center space-y-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-neon/5 to-transparent pointer-events-none" />
            <div className="relative">
              <div className="flex justify-center mb-3">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-neon/20 blur-xl scale-150" />
                  <div className="relative w-20 h-20 rounded-full bg-neon/10 border-2 border-neon/50 flex items-center justify-center">
                    <Star className="w-8 h-8 text-neon" />
                  </div>
                </div>
              </div>
              <h2 className="font-display text-2xl font-black text-foreground">{title}</h2>
              <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
              <div className="mt-4">
                <div className="font-display text-7xl font-black text-neon leading-none">
                  {score}
                </div>
                <div className="text-muted-foreground text-sm mt-1 uppercase tracking-widest">
                  Correct Answers
                </div>
              </div>
            </div>
          </div>

          {/* Submit score */}
          {!submitted ? (
            <div className="bg-game-card border border-game-border rounded-2xl p-5 space-y-3">
              <h3 className="font-display font-bold text-foreground flex items-center gap-2">
                <Trophy className="w-4 h-4 text-orange-accent" />
                Submit to Leaderboard
              </h3>
              <div className="flex gap-2">
                <Input
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Your name (optional)"
                  maxLength={30}
                  className="bg-game-bg border-game-border text-foreground placeholder:text-muted-foreground/50 rounded-lg focus:border-neon focus:ring-neon/30"
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <Button
                  onClick={handleSubmit}
                  disabled={submitScore.isPending}
                  className="bg-orange-accent text-game-bg hover:bg-orange-accent/90 rounded-lg font-bold px-4 shrink-0 transition-all duration-100"
                >
                  {submitScore.isPending ? (
                    <div className="w-4 h-4 border-2 border-game-bg/30 border-t-game-bg rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-neon/10 border border-neon/30 rounded-2xl p-4 text-center">
              <Zap className="w-5 h-5 text-neon mx-auto mb-1" />
              <p className="text-neon font-medium text-sm">Score submitted! Check the leaderboard below.</p>
            </div>
          )}

          {/* Leaderboard */}
          <div className="bg-game-card border border-game-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-game-border flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <h3 className="font-display font-bold text-foreground">Top 10 Leaderboard</h3>
            </div>

            {leaderboardLoading ? (
              <div className="p-8 text-center">
                <div className="flex justify-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-neon animate-bounce [animation-delay:0ms]" />
                  <div className="w-2 h-2 rounded-full bg-neon animate-bounce [animation-delay:150ms]" />
                  <div className="w-2 h-2 rounded-full bg-neon animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            ) : !leaderboard || leaderboard.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No scores yet. Be the first!
              </div>
            ) : (
              <ScrollArea className="max-h-72">
                <div className="divide-y divide-game-border">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={`${entry.name}-${index}`}
                      className={`flex items-center gap-3 px-5 py-3 transition-colors ${
                        index === 0 ? 'bg-yellow-400/5' : ''
                      }`}
                    >
                      <div className="w-7 flex items-center justify-center">
                        {index < 3 ? (
                          rankIcons[index]
                        ) : (
                          <span className={`font-display font-bold text-sm ${rankColors[index] || 'text-muted-foreground'}`}>
                            {index + 1}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm truncate ${index === 0 ? 'text-yellow-400' : 'text-foreground'}`}>
                          {entry.name}
                        </p>
                      </div>
                      <div className={`font-display font-black text-lg tabular-nums ${index === 0 ? 'text-yellow-400' : index < 3 ? rankColors[index] : 'text-neon'}`}>
                        {Number(entry.numCorrect)}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Play again CTA */}
          <Button
            onClick={onPlayAgain}
            className="w-full h-14 text-lg font-display font-bold bg-neon text-game-bg hover:bg-neon/90 rounded-xl shadow-[0_0_30px_oklch(0.85_0.22_145/0.4)] transition-all duration-100 hover:shadow-[0_0_40px_oklch(0.85_0.22_145/0.6)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Play Again
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-muted-foreground border-t border-game-border">
        <span>
          © {new Date().getFullYear()} MathSprint · Built with{' '}
          <span className="text-neon">♥</span> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'mathsprint')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon hover:underline"
          >
            caffeine.ai
          </a>
        </span>
      </footer>
    </div>
  );
}
