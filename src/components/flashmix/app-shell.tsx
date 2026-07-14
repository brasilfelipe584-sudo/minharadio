"use client";

import { AppHeader } from "./app-header";
import { BottomNav } from "./bottom-nav";
import { MiniPlayer } from "./mini-player";
import { PlayerBootstrap } from "./player-bootstrap";
import { SplashOverlay } from "./splash-overlay";
import { usePathname } from "next/navigation";
import { ViewTransitions } from "./view-transitions";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isRadioPage = pathname === "/app/radio";

  return (
    <div className="relative min-h-screen bg-[#090909] text-white">
      <SplashOverlay />
      <PlayerBootstrap />
      <AppHeader />

      <main
        className={`mx-auto max-w-md px-3 pb-32 pt-3 sm:max-w-2xl sm:px-4 ${
          isRadioPage ? "pb-32" : ""
        }`}
      >
        <ViewTransitions>{children}</ViewTransitions>
      </main>

      <MiniPlayer />
      <BottomNav />
    </div>
  );
}
