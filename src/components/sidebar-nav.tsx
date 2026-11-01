"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { BookOpen, Heart } from "lucide-react";

import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";

const item =
  "flex h-9 items-center gap-3 rounded-lg px-3 text-[15px] transition-colors duration-150 outline-none focus-visible:ring-[3px] focus-visible:ring-ring";
const idle = "text-graphite hover:bg-ink/[0.05] hover:text-ink";
const active = "bg-teal text-white";

export function SidebarNav({ counts }: { counts: Record<string, number> }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const onHome = pathname === "/";
  const categoria = onHome ? params.get("categoria") : null;
  const favoritas = onHome && params.get("favoritas") === "1";
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const used = CATEGORIES.filter((c) => counts[c.slug] || c.slug === categoria);

  return (
    <nav className="flex flex-col gap-6" aria-label="Navegação">
      <div className="flex flex-col gap-0.5">
        <Link
          href="/"
          className={cn(item, onHome && !categoria && !favoritas ? active : idle)}
        >
          <BookOpen className="size-4" aria-hidden />
          <span className="flex-1">Todas as receitas</span>
          <span className="text-xs tabular-nums opacity-70">{total}</span>
        </Link>
        <Link href="/?favoritas=1" className={cn(item, favoritas ? active : idle)}>
          <Heart className="size-4" aria-hidden />
          <span className="flex-1">Favoritas</span>
        </Link>
      </div>

      {used.length > 0 && (
        <div className="flex flex-col gap-0.5">
          <p className="px-3 pb-1.5 text-xs text-graphite">Categorias</p>
          {used.map((c) => {
            const Icon = c.icon;
            const isActive = categoria === c.slug;
            return (
              <Link
                key={c.slug}
                href={`/?categoria=${c.slug}`}
                className={cn(item, isActive ? active : idle)}
              >
                <Icon className="size-4" aria-hidden />
                <span className="flex-1 truncate">{c.label}</span>
                <span className="text-xs tabular-nums opacity-70">
                  {counts[c.slug] ?? 0}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
