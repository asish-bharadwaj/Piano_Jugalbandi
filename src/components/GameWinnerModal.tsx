// import React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { useGame } from "@/contexts/GameContext";

// interface GameWinnerModalProps {
//   isOpen: boolean;
//   players: Array<{ name: string; score: number }>;
//   onClose: () => void;
//   onPlayAgain: () => void;
// }

// const GameWinnerModal = ({ isOpen, players, onClose, onPlayAgain }: GameWinnerModalProps) => {
//   const winner = players[0].score > players[1].score 
//     ? players[0].name 
//     : players[0].score < players[1].score 
//       ? players[1].name 
//       : "It's a tie";

//   const handleCloseModal = (open: boolean) => {
//     if (!open) {
//       // Only call onClose (which resumes the game) when dialog is closing
//       onClose();
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={handleCloseModal}>
//       <DialogContent className="sm:max-w-md bg-[#8B5CF6]/30 backdrop-blur-md border border-white/20 shadow-lg">
//         <DialogHeader>
//           <DialogTitle className="text-3xl font-bold text-center mb-4 text-white">
//             Game Over!
//           </DialogTitle>
//         </DialogHeader>
//         <div className="text-center space-y-6">
//           <div className="space-y-2">
//             <p className="text-xl text-white/90">{players[0].name}: {players[0].score} points</p>
//             <p className="text-xl text-white/90">{players[1].name}: {players[1].score} points</p>
//           </div>
//           <p className="text-2xl font-semibold text-white">
//             {winner === "It's a tie" ? winner : `${winner} wins!`}
//           </p>
//           <div className="flex justify-center space-x-4 pt-4">
//             <Button 
//               onClick={onPlayAgain} 
//               size="lg"
//               className="bg-[#D946EF] hover:bg-[#D946EF]/80 text-white"
//             >
//               Play Again
//             </Button>
//             <Button 
//               variant="outline" 
//               onClick={onClose} 
//               size="lg"
//               className="bg-indigo-600 hover:bg-indigo-700 text-white border-none"
//             >
//               Close Game
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default GameWinnerModal;

// import React, { useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import confetti from 'canvas-confetti';
// import { playSuccessSound } from "@/utils/audioUtils";

// interface GameWinnerModalProps {
//   isOpen: boolean;
//   winner: string;
//   score: number;
//   onClose: () => void;
//   onPlayAgain: () => void;
// }

// const GameWinnerModal = ({ isOpen, winner, score, onClose, onPlayAgain }: GameWinnerModalProps) => {
//   const triggerConfetti = () => {
//     confetti({
//       particleCount: 100,
//       spread: 70,
//       origin: { y: 0.6 }
//     });
//     playSuccessSound();
//   };

//   useEffect(() => {
//     if (isOpen) {
//       triggerConfetti();
//     }
//   }, [isOpen]);

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle className="text-2xl font-bold text-center animate-bounce">
//             🎉 Congratulations! 🎉
//           </DialogTitle>
//         </DialogHeader>
//         <div className="text-center space-y-4">
//           <p className="text-xl animate-fade-in">
//             {winner} wins with {score} points!
//           </p>
//           <div className="flex justify-center space-x-4 pt-4">
//             <Button onClick={onPlayAgain} className="animate-slide-up">
//               Play Again
//             </Button>
//             <Button variant="outline" onClick={onClose} className="animate-slide-up">
//               Close
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default GameWinnerModal;


import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { playSuccessSound } from "@/utils/audioUtils";
// import { toast } from "@/components/ui/toast";

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
      origin: { y: 0.6 },
    });
    playSuccessSound();
  };

  const uploadScore = () => {
    const player = prompt("Enter your player name (required to upload score):");
    if (player) {
      const game = "pianojugalbandi"; // Replace with the actual game name if different
      fetch(
        `https://sohamapps.rf.gd/music-games/save.php?player=${encodeURIComponent(player)}&game=${encodeURIComponent(game)}&score=${encodeURIComponent(score)}&i=1`,
        {
          method: "GET",
        }
      )
        .then((response) => {
          if (response.ok) {
            alert("Score uploaded successfully.");
          } else {
            alert("Failed to upload score.");
          }
        })
        .catch(() => {
          alert("Failed to upload score.");
        });
    }
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
            <Button
              onClick={() => {
                uploadScore();
                onPlayAgain();
              }}
              className="animate-slide-up"
            >
              Play Again
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                uploadScore();
                onClose();
              }}
              className="animate-slide-up"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameWinnerModal;
