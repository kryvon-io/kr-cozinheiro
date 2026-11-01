import type { Metadata } from "next";

import { RecipeForm } from "@/components/recipe-form";

export const metadata: Metadata = { title: "Nova receita" };

export default function NewRecipePage() {
  return (
    <main className="mx-auto w-full max-w-[960px] px-4 sm:px-6">
      <header className="reveal pt-12 pb-10 sm:pt-16">
        <span className="label-mono text-ash">Nova receita</span>
        <h1 className="display mt-5 text-[48px] sm:text-[72px]">
          O que vamos <em className="italic">guardar</em> hoje?
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
