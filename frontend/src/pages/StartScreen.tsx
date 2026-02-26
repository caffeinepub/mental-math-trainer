import { Zap, Clock, Hash, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StartScreenProps {
  onStart: () => void;
}

const operations = [
  { symbol: '+', label: 'Addition', color: 'text-neon' },
  { symbol: '−', label: 'Subtraction', color: 'text-orange-accent' },
  { symbol: '×', label: 'Multiplication', color: 'text-neon' },
  { symbol: '÷', label: 'Division', color: 'text-orange-accent' },
];

export default function StartScreen({ onStart }: StartScreenProps) {
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
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
          <Trophy className="w-4 h-4 text-orange-accent" />
          <span>Mental Math Trainer</span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg text-center space-y-8">
          {/* Logo + Title */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-neon/20 blur-2xl scale-150" />
                <img
                  src="/assets/generated/mathsprint-logo.dim_256x256.png"
                  alt="MathSprint"
                  className="relative w-24 h-24 object-contain drop-shadow-[0_0_20px_oklch(0.85_0.22_145/0.6)]"
                />
              </div>
            </div>
            <div>
              <h1 className="font-display text-6xl font-black tracking-tight text-foreground">
                Math<span className="text-neon">Sprint</span>
              </h1>
              <p className="mt-2 text-muted-foreground text-lg">
                How fast can you calculate?
              </p>
            </div>
          </div>

          {/* Rules card */}
          <div className="bg-game-card border border-game-border rounded-2xl p-6 space-y-4 text-left">
            <h2 className="font-display font-bold text-foreground text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-neon" />
              How to Play
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-neon/10 border border-neon/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 text-neon" />
                </div>
                <div>
                  <p className="text-foreground font-medium text-sm">2-Minute Challenge</p>
                  <p className="text-muted-foreground text-sm">Answer as many problems as you can before time runs out.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-accent/10 border border-orange-accent/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Hash className="w-4 h-4 text-orange-accent" />
                </div>
                <div>
                  <p className="text-foreground font-medium text-sm">All Four Operations</p>
                  <p className="text-muted-foreground text-sm">Addition, subtraction, multiplication, and division — all mixed in.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-neon/10 border border-neon/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Trophy className="w-4 h-4 text-neon" />
                </div>
                <div>
                  <p className="text-foreground font-medium text-sm">Score & Leaderboard</p>
                  <p className="text-muted-foreground text-sm">Each correct answer earns a point. Submit your score to the global leaderboard.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Operations preview */}
          <div className="grid grid-cols-4 gap-3">
            {operations.map((op) => (
              <div
                key={op.symbol}
                className="bg-game-card border border-game-border rounded-xl py-3 flex flex-col items-center gap-1"
              >
                <span className={`font-display text-2xl font-black ${op.color}`}>{op.symbol}</span>
                <span className="text-muted-foreground text-xs">{op.label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Button
            onClick={onStart}
            className="w-full h-14 text-lg font-display font-bold bg-neon text-game-bg hover:bg-neon/90 rounded-xl shadow-[0_0_30px_oklch(0.85_0.22_145/0.4)] transition-all duration-100 hover:shadow-[0_0_40px_oklch(0.85_0.22_145/0.6)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <Zap className="w-5 h-5 mr-2" />
            Start Game
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
