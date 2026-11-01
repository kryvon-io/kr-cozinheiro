"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, LoaderCircle, Search, X } from "lucide-react";

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("q") ?? "");
  const [pending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function push(q: string) {
    const next = new URLSearchParams(params.toString());
    if (q.trim()) next.set("q", q.trim());
    else next.delete("q");
    const qs = next.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        clearTimeout(timer.current);
        push(value);
      }}
      className="flex h-14 w-full items-center gap-2 rounded-lg border border-white/10 bg-black py-2 pr-2 pl-5 transition-[border-color] duration-200 focus-within:border-white/30"
    >
      <Search className="size-4 shrink-0 text-ash" aria-hidden />
      <input
        type="search"
        name="q"
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          setValue(v);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => push(v), 350);
        }}
        placeholder="Buscar por nome ou ingrediente…"
        aria-label="Buscar receitas"
        className="h-full min-w-0 flex-1 bg-transparent text-base text-cloud outline-none placeholder:text-ash [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            setValue("");
            push("");
          }}
          className="inline-flex size-8 items-center justify-center rounded-full text-ash transition-colors hover:text-white"
          aria-label="Limpar busca"
        >
          <X className="size-4" />
        </button>
      )}
      <button
        type="submit"
        className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white transition-colors duration-200 hover:bg-white/30"
        aria-label="Buscar"
      >
        {pending ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <ArrowRight className="size-4" />
        )}
      </button>
    </form>
  );
}
