"use client";

import { useState } from "react";
import { Bell, Globe, Volume2, Moon, AlarmClock, Download, Trash2, Info, ChevronRight } from "lucide-react";
import { usePlayerStore } from "@/lib/player-store";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";

export function ConfiguracoesContent() {
  const { toast } = useToast();
  const { volume, setVolume } = usePlayerStore();

  const [notifMusic, setNotifMusic] = useState(true);
  const [notifPromo, setNotifPromo] = useState(true);
  const [notifProgram, setNotifProgram] = useState(false);
  const [notifNews, setNotifNews] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [lang, setLang] = useState("pt-BR");
  const [quality, setQuality] = useState("auto");

  const clearCache = () => {
    if (typeof window !== "undefined") {
      // Limpa localStorage relacionado ao player
      localStorage.removeItem("flashmix-player");
      toast({ title: "Cache limpo", description: "Os dados locais foram removidos." });
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Configurações</h1>
        <p className="text-sm text-white/60">Personalize sua experiência</p>
      </header>

      {/* Notificações */}
      <section>
        <h3 className="mb-2 flex items-center gap-2 px-1 text-xs uppercase tracking-widest text-white/40">
          <Bell className="h-3 w-3" /> Notificações
        </h3>
        <div className="glass overflow-hidden rounded-2xl">
          {[
            { label: "Novas músicas", desc: "Avisar quando uma música que você curtiu tocar", checked: notifMusic, set: setNotifMusic },
            { label: "Promoções", desc: "Receber alertas de novas promoções", checked: notifPromo, set: setNotifPromo },
            { label: "Programas", desc: "Avisar quando um programa favorito começar", checked: notifProgram, set: setNotifProgram },
            { label: "Notícias", desc: "Receber notificações de notícias em destaque", checked: notifNews, set: setNotifNews },
          ].map((item, i, arr) => (
            <div
              key={item.label}
              className={`flex items-center justify-between p-3 ${i < arr.length - 1 ? "border-b border-white/5" : ""}`}
            >
              <div className="mr-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-white/50">{item.desc}</p>
              </div>
              <Switch checked={item.checked} onCheckedChange={item.set} />
            </div>
          ))}
        </div>
      </section>

      {/* Player */}
      <section>
        <h3 className="mb-2 flex items-center gap-2 px-1 text-xs uppercase tracking-widest text-white/40">
          <Volume2 className="h-3 w-3" /> Player
        </h3>
        <div className="glass overflow-hidden rounded-2xl">
          <div className="border-b border-white/5 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-white">Volume padrão</span>
              <span className="text-xs text-white/60">{Math.round(volume * 100)}%</span>
            </div>
            <Slider
              value={[volume * 100]}
              onValueChange={(v) => setVolume(v[0] / 100)}
              max={100}
              step={1}
            />
          </div>
          <div className="flex items-center justify-between p-3">
            <div>
              <p className="text-sm font-medium text-white">Auto-play</p>
              <p className="text-xs text-white/50">Iniciar rádio automaticamente ao abrir o app</p>
            </div>
            <Switch checked={autoPlay} onCheckedChange={setAutoPlay} />
          </div>
          <div className="border-t border-white/5 p-3">
            <p className="mb-2 text-sm font-medium text-white">Qualidade do áudio</p>
            <Select value={quality} onValueChange={setQuality}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Automática (recomendado)</SelectItem>
                <SelectItem value="low">Baixa (64 kbps)</SelectItem>
                <SelectItem value="mid">Média (128 kbps)</SelectItem>
                <SelectItem value="high">Alta (256 kbps)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Aparência */}
      <section>
        <h3 className="mb-2 flex items-center gap-2 px-1 text-xs uppercase tracking-widest text-white/40">
          <Moon className="h-3 w-3" /> Aparência
        </h3>
        <div className="glass overflow-hidden rounded-2xl">
          <div className="flex items-center justify-between p-3 border-b border-white/5">
            <div>
              <p className="text-sm font-medium text-white">Tema</p>
              <p className="text-xs text-white/50">Dark mode premium (sempre ativo)</p>
            </div>
            <span className="rounded-full bg-[#E30613]/15 px-3 py-1 text-xs font-bold uppercase text-[#E30613]">
              Dark
            </span>
          </div>
          <div className="p-3">
            <p className="mb-2 text-sm font-medium text-white">Idioma</p>
            <Select value={lang} onValueChange={setLang}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="es-ES">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Dados */}
      <section>
        <h3 className="mb-2 flex items-center gap-2 px-1 text-xs uppercase tracking-widest text-white/40">
          <Download className="h-3 w-3" /> Dados e Armazenamento
        </h3>
        <div className="glass overflow-hidden rounded-2xl">
          <button
            onClick={clearCache}
            className="flex w-full items-center justify-between p-3 hover:bg-white/5 transition"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="h-5 w-5 text-[#E30613]" />
              <div className="text-left">
                <p className="text-sm font-medium text-white">Limpar cache</p>
                <p className="text-xs text-white/50">Remove dados locais e histórico de navegação</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-white/40" />
          </button>
        </div>
      </section>

      {/* Sobre */}
      <section>
        <h3 className="mb-2 flex items-center gap-2 px-1 text-xs uppercase tracking-widest text-white/40">
          <Info className="h-3 w-3" /> Sobre
        </h3>
        <div className="glass rounded-2xl p-4 text-center">
          <p className="text-sm font-bold text-white">Flash Mix Digital</p>
          <p className="text-xs text-white/60">Versão 1.0.0</p>
          <div className="mt-3 flex justify-center gap-3 text-xs text-white/70">
            <Link href="/app/sobre" className="hover:text-[#E30613]">Política de Privacidade</Link>
            <span>•</span>
            <Link href="/app/sobre" className="hover:text-[#E30613]">Termos</Link>
          </div>
          <div className="mt-3 flex justify-center gap-4 text-xs text-white/70">
            <a href="#" className="hover:text-[#E30613]">Instagram</a>
            <a href="#" className="hover:text-[#E30613]">Facebook</a>
            <a href="#" className="hover:text-[#E30613]">WhatsApp</a>
          </div>
        </div>
      </section>
    </div>
  );
}
