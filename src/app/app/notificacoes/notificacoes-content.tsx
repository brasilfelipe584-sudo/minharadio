"use client";

import { Bell, Music, Gift, Radio, Newspaper, Info, CheckCheck } from "lucide-react";
import { useState } from "react";

type Notif = {
  id: string; title: string; message: string; type: string;
  isRead: boolean; createdAt: string; linkUrl?: string | null;
};

export function NotificacoesContent({ items }: { items: Notif[] }) {
  const [localItems, setLocalItems] = useState(items);

  const markAllRead = () => {
    setLocalItems(localItems.map((i) => ({ ...i, isRead: true })));
  };

  const IconFor = ({ type, color }: { type: string; color: string }) => {
    const cls = `h-4 w-4 text-${color}`;
    if (type === "MUSICA") return <Music className={cls} />;
    if (type === "PROMO") return <Gift className={cls} />;
    if (type === "PROGRAMA") return <Radio className={cls} />;
    if (type === "NOTICIA") return <Newspaper className={cls} />;
    return <Info className={cls} />;
  };

  const colorFor = (type: string) => {
    if (type === "MUSICA") return "[#E30613]";
    if (type === "PROMO") return "[#22c55e]";
    if (type === "PROGRAMA") return "[#3b82f6]";
    return "[#B5B5B5]";
  };

  const fmtTime = (iso: string) => {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "Agora";
    if (m < 60) return `${m} min`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Notificações</h1>
          <p className="text-sm text-white/60">{localItems.filter((i) => !i.isRead).length} não lidas</p>
        </div>
        {localItems.some((i) => !i.isRead) && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-white/70 hover:bg-white/5 transition"
          >
            <CheckCheck className="h-3 w-3" />
            Marcar todas
          </button>
        )}
      </header>

      {localItems.length === 0 ? (
        <div className="py-16 text-center">
          <Bell className="mx-auto h-12 w-12 text-white/20" />
          <p className="mt-3 text-sm text-white/50">Nenhuma notificação ainda</p>
        </div>
      ) : (
        <div className="space-y-2">
          {localItems.map((n) => {
            const color = colorFor(n.type);
            return (
              <div
                key={n.id}
                className={`flex gap-3 rounded-2xl p-3 transition ${
                  n.isRead ? "glass opacity-70" : "glass-red"
                }`}
              >
                <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-${color}/15`}>
                  <IconFor type={n.type} color={color} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-white">{n.title}</p>
                    <span className="shrink-0 text-xs text-white/40">{fmtTime(n.createdAt)}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-white/70">{n.message}</p>
                  {!n.isRead && (
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-[#E30613] glow-red" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
