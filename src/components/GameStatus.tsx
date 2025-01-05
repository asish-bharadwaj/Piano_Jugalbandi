import React from 'react';
import { Button } from './ui/button';

interface GameStatusProps {
  currentRound: number;
  players: Array<{ name: string; score: number }>;
  onEndGame: () => void;
}

const GameStatus: React.FC<GameStatusProps> = ({ currentRound, players, onEndGame }) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-4 z-50">
      <div className="flex justify-between items-center max-w-4xl mx-auto">
        <div className="text-lg font-semibold">
          Round {currentRound}
        </div>
        <div className="flex gap-4">
          <div>{players[0].name}: {players[0].score}</div>
          <div>{players[1].name}: {players[1].score}</div>
        </div>
        <Button 
          variant="outline" 
          onClick={onEndGame}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          End Game
        </Button>
      </div>
    </div>
  );
};

export default GameStatus;