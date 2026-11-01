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
  "label-mono inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-4 transition-colors duration-200";

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
    <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap sm:justify-center">
        <Link
          href={hrefWith(current, { categoria: undefined, favoritas: false })}
          className={cn(
            chip,
            !current.categoria && !current.favoritas
              ? "border-white bg-white text-black"
              : "border-white/15 bg-white/[0.06] text-white/80 hover:bg-white/10"
          )}
        >
          Todas
        </Link>
        <Link
          href={hrefWith(current, { favoritas: !current.favoritas })}
          className={cn(
            chip,
            current.favoritas
              ? "border-white bg-white text-black"
              : "border-white/15 bg-white/[0.06] text-white/80 hover:bg-white/10"
          )}
        >
          <Heart className="size-3.5" aria-hidden /> Favoritas
        </Link>
        {available.map((c) => {
          const active = current.categoria === c.slug;
          return (
            <Link
              key={c.slug}
              href={hrefWith(current, {
                categoria: active ? undefined : c.slug,
              })}
              className={cn(
                chip,
                active
                  ? "border-white bg-white text-black"
                  : "border-white/15 bg-white/[0.06] text-white/80 hover:bg-white/10"
              )}
            >
              {c.label}
              <span className={active ? "text-black/50" : "text-fog"}>
                {counts[c.slug] ?? 0}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
