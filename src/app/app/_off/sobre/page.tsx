import { AppShell } from "@/components/flashmix/app-shell";
import Image from "next/image";
import Link from "next/link";

export default function SobrePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <header className="text-center">
          <div className="mx-auto mb-3 animate-splash-glow">
            <Image
              src="/logo/flashmix-logo.png"
              alt="Flash Mix Digital"
              width={200}
              height={137}
              priority
              className="mx-auto"
            />
          </div>
          <h1 className="text-2xl font-bold text-white">Flash Mix Digital</h1>
          <p className="text-sm text-white/60">Versão 1.0.0</p>
        </header>

        <section className="glass rounded-3xl p-4">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-[#E30613]">Sobre</h2>
          <p className="text-sm leading-relaxed text-white/80">
            A Flash Mix Digital é uma rádio online premium que combina o melhor da música,
            informação e entretenimento em uma única plataforma. Com design moderno inspirado nos
            melhores apps de streaming, oferecemos uma experiência única de audição com dark mode
            neon, equalizer animado e player em segundo plano.
          </p>
        </section>

        <section className="glass rounded-3xl p-4">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#E30613]">Recursos</h2>
          <ul className="space-y-2 text-sm text-white/80">
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#E30613]" /> Streaming ao vivo com player em segundo plano</li>
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#E30613]" /> Notícias, programação e promoções em tempo real</li>
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#E30613]" /> Recados dos ouvintes com resposta da rádio</li>
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#E30613]" /> Favoritos e histórico personalizado</li>
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#E30613]" /> Sleep timer e controle de volume</li>
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#E30613]" /> Design dark premium com neon glow</li>
          </ul>
        </section>

        <section className="glass rounded-3xl p-4">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#E30613]">Contato</h2>
          <div className="space-y-2 text-sm">
            <a href="#" className="block text-white/80 hover:text-[#E30613] transition">📷 Instagram @flashmixdigital</a>
            <a href="#" className="block text-white/80 hover:text-[#E30613] transition">👍 Facebook /flashmixdigital</a>
            <a href="#" className="block text-white/80 hover:text-[#E30613] transition">💬 WhatsApp (00) 0000-0000</a>
            <a href="#" className="block text-white/80 hover:text-[#E30613] transition">🌐 Site www.flashmix.com.br</a>
          </div>
        </section>

        <section className="glass rounded-3xl p-4">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#E30613]">Legal</h2>
          <div className="space-y-2 text-sm">
            <Link href="#" className="block text-white/80 hover:text-[#E30613] transition">Política de Privacidade</Link>
            <Link href="#" className="block text-white/80 hover:text-[#E30613] transition">Termos de Uso</Link>
            <Link href="#" className="block text-white/80 hover:text-[#E30613] transition">Licenças</Link>
          </div>
        </section>

        <p className="px-4 text-center text-xs text-white/40">
          © 2026 Flash Mix Digital. Todos os direitos reservados.
        </p>
      </div>
    </AppShell>
  );
}
