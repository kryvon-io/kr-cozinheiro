import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RecipeForm } from "@/components/recipe-form";
import { getRecipe } from "@/lib/recipes";

export const metadata: Metadata = { title: "Editar receita" };

export default async function EditRecipePage({
  params,
}: PageProps<"/receitas/[id]/editar">) {
  const { id } = await params;
  const recipe = await getRecipe(id);
  if (!recipe) notFound();

  return (
    <main>
      <header className="pb-6">
        <p className="caption">Editar receita</p>
        <h1 className="heading mt-1 text-3xl leading-tight text-balance">
          {recipe.title}
        </h1>
      </header>
      <RecipeForm
        cancelHref={`/receitas/${recipe.id}`}
        initial={{
          id: recipe.id,
          title: recipe.title,
          description: recipe.description ?? "",
          category: recipe.category,
          totalTimeMinutes: recipe.totalTimeMinutes?.toString() ?? "",
          servings: recipe.servings?.toString() ?? "",
          difficulty: recipe.difficulty ?? "",
          ingredients: recipe.ingredients.join("\n"),
          steps: recipe.steps.join("\n"),
          notes: recipe.notes ?? "",
          source: recipe.source ?? "",
          imageSrc: recipe.hasImage
            ? `/receitas/${recipe.id}/foto?v=${recipe.updatedAt.getTime()}`
            : undefined,
        }}
      />
    </main>
  );
}
