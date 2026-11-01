import Link from "next/link";
import { Clock, Heart, Users } from "lucide-react";

import { CategoryTile } from "@/components/category-tile";
import { RecipeImage } from "@/components/recipe-image";
import { formatTime, getCategory } from "@/lib/categories";
import type { RecipeListItem } from "@/lib/recipes";

export function RecipeCard({ recipe }: { recipe: RecipeListItem }) {
  const time = formatTime(recipe.totalTimeMinutes);
  const cat = getCategory(recipe.category);

  return (
    <Link
      href={`/receitas/${recipe.id}`}
      className="group flex flex-col gap-4 rounded-[30px] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[30px] bg-graphite">
        {recipe.hasImage ? (
          <RecipeImage
            id={recipe.id}
            version={recipe.updatedAt}
            alt={recipe.title}
            className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <CategoryTile category={recipe.category} />
        )}
        {recipe.isFavorite && (
          <span className="absolute top-4 right-4 inline-flex size-9 items-center justify-center rounded-full border border-white/25 bg-black/40 backdrop-blur-md">
            <Heart className="size-4 fill-white text-white" aria-label="Favorita" />
          </span>
        )}
      </div>

      <div className="space-y-2.5 px-1">
        <p className="label-mono text-fog">{cat.label}</p>
        <h3 className="font-serif text-[26px] leading-[1.05] font-light text-cloud transition-colors duration-200 group-hover:text-white">
          {recipe.title}
        </h3>
        {recipe.description && (
          <p className="line-clamp-2 text-[15px] leading-relaxed text-ash">
            {recipe.description}
          </p>
        )}
        <div className="label-mono flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-ash">
          {time && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" aria-hidden /> {time}
            </span>
          )}
          {recipe.servings && (
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-3.5" aria-hidden /> {recipe.servings}{" "}
              {recipe.servings === 1 ? "porção" : "porções"}
            </span>
          )}
          <span>{recipe.ingredientCount} ingred.</span>
        </div>
      </div>
    </Link>
  );
}
