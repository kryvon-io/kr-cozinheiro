import { Suspense } from "react";
import Link from "next/link";
import { LogOut, Plus } from "lucide-react";

import { logoutAction } from "@/app/actions";
import { Brand } from "@/components/brand";
import { SidebarNav } from "@/components/sidebar-nav";
import { Button } from "@/components/ui/button";
import { countRecipesByCategory } from "@/lib/recipes";

function LogoutButton({ compact }: { compact?: boolean }) {
  return (
    <form action={logoutAction}>
      <Button
        type="submit"
        variant="ghost"
        size={compact ? "icon" : "default"}
        className={compact ? undefined : "w-full justify-start px-3"}
        title="Sair"
      >
        <LogOut />
        <span className={compact ? "sr-only" : undefined}>Sair</span>
      </Button>
    </form>
  );
}

export async function AppShell({ children }: { children: React.ReactNode }) {
  const counts = await countRecipesByCategory();

  return (
    <div className="min-h-dvh lg:pl-[260px]">
      {/* Barra lateral fixa (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col border-r border-warm-mist/70 bg-sidebar px-3 py-5 lg:flex">
        <div className="px-2">
          <Brand />
        </div>
        <Button asChild className="mx-1 mt-6 justify-start">
          <Link href="/receitas/nova">
            <Plus /> Nova receita
          </Link>
        </Button>
        <div className="mt-6 flex-1 overflow-y-auto">
          <Suspense>
            <SidebarNav counts={counts} />
          </Suspense>
        </div>
        <div className="border-t border-warm-mist/70 pt-3">
          <LogoutButton />
        </div>
      </aside>

      {/* Barra superior (celular/tablet) */}
      <header className="sticky top-0 z-30 border-b border-warm-mist/70 bg-parchment lg:hidden">
        <div className="flex h-14 items-center justify-between gap-3 px-4">
          <Brand />
          <div className="flex items-center gap-1">
            <Button asChild size="icon">
              <Link href="/receitas/nova" aria-label="Nova receita">
                <Plus />
              </Link>
            </Button>
            <LogoutButton compact />
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[900px] px-4 pt-8 pb-16 sm:px-8 lg:pt-12">
        {children}
      </div>
    </div>
  );
}
