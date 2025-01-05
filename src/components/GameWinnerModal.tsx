import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import confetti from 'canvas-confetti';
import { playSuccessSound } from "@/utils/audioUtils";

interface GameWinnerModalProps {
  isOpen: boolean;
  winner: string;
  score: number;
  onClose: () => void;
  onPlayAgain: () => void;
}

const GameWinnerModal = ({ isOpen, winner, score, onClose, onPlayAgain }: GameWinnerModalProps) => {
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    playSuccessSound();
  };

  useEffect(() => {
    if (isOpen) {
      triggerConfetti();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center animate-bounce">
            🎉 Congratulations! 🎉
          </DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4">
          <p className="text-xl animate-fade-in">
            {winner} wins with {score} points!
          </p>
          <div className="flex justify-center space-x-4 pt-4">
            <Button onClick={onPlayAgain} className="animate-slide-up">
              Play Again
            </Button>
            <Button variant="outline" onClick={onClose} className="animate-slide-up">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameWinnerModal;