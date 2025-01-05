import React from 'react';
import { GameProvider } from '@/contexts/GameContext';
import WelcomeScreen from '@/components/WelcomeScreen';
import GameScreen from '@/components/GameScreen';
import { useGame } from '@/contexts/GameContext';

const GameContainer = () => {
  const { gameState } = useGame();
  return gameState.gamePhase === 'welcome' ? <WelcomeScreen /> : <GameScreen />;
};

const Index = () => {
  return (
    <GameProvider>
      <GameContainer />
    </GameProvider>
  );
};

export default Index;