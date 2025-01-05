import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';
import PianoKeyboard from './PianoKeyboard';
import { toast } from '@/hooks/use-toast';
import { playSuccessSound, playFailureSound } from '@/utils/audioUtils';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import GameWinnerModal from './GameWinnerModal';
import GameStatus from './GameStatus';
import GuessIndicator from './GuessIndicator';
import confetti from 'canvas-confetti';

const GameScreen: React.FC = () => {
  const { 
    gameState, 
    addToSequence, 
    checkSequence, 
    nextTurn, 
    resetGame,
    resetToWelcome,
    setRequiredLength,
    updateScore 
  } = useGame();
  
  const [lives, setLives] = useState(3);
  const [guessStatus, setGuessStatus] = useState<Array<'correct' | 'incorrect' | 'pending'>>([]);
  const [currentGuessIndex, setCurrentGuessIndex] = useState(0);
  const [sequenceLength, setSequenceLength] = useState(3);
  const [showEndGameModal, setShowEndGameModal] = useState(false);

  const currentPlayer = gameState.players[gameState.currentTurn];
  const isCreating = gameState.gamePhase === 'create';

  const handleSequenceLengthChange = useCallback((increment: boolean) => {
    const newLength = increment ? sequenceLength + 1 : Math.max(3, sequenceLength - 1);
    if (newLength <= 50) {
      setSequenceLength(newLength);
      setRequiredLength(newLength);
    }
  }, [sequenceLength, setRequiredLength]);

  const triggerCelebration = (isGuesserWin: boolean) => {
    const currentPlayerIsBottom = gameState.currentTurn === 1;
    const isBottomPlayerWinning = isGuesserWin ? currentPlayerIsBottom : !currentPlayerIsBottom;
    const y = isBottomPlayerWinning ? 0.8 : 0.2;
    
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x: 0.1, y },
      gravity: 0.3,
      ticks: 200,
      startVelocity: 35,
      scalar: 1.2,
      angle: 45
    });
    
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x: 0.9, y },
      gravity: 0.3,
      ticks: 200,
      startVelocity: 35,
      scalar: 1.2,
      angle: 135
    });
  };

  const handleKeyPress = useCallback((note: string) => {
    if (isCreating) {
      if (gameState.sequence.length < sequenceLength) {
        addToSequence(note);
        if (gameState.sequence.length + 1 === sequenceLength) {
          setTimeout(() => nextTurn(), 500);
        }
      }
    } else {
      const isCorrect = checkSequence([...gameState.sequence.slice(0, currentGuessIndex), note]);
      
      if (!isCorrect) {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives === 0) {
            const points = sequenceLength * 100;
            const creatorIndex = (gameState.currentTurn + 1) % 2;
            updateScore(creatorIndex, points);
            playFailureSound();
            triggerCelebration(false);
            toast({
              title: "Game Over!",
              description: `${gameState.players[creatorIndex].name} wins ${points} points!`,
              duration: 1500,
              className: "bg-red-500 text-white",
            });
            setTimeout(() => {
              setGuessStatus([]);
              setCurrentGuessIndex(0);
              setLives(3);
              nextTurn();
            }, 1500);
          } else {
            playFailureSound();
            toast({
              title: "Wrong note!",
              description: `${newLives} ${newLives === 1 ? 'life' : 'lives'} remaining`,
              variant: "destructive",
              duration: 1500,
            });
            setGuessStatus([]);
            setCurrentGuessIndex(0);
          }
          return newLives;
        });
        return;
      }

      setGuessStatus(prev => {
        const newStatus = [...prev];
        newStatus[currentGuessIndex] = 'correct';
        return newStatus;
      });
      
      setCurrentGuessIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex === gameState.sequence.length) {
          const points = sequenceLength * 100;
          updateScore(gameState.currentTurn, points);
          playSuccessSound();
          triggerCelebration(true);
          toast({
            title: "Round Complete!",
            description: `${currentPlayer.name} wins ${points} points!`,
            duration: 1500,
            className: "bg-green-500 text-white",
          });
          
          setTimeout(() => {
            setGuessStatus([]);
            setLives(3);
            setCurrentGuessIndex(0);
            nextTurn();
          }, 1500);
        }
        return nextIndex;
      });
    }
  }, [isCreating, gameState.sequence, currentGuessIndex, sequenceLength, addToSequence, nextTurn, checkSequence, currentPlayer.name, gameState.currentTurn, gameState.players, updateScore]);

  useEffect(() => {
    if (isCreating) {
      setGuessStatus([]);
      setCurrentGuessIndex(0);
      setLives(3);
    }
  }, [isCreating]);

  return (
    <div className="min-h-screen flex flex-col bg-piano-bg">
      <GameStatus 
        currentRound={gameState.currentRound}
        players={gameState.players}
        onEndGame={() => setShowEndGameModal(true)}
      />

      <div className="flex-1 flex flex-col justify-between pt-16">
        <div className="flex-1 flex items-center justify-center">
          <PianoKeyboard
            isRotated={true}
            isDisabled={gameState.currentTurn === 1}
            onKeyPress={handleKeyPress}
          />
        </div>

        <div className="text-center py-4 glass-morphism mx-4 rounded-lg">
          <div className="text-xl font-semibold mb-2">
            {currentPlayer.name}'s turn to {isCreating ? 'create' : 'guess'}
          </div>
          
          {isCreating && (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleSequenceLengthChange(false)}
                >
                  -
                </Button>
                <Input
                  type="number"
                  min={3}
                  max={50}
                  value={sequenceLength}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 3 && value <= 50) {
                      setSequenceLength(value);
                      setRequiredLength(value);
                    }
                  }}
                  className="w-20 text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleSequenceLengthChange(true)}
                >
                  +
                </Button>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-sm text-white bg-black/40 px-3 py-1 rounded-full font-medium">
                  Sequence Progress: {gameState.sequence.length} / {sequenceLength} notes
                </div>
                <Progress 
                  value={(gameState.sequence.length / sequenceLength) * 100} 
                  className="w-64"
                />
              </div>
            </div>
          )}

          {!isCreating && (
            <GuessIndicator
              lives={lives}
              guessStatus={guessStatus}
              sequenceLength={gameState.sequence.length}
              currentGuessIndex={currentGuessIndex}
            />
          )}
        </div>

        <div className="flex-1 flex items-center justify-center">
          <PianoKeyboard
            isDisabled={gameState.currentTurn === 0}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>

      <GameWinnerModal
        isOpen={showEndGameModal}
        players={gameState.players}
        onClose={() => {
          resetToWelcome();
          setShowEndGameModal(false);
        }}
        onPlayAgain={() => {
          resetGame();
          setShowEndGameModal(false);
        }}
      />
    </div>
  );
};

export default GameScreen;