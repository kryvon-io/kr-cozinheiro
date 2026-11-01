"use client";

import { useOptimistic, useTransition } from "react";
import { Heart } from "lucide-react";

import { toggleFavoriteAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  id,
  isFavorite,
}: {
  id: string;
  isFavorite: boolean;
}) {
  const [optimistic, setOptimistic] = useOptimistic(isFavorite);
  const [, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant={optimistic ? "active" : "outline"}
      aria-pressed={optimistic}
      onClick={() =>
        startTransition(async () => {
          setOptimistic(!optimistic);
          await toggleFavoriteAction(id, !optimistic);
        })
      }
    >
      <Heart className={cn(optimistic && "fill-current")} />
      {optimistic ? "Favorita" : "Favoritar"}
    </Button>
  );
}
