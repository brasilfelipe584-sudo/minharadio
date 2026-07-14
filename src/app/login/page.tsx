"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, User, Eye, EyeOff, Loader2, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState<"email" | "guest" | null>(null);
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    city: "",
  });

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading("email");

    try {
      if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erro ao cadastrar");
      }

      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Credenciais inválidas");
      }

      // Busca a sessão para ver o role do usuário e redirecionar adequadamente
      try {
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        const role = session?.user?.role;

        if (role === "ADMIN") {
          // Admin vai direto pro painel admin
          router.push("/admin");
        } else {
          // Usuário comum vai pro app
          router.push("/app");
        }
      } catch {
        // Se não conseguir buscar a sessão, vai pro app
        router.push("/app");
      }
      router.refresh();
    } catch (e: any) {
      setError(e.message ?? "Erro ao entrar");
      setLoading(null);
    }
  };

  const enterAsGuest = async () => {
    setLoading("guest");
    try {
      const result = await signIn("guest", { redirect: false });
      if (result?.error) throw new Error("Erro ao entrar como visitante");
      router.push("/app");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
      setLoading(null);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090909] text-white">
      {/* Glow de fundo */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(227,6,19,0.25) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(11,24,54,0.7) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-8">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center animate-splash-scale animate-splash-glow">
          <Image
            src="/logo/flashmix-logo.png"
            alt="Flash Mix Digital"
            width={220}
            height={150}
            priority
          />
          <p className="mt-2 text-xs uppercase tracking-[0.4em] text-white/60">
            Rádio Online
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex rounded-full bg-white/5 p-1">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition ${
              mode === "login" ? "bg-[#E30613] text-white glow-red" : "text-white/60"
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition ${
              mode === "register" ? "bg-[#E30613] text-white glow-red" : "text-white/60"
            }`}
          >
            Cadastrar
          </button>
        </div>

        <form onSubmit={submitEmail} className="space-y-3">
          {mode === "register" && (
            <Field
              icon={User}
              type="text"
              placeholder="Nome completo"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              required
            />
          )}
          <Field
            icon={Mail}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
            required
          />
          <div className="relative">
            <Field
              icon={Lock}
              type={showPwd ? "text" : "password"}
              placeholder="Senha"
              value={form.password}
              onChange={(v) => setForm({ ...form, password: v })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              aria-label="Mostrar senha"
            >
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {mode === "register" && (
            <Field
              icon={User}
              type="text"
              placeholder="Cidade (opcional)"
              value={form.city}
              onChange={(v) => setForm({ ...form, city: v })}
            />
          )}

          {error && (
            <p className="rounded-xl bg-[#E30613]/15 px-3 py-2 text-sm text-[#ff5560]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading !== null}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#E30613] py-3.5 text-sm font-bold uppercase tracking-wider text-white glow-red hover:scale-[1.02] active:scale-95 transition disabled:opacity-60"
          >
            {loading === "email" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                {mode === "login" ? "Entrar" : "Criar Conta"}
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs uppercase tracking-widest text-white/40">ou</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Visitante */}
        <button
          onClick={enterAsGuest}
          disabled={loading !== null}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition disabled:opacity-60"
        >
          {loading === "guest" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <User className="h-4 w-4" />
              Entrar como Visitante
            </>
          )}
        </button>

        {/* Social (placeholder - mostrar visualmente mas não funcional) */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {["Google", "Apple", "Facebook"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setError(`${s} OAuth será configurado em produção`)}
              className="rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-medium text-white/70 hover:bg-white/10 transition"
            >
              {s}
            </button>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-white/40">
          Ao continuar, você concorda com nossos{" "}
          <Link href="/sobre" className="underline hover:text-white/70">
            Termos
          </Link>{" "}
          e{" "}
          <Link href="/sobre" className="underline hover:text-white/70">
            Política de Privacidade
          </Link>
        </p>

        {/* Demo admin hint */}
        <p className="mt-4 text-center text-[10px] text-white/30">
          Demo: admin@flashmix.com / admin123
        </p>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
  required,
}: {
  icon: any;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-10 pr-3 text-sm text-white placeholder:text-white/40 focus:border-[#E30613]/60 focus:outline-none focus:ring-1 focus:ring-[#E30613]/30 transition"
      />
    </div>
  );
}
