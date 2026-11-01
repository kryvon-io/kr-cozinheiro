import { getCategory } from "@/lib/categories";
import { cn } from "@/lib/utils";

/** Bloco cromático usado quando a receita não tem foto. */
export function CategoryTile({
  category,
  className,
  size = "md",
}: {
  category: string;
  className?: string;
  size?: "md" | "lg";
}) {
  const cat = getCategory(category);
  const Icon = cat.icon;
  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col justify-between overflow-hidden",
        cat.tile,
        cat.ink,
        size === "lg" ? "p-8" : "p-6",
        className
      )}
    >
      <Icon
        strokeWidth={1.25}
        className={size === "lg" ? "size-12" : "size-9"}
        aria-hidden
      />
      <span className="label-mono opacity-80">{cat.label}</span>
      <Icon
        aria-hidden
        strokeWidth={0.6}
        className="pointer-events-none absolute -right-6 -bottom-8 size-44 opacity-15"
      />
    </div>
  );
}
