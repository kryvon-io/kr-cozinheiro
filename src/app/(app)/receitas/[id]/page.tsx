import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Pencil } from "lucide-react";

import { CategoryTile } from "@/components/category-tile";
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
    <main className="mx-auto w-full max-w-[1200px] px-4 pt-8 sm:px-6 sm:pt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="label-mono inline-flex items-center gap-2 rounded-lg py-2 text-ash transition-colors hover:text-white"
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

      <header className="reveal mx-auto max-w-[900px] pt-12 pb-10 text-center sm:pt-16">
        <span className="label-mono inline-flex rounded-full border border-white/15 bg-white/[0.08] px-5 py-2.5 text-white/90">
          {cat.label}
        </span>
        <h1 className="display mt-7 text-[46px] text-balance sm:text-[72px] lg:text-[84px]">
          {recipe.title}
        </h1>
        {recipe.description && (
          <p className="mx-auto mt-6 max-w-[620px] text-[17px] leading-relaxed font-light text-ash sm:text-lg">
            {recipe.description}
          </p>
        )}
      </header>

      {stats.length > 0 && (
        <dl className="mx-auto mb-10 grid max-w-[900px] grid-cols-2 gap-px overflow-hidden rounded-[16px] border border-white/10 bg-white/10 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-obsidian px-5 py-5 text-center">
              <dt className="label-mono text-fog">{s.label}</dt>
              <dd className="mt-3 font-serif text-2xl font-light text-cloud">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mb-14 aspect-[16/10] overflow-hidden rounded-[30px] bg-graphite sm:aspect-[21/9]">
        {recipe.hasImage ? (
          <RecipeImage
            id={recipe.id}
            version={recipe.updatedAt}
            alt={recipe.title}
            priority
          />
        ) : (
          <CategoryTile category={recipe.category} size="lg" />
        )}
      </div>

      <div className="grid gap-12 lg:grid-cols-[380px_1fr] lg:gap-16">
        <section aria-labelledby="ingredientes" className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[16px] bg-[#17181a] p-6 sm:p-8">
            <h2 id="ingredientes" className="font-serif text-[34px] leading-none font-light text-cloud">
              Ingredientes
            </h2>
            <p className="label-mono mt-3 mb-5 text-fog">Toque para marcar</p>
            <IngredientList items={recipe.ingredients} />
          </div>
        </section>

        <section aria-labelledby="preparo">
          <h2 id="preparo" className="font-serif text-[34px] leading-none font-light text-cloud">
            Modo de preparo
          </h2>
          <ol className="mt-8 space-y-8">
            {recipe.steps.map((step, i) => {
              if (step.endsWith(":")) {
                return (
                  <li key={i} className="label-mono pt-2 text-white">
                    {step.slice(0, -1)}
                  </li>
                );
              }
              return (
                <li key={i} className="grid grid-cols-[44px_1fr] gap-3 sm:grid-cols-[56px_1fr]">
                  <span className="font-mono text-sm font-medium text-ash tabular-nums">
                    {String(stepNumbers[i]).padStart(2, "0")}
                  </span>
                  <p className="text-[17px] leading-[1.7] text-cloud/90">{step}</p>
                </li>
              );
            })}
          </ol>

          {recipe.notes && (
            <div className="mt-14 rounded-[30px] bg-silver p-8 text-black">
              <p className="label-mono text-black/60">Observações</p>
              <p className="mt-4 text-[17px] leading-relaxed whitespace-pre-line">
                {recipe.notes}
              </p>
            </div>
          )}

          {recipe.source && (
            <p className="label-mono mt-8 flex flex-wrap items-center gap-2 text-fog">
              Fonte:{" "}
              {sourceHost ? (
                <a
                  href={recipe.source!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 break-all text-ash normal-case underline-offset-4 hover:text-white hover:underline"
                >
                  {sourceHost}
                  <ExternalLink className="size-3" />
                </a>
              ) : (
                <span className="text-ash normal-case">{recipe.source}</span>
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
