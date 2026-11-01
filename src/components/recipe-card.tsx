import Link from "next/link";
import { Clock, Heart, Users } from "lucide-react";

import { RecipeImage } from "@/components/recipe-image";
import { formatTime, getCategory } from "@/lib/categories";
import type { RecipeListItem } from "@/lib/recipes";

export function RecipeCard({ recipe }: { recipe: RecipeListItem }) {
  const time = formatTime(recipe.totalTimeMinutes);
  const cat = getCategory(recipe.category);
  const Icon = cat.icon;

  return (
    <Link
      href={`/receitas/${recipe.id}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-soft-paper shadow-subtle ring-1 ring-transparent transition-[box-shadow] duration-150 outline-none hover:ring-warm-mist focus-visible:ring-[3px] focus-visible:ring-ring"
    >
      {recipe.hasImage && (
        <div className="aspect-[16/10] overflow-hidden bg-muted">
          <RecipeImage id={recipe.id} version={recipe.updatedAt} alt={recipe.title} />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-3 text-graphite">
          <span className="inline-flex items-center gap-1.5 text-xs">
            <Icon className="size-3.5 text-ink" aria-hidden />
            {cat.label}
          </span>
          {recipe.isFavorite && (
            <Heart className="size-3.5 fill-ink text-ink" aria-label="Favorita" />
          )}
        </div>
        <h3 className="text-base leading-snug font-medium text-ink">
          {recipe.title}
        </h3>
        {recipe.description && (
          <p className="line-clamp-2 text-sm leading-[1.43] text-graphite">
            {recipe.description}
          </p>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-graphite">
          {time && (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden /> {time}
            </span>
          )}
          {recipe.servings && (
            <span className="inline-flex items-center gap-1">
              <Users className="size-3.5" aria-hidden /> {recipe.servings}{" "}
              {recipe.servings === 1 ? "porção" : "porções"}
            </span>
          )}
          <span>
            {recipe.ingredientCount}{" "}
            {recipe.ingredientCount === 1 ? "ingrediente" : "ingredientes"}
          </span>
        </div>
      </div>
    </Link>
  );
}
