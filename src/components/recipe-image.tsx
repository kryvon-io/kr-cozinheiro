import { cn } from "@/lib/utils";

/** Foto da receita servida pela rota protegida /receitas/[id]/foto. */
export function RecipeImage({
  id,
  version,
  alt,
  className,
  priority,
}: {
  id: string;
  version: Date;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/receitas/${id}/foto?v=${version.getTime()}`}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
