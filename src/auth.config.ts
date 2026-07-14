import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

// Base config (no DB-specific bits) — safe to use in middleware
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  // trustHost: true — não precisa de NEXTAUTH_URL, usa a URL do request
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(creds) {
        const email = creds?.email as string | undefined;
        const password = creds?.password as string | undefined;
        if (!email || !password) return null;

        const user = await db.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return null;
        if (user.isGuest) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: user.role,
        };
      },
    }),
    Credentials({
      id: "guest",
      name: "Visitante",
      credentials: {},
      async authorize() {
        const guestEmail = `guest-${Date.now()}-${Math.floor(Math.random() * 10000)}@flashmix.local`;
        const user = await db.user.create({
          data: {
            email: guestEmail,
            name: "Visitante",
            isGuest: true,
            role: "GUEST",
          },
        });
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? "Visitante",
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role ?? "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
};
