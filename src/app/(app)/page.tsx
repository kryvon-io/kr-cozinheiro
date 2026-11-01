import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, SearchX, Smartphone } from "lucide-react";

import { CategoryFilter } from "@/components/category-filter";
import { RecipeCard } from "@/components/recipe-card";
import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { getCategory, isCategory } from "@/lib/categories";
import { countRecipesByCategory, listRecipes } from "@/lib/recipes";

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.slice(0, 100) : undefined;
  const categoria =
    typeof sp.categoria === "string" && isCategory(sp.categoria)
      ? sp.categoria
      : undefined;
  const favoritas = sp.favoritas === "1";

  const [recipes, counts] = await Promise.all([
    listRecipes({ q, category: categoria, favorites: favoritas }),
    countRecipesByCategory(),
  ]);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const filtering = Boolean(q || categoria || favoritas);

  const title = categoria
    ? getCategory(categoria).label
    : favoritas
      ? "Favoritas"
      : "O que vamos cozinhar hoje?";

  return (
    <main>
      <section className="flex flex-col items-center pt-4 pb-8 text-center sm:pt-10">
        <h1 className="heading text-[28px] leading-tight sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-graphite">
          {total === 0
            ? "Seu caderno ainda está vazio."
            : `${total} ${total === 1 ? "receita salva" : "receitas salvas"} no seu caderno`}
        </p>
        {total > 0 && (
          <div className="mt-6 w-full max-w-[640px]">
            <Suspense>
              <SearchBar />
            </Suspense>
          </div>
        )}
      </section>

      {total > 0 && (
        <div className="mb-6 lg:hidden">
          <CategoryFilter current={{ q, categoria, favoritas }} counts={counts} />
        </div>
      )}

      {total === 0 ? (
        <EmptyState />
      ) : recipes.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-warm-mist px-6 py-14 text-center">
          <SearchX className="size-6 text-graphite" strokeWidth={1.5} />
          <p className="text-base font-medium">Nada encontrado</p>
          <p className="max-w-sm text-sm text-graphite">
            {q ? <>Nenhuma receita com “{q}”</> : "Nenhuma receita"}
            {categoria && <> em {getCategory(categoria).label}</>}
            {favoritas && <> entre as favoritas</>}.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-2">
            <Link href="/">Limpar filtros</Link>
          </Button>
        </div>
      ) : (
        <section aria-label="Receitas">
          {filtering && (
            <p className="caption mb-3">
              {recipes.length} {recipes.length === 1 ? "resultado" : "resultados"}
            </p>
          )}
          <div className="grid items-start gap-3 sm:grid-cols-2">
            {recipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function EmptyState() {
  return (
    <section className="mx-auto grid max-w-[640px] gap-3 sm:grid-cols-2">
      <Link
        href="/receitas/nova"
        className="group flex flex-col gap-2 rounded-xl bg-soft-paper p-4 shadow-subtle ring-1 ring-transparent transition-[box-shadow] hover:ring-warm-mist"
      >
        <span className="inline-flex w-fit rounded-full bg-teal px-2 py-0.5 text-[11px] font-medium text-white">
          Comece aqui
        </span>
        <p className="text-base font-medium">Salve sua primeira receita</p>
        <p className="text-sm text-graphite">
          Nome, ingredientes, modo de preparo e, se quiser, uma foto.
        </p>
        <span className="mt-1 inline-flex items-center gap-1 text-sm text-ink">
          Nova receita <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
      <div className="flex flex-col gap-2 rounded-xl bg-soft-paper p-4 shadow-subtle">
        <Smartphone className="size-4 text-ink" aria-hidden />
        <p className="text-base font-medium">Use como app</p>
        <p className="text-sm text-graphite">
          No celular, toque em “Adicionar à tela de início” para abrir o
          caderno direto.
        </p>
      </div>
    </section>
  );
}
