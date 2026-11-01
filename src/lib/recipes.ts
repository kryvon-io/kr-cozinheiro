import "server-only";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

import { requireSession } from "./auth";
import { getDb, schema } from "./db";
import type { NewRecipe } from "./db/schema";

const { recipes } = schema;

export type RecipeListItem = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  totalTimeMinutes: number | null;
  servings: number | null;
  difficulty: string | null;
  isFavorite: boolean;
  hasImage: boolean;
  updatedAt: Date;
  ingredientCount: number;
};

function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, (c) => `\\${c}`);
}

export async function listRecipes(filters: {
  q?: string;
  category?: string;
  favorites?: boolean;
}) {
  await requireSession();
  const db = await getDb();

  const conditions = [];
  const q = filters.q?.trim();
  if (q) {
    const pattern = `%${escapeLike(q)}%`;
    conditions.push(
      or(
        ilike(recipes.title, pattern),
        ilike(recipes.description, pattern),
        ilike(recipes.notes, pattern),
        sql`${recipes.ingredients}::text ILIKE ${pattern}`
      )
    );
  }
  if (filters.category) conditions.push(eq(recipes.category, filters.category));
  if (filters.favorites) conditions.push(eq(recipes.isFavorite, true));

  const rows = await db
    .select({
      id: recipes.id,
      title: recipes.title,
      description: recipes.description,
      category: recipes.category,
      totalTimeMinutes: recipes.totalTimeMinutes,
      servings: recipes.servings,
      difficulty: recipes.difficulty,
      isFavorite: recipes.isFavorite,
      hasImage: sql<boolean>`${recipes.image} IS NOT NULL`,
      updatedAt: recipes.updatedAt,
      ingredientCount: sql<number>`jsonb_array_length(${recipes.ingredients})`,
    })
    .from(recipes)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(recipes.isFavorite), desc(recipes.updatedAt));

  return rows as RecipeListItem[];
}

export async function countRecipesByCategory() {
  await requireSession();
  const db = await getDb();
  const rows = await db
    .select({ category: recipes.category, count: sql<number>`count(*)::int` })
    .from(recipes)
    .groupBy(recipes.category);
  return Object.fromEntries(rows.map((r) => [r.category, r.count])) as Record<
    string,
    number
  >;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getRecipe(id: string) {
  await requireSession();
  if (!UUID_RE.test(id)) return null;
  const db = await getDb();
  const [row] = await db
    .select({
      id: recipes.id,
      title: recipes.title,
      description: recipes.description,
      category: recipes.category,
      totalTimeMinutes: recipes.totalTimeMinutes,
      servings: recipes.servings,
      difficulty: recipes.difficulty,
      ingredients: recipes.ingredients,
      steps: recipes.steps,
      notes: recipes.notes,
      source: recipes.source,
      isFavorite: recipes.isFavorite,
      hasImage: sql<boolean>`${recipes.image} IS NOT NULL`,
      createdAt: recipes.createdAt,
      updatedAt: recipes.updatedAt,
    })
    .from(recipes)
    .where(eq(recipes.id, id));
  return row ?? null;
}

export type RecipeDetail = NonNullable<Awaited<ReturnType<typeof getRecipe>>>;

export async function getRecipeImage(id: string) {
  await requireSession();
  if (!UUID_RE.test(id)) return null;
  const db = await getDb();
  const [row] = await db
    .select({ image: recipes.image })
    .from(recipes)
    .where(eq(recipes.id, id));
  return row?.image ?? null;
}

type RecipeInput = Omit<NewRecipe, "id" | "createdAt" | "updatedAt">;

export async function insertRecipe(data: RecipeInput) {
  await requireSession();
  const db = await getDb();
  const [row] = await db
    .insert(recipes)
    .values(data)
    .returning({ id: recipes.id });
  return row.id;
}

/** `image: undefined` mantém a foto atual; `null` remove. */
export async function updateRecipe(id: string, data: Partial<RecipeInput>) {
  await requireSession();
  if (!UUID_RE.test(id)) return;
  const db = await getDb();
  await db
    .update(recipes)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(recipes.id, id));
}

export async function setFavorite(id: string, isFavorite: boolean) {
  await requireSession();
  if (!UUID_RE.test(id)) return;
  const db = await getDb();
  await db.update(recipes).set({ isFavorite }).where(eq(recipes.id, id));
}

export async function deleteRecipe(id: string) {
  await requireSession();
  if (!UUID_RE.test(id)) return;
  const db = await getDb();
  await db.delete(recipes).where(eq(recipes.id, id));
}
