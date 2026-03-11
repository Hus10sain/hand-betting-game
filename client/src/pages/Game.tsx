import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useGame } from "@/hooks/use-game";
import { useSubmitScore } from "@/hooks/use-leaderboard";
import { MahjongTile } from "@/components/MahjongTile";
import { calculateHandValue } from "@/lib/mahjong";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpCircle, ArrowDownCircle, LogOut, Loader2, RefreshCw } from "lucide-react";

export default function Game() {
  const [, setLocation] = useLocation();
  const { state, startGame, placeBet, quitGame } = useGame();
  const submitScore = useSubmitScore();
  const [playerName, setPlayerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Start game on mount if idle
  useEffect(() => {
    if (state.status === 'idle') {
      startGame();
    }
  }, [state.status, startGame]);

  const handleGameOverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || state.maxStreak === 0) {
      setLocation("/");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitScore.mutateAsync({
        playerName: playerName.trim(),
        score: state.maxStreak,
      });
      setLocation("/");
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  if (state.status === 'idle') return null;

  if (state.status === 'gameover') {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-secondary/80 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-2xl text-center"
        >
          <h2 className="text-4xl font-display font-bold text-destructive mb-2 text-shadow-sm">Game Over</h2>
          <p className="text-muted-foreground mb-8">{state.gameOverReason}</p>
          
          <div className="bg-background/50 rounded-2xl p-6 mb-8 border border-border/50">
            <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-1">Final Score</p>
            <p className="text-6xl font-display font-bold text-primary text-shadow-glow">
              {state.maxStreak}
            </p>
            <p className="text-sm text-muted-foreground mt-2">Consecutive correct bets</p>
          </div>

          <form onSubmit={handleGameOverSubmit} className="space-y-4">
            {state.maxStreak > 0 ? (
              <>
                <div>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name..."
                    maxLength={15}
                    required
                    disabled={isSubmitting}
                    className="w-full bg-background border-2 border-border text-foreground px-4 py-3 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all text-center text-lg placeholder:text-muted-foreground"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !playerName.trim()}
                  className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 flex justify-center items-center gap-2 shadow-lg shadow-primary/20"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Score & Leave"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setLocation("/")}
                className="w-full bg-border text-foreground font-bold py-4 rounded-xl hover:bg-muted transition-all active:scale-[0.98]"
              >
                Return to Menu
              </button>
            )}
          </form>
        </motion.div>
      </div>
    );
  }

  const currentHandValue = calculateHandValue(state.currentHand, state.dynamicValues);

  return (
    <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full p-4 gap-6">
      
      {/* Header Stats */}
      <header className="flex justify-between items-center bg-secondary/30 rounded-2xl p-4 border border-border/30 backdrop-blur-sm">
        <div className="flex gap-6">
          <div>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Current Streak</p>
            <p className="text-2xl font-bold text-foreground">{state.currentStreak}</p>
          </div>
          <div className="hidden sm:block">
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Best</p>
            <p className="text-2xl font-bold text-primary">{state.maxStreak}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Deck</p>
            <p className="text-sm font-bold text-foreground">
              {state.drawPile.length} <span className="text-muted-foreground font-normal">tiles left</span>
            </p>
          </div>
          {state.reshuffles > 0 && (
            <div className="flex items-center gap-1 text-accent bg-accent/10 px-3 py-1 rounded-full text-xs font-bold border border-accent/20">
              <RefreshCw className="w-3 h-3" />
              Reshuffled {state.reshuffles}/2
            </div>
          )}
          <button 
            onClick={quitGame}
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
            title="Quit Game"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Play Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative min-h-[400px]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg aspect-square bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="text-center mb-8 z-10">
          <h2 className="text-xl sm:text-2xl font-display text-muted-foreground mb-2">Current Hand Value</h2>
          <div className="text-6xl sm:text-8xl font-display font-bold text-white text-shadow-glow">
            {currentHandValue}
          </div>
        </div>

        <div className="flex gap-2 sm:gap-4 mb-12 z-10 justify-center flex-wrap">
          <AnimatePresence mode="popLayout">
            {state.currentHand.map((tile, idx) => (
              <MahjongTile 
                key={tile.id} 
                tile={tile} 
                size="lg" 
                dynamicValue={state.dynamicValues[tile.baseId]}
                delay={idx * 0.1}
              />
            ))}
          </AnimatePresence>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md z-10">
          <button
            onClick={() => placeBet('lower')}
            className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-b from-slate-700 to-slate-900 border border-slate-600 hover:border-slate-400 text-white p-5 rounded-2xl font-bold text-xl transition-all hover:-translate-y-1 active:translate-y-0 shadow-lg"
          >
            <ArrowDownCircle className="w-6 h-6 text-blue-400" />
            LOWER
          </button>
          
          <button
            onClick={() => placeBet('higher')}
            className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-b from-primary to-amber-700 border border-amber-400 hover:border-yellow-200 text-primary-foreground p-5 rounded-2xl font-bold text-xl transition-all hover:-translate-y-1 active:translate-y-0 shadow-lg shadow-primary/20"
          >
            HIGHER
            <ArrowUpCircle className="w-6 h-6" />
          </button>
        </div>
      </main>

      {/* History Ribbon */}
      <footer className="mt-auto pt-6 border-t border-border/50">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">Hand History</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 px-2 snap-x">
          {state.history.length === 0 ? (
            <p className="text-muted-foreground italic text-sm">No history yet.</p>
          ) : (
            state.history.map((item, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={item.id}
                className={clsx(
                  "flex-shrink-0 flex flex-col p-3 rounded-xl border min-w-[200px] snap-start transition-colors",
                  item.isWin ? "bg-primary/5 border-primary/30" : "bg-destructive/5 border-destructive/30 opacity-70"
                )}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={clsx("text-xs font-bold uppercase", item.isWin ? "text-primary" : "text-destructive")}>
                    {item.isWin ? "WON" : "LOST"}
                  </span>
                  <span className="text-sm font-mono font-bold text-foreground">Val: {item.value}</span>
                </div>
                <div className="flex gap-1 justify-center">
                  {item.hand.map(tile => (
                    <MahjongTile 
                      key={`hist-${item.id}-${tile.id}`} 
                      tile={tile} 
                      size="sm" 
                      dynamicValue={state.dynamicValues[tile.baseId]}
                    />
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </footer>
    </div>
  );
}

// Add clsx import missing at top level
import { clsx } from "clsx";
