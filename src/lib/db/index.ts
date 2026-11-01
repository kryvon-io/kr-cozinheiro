import "server-only";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";

import * as schema from "./schema";

type DB = NeonHttpDatabase<typeof schema>;

let sqlClient: NeonQueryFunction<false, false> | undefined;
let dbClient: DB | undefined;
let schemaReady: Promise<void> | undefined;

function getSql() {
  if (!sqlClient) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        "DATABASE_URL não está configurada. Veja o arquivo .env.example."
      );
    }
    sqlClient = neon(url);
  }
  return sqlClient;
}

/**
 * Garante que a tabela exista. Assim o app funciona no primeiro deploy
 * mesmo sem rodar `npm run db:push`. É idempotente e roda uma vez por
 * instância do servidor.
 */
function ensureSchema() {
  if (!schemaReady) {
    const sql = getSql();
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS "recipes" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "title" text NOT NULL,
          "description" text,
          "category" text DEFAULT 'outros' NOT NULL,
          "total_time_minutes" integer,
          "servings" integer,
          "difficulty" text,
          "ingredients" jsonb DEFAULT '[]'::jsonb NOT NULL,
          "steps" jsonb DEFAULT '[]'::jsonb NOT NULL,
          "notes" text,
          "source" text,
          "image" text,
          "is_favorite" boolean DEFAULT false NOT NULL,
          "created_at" timestamp with time zone DEFAULT now() NOT NULL,
          "updated_at" timestamp with time zone DEFAULT now() NOT NULL
        )`;
      await sql`CREATE INDEX IF NOT EXISTS "recipes_category_idx" ON "recipes" ("category")`;
      await sql`CREATE INDEX IF NOT EXISTS "recipes_updated_at_idx" ON "recipes" ("updated_at")`;
    })().catch((error) => {
      schemaReady = undefined;
      throw error;
    });
  }
  return schemaReady;
}

export async function getDb(): Promise<DB> {
  await ensureSchema();
  if (!dbClient) {
    dbClient = drizzle({ client: getSql(), schema });
  }
  return dbClient;
}

export { schema };
