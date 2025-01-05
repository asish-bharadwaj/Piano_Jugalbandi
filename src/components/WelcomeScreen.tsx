import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const WelcomeScreen: React.FC = () => {
  const { gameState, setPlayerName, startGame } = useGame();
  const canStart = gameState.players.every(player => player.name.trim() !== '');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8 animate-fade-in">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Piano Jugalbandi Game</h1>
          <p className="text-muted-foreground">
            Test your memory and musical skills against a friend
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Player 1 Name"
              value={gameState.players[0].name}
              onChange={(e) => setPlayerName(0, e.target.value)}
              className="w-full"
            />
            <Input
              type="text"
              placeholder="Player 2 Name"
              value={gameState.players[1].name}
              onChange={(e) => setPlayerName(1, e.target.value)}
              className="w-full"
            />
          </div>

          <Button
            onClick={startGame}
            disabled={!canStart}
            className="w-full"
          >
            Start Game
          </Button>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          <h2 className="font-semibold mb-2">How to Play:</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Players take turns creating and guessing musical sequences</li>
            <li>Each round, the sequence gets longer</li>
            <li>Correctly guess the sequence to earn 100 points</li>
            <li>If you guess wrong, your opponent gets 100 points</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;