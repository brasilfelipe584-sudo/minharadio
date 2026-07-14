"use client";

import { usePlayerStore } from "@/lib/player-store";
import { useState, useEffect } from "react";

interface EqVisualizerProps {
  bars?: number;
  className?: string;
  barColor?: string;
  height?: number;
}

// Equalizer visual animado (CSS puro, sincronizado com o estado de play/pause)
export function EqVisualizer({
  bars = 12,
  className = "",
  barColor = "#E30613",
  height = 24,
}: EqVisualizerProps) {
  const playback = usePlayerStore((s) => s.playback);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // No SSR sempre renderiza como "pausado" para evitar mismatch
  const paused = !mounted || playback !== "playing";

  return (
    <div
      className={`flex items-end gap-[2px] ${className}`}
      style={{ height }}
      aria-hidden
    >
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={paused ? "" : "eq-bar"}
          style={{
            display: "block",
            width: 3,
            height: paused ? "30%" : "100%",
            background: `linear-gradient(to top, ${barColor}, #FFFFFF)`,
            borderRadius: 2,
            animationDelay: `${(i % 6) * 0.12}s`,
            animationDuration: `${0.7 + (i % 5) * 0.15}s`,
            opacity: paused ? 0.4 : 1,
            transition: "height 0.3s",
            boxShadow: `0 0 6px ${barColor}80`,
          }}
        />
      ))}
    </div>
  );
}
