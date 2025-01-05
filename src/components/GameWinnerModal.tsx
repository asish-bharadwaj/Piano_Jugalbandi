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
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";

interface GameWinnerModalProps {
  isOpen: boolean;
  players: Array<{ name: string; score: number }>;
  onClose: () => void;
  onPlayAgain: () => void;
}

const GameWinnerModal = ({ isOpen, players, onClose, onPlayAgain }: GameWinnerModalProps) => {
  const winner = players[0].score > players[1].score 
    ? players[0].name 
    : players[0].score < players[1].score 
      ? players[1].name 
      : "It's a tie";

  const handleCloseModal = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const handleUploadScore = async () => {
    const player = prompt("Enter your player name to upload the score:");
    if (player) {
      const game = "bucket"; // Replace 'bucket' with your actual game name
      const score = winner === players[0].name ? players[0].score : players[1].score;
      
      try {
        const response = await fetch(`../save.php?player=${player}&game=${game}&score=${score}`, {
          method: "GET",
        });

        if (response.ok) {
          toast("Score uploaded successfully.");
        } else {
          toast("Failed to upload score.");
        }
      } catch (error) {
        console.error("Error uploading score:", error);
        toast("An error occurred while uploading the score.");
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-md bg-[#8B5CF6]/30 backdrop-blur-md border border-white/20 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center mb-4 text-white">
            Game Over!
          </DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-xl text-white/90">{players[0].name}: {players[0].score} points</p>
            <p className="text-xl text-white/90">{players[1].name}: {players[1].score} points</p>
          </div>
          <p className="text-2xl font-semibold text-white">
            {winner === "It's a tie" ? winner : `${winner} wins!`}
          </p>
          <div className="flex justify-center space-x-4 pt-4">
            <Button 
              onClick={onPlayAgain} 
              size="lg"
              className="bg-[#D946EF] hover:bg-[#D946EF]/80 text-white"
            >
              Play Again
            </Button>
            <Button 
              onClick={handleUploadScore} 
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Upload Score
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose} 
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white border-none"
            >
              Close Game
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameWinnerModal;
