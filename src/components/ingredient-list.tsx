"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const isHeading = (line: string) => line.endsWith(":");

/** Lista de ingredientes que dá para ir marcando enquanto cozinha. */
export function IngredientList({ items }: { items: string[] }) {
  const [done, setDone] = useState<Set<number>>(new Set());

  return (
    <ul className="divide-y divide-warm-mist/60">
      {items.map((item, i) =>
        isHeading(item) ? (
          <li key={i} className="caption pt-5 pb-2 first:pt-0">
            {item.slice(0, -1)}
          </li>
        ) : (
          <li key={i}>
            <button
              type="button"
              onClick={() =>
                setDone((prev) => {
                  const next = new Set(prev);
                  if (next.has(i)) next.delete(i);
                  else next.add(i);
                  return next;
                })
              }
              aria-pressed={done.has(i)}
              className="flex w-full items-start gap-3.5 py-2.5 text-left outline-none focus-visible:bg-ink/[0.04]"
            >
              <span
                className={cn(
                  "mt-0.5 inline-flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors duration-200",
                  done.has(i)
                    ? "border-teal bg-teal text-white"
                    : "border-warm-mist bg-parchment"
                )}
              >
                {done.has(i) && <Check className="size-3" strokeWidth={2.5} />}
              </span>
              <span
                className={cn(
                  "text-[15px] leading-normal transition-colors duration-150",
                  done.has(i) ? "text-ash line-through" : "text-ink"
                )}
              >
                {item}
              </span>
            </button>
          </li>
        )
      )}
    </ul>
  );
}
