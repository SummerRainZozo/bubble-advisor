import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BubbleVisualizationProps {
  score: number; // 0-100
  title: string;
  subtitle: string;
  isUserBubble?: boolean;
}

export const BubbleVisualization = ({
  score,
  title,
  subtitle,
  isUserBubble = false,
}: BubbleVisualizationProps) => {
  const [prevScore, setPrevScore] = useState(score);
  const [animation, setAnimation] = useState<"pulse" | "inflate" | "shrink" | "burst" | null>("pulse");

  useEffect(() => {
    if (score !== prevScore) {
      if (score > prevScore + 10) {
        setAnimation("inflate");
      } else if (score < prevScore - 10) {
        setAnimation("shrink");
      } else if (score > 90) {
        setAnimation("burst");
      } else {
        setAnimation("pulse");
      }
      setPrevScore(score);
    }
  }, [score, prevScore]);

  const getBurstRisk = (score: number) => {
    if (score >= 80) return { label: "CRITICAL", color: "text-bubble-danger" };
    if (score >= 65) return { label: "HIGH", color: "text-bubble-warning" };
    if (score >= 45) return { label: "MODERATE", color: "text-yellow-500" };
    return { label: "LOW", color: "text-bubble-success" };
  };

  const getTimeEstimate = (score: number) => {
    if (score >= 80) return "< 30 days";
    if (score >= 65) return "30-90 days";
    if (score >= 45) return "90-180 days";
    return "12+ months";
  };

  const risk = getBurstRisk(score);
  const cappedScore = Math.min(score, 100);
  const bubbleSize = Math.max(140, Math.min(320, 140 + (cappedScore * 1.8)));

  return (
    <div className="relative flex flex-col items-center justify-between h-full p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">{title}</h2>
        <p className="text-muted-foreground text-sm">{subtitle}</p>
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={score}
            className="relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              ...(animation === "pulse" && {
                scale: [1, 1.02, 1],
              }),
              ...(animation === "inflate" && {
                scale: [0.9, 1.1, 1],
              }),
              ...(animation === "shrink" && {
                scale: [1, 0.9, 1],
              }),
            }}
            transition={{ 
              duration: animation === "pulse" ? 2 : 0.6,
              repeat: animation === "pulse" ? Infinity : 0,
              ease: "easeInOut"
            }}
            style={{
              width: bubbleSize,
              height: bubbleSize,
            }}
          >
            {/* Outer glow effect */}
            <motion.div 
              className="absolute inset-0 rounded-full bubble-glow-strong"
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.6, 0.8, 0.6],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Main bubble with gradient */}
            <div 
              className="absolute inset-0 rounded-full border-2 border-primary/20 backdrop-blur-md overflow-hidden"
              style={{
                background: `radial-gradient(circle at 30% 30%, 
                  hsl(var(--bubble-glow) / 0.35) 0%, 
                  hsl(var(--bubble-primary) / 0.25) 30%,
                  hsl(var(--bubble-secondary) / 0.15) 60%, 
                  hsl(var(--bubble-primary) / 0.08) 100%)`,
              }}
            >
              {/* Primary highlight */}
              <motion.div 
                className="absolute top-6 left-6 w-20 h-20 rounded-full"
                style={{
                  background: `radial-gradient(circle, 
                    rgba(255, 255, 255, 0.5) 0%, 
                    rgba(255, 255, 255, 0.2) 40%,
                    transparent 70%)`,
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.6, 0.8, 0.6],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Secondary highlight */}
              <motion.div 
                className="absolute bottom-12 right-12 w-12 h-12 rounded-full"
                style={{
                  background: `radial-gradient(circle, 
                    rgba(255, 255, 255, 0.3) 0%, 
                    transparent 60%)`,
                }}
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              />
              
              {/* Floating particles */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-primary/30"
                  style={{
                    width: `${4 + i * 2}px`,
                    height: `${4 + i * 2}px`,
                    top: `${15 + i * 18}%`,
                    left: `${55 + i * 8}%`,
                  }}
                  animate={{
                    y: [-15, 15, -15],
                    x: [-8, 8, -8],
                    opacity: [0.3, 0.7, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3.5 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  }}
                />
              ))}

              {/* Score display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  className="text-6xl font-bold bg-gradient-to-br from-primary to-bubble-secondary bg-clip-text text-transparent"
                  animate={{ 
                    scale: [1, 1.03, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {Math.round(cappedScore)}
                </motion.div>
                <motion.div 
                  className="text-xs text-foreground/60 uppercase tracking-wider mt-2 font-medium"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Bubble Index
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full space-y-3 mt-8">
        <div className="flex justify-between items-center py-2 border-b border-border/50">
          <span className="text-muted-foreground text-sm font-medium">Bubble Size:</span>
          <span className="text-2xl font-bold text-primary">{cappedScore.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border/50">
          <span className="text-muted-foreground text-sm font-medium">Burst Risk:</span>
          <span className={`text-lg font-bold ${risk.color}`}>{risk.label}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-muted-foreground text-sm font-medium">Est. Time to Burst:</span>
          <span className="text-base font-semibold text-foreground">{getTimeEstimate(cappedScore)}</span>
        </div>
      </div>
    </div>
  );
};