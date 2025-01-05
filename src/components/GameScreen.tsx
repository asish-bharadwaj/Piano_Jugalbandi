import React, { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import PianoKeyboard from './PianoKeyboard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { playSuccessSound, playFailureSound } from '@/utils/audioUtils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const GameScreen: React.FC = () => {
  const { gameState, addToSequence, checkSequence, nextTurn, resetGame } = useGame();
  const [guessSequence, setGuessSequence] = useState<string[]>([]);
  const [showRoundTransition, setShowRoundTransition] = useState(false);
  const [nextRoundNumber, setNextRoundNumber] = useState(1);

  const currentPlayer = gameState.players[gameState.currentTurn];
  const requiredLength = gameState.currentRound + 2;
  const isCreating = gameState.gamePhase === 'create';

  const handleKeyPress = (note: string) => {
    if (isCreating) {
      if (gameState.sequence.length < requiredLength) {
        addToSequence(note);
        if (gameState.sequence.length + 1 === requiredLength) {
          setTimeout(() => nextTurn(), 500);
        }
      }
    } else {
      // Only allow input if we haven't reached the sequence length
      if (guessSequence.length < gameState.sequence.length) {
        setGuessSequence(prev => {
          const newSequence = [...prev, note];
          if (newSequence.length === gameState.sequence.length) {
            const isCorrect = checkSequence(newSequence);
            
            // Play appropriate sound
            if (isCorrect) {
              playSuccessSound();
            } else {
              playFailureSound();
            }

            // Show round transition
            setNextRoundNumber(gameState.currentRound + 1);
            setShowRoundTransition(true);
            
            setTimeout(() => {
              setGuessSequence([]);
              setShowRoundTransition(false);
              nextTurn();
            }, 2000);
          }
          return newSequence;
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-piano-bg">
      <div className="flex justify-between items-center p-4 bg-background/80 backdrop-blur-sm fixed w-full top-0 z-50">
        <div className="text-lg font-semibold">
          Round {gameState.currentRound}
        </div>
        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
          {gameState.players.map((player, index) => (
            <div
              key={player.name}
              className={cn(
                'px-4 py-2 rounded-lg transition-colors',
                gameState.currentTurn === index
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              {player.name}: {player.score}
            </div>
          ))}
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">End Game</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. All progress will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={resetGame}>
                End Game
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="flex-1 flex flex-col justify-between pt-16 md:pt-20">
        <PianoKeyboard
          isRotated={true}
          isDisabled={gameState.currentTurn === 1}
          onKeyPress={handleKeyPress}
        />

        <div className="relative">
          {showRoundTransition && (
            <div className="absolute inset-0 flex items-center justify-center z-50">
              <div className="text-4xl font-bold text-primary animate-bounce bg-background/90 px-8 py-4 rounded-full">
                Round {nextRoundNumber}!
              </div>
            </div>
          )}

          <div className="text-center py-8 animate-fade-in glass-morphism mx-4 rounded-lg">
            <div className="text-2xl font-semibold mb-2">
              {currentPlayer.name}'s turn to {isCreating ? 'create' : 'guess'}
            </div>
            <div className="text-muted-foreground">
              {isCreating
                ? `Play ${requiredLength} notes`
                : `Reproduce the sequence (${guessSequence.length}/${gameState.sequence.length})`}
            </div>
          </div>
        </div>

        <PianoKeyboard
          isDisabled={gameState.currentTurn === 0}
          onKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
};

export default GameScreen;