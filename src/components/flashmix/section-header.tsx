"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  href?: string;
  hrefLabel?: string;
}

export function SectionHeader({ title, href, hrefLabel = "Ver todos" }: SectionHeaderProps) {
  return (
    <div className="mb-3 flex items-center justify-between px-1">
      <h3 className="text-base font-bold uppercase tracking-wide text-white">
        {title}
      </h3>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#E30613] hover:text-[#ff1f2c]"
        >
          {hrefLabel}
          <ChevronRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}
