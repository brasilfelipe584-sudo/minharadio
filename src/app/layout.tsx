import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flash Mix Digital — Rádio Online Premium",
  description:
    "Flash Mix Digital — a rádio online premium com dark mode neon. Ouça ao vivo, recados, programação, notícias, promoções, podcasts e muito mais.",
  keywords: ["Flash Mix Digital", "rádio online", "streaming", "música", "podcast"],
  authors: [{ name: "Flash Mix Digital" }],
  icons: {
    icon: "/logo/flashmix-logo.png",
    apple: "/logo/flashmix-logo.png",
  },
  openGraph: {
    title: "Flash Mix Digital",
    description: "Rádio online premium com design neon e dark mode.",
    siteName: "Flash Mix Digital",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flash Mix Digital",
    description: "Rádio online premium com design neon e dark mode.",
  },
};

export const viewport: Viewport = {
  themeColor: "#090909",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        style={{ background: "#090909" }}
        suppressHydrationWarning
      >
        <SessionProvider>{children}</SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
