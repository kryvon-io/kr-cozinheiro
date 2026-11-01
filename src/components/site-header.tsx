import Link from "next/link";
import { LogOut, Plus } from "lucide-react";

import { logoutAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-obsidian/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-baseline gap-2 rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <span className="font-serif text-[26px] leading-none font-light text-white">
            <em>KR</em> Cozinheiro
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Button asChild size="sm" className="h-10 px-3 sm:px-4">
            <Link href="/receitas/nova">
              <Plus />
              <span className="hidden sm:inline">Nova receita</span>
              <span className="sr-only sm:hidden">Nova receita</span>
            </Link>
          </Button>
          <form action={logoutAction}>
            <Button
              type="submit"
              variant="ghost"
              size="icon-sm"
              className="size-10"
              title="Sair"
            >
              <LogOut />
              <span className="sr-only">Sair</span>
            </Button>
          </form>
        </nav>
      </div>
    </header>
  );
}
