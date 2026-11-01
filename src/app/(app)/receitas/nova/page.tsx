import type { Metadata } from "next";

import { RecipeForm } from "@/components/recipe-form";

export const metadata: Metadata = { title: "Nova receita" };

export default function NewRecipePage() {
  return (
    <main>
      <header className="pb-6">
        <p className="caption">Nova receita</p>
        <h1 className="heading mt-1 text-3xl leading-tight">
          O que vamos guardar hoje?
        </h1>
      </header>
      <RecipeForm
        cancelHref="/"
        initial={{
          title: "",
          description: "",
          category: "pratos-principais",
          totalTimeMinutes: "",
          servings: "",
          difficulty: "",
          ingredients: "",
          steps: "",
          notes: "",
          source: "",
        }}
      />
    </main>
  );
}
