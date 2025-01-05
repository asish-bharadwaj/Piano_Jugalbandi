import React from 'react';

interface ScoreDisplayProps {
  player1Name: string;
  player1Score: number;
  player2Name: string;
  player2Score: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  player1Name,
  player1Score,
  player2Name,
  player2Score,
}) => {
  return (
    <div className="text-center py-4">
      <div className="flex justify-center items-center gap-8 glass-morphism mx-4 p-4 rounded-lg">
        <div className="text-xl font-semibold">
          {player1Name}: {player1Score}
        </div>
        <div className="text-2xl font-bold">VS</div>
        <div className="text-xl font-semibold">
          {player2Name}: {player2Score}
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;