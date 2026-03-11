import { useLeaderboard } from "@/hooks/use-leaderboard";
import { Trophy, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function Leaderboard() {
  const { data: scores, isLoading, error } = useLeaderboard();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48 text-primary">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-center border border-destructive/20">
        Failed to load leaderboard.
      </div>
    );
  }

  const topScores = scores?.slice(0, 5) || [];

  return (
    <div className="bg-secondary/50 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-6 justify-center">
        <Trophy className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-display text-foreground">Hall of Fame</h2>
        <Trophy className="w-6 h-6 text-primary" />
      </div>

      {topScores.length === 0 ? (
        <p className="text-muted-foreground text-center italic py-8">
          No champions yet. Be the first!
        </p>
      ) : (
        <div className="space-y-3">
          {topScores.map((entry, idx) => (
            <motion.div 
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/30 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className={`
                  font-display font-bold text-lg w-6 text-center
                  ${idx === 0 ? 'text-yellow-400 text-shadow-glow' : 
                    idx === 1 ? 'text-slate-300' : 
                    idx === 2 ? 'text-amber-600' : 'text-muted-foreground'}
                `}>
                  #{idx + 1}
                </span>
                <span className="font-medium text-foreground tracking-wide">{entry.playerName}</span>
              </div>
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold text-sm">
                {entry.score} Streak
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
