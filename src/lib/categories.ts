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
};

export const CATEGORIES: Category[] = [
  { slug: "cafe-da-manha", label: "Café da manhã", icon: Coffee },
  { slug: "entradas", label: "Entradas e petiscos", icon: Salad },
  { slug: "pratos-principais", label: "Pratos principais", icon: UtensilsCrossed },
  { slug: "massas", label: "Massas", icon: CookingPot },
  { slug: "carnes", label: "Carnes", icon: Beef },
  { slug: "aves", label: "Aves", icon: Drumstick },
  { slug: "peixes", label: "Peixes e frutos do mar", icon: Fish },
  { slug: "vegetariano", label: "Vegetariano", icon: Leaf },
  { slug: "sopas-e-molhos", label: "Sopas e molhos", icon: Soup },
  { slug: "paes", label: "Pães e massas de forno", icon: Croissant },
  { slug: "sobremesas", label: "Sobremesas", icon: CakeSlice },
  { slug: "bebidas", label: "Bebidas", icon: CupSoda },
  { slug: "outros", label: "Outros", icon: UtensilsCrossed },
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
