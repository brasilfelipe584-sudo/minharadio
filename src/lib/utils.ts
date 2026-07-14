import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─────────────────────────────────────────────────────────────
// FORMATAÇÃO DE DATA — sempre em America/Sao_Paulo
// Evita erro de hidratação: servidor (UTC) vs cliente (browser)
// ─────────────────────────────────────────────────────────────

const TZ = "America/Sao_Paulo";

/** "14/07/2026" */
export function formatDate(iso: string | Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}

/** "14 de julho" */
export function formatDateShort(iso: string | Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: TZ,
    day: "2-digit",
    month: "short",
  }).format(new Date(iso));
}

/** "14 de julho de 2026" */
export function formatDateLong(iso: string | Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: TZ,
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

/** "14/07/2026 14:30" */
export function formatDateTime(iso: string | Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/** "14:30" */
export function formatTime(iso: string | Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/** "jul/2026" */
export function formatMonthYear(iso: string | Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: TZ,
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}
