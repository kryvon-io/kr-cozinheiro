import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const recipes = pgTable(
  "recipes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    category: text("category").notNull().default("outros"),
    totalTimeMinutes: integer("total_time_minutes"),
    servings: integer("servings"),
    difficulty: text("difficulty"),
    ingredients: jsonb("ingredients").$type<string[]>().notNull().default([]),
    steps: jsonb("steps").$type<string[]>().notNull().default([]),
    notes: text("notes"),
    source: text("source"),
    /** Foto comprimida no navegador, guardada como data URL (JPEG/WebP). */
    image: text("image"),
    isFavorite: boolean("is_favorite").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("recipes_category_idx").on(t.category),
    index("recipes_updated_at_idx").on(t.updatedAt),
  ]
);

export type Recipe = typeof recipes.$inferSelect;
export type NewRecipe = typeof recipes.$inferInsert;
