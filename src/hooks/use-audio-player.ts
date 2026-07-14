"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePlayerStore } from "@/lib/player-store";

// Hook que sincroniza o <audio> real com o store zustand
export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    playback,
    nowPlaying,
    volume,
    isMuted,
    togglePlay,
    pause,
  } = usePlayerStore();

  // Inicializa elemento audio uma única vez
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "none";
      audioRef.current.crossOrigin = "anonymous";
    }
  }, []);

  // Atualiza src quando muda a música/stream
  useEffect(() => {
    if (!audioRef.current || !nowPlaying?.streamUrl) return;
    if (audioRef.current.src !== nowPlaying.streamUrl) {
      audioRef.current.src = nowPlaying.streamUrl;
      // Se estava tocando, retoma
      if (playback === "playing") {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [nowPlaying?.streamUrl, playback]);

  // Play/pause
  useEffect(() => {
    if (!audioRef.current) return;
    if (playback === "playing") {
      audioRef.current.play().catch(() => {});
    } else if (playback === "paused") {
      audioRef.current.pause();
    }
  }, [playback]);

  // Volume
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Sleep timer
  const sleepTimerEnd = usePlayerStore((s) => s.sleepTimerEnd);
  useEffect(() => {
    if (!sleepTimerEnd) return;
    const ms = sleepTimerEnd - Date.now();
    if (ms <= 0) {
      pause();
      usePlayerStore.getState().cancelSleepTimer();
      return;
    }
    const t = setTimeout(() => {
      pause();
      usePlayerStore.getState().cancelSleepTimer();
    }, ms);
    return () => clearTimeout(t);
  }, [sleepTimerEnd, pause]);

  // Media Session API (lock screen / background)
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.mediaSession) return;
    if (!nowPlaying) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: nowPlaying.title,
      artist: nowPlaying.artist,
      album: nowPlaying.streamName,
      artwork: nowPlaying.coverUrl
        ? [{ src: nowPlaying.coverUrl, sizes: "512x512", type: "image/jpeg" }]
        : [],
    });

    navigator.mediaSession.setActionHandler("play", () => togglePlay());
    navigator.mediaSession.setActionHandler("pause", () => togglePlay());
    navigator.mediaSession.setActionHandler("stop", () => pause());
  }, [nowPlaying, togglePlay, pause]);

  const seek = useCallback((t: number) => {
    if (audioRef.current) audioRef.current.currentTime = t;
  }, []);

  return { audioRef, seek };
}
