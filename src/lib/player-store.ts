"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PlaybackState = "idle" | "loading" | "playing" | "paused" | "error";

export interface NowPlaying {
  title: string;
  artist: string;
  coverUrl?: string | null;
  isLive: boolean;
  streamUrl: string;
  streamName: string;
}

interface PlayerState {
  playback: PlaybackState;
  nowPlaying: NowPlaying | null;
  volume: number;
  isMuted: boolean;
  liked: boolean;
  eqBars: number[];
  sleepTimerMin: number;
  sleepTimerEnd: number | null;
  sessionHistory: { title: string; artist: string; at: number }[];
  initialized: boolean;

  setNowPlaying: (np: NowPlaying) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  toggleLike: () => void;
  setEqBars: (bars: number[]) => void;
  startSleepTimer: (min: number) => void;
  cancelSleepTimer: () => void;
  appendHistory: (item: { title: string; artist: string }) => void;
  setInitialized: (v: boolean) => void;
  reset: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      playback: "idle",
      nowPlaying: null,
      volume: 0.8,
      isMuted: false,
      liked: false,
      eqBars: [0.3, 0.6, 0.4, 0.8, 0.5, 0.7, 0.3, 0.9, 0.4, 0.6, 0.5, 0.8],
      sleepTimerMin: 0,
      sleepTimerEnd: null,
      sessionHistory: [],
      initialized: false,

      setNowPlaying: (np) => set({ nowPlaying: np }),
      // Otimista: já muda o estado imediatamente, antes do áudio responder
      play: () => set({ playback: "playing" }),
      pause: () => set({ playback: "paused" }),
      togglePlay: () =>
        set((s) => ({
          playback: s.playback === "playing" ? "paused" : "playing",
        })),
      setVolume: (v) => set({ volume: Math.min(1, Math.max(0, v)), isMuted: v === 0 }),
      toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
      toggleLike: () => set((s) => ({ liked: !s.liked })),
      setEqBars: (bars) => set({ eqBars: bars }),
      startSleepTimer: (min) =>
        set({
          sleepTimerMin: min,
          sleepTimerEnd: Date.now() + min * 60 * 1000,
        }),
      cancelSleepTimer: () => set({ sleepTimerMin: 0, sleepTimerEnd: null }),
      appendHistory: (item) =>
        set((s) => ({
          sessionHistory: [
            { ...item, at: Date.now() },
            ...s.sessionHistory,
          ].slice(0, 50),
        })),
      setInitialized: (v) => set({ initialized: v }),
      reset: () => set({ playback: "idle", nowPlaying: null }),
    }),
    {
      name: "flashmix-player",
      partialize: (s) => ({
        volume: s.volume,
        isMuted: s.isMuted,
        liked: s.liked,
        sessionHistory: s.sessionHistory,
      }),
    }
  )
);
