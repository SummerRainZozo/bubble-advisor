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
    if (score >= 85) return { label: "CRITICAL", color: "text-bubble-danger" };
    if (score >= 70) return { label: "HIGH", color: "text-bubble-warning" };
    if (score >= 50) return { label: "MODERATE", color: "text-bubble-warning" };
    return { label: "LOW", color: "text-bubble-success" };
  };

  const getTimeEstimate = (score: number) => {
    if (score >= 85) return "< 30 days";
    if (score >= 70) return "30-90 days";
    if (score >= 50) return "90+ days";
    return "12+ months";
  };

  const risk = getBurstRisk(score);
  const bubbleSize = Math.max(120, Math.min(280, 120 + (score * 1.6)));

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
            {/* Outer glow */}
            <div 
              className="absolute inset-0 rounded-full bubble-glow-strong"
              style={{
                background: `radial-gradient(circle at 30% 30%, 
                  hsl(var(--bubble-glow) / 0.6) 0%, 
                  hsl(var(--bubble-primary) / 0.4) 40%, 
                  transparent 70%)`,
              }}
            />
            
            {/* Main bubble */}
            <div 
              className="absolute inset-0 rounded-full border-4 border-primary/30 backdrop-blur-sm"
              style={{
                background: `radial-gradient(circle at 35% 35%, 
                  hsl(var(--bubble-glow) / 0.3) 0%, 
                  hsl(var(--bubble-primary) / 0.2) 50%, 
                  hsl(var(--bubble-primary) / 0.1) 100%)`,
              }}
            >
              {/* Highlight */}
              <div 
                className="absolute top-8 left-8 w-16 h-16 rounded-full"
                style={{
                  background: `radial-gradient(circle, 
                    rgba(255, 255, 255, 0.4) 0%, 
                    transparent 70%)`,
                }}
              />
              
              {/* Floating particles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-primary/40"
                  style={{
                    top: `${20 + i * 25}%`,
                    left: `${60 + i * 10}%`,
                  }}
                  animate={{
                    y: [-10, 10, -10],
                    x: [-5, 5, -5],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5,
                  }}
                />
              ))}

              {/* Score display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  className="text-5xl font-bold text-primary"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {Math.round(score)}
                </motion.div>
                <div className="text-xs text-primary/70 uppercase tracking-wider mt-1">
                  Bubble Index
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full space-y-3 mt-8">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">Bubble Size:</span>
          <span className="text-xl font-bold text-primary">{score.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">Burst Risk:</span>
          <span className={`text-lg font-bold ${risk.color}`}>{risk.label}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">Est. Time to Burst:</span>
          <span className="text-base font-medium text-foreground">{getTimeEstimate(score)}</span>
        </div>
      </div>
    </div>
  );
};