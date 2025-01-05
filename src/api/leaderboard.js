// Backend: src/api/leaderboard.js
const express = require('express');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const EXCEL_FILE = path.join(__dirname, '../data/leaderboard.xlsx');

// Ensure the data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Create Excel file if it doesn't exist
if (!fs.existsSync(EXCEL_FILE)) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([]);
    XLSX.utils.book_append_sheet(wb, ws, 'Leaderboard');
    XLSX.writeFile(wb, EXCEL_FILE);
}

// Function to read the Excel file
const readLeaderboard = () => {
    const workbook = XLSX.readFile(EXCEL_FILE);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet);
};

// Function to write to the Excel file
const writeLeaderboard = (data) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Leaderboard');
    XLSX.writeFile(wb, EXCEL_FILE);
};

// API endpoint to update scores
router.post('/update-score', (req, res) => {
    try {
        const { playerName, score } = req.body;
        let leaderboard = readLeaderboard();
        
        // Find existing player
        const existingPlayer = leaderboard.find(p => p.name.toLowerCase() === playerName.toLowerCase());
        
        if (existingPlayer) {
            // Update existing player
            existingPlayer.totalScore = (existingPlayer.totalScore || 0) + score;
            existingPlayer.gamesPlayed = (existingPlayer.gamesPlayed || 0) + 1;
            existingPlayer.averageScore = existingPlayer.totalScore / existingPlayer.gamesPlayed;
        } else {
            // Add new player
            leaderboard.push({
                name: playerName,
                totalScore: score,
                gamesPlayed: 1,
                averageScore: score
            });
        }
        
        // Sort by average score
        leaderboard.sort((a, b) => b.averageScore - a.averageScore);
        
        writeLeaderboard(leaderboard);
        
        res.json({ success: true, leaderboard });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// API endpoint to get leaderboard
router.get('/', (req, res) => {
    try {
        const leaderboard = readLeaderboard();
        res.json({ success: true, leaderboard });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;

// Frontend: src/components/GameWinnerModal.tsx
import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
    const [isUpdating, setIsUpdating] = useState(false);

    const winner = players[0].score > players[1].score
        ? players[0]
        : players[0].score < players[1].score
            ? players[1]
            : null;

    useEffect(() => {
        if (isOpen && !isUpdating) {
            updateLeaderboard();
        }
    }, [isOpen]);

    const updateLeaderboard = async () => {
        try {
            setIsUpdating(true);
            
            // Update both players' scores
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
            setIsUpdating(false);
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
                    <div className="space-y-2">
                        <p className="text-xl text-white/90">
                            {players[0].name}: {players[0].score} points
                        </p>
                        <p className="text-xl text-white/90">
                            {players[1].name}: {players[1].score} points
                        </p>
                    </div>
                    <p className="text-2xl font-semibold text-white">
                        {winner ? `${winner.name} wins!` : "It's a tie!"}
                    </p>
                    
                    {/* Leaderboard Section */}
                    <div className="mt-6 border-t border-white/20 pt-4">
                        <h3 className="text-xl font-semibold text-white mb-3">Leaderboard</h3>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {leaderboard.map((entry, index) => (
                                <div key={entry.name} className="flex justify-between text-white/90">
                                    <span>#{index + 1} {entry.name}</span>
                                    <span>{entry.averageScore.toFixed(1)} avg</span>
                                </div>
                            ))}
                        </div>
                    </div>

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