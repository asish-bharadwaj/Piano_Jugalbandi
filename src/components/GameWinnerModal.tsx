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

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import axios from 'axios';

interface Player {
  name: string;
  score: number;
}

interface GameWinnerModalProps {
  isOpen: boolean;
  players: Array<Player>;
  onClose: () => void;
  onPlayAgain: () => void;
}

interface LeaderboardEntry {
  name: string;
  totalScore: number;
  gamesPlayed: number;
  averageScore: number;
}

const GameWinnerModal = ({ isOpen, players, onClose, onPlayAgain }: GameWinnerModalProps) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const winner = players[0].score > players[1].score
    ? players[0].name
    : players[0].score < players[1].score
      ? players[1].name
      : "It's a tie";

  useEffect(() => {
    if (isOpen) {
      updateLeaderboard();
    }
  }, [isOpen]);

  const updateLeaderboard = async () => {
    try {
      setIsLoading(true);
      
      // Update scores for both players
      for (const player of players) {
        await axios.post('/api/leaderboard/update-score', {
          playerName: player.name,
          score: player.score
        });
      }

      // Fetch updated leaderboard
      const response = await axios.get('/api/leaderboard');
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      console.error('Error updating leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = (open: boolean) => {
    if (!open) {
      onClose();
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
          {/* Game Results */}
          <div className="space-y-2">
            <p className="text-xl text-white/90">{players[0].name}: {players[0].score} points</p>
            <p className="text-xl text-white/90">{players[1].name}: {players[1].score} points</p>
          </div>
          <p className="text-2xl font-semibold text-white">
            {winner === "It's a tie" ? winner : `${winner} wins!`}
          </p>

          {/* Leaderboard Section */}
          <div className="border-t border-white/20 pt-4">
            <h3 className="text-xl font-semibold text-white mb-3">Top Players</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-200">
              {isLoading ? (
                <p className="text-white/70">Updating leaderboard...</p>
              ) : (
                leaderboard.map((entry, index) => (
                  <div 
                    key={entry.name} 
                    className="flex justify-between items-center py-1 px-3 rounded-lg bg-white/10"
                  >
                    <span className="text-white/90">
                      #{index + 1} {entry.name}
                    </span>
                    <div className="text-right">
                      <span className="text-white/90">
                        {entry.averageScore.toFixed(1)} avg
                      </span>
                      <span className="text-white/50 text-sm ml-2">
                        ({entry.gamesPlayed} games)
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 pt-4">
            <Button
              onClick={onPlayAgain}
              size="lg"
              className="bg-[#D946EF] hover:bg-[#D946EF]/80 text-white"
            >
              Play Again
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