import Link from "next/link";
import { Heart } from "lucide-react";

import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";

function hrefWith(
  current: { q?: string; categoria?: string; favoritas?: boolean },
  patch: Partial<{ categoria: string | undefined; favoritas: boolean }>
) {
  const next = { ...current, ...patch };
  const params = new URLSearchParams();
  if (next.q) params.set("q", next.q);
  if (next.categoria) params.set("categoria", next.categoria);
  if (next.favoritas) params.set("favoritas", "1");
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}

const chip =
  "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm transition-colors duration-150";
const on = "bg-teal text-white";
const off = "border border-warm-mist text-ink hover:border-ash";

/** Filtros em "pílulas" (usados no celular; no desktop ficam na barra lateral). */
export function CategoryFilter({
  current,
  counts,
}: {
  current: { q?: string; categoria?: string; favoritas?: boolean };
  counts: Record<string, number>;
}) {
  const available = CATEGORIES.filter(
    (c) => counts[c.slug] || c.slug === current.categoria
  );

  return (
    <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max gap-2">
        <Link
          href={hrefWith(current, { categoria: undefined, favoritas: false })}
          className={cn(chip, !current.categoria && !current.favoritas ? on : off)}
        >
          Todas
        </Link>
        <Link
          href={hrefWith(current, { favoritas: !current.favoritas })}
          className={cn(chip, current.favoritas ? on : off)}
        >
          <Heart className="size-3.5" aria-hidden /> Favoritas
        </Link>
        {available.map((c) => {
          const active = current.categoria === c.slug;
          return (
            <Link
              key={c.slug}
              href={hrefWith(current, { categoria: active ? undefined : c.slug })}
              className={cn(chip, active ? on : off)}
            >
              {c.label}
              <span className={active ? "text-white/75" : "text-ash"}>
                {counts[c.slug] ?? 0}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
