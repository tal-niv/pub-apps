import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RotateCcw, Trophy, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Mancala() {
  // Initialize board: [player2 pits (right to left), player2 store, player1 pits (left to right), player1 store]
  const [board, setBoard] = useState([4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0]);
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 or 2
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [animatingPit, setAnimatingPit] = useState(null);
  const [lastMove, setLastMove] = useState(null);

  const player1Store = 13;
  const player2Store = 6;

  useEffect(() => {
    checkGameOver();
  }, [board]);

  const checkGameOver = () => {
    const player1Pits = board.slice(7, 13);
    const player2Pits = board.slice(0, 6);

    if (player1Pits.every(stones => stones === 0) || player2Pits.every(stones => stones === 0)) {
      // Collect remaining stones
      const finalBoard = [...board];
      const player1Remaining = player1Pits.reduce((sum, stones) => sum + stones, 0);
      const player2Remaining = player2Pits.reduce((sum, stones) => sum + stones, 0);
      
      finalBoard[player1Store] += player1Remaining;
      finalBoard[player2Store] += player2Remaining;
      
      for (let i = 0; i < 6; i++) {
        finalBoard[i] = 0;
        finalBoard[i + 7] = 0;
      }
      
      setBoard(finalBoard);
      setGameOver(true);
      
      if (finalBoard[player1Store] > finalBoard[player2Store]) {
        setWinner(1);
      } else if (finalBoard[player2Store] > finalBoard[player1Store]) {
        setWinner(2);
      } else {
        setWinner(0); // tie
      }
    }
  };

  const makeMove = async (pitIndex) => {
    if (gameOver || animatingPit !== null) return;
    
    // Check if it's a valid move
    if (currentPlayer === 1) {
      if (pitIndex < 7 || pitIndex > 12) return;
      if (board[pitIndex] === 0) return;
    } else {
      if (pitIndex < 0 || pitIndex > 5) return;
      if (board[pitIndex] === 0) return;
    }

    setAnimatingPit(pitIndex);
    setLastMove(pitIndex);

    const newBoard = [...board];
    let stones = newBoard[pitIndex];
    newBoard[pitIndex] = 0;
    let currentIndex = pitIndex;

    // Distribute stones
    while (stones > 0) {
      currentIndex = (currentIndex + 1) % 14;
      
      // Skip opponent's store
      if (currentPlayer === 1 && currentIndex === player2Store) continue;
      if (currentPlayer === 2 && currentIndex === player1Store) continue;
      
      newBoard[currentIndex]++;
      stones--;
    }

    setBoard(newBoard);

    // Check for capture
    if (currentPlayer === 1 && currentIndex >= 7 && currentIndex <= 12 && newBoard[currentIndex] === 1) {
      const oppositeIndex = 12 - currentIndex;
      if (newBoard[oppositeIndex] > 0) {
        newBoard[player1Store] += newBoard[oppositeIndex] + 1;
        newBoard[oppositeIndex] = 0;
        newBoard[currentIndex] = 0;
        setBoard(newBoard);
      }
    } else if (currentPlayer === 2 && currentIndex >= 0 && currentIndex <= 5 && newBoard[currentIndex] === 1) {
      const oppositeIndex = 12 - currentIndex;
      if (newBoard[oppositeIndex] > 0) {
        newBoard[player2Store] += newBoard[oppositeIndex] + 1;
        newBoard[oppositeIndex] = 0;
        newBoard[currentIndex] = 0;
        setBoard(newBoard);
      }
    }

    // Check if player gets another turn (landed in own store)
    const getsAnotherTurn = 
      (currentPlayer === 1 && currentIndex === player1Store) ||
      (currentPlayer === 2 && currentIndex === player2Store);

    setTimeout(() => {
      setAnimatingPit(null);
      if (!getsAnotherTurn) {
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      }
    }, 600);
  };

  const resetGame = () => {
    setBoard([4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0]);
    setCurrentPlayer(1);
    setGameOver(false);
    setWinner(null);
    setAnimatingPit(null);
    setLastMove(null);
  };

  const renderPit = (index, isStore = false) => {
    const stones = board[index];
    const isPlayer1 = index >= 7 && index <= 13;
    const isClickable = !gameOver && !isStore && (
      (currentPlayer === 1 && index >= 7 && index <= 12) ||
      (currentPlayer === 2 && index >= 0 && index <= 5)
    ) && stones > 0;

    return (
      <motion.div
        key={index}
        onClick={() => !isStore && makeMove(index)}
        className={`
          ${isStore ? 'w-24 h-full' : 'w-20 h-20 md:w-24 md:h-24'}
          relative rounded-2xl flex items-center justify-center
          transition-all duration-300
          ${isStore ? 'bg-gradient-to-b from-amber-700 to-amber-900' : 'bg-gradient-to-br from-amber-600 to-amber-800'}
          ${isClickable ? 'cursor-pointer hover:scale-105 hover:shadow-xl ring-2 ring-amber-400' : ''}
          ${animatingPit === index ? 'animate-pulse' : ''}
          ${lastMove === index ? 'ring-2 ring-green-400' : ''}
          shadow-lg
        `}
        whileHover={isClickable ? { scale: 1.05 } : {}}
        whileTap={isClickable ? { scale: 0.95 } : {}}
      >
        {/* Pit interior shadow */}
        <div className="absolute inset-2 rounded-xl bg-black/20" />
        
        {/* Stones */}
        <div className="relative z-10 flex flex-wrap gap-1 items-center justify-center p-2 max-w-full">
          {stones > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center"
            >
              <div className="text-2xl md:text-3xl font-bold text-amber-100 drop-shadow-lg">
                {stones}
              </div>
              <div className="flex flex-wrap gap-0.5 justify-center mt-1">
                {Array.from({ length: Math.min(stones, 8) }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Circle className="w-2 h-2 fill-emerald-400 text-emerald-500" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Store labels */}
        {isStore && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-semibold text-gray-700 whitespace-nowrap">
            Player {index === player1Store ? '1' : '2'}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-2">Mancala</h1>
          <p className="text-amber-700">Classic African Stone Game</p>
        </div>

        {/* Score and Status */}
        <Card className="p-6 mb-6 bg-white/80 backdrop-blur">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-lg ${currentPlayer === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                <div className="text-sm font-medium">Player 1</div>
                <div className="text-2xl font-bold">{board[player1Store]}</div>
              </div>
              <div className="text-gray-400">VS</div>
              <div className={`px-4 py-2 rounded-lg ${currentPlayer === 2 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                <div className="text-sm font-medium">Player 2</div>
                <div className="text-2xl font-bold">{board[player2Store]}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {!gameOver && (
                <div className="text-center">
                  <div className="text-sm text-gray-500">Current Turn</div>
                  <div className={`text-xl font-bold ${currentPlayer === 1 ? 'text-blue-600' : 'text-red-600'}`}>
                    Player {currentPlayer}
                  </div>
                </div>
              )}
              <Button onClick={resetGame} variant="outline" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                New Game
              </Button>
            </div>
          </div>
        </Card>

        {/* Game Board */}
        <Card className="p-8 bg-gradient-to-br from-amber-900 to-amber-800 shadow-2xl">
          <div className="flex gap-6 items-center justify-center">
            {/* Player 2 Store (left) */}
            <div className="flex flex-col items-center gap-2">
              {renderPit(player2Store, true)}
            </div>

            {/* Main board */}
            <div className="flex flex-col gap-8">
              {/* Player 2 pits (top row - right to left) */}
              <div className="flex gap-3 md:gap-4">
                {[5, 4, 3, 2, 1, 0].map(i => renderPit(i))}
              </div>

              {/* Player 1 pits (bottom row - left to right) */}
              <div className="flex gap-3 md:gap-4">
                {[7, 8, 9, 10, 11, 12].map(i => renderPit(i))}
              </div>
            </div>

            {/* Player 1 Store (right) */}
            <div className="flex flex-col items-center gap-2">
              {renderPit(player1Store, true)}
            </div>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="mt-6 p-6 bg-white/80 backdrop-blur">
          <h3 className="font-semibold text-lg mb-3 text-amber-900">How to Play</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Click on one of your pits to pick up all stones and distribute them counter-clockwise</li>
            <li>• If your last stone lands in your store, you get another turn</li>
            <li>• If your last stone lands in an empty pit on your side, capture that stone and all stones in the opposite pit</li>
            <li>• Game ends when all pits on one side are empty</li>
            <li>• Player with the most stones in their store wins!</li>
          </ul>
        </Card>

        {/* Game Over Modal */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={resetGame}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                  <h2 className="text-3xl font-bold mb-4">
                    {winner === 0 ? "It's a Tie!" : `Player ${winner} Wins!`}
                  </h2>
                  <div className="flex justify-center gap-8 mb-6">
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Player 1</div>
                      <div className="text-3xl font-bold text-blue-600">{board[player1Store]}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Player 2</div>
                      <div className="text-3xl font-bold text-red-600">{board[player2Store]}</div>
                    </div>
                  </div>
                  <Button onClick={resetGame} className="w-full gap-2 bg-amber-600 hover:bg-amber-700">
                    <RotateCcw className="w-4 h-4" />
                    Play Again
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}