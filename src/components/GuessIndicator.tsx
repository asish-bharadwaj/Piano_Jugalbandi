import React from 'react';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';

interface GuessIndicatorProps {
  lives: number;
  guessStatus: Array<'correct' | 'incorrect' | 'pending'>;
  sequenceLength: number;
  currentGuessIndex: number;
}

const GuessIndicator: React.FC<GuessIndicatorProps> = ({
  lives,
  guessStatus,
  sequenceLength,
  currentGuessIndex,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Heart
            key={i}
            className={cn(
              "w-6 h-6 transition-colors",
              i < lives ? "fill-red-500 text-red-500" : "fill-gray-300 text-gray-300"
            )}
          />
        ))}
      </div>

      <div className="flex justify-center gap-2">
        {Array.from({ length: sequenceLength }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-8 h-8 border-2 rounded-full flex items-center justify-center transition-all duration-300",
              guessStatus[i] === 'correct' && "border-green-500 bg-green-100",
              guessStatus[i] === 'incorrect' && "border-red-500 bg-red-100",
              !guessStatus[i] && "border-gray-300",
              i === currentGuessIndex && "scale-110 border-blue-500"
            )}
          >
            {guessStatus[i] === 'correct' && "✓"}
            {guessStatus[i] === 'incorrect' && "✗"}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuessIndicator;