"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  createSession,
  destroySession,
  requireSession,
  verifyCredentials,
} from "@/lib/auth";
import { DIFFICULTIES, isCategory } from "@/lib/categories";
import {
  deleteRecipe,
  insertRecipe,
  setFavorite,
  updateRecipe,
} from "@/lib/recipes";

/* ---------------------------------- Login --------------------------------- */

export type LoginState = { error?: string; email?: string } | undefined;

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("de") ?? "");

  if (!email || !password) {
    return { error: "Informe e-mail e senha.", email };
  }

  const ok = await verifyCredentials(email, password);
  if (!ok) {
    // Pequeno atraso para dificultar tentativas em massa.
    await new Promise((r) => setTimeout(r, 800));
    return { error: "E-mail ou senha incorretos.", email };
  }

  await createSession();
  // Só redireciona para caminhos internos.
  redirect(from.startsWith("/") && !from.startsWith("//") ? from : "/");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

/* --------------------------------- Receitas -------------------------------- */

const MAX_IMAGE_CHARS = 3_000_000; // ~2,2 MB de imagem

const lines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

const optionalInt = (max: number) =>
  z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : Number(v)))
    .refine(
      (v) => v === null || (Number.isInteger(v) && v > 0 && v <= max),
      "Use um número inteiro positivo."
    );

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Use no máximo ${max} caracteres.`)
    .transform((v) => (v === "" ? null : v));

const recipeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Dê um nome à receita.")
    .max(160, "Nome muito longo."),
  description: optionalText(600),
  category: z.string().refine(isCategory, "Escolha uma categoria."),
  totalTimeMinutes: optionalInt(60 * 24 * 7),
  servings: optionalInt(500),
  difficulty: z
    .string()
    .transform((v) => (v === "" ? null : v))
    .refine(
      (v) => v === null || DIFFICULTIES.some((d) => d.value === v),
      "Dificuldade inválida."
    ),
  ingredients: z
    .string()
    .transform(lines)
    .refine((l) => l.length > 0, "Adicione pelo menos um ingrediente."),
  steps: z
    .string()
    .transform(lines)
    .refine((l) => l.length > 0, "Adicione pelo menos um passo."),
  notes: optionalText(4000),
  source: optionalText(500),
  image: z
    .string()
    .refine(
      (v) =>
        v === "" ||
        v === "__remove__" ||
        (/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(v) &&
          v.length <= MAX_IMAGE_CHARS),
      "Imagem inválida ou grande demais."
    ),
});

export type RecipeFormState =
  | {
      errors?: Partial<Record<keyof z.input<typeof recipeSchema>, string>>;
      message?: string;
    }
  | undefined;

export async function saveRecipeAction(
  _prev: RecipeFormState,
  formData: FormData
): Promise<RecipeFormState> {
  await requireSession();

  const id = String(formData.get("id") ?? "");
  const raw = Object.fromEntries(
    Object.keys(recipeSchema.shape).map((k) => [k, String(formData.get(k) ?? "")])
  );
  const parsed = recipeSchema.safeParse(raw);

  if (!parsed.success) {
    const errors: NonNullable<RecipeFormState>["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof typeof errors;
      errors[key] ??= issue.message;
    }
    return { errors, message: "Revise os campos destacados." };
  }

  const { image, ...data } = parsed.data;
  const imageValue =
    image === "" ? undefined : image === "__remove__" ? null : image;

  let recipeId = id;
  if (id) {
    await updateRecipe(id, { ...data, image: imageValue });
  } else {
    recipeId = await insertRecipe({ ...data, image: imageValue ?? null });
  }

  revalidatePath("/");
  revalidatePath(`/receitas/${recipeId}`);
  redirect(`/receitas/${recipeId}`);
}

export async function toggleFavoriteAction(id: string, isFavorite: boolean) {
  await setFavorite(id, isFavorite);
  revalidatePath("/");
  revalidatePath(`/receitas/${id}`);
}

export async function deleteRecipeAction(id: string) {
  await deleteRecipe(id);
  revalidatePath("/");
  redirect("/");
}
