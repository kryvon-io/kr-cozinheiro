import {
  Beef,
  CakeSlice,
  Coffee,
  CookingPot,
  Croissant,
  CupSoda,
  Drumstick,
  Fish,
  Leaf,
  Salad,
  Soup,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

export type Category = {
  slug: string;
  label: string;
  icon: LucideIcon;
  /** Fundo cromático do "tile" (único lugar onde a cor aparece). */
  tile: string;
  /** Cor de texto com contraste adequado sobre o tile. */
  ink: string;
};

export const CATEGORIES: Category[] = [
  { slug: "cafe-da-manha", label: "Café da manhã", icon: Coffee, tile: "bg-periwinkle", ink: "text-black" },
  { slug: "entradas", label: "Entradas e petiscos", icon: Salad, tile: "bg-pale-iris", ink: "text-black" },
  { slug: "pratos-principais", label: "Pratos principais", icon: UtensilsCrossed, tile: "bg-iris-gleam", ink: "text-white" },
  { slug: "massas", label: "Massas", icon: CookingPot, tile: "bg-orchid-bloom", ink: "text-black" },
  { slug: "carnes", label: "Carnes", icon: Beef, tile: "bg-deep-iris", ink: "text-white" },
  { slug: "aves", label: "Aves", icon: Drumstick, tile: "bg-periwinkle", ink: "text-black" },
  { slug: "peixes", label: "Peixes e frutos do mar", icon: Fish, tile: "bg-cyan-signal", ink: "text-black" },
  { slug: "vegetariano", label: "Vegetariano", icon: Leaf, tile: "bg-pale-iris", ink: "text-black" },
  { slug: "sopas-e-molhos", label: "Sopas e molhos", icon: Soup, tile: "bg-deep-iris", ink: "text-white" },
  { slug: "paes", label: "Pães e massas de forno", icon: Croissant, tile: "bg-orchid-bloom", ink: "text-black" },
  { slug: "sobremesas", label: "Sobremesas", icon: CakeSlice, tile: "bg-iris-gleam", ink: "text-white" },
  { slug: "bebidas", label: "Bebidas", icon: CupSoda, tile: "bg-cyan-signal", ink: "text-black" },
  { slug: "outros", label: "Outros", icon: UtensilsCrossed, tile: "bg-silver", ink: "text-black" },
];

const BY_SLUG = new Map(CATEGORIES.map((c) => [c.slug, c]));

export function getCategory(slug: string | null | undefined): Category {
  return BY_SLUG.get(slug ?? "") ?? BY_SLUG.get("outros")!;
}

export function isCategory(slug: string) {
  return BY_SLUG.has(slug);
}

export const DIFFICULTIES = [
  { value: "facil", label: "Fácil" },
  { value: "media", label: "Média" },
  { value: "dificil", label: "Difícil" },
] as const;

export function difficultyLabel(value: string | null | undefined) {
  return DIFFICULTIES.find((d) => d.value === value)?.label ?? null;
}

export function formatTime(minutes: number | null | undefined) {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}
