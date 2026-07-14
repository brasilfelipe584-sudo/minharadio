"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Radio, MessageSquare, CalendarClock, Gift } from "lucide-react";

const items = [
  { href: "/app", label: "Início", icon: Home },
  { href: "/app/radio", label: "Rádio", icon: Radio },
  { href: "/app/recados", label: "Recados", icon: MessageSquare },
  { href: "/app/programacao", label: "Programação", icon: CalendarClock },
  { href: "/app/promocoes", label: "Promoções", icon: Gift },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-dark border-t border-white/5 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-1.5 sm:max-w-2xl">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2 transition active:scale-95 ${
                active ? "text-[#E30613]" : "text-white/60 hover:text-white"
              }`}
            >
              <span
                className={`grid h-7 w-7 place-items-center ${
                  active ? "drop-shadow-[0_0_8px_rgba(227,6,19,0.8)]" : ""
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.6 : 2} />
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider">
                {item.label}
              </span>
              {active && (
                <span className="absolute -mt-1 h-1 w-8 rounded-full bg-[#E30613] glow-red" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
