import { NextResponse } from "next/server";
import { signIn } from "@/auth";

export async function POST() {
  // Cria sessão de visitante e redireciona para home
  try {
    await signIn("guest", { redirect: false });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erro" }, { status: 500 });
  }
}
