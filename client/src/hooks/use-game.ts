import { useState, useCallback } from 'react';
import { 
  MahjongTileDef, 
  generateFullDeck, 
  shuffleDeck, 
  getInitialDynamicValues,
  calculateHandValue 
} from '../lib/mahjong';

// Represents a hand that was played and the outcome
export interface GameHistoryItem {
  id: string;
  hand: MahjongTileDef[];
  value: number;
  bet: 'higher' | 'lower';
  isWin: boolean;
}

// Complete game state management
// Tracks deck piles, current hand, player streak, and game over conditions
interface GameState {
  status: 'idle' | 'playing' | 'gameover';
  drawPile: MahjongTileDef[];
  discardPile: MahjongTileDef[];
  currentHand: MahjongTileDef[];
  history: GameHistoryItem[];
  dynamicValues: Record<string, number>;
  reshuffles: number;
  currentStreak: number;
  maxStreak: number;
  gameOverReason: string | null;
}

const INITIAL_HAND_SIZE = 5;
const MAX_RESHUFFLES = 2; // Can run out 2 times, game over on 3rd

// Custom React hook for managing all game logic
// Handles game initialization, betting, deck management, and win/loss calculations
export function useGame() {
  const [state, setState] = useState<GameState>({
    status: 'idle',
    drawPile: [],
    discardPile: [],
    currentHand: [],
    history: [],
    dynamicValues: {},
    reshuffles: 0,
    currentStreak: 0,
    maxStreak: 0,
    gameOverReason: null,
  });

  // Initialize a new game with a shuffled deck
  // Draws the first hand of 5 tiles from the deck
  const startGame = useCallback(() => {
    const deck = shuffleDeck(generateFullDeck());
    const initialHand = deck.splice(0, INITIAL_HAND_SIZE);
    
    setState({
      status: 'playing',
      drawPile: deck,
      discardPile: [],
      currentHand: initialHand,
      history: [],
      dynamicValues: getInitialDynamicValues(),
      reshuffles: 0,
      currentStreak: 0,
      maxStreak: 0,
      gameOverReason: null,
    });
  }, []);

  // Core game logic: player places a bet (higher or lower) and a new hand is drawn
  // Determines win/loss, updates streaks, manages deck exhaustion, and updates dynamic values
  const placeBet = useCallback((bet: 'higher' | 'lower') => {
    setState(prev => {
      if (prev.status !== 'playing') return prev;

      let currentDrawPile = [...prev.drawPile];
      let currentDiscardPile = [...prev.discardPile, ...prev.currentHand];
      let currentReshuffles = prev.reshuffles;
      let newGameOverReason: string | null = null;

      // Check if we need to reshuffle
      // If draw pile has fewer than 5 tiles, we can't draw a new hand
      if (currentDrawPile.length < INITIAL_HAND_SIZE) {
        if (currentReshuffles >= MAX_RESHUFFLES) {
          // Game over: drew from pile 3 times
          return {
            ...prev,
            status: 'gameover',
            gameOverReason: "The draw pile ran out for the 3rd time.",
          };
        }
        
        // Reshuffle: Combine current discard pile with a fresh full deck
        // This allows the game to continue indefinitely (until end condition triggered)
        const freshDeck = generateFullDeck();
        const combined = [...currentDiscardPile, ...freshDeck];
        currentDrawPile = shuffleDeck(combined);
        currentDiscardPile = [];
        currentReshuffles += 1;
      }

      // Draw the next hand of 5 tiles
      const nextHand = currentDrawPile.splice(0, INITIAL_HAND_SIZE);
      
      // Calculate values of current and next hands
      const currentVal = calculateHandValue(prev.currentHand, prev.dynamicValues);
      const nextVal = calculateHandValue(nextHand, prev.dynamicValues);

      // Determine if the bet was correct
      let isWin = false;
      if (bet === 'higher' && nextVal > currentVal) isWin = true;
      if (bet === 'lower' && nextVal < currentVal) isWin = true;
      // Ties: player loses (house wins)

      // Update player streak (reset to 0 on loss, increment on win)
      const newStreak = isWin ? prev.currentStreak + 1 : 0;
      const newMaxStreak = Math.max(prev.maxStreak, newStreak);

      // Update dynamic values for any honor tiles in the newly drawn hand
      const newDynamicValues = { ...prev.dynamicValues };
      
      nextHand.forEach(tile => {
        if (tile.isDynamic) {
          const change = isWin ? 1 : -1;
          newDynamicValues[tile.baseId] += change;
          
          // Game over condition: any tile reaches 0 or 10
          if (newDynamicValues[tile.baseId] <= 0 || newDynamicValues[tile.baseId] >= 10) {
            newGameOverReason = `The ${tile.character} tile reached a value of ${newDynamicValues[tile.baseId]}.`;
          }
        }
      });

      // Record this round in history for display
      const historyItem: GameHistoryItem = {
        id: Date.now().toString(),
        hand: prev.currentHand,
        value: currentVal,
        bet,
        isWin,
      };

      return {
        ...prev,
        drawPile: currentDrawPile,
        discardPile: currentDiscardPile,
        currentHand: nextHand,
        history: [historyItem, ...prev.history],
        dynamicValues: newDynamicValues,
        currentStreak: newStreak,
        maxStreak: newMaxStreak,
        reshuffles: currentReshuffles,
        status: newGameOverReason ? 'gameover' : 'playing',
        gameOverReason: newGameOverReason,
      };
    });
  }, []);

  // End the game and return to home page
  // Records the forfeit in game over reason
  const quitGame = useCallback(() => {
    setState(prev => ({
      ...prev,
      status: 'gameover',
      gameOverReason: "Player forfeited.",
    }));
  }, []);

  return {
    state,
    startGame,
    placeBet,
    quitGame,
  };
}
