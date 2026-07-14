"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function SplashOverlay() {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 2200);
    const t2 = setTimeout(() => setShow(false), 2900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#090909] ${
        fadeOut ? "animate-fade-out" : ""
      }`}
      aria-hidden={!show}
    >
      {/* Glow radial de fundo */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(227,6,19,0.25) 0%, transparent 60%)",
        }}
      />

      {/* Logo com glow pulsante */}
      <div className="relative animate-splash-scale animate-splash-glow">
        <Image
          src="/logo/flashmix-logo.png"
          alt="Flash Mix Digital"
          width={280}
          height={192}
          priority
          className="object-contain"
        />
      </div>

      {/* Equalizer animado */}
      <div className="mt-8 flex items-end gap-[3px] h-8">
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            className="eq-bar"
            style={{
              width: 4,
              height: "100%",
              background: "linear-gradient(to top, #E30613, #FFFFFF)",
              borderRadius: 2,
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${0.7 + (i % 4) * 0.15}s`,
              boxShadow: "0 0 8px rgba(227,6,19,0.7)",
            }}
          />
        ))}
      </div>

      <p className="mt-6 text-sm uppercase tracking-[0.3em] text-white/60 font-medium">
        Carregando
      </p>
    </div>
  );
}
