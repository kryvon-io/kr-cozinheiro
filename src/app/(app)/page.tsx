import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, SearchX } from "lucide-react";

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

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
      <section className="reveal flex flex-col items-center pt-14 pb-10 text-center sm:pt-20 sm:pb-14">
        <span className="label-mono inline-flex rounded-full border border-white/15 bg-white/[0.08] px-5 py-2.5 text-white/90">
          {total === 0
            ? "Seu caderno está vazio"
            : `${total} ${total === 1 ? "receita salva" : "receitas salvas"}`}
        </span>
        <h1 className="display mt-7 max-w-[900px] text-[52px] sm:text-[80px] lg:text-[96px]">
          Tudo o que você <em className="italic">cozinha</em>, num só lugar
        </h1>
        <p className="mt-6 max-w-[560px] text-[17px] leading-relaxed font-light text-ash sm:text-lg">
          Guarde suas receitas, encontre pelo nome ou por um ingrediente e
          consulte quando quiser, do celular ou do computador.
        </p>

        {total > 0 && (
          <div className="mt-10 w-full max-w-[640px]">
            <Suspense>
              <SearchBar />
            </Suspense>
          </div>
        )}
      </section>

      {total > 0 && (
        <div className="mb-10">
          <CategoryFilter current={{ q, categoria, favoritas }} counts={counts} />
        </div>
      )}

      {total === 0 ? (
        <EmptyState />
      ) : recipes.length === 0 ? (
        <div className="flex flex-col items-center gap-5 rounded-[30px] border border-white/10 px-6 py-20 text-center">
          <SearchX className="size-8 text-ash" strokeWidth={1.25} />
          <p className="font-serif text-3xl font-light text-cloud">
            Nada encontrado
          </p>
          <p className="max-w-sm text-ash">
            {q ? <>Nenhuma receita com “{q}”</> : "Nenhuma receita"}
            {categoria && <> em {getCategory(categoria).label}</>}
            {favoritas && <> entre as favoritas</>}.
          </p>
          <Button asChild variant="outline">
            <Link href="/">Limpar filtros</Link>
          </Button>
        </div>
      ) : (
        <section aria-label="Receitas">
          {filtering && (
            <p className="label-mono mb-6 text-ash">
              {recipes.length}{" "}
              {recipes.length === 1 ? "resultado" : "resultados"}
            </p>
          )}
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
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
    <section className="grid gap-3 pb-10 md:grid-cols-3">
      <div className="flex flex-col justify-between gap-12 rounded-[30px] bg-iris-gleam p-8 text-white md:col-span-2">
        <span className="label-mono text-white/80">Primeiro passo</span>
        <div>
          <h2 className="font-serif text-[38px] leading-[0.95] font-light sm:text-5xl">
            Salve sua primeira receita
          </h2>
          <p className="mt-4 max-w-md text-white/85">
            Nome, ingredientes, modo de preparo e, se quiser, uma foto do
            prato pronto.
          </p>
        </div>
        <Button asChild className="self-start">
          <Link href="/receitas/nova">
            Nova receita <ArrowRight />
          </Link>
        </Button>
      </div>
      <div className="flex flex-col justify-between gap-12 rounded-[30px] bg-silver p-8 text-black">
        <span className="label-mono text-black/60">Dica</span>
        <p className="font-serif text-[26px] leading-[1.1] font-light">
          No celular, use “Adicionar à tela de início” para abrir o caderno
          como um app.
        </p>
      </div>
    </section>
  );
}
