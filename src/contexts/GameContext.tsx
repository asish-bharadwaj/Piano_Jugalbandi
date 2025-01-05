import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

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
  requiredLength: number;
}

interface GameContextType {
  gameState: GameState;
  setPlayerName: (index: number, name: string) => void;
  startGame: () => void;
  addToSequence: (note: string) => void;
  checkSequence: (sequence: string[]) => boolean;
  nextTurn: () => void;
  resetGame: () => void;
  resetToWelcome: () => void;
  setRequiredLength: (length: number) => void;
  updateScore: (playerIndex: number, points: number) => void;
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
  requiredLength: 3,
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
      currentTurn: 0,
      currentRound: 1,
      sequence: [],
      requiredLength: 3,
    }));
  }, []);

  const addToSequence = useCallback((note: string) => {
    setGameState(prev => ({
      ...prev,
      sequence: [...prev.sequence, note],
    }));
  }, []);

  const updateScore = useCallback((playerIndex: number, points: number) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map((player, index) => 
        index === playerIndex 
          ? { ...player, score: player.score + points }
          : player
      ) as [Player, Player],
    }));
  }, []);

  const checkSequence = useCallback((guessSequence: string[]) => {
    const isCorrect = gameState.sequence.slice(0, guessSequence.length).every(
      (note, index) => note === guessSequence[index]
    );
    return isCorrect;
  }, [gameState.sequence]);

  const nextTurn = useCallback(() => {
    setGameState(prev => {
      const isOddRound = prev.currentRound % 2 === 1;
      
      if (prev.gamePhase === 'guess') {
        return {
          ...prev,
          currentRound: prev.currentRound + 1,
          currentTurn: prev.currentRound % 2 === 0 ? 0 : 1,
          gamePhase: 'create',
          sequence: [],
          isPlaying: true,
        };
      } else {
        return {
          ...prev,
          currentTurn: isOddRound ? 1 : 0,
          gamePhase: 'guess',
          isPlaying: true,
        };
      }
    });
  }, []);

  const resetToWelcome = useCallback(() => {
    setGameState(initialState);
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      ...initialState,
      players: gameState.players.map(player => ({ ...player, score: 0 })) as [Player, Player],
      gamePhase: 'create',
      isPlaying: true,
      requiredLength: 3,
    });
  }, [gameState.players]);

  const setRequiredLength = useCallback((length: number) => {
    const clampedLength = Math.max(3, Math.min(50, length));
    setGameState(prev => ({
      ...prev,
      requiredLength: clampedLength,
    }));
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
      resetToWelcome,
      setRequiredLength,
      updateScore,
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
