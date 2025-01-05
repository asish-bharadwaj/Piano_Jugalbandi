import React, { createContext, useContext, useState, useCallback } from 'react';
import { calculateScore, getRequiredSequenceLength } from '@/utils/gameUtils';
import { toast } from '@/components/ui/use-toast';

interface Player {
  name: string;
  score: number;
}

interface GameState {
  players: [Player, Player];
  currentRound: number;
  currentTurn: number;
  sequence: string[];
  isPlaying: boolean;
  gamePhase: 'welcome' | 'create' | 'guess' | 'end';
}

interface GameContextType {
  gameState: GameState;
  setPlayerName: (index: number, name: string) => void;
  startGame: () => void;
  addToSequence: (note: string) => void;
  checkSequence: (sequence: string[]) => boolean;
  nextTurn: () => void;
  resetGame: () => void;
}

const initialState: GameState = {
  players: [
    { name: '', score: 0 },
    { name: '', score: 0 },
  ],
  currentRound: 1,
  currentTurn: 0,
  sequence: [],
  isPlaying: false,
  gamePhase: 'welcome',
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialState);

  const setPlayerName = useCallback((index: number, name: string) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map((player, i) => 
        i === index ? { ...player, name } : player
      ) as [Player, Player],
    }));
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      gamePhase: 'create',
      currentTurn: 0, // Always start with player 1 creating
    }));
  }, []);

  const addToSequence = useCallback((note: string) => {
    setGameState(prev => ({
      ...prev,
      sequence: [...prev.sequence, note],
    }));
  }, []);

  const checkSequence = useCallback((guessSequence: string[]) => {
    const isCorrect = gameState.sequence.every(
      (note, index) => note === guessSequence[index]
    );

    setGameState(prev => {
      const guessingPlayerIndex = prev.currentTurn;
      const creatingPlayerIndex = guessingPlayerIndex === 0 ? 1 : 0;
      const updatedPlayers = [...prev.players] as [Player, Player];

      const scoreChange = calculateScore(isCorrect, prev.currentRound, true);
      
      if (isCorrect) {
        updatedPlayers[guessingPlayerIndex].score += scoreChange;
        toast({
          title: "Great job! 🎉",
          description: `+${scoreChange} points!`,
          duration: 1000, // Changed to 1000ms (1 second)
        });
      } else {
        const creatorScore = calculateScore(isCorrect, prev.currentRound, false);
        updatedPlayers[creatingPlayerIndex].score += creatorScore;
        toast({
          title: "Nice try!",
          description: `${updatedPlayers[creatingPlayerIndex].name} gets ${creatorScore} points!`,
          variant: "destructive",
          duration: 1000, // Changed to 1000ms (1 second)
        });
      }

      return {
        ...prev,
        players: updatedPlayers,
      };
    });

    return isCorrect;
  }, [gameState.sequence]);

  const nextTurn = useCallback(() => {
    setGameState(prev => {
      // If we just finished a guess phase
      if (prev.gamePhase === 'guess') {
        // Move to the next round and switch roles
        const nextRound = prev.currentRound + 1;
        // In odd rounds, player 1 creates (turn 0)
        // In even rounds, player 2 creates (turn 1)
        const nextCreatingPlayer = nextRound % 2 === 1 ? 0 : 1;
        
        return {
          ...prev,
          currentRound: nextRound,
          currentTurn: nextCreatingPlayer,
          gamePhase: 'create',
          sequence: [], // Clear sequence for new round
        };
      } else {
        // If we just finished create phase, switch to guess phase
        // The other player should guess
        const guessingPlayer = prev.currentTurn === 0 ? 1 : 0;
        return {
          ...prev,
          currentTurn: guessingPlayer,
          gamePhase: 'guess',
        };
      }
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initialState);
  }, []);

  return (
    <GameContext.Provider value={{
      gameState,
      setPlayerName,
      startGame,
      addToSequence,
      checkSequence,
      nextTurn,
      resetGame,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
