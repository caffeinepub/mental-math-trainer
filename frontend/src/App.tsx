import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { useState } from 'react';
import StartScreen from './pages/StartScreen';
import GameScreen from './pages/GameScreen';
import ResultsScreen from './pages/ResultsScreen';

type GameView = 'start' | 'game' | 'results';

function AppContent() {
  const [view, setView] = useState<GameView>('start');
  const [finalScore, setFinalScore] = useState(0);

  const handleStartGame = () => setView('game');
  const handleGameEnd = (score: number) => {
    setFinalScore(score);
    setView('results');
  };
  const handlePlayAgain = () => setView('start');

  if (view === 'game') {
    return <GameScreen onGameEnd={handleGameEnd} />;
  }
  if (view === 'results') {
    return <ResultsScreen score={finalScore} onPlayAgain={handlePlayAgain} />;
  }
  return <StartScreen onStart={handleStartGame} />;
}

export default function App() {
  return <AppContent />;
}
