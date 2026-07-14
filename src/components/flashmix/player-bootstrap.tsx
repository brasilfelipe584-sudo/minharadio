"use client";

import { useEffect } from "react";
import { usePlayerStore } from "@/lib/player-store";
import { useAudioPlayer } from "@/hooks/use-audio-player";

// Inicializa o player: carrega "now playing" e mantém o <audio> sincronizado
export function PlayerBootstrap() {
  const { setNowPlaying, playback, play } = usePlayerStore();
  useAudioPlayer();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/radio/now-playing");
        const data = await res.json();
        if (cancelled) return;
        setNowPlaying({
          title: data.title,
          artist: data.artist,
          coverUrl: data.coverUrl,
          isLive: data.isLive,
          streamUrl: data.streamUrl,
          streamName: data.streamName,
        });
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setNowPlaying]);

  return null;
}
