import { motion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { MahjongTileDef } from "../lib/mahjong";

interface MahjongTileProps {
  tile: MahjongTileDef;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  dynamicValue?: number;
  delay?: number;
}

export function MahjongTile({ tile, size = 'md', className, dynamicValue, delay = 0 }: MahjongTileProps) {
  const sizeClasses = {
    sm: "w-10 h-14 text-sm rounded-sm tile-3d-sm",
    md: "w-16 h-24 text-2xl rounded-md tile-3d",
    lg: "w-24 h-36 text-4xl rounded-lg tile-3d",
  };

  const hasSubChar = !!tile.subCharacter;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, rotateY: 90 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ 
        duration: 0.5, 
        delay, 
        type: "spring", 
        stiffness: 200, 
        damping: 20 
      }}
      className={twMerge(
        clsx(
          "bg-card text-card-foreground flex flex-col items-center justify-center relative select-none",
          "border border-border/10 transform-gpu cursor-default",
          sizeClasses[size],
          className
        )
      )}
    >
      <div className={clsx("flex flex-col items-center", tile.colorClass)}>
        <span className="font-bold leading-none" style={{ fontFamily: 'var(--font-sans)' }}>
          {tile.character}
        </span>
        {hasSubChar && (
          <span className={clsx(
            "opacity-80 font-bold", 
            size === 'lg' ? 'text-xl mt-2' : size === 'md' ? 'text-sm mt-1' : 'text-[10px] mt-0.5'
          )}>
            {tile.subCharacter}
          </span>
        )}
      </div>

      {/* Value Indicator */}
      <div className={clsx(
        "absolute bottom-1 right-1 font-mono font-bold opacity-50",
        size === 'lg' ? 'text-sm' : size === 'md' ? 'text-xs' : 'text-[8px]'
      )}>
        {tile.isDynamic ? dynamicValue : tile.rank}
      </div>
      
      {/* Decorative corner accents for prestige feel */}
      {size !== 'sm' && (
        <>
          <div className="absolute top-1 left-1 w-1 h-1 rounded-full bg-border/20"></div>
          <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-border/20"></div>
          <div className="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-border/20"></div>
        </>
      )}
    </motion.div>
  );
}
