"use client";

import { usePlayerStore } from "@/lib/player-store";

// Ondas sonoras animadas que expandem do centro (uso como decoração de fundo)
export function SoundWaves({
  className = "",
  color = "rgba(227, 6, 19, 0.5)",
  count = 3,
}: {
  className?: string;
  color?: string;
  count?: number;
}) {
  const playback = usePlayerStore((s) => s.playback);
  const playing = playback === "playing";

  if (!playing) return null;

  return (
    <div
      className={`pointer-events-none absolute inset-0 flex items-center justify-center ${className}`}
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full animate-wave"
          style={{
            width: 100,
            height: 100,
            border: `2px solid ${color}`,
            animationDelay: `${i * 1}s`,
            animationDuration: `${3 + i * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}
