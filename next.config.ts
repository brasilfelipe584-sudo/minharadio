import type { NextConfig } from "next";

// ⚠️ VARIÁVEIS HARDCODEADAS — para deploy funcionar sem configurar nada no Vercel
// Em produção idealmente deveria estar no painel do Vercel, mas assim funciona direto
const DATABASE_URL = "postgresql://neondb_owner:npg_FM85HkUCXpzu@ep-holy-glade-atms4z5e-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require&pgbouncer=true&connect_timeout=15";
const DIRECT_URL = "postgresql://neondb_owner:npg_FM85HkUCXpzu@ep-holy-glade-atms4z5e-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require&connect_timeout=15";
const AUTH_SECRET = "flashmix-digital-secret-423561410c39a80faecf23dc858416e3cb753fd6d85c40adb99aa4bff272cc54";
const STREAM_URL = "http://s02.taaqui.org:8874/stream";
const STREAM_NAME = "Flash Mix Digital";

// Define as variáveis de ambiente se não estiverem configuradas
// (permite override via painel do Vercel se necessário)
process.env.DATABASE_URL = process.env.DATABASE_URL || DATABASE_URL;
process.env.DIRECT_URL = process.env.DIRECT_URL || DIRECT_URL;
process.env.AUTH_SECRET = process.env.AUTH_SECRET || AUTH_SECRET;
process.env.STREAM_URL = process.env.STREAM_URL || STREAM_URL;
process.env.STREAM_NAME = process.env.STREAM_NAME || STREAM_NAME;
// NEXTAUTH_URL será definido dinamicamente em runtime baseado no request

const nextConfig: NextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
