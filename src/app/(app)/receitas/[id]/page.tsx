import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Pencil } from "lucide-react";

import { DeleteRecipeButton } from "@/components/delete-recipe-button";
import { FavoriteButton } from "@/components/favorite-button";
import { IngredientList } from "@/components/ingredient-list";
import { RecipeImage } from "@/components/recipe-image";
import { Button } from "@/components/ui/button";
import { difficultyLabel, formatTime, getCategory } from "@/lib/categories";
import { getRecipe } from "@/lib/recipes";

export async function generateMetadata({
  params,
}: PageProps<"/receitas/[id]">): Promise<Metadata> {
  const { id } = await params;
  const recipe = await getRecipe(id);
  return { title: recipe?.title ?? "Receita" };
}

export default async function RecipePage({ params }: PageProps<"/receitas/[id]">) {
  const { id } = await params;
  const recipe = await getRecipe(id);
  if (!recipe) notFound();

  const cat = getCategory(recipe.category);
  const CategoryIcon = cat.icon;
  const stats = [
    { label: "Tempo", value: formatTime(recipe.totalTimeMinutes) },
    {
      label: "Rende",
      value: recipe.servings
        ? `${recipe.servings} ${recipe.servings === 1 ? "porção" : "porções"}`
        : null,
    },
    { label: "Dificuldade", value: difficultyLabel(recipe.difficulty) },
    {
      label: "Ingredientes",
      value: String(recipe.ingredients.filter((l) => !l.endsWith(":")).length),
    },
  ].filter((s) => s.value);

  const stepNumbers = recipe.steps.reduce<number[]>((acc, step) => {
    const last = acc.length ? acc[acc.length - 1] : 0;
    acc.push(step.endsWith(":") ? last : last + 1);
    return acc;
  }, []);
  const sourceHost = hostOf(recipe.source);

  return (
    <main>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-sm py-1 text-sm text-graphite transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" /> Receitas
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <FavoriteButton id={recipe.id} isFavorite={recipe.isFavorite} />
          <Button asChild variant="outline">
            <Link href={`/receitas/${recipe.id}/editar`}>
              <Pencil /> Editar
            </Link>
          </Button>
          <DeleteRecipeButton id={recipe.id} title={recipe.title} />
        </div>
      </div>

      <header className="pt-8 pb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-warm-mist px-3 py-1 text-sm text-ink">
          <CategoryIcon className="size-3.5" aria-hidden />
          {cat.label}
        </span>
        <h1 className="heading mt-4 text-3xl leading-tight text-balance sm:text-[40px]">
          {recipe.title}
        </h1>
        {recipe.description && (
          <p className="mt-3 max-w-[640px] text-base text-graphite">
            {recipe.description}
          </p>
        )}
      </header>

      {stats.length > 0 && (
        <dl className="mb-6 grid grid-cols-2 overflow-hidden rounded-xl border border-warm-mist sm:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={[
                "px-4 py-3",
                i % 2 === 1 ? "border-l border-warm-mist" : "",
                i >= 2 ? "border-t border-warm-mist sm:border-t-0" : "",
                i === 2 ? "sm:border-l" : "",
              ].join(" ")}
            >
              <dt className="caption">{s.label}</dt>
              <dd className="mt-0.5 text-base font-medium text-ink">{s.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {recipe.hasImage && (
        <div className="mb-6 aspect-[16/9] overflow-hidden rounded-xl bg-muted">
          <RecipeImage
            id={recipe.id}
            version={recipe.updatedAt}
            alt={recipe.title}
            priority
          />
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-[300px_1fr]">
        <section
          aria-labelledby="ingredientes"
          className="rounded-xl bg-soft-paper p-4 shadow-subtle sm:p-5 md:sticky md:top-6 md:self-start"
        >
          <h2 id="ingredientes" className="text-base font-medium">
            Ingredientes
          </h2>
          <p className="mt-0.5 mb-3 text-xs text-graphite">Toque para marcar</p>
          <IngredientList items={recipe.ingredients} />
        </section>

        <section
          aria-labelledby="preparo"
          className="rounded-xl bg-soft-paper p-4 shadow-subtle sm:p-5"
        >
          <h2 id="preparo" className="text-base font-medium">
            Modo de preparo
          </h2>
          <ol className="mt-4 space-y-4">
            {recipe.steps.map((step, i) =>
              step.endsWith(":") ? (
                <li key={i} className="caption pt-2">
                  {step.slice(0, -1)}
                </li>
              ) : (
                <li key={i} className="grid grid-cols-[28px_1fr] gap-3">
                  <span className="inline-flex size-6 items-center justify-center rounded-full border border-warm-mist text-xs font-medium text-ink tabular-nums">
                    {stepNumbers[i]}
                  </span>
                  <p className="text-[15px] leading-relaxed text-ink">{step}</p>
                </li>
              )
            )}
          </ol>

          {recipe.notes && (
            <div className="mt-6 rounded-lg border border-warm-mist bg-parchment p-4">
              <p className="caption">Observações</p>
              <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-line text-ink">
                {recipe.notes}
              </p>
            </div>
          )}

          {recipe.source && (
            <p className="mt-4 flex flex-wrap items-center gap-1.5 text-xs text-graphite">
              Fonte:{" "}
              {sourceHost ? (
                <a
                  href={recipe.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 break-all text-ink underline underline-offset-4 decoration-warm-mist hover:decoration-ink"
                >
                  {sourceHost}
                  <ExternalLink className="size-3" />
                </a>
              ) : (
                <span className="text-ink">{recipe.source}</span>
              )}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

function hostOf(source: string | null) {
  if (!source || !/^https?:\/\//i.test(source)) return null;
  try {
    return new URL(source).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}
