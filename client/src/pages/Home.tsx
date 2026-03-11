import { useLocation } from "wouter";
import { Leaderboard } from "@/components/Leaderboard";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full flex flex-col items-center z-10"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-6xl sm:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary via-yellow-200 to-amber-600 drop-shadow-lg mb-4 leading-tight py-2">
              Hand Betting<br/>Game
            </h1>
          </motion.div>
          <p className="text-muted-foreground text-lg max-w-sm mx-auto">
            Test your luck and intuition. Guess the value of the next hand to build your streak.
          </p>
        </div>

        <button
          onClick={() => setLocation("/game")}
          className="
            group relative flex items-center justify-center gap-3 w-full
            px-8 py-5 rounded-2xl font-bold text-xl
            bg-gradient-to-b from-primary to-amber-600 text-primary-foreground
            shadow-[0_0_40px_-10px_rgba(234,179,8,0.4)]
            hover:shadow-[0_0_60px_-15px_rgba(234,179,8,0.6)]
            hover:-translate-y-1 active:translate-y-0
            transition-all duration-300 ease-out mb-12
          "
        >
          <div className="absolute inset-0 rounded-2xl border-2 border-white/20 pointer-events-none mix-blend-overlay" />
          <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
          Start New Game
        </button>

        <div className="w-full">
          <Leaderboard />
        </div>
      </motion.div>
    </div>
  );
}
