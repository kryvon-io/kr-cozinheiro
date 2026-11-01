"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const isHeading = (line: string) => line.endsWith(":");

/** Lista de ingredientes que dá para ir marcando enquanto cozinha. */
export function IngredientList({ items }: { items: string[] }) {
  const [done, setDone] = useState<Set<number>>(new Set());

  return (
    <ul className="divide-y divide-white/[0.07]">
      {items.map((item, i) =>
        isHeading(item) ? (
          <li key={i} className="label-mono pt-6 pb-3 text-white first:pt-0">
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
              className="flex w-full items-start gap-3.5 py-3.5 text-left outline-none focus-visible:bg-white/5"
            >
              <span
                className={cn(
                  "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors duration-200",
                  done.has(i)
                    ? "border-white bg-white text-black"
                    : "border-white/30"
                )}
              >
                {done.has(i) && <Check className="size-3.5" strokeWidth={2.5} />}
              </span>
              <span
                className={cn(
                  "text-[16px] leading-relaxed transition-colors duration-200",
                  done.has(i) ? "text-fog line-through" : "text-cloud"
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
