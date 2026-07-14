"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Wrapper que detecta mudança de rota e aplica transição suave + scroll top
export function ViewTransitions({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll suave para o topo em troca de rota
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [pathname]);

  return (
    <div
      ref={mainRef}
      key={pathname}
      className="animate-fade-in-up"
      style={{ animationDuration: "0.25s" }}
    >
      {children}
    </div>
  );
}
