"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowRight, LoaderCircle } from "lucide-react";

import { saveRecipeAction } from "@/app/actions";
import { ImagePicker } from "@/components/image-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, DIFFICULTIES } from "@/lib/categories";

export type RecipeFormValues = {
  id?: string;
  title: string;
  description: string;
  category: string;
  totalTimeMinutes: string;
  servings: string;
  difficulty: string;
  ingredients: string;
  steps: string;
  notes: string;
  source: string;
  imageSrc?: string;
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="text-sm leading-relaxed text-fog">{children}</p>;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-6 border-t border-white/10 py-10 md:grid-cols-[220px_1fr] md:gap-10">
      <h2 className="font-serif text-[28px] leading-none font-light text-cloud">
        {title}
      </h2>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

export function RecipeForm({
  initial,
  cancelHref,
}: {
  initial: RecipeFormValues;
  cancelHref: string;
}) {
  const [state, action, pending] = useActionState(saveRecipeAction, undefined);
  const e = state?.errors ?? {};

  return (
    <form action={action} noValidate>
      {initial.id && <input type="hidden" name="id" value={initial.id} />}

      <Section title="Sobre">
        <div className="space-y-2.5">
          <Label htmlFor="title">Nome da receita</Label>
          <Input
            id="title"
            name="title"
            defaultValue={initial.title}
            placeholder="Ex.: Bolo de cenoura com cobertura de chocolate"
            aria-invalid={!!e.title}
            required
            maxLength={160}
          />
          <FieldError message={e.title} />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="description">Descrição curta</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={initial.description}
            placeholder="Uma ou duas frases sobre o prato."
            className="min-h-20"
            maxLength={600}
            aria-invalid={!!e.description}
          />
          <FieldError message={e.description} />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2.5">
            <Label htmlFor="category">Categoria</Label>
            <NativeSelect
              id="category"
              name="category"
              defaultValue={initial.category}
              aria-invalid={!!e.category}
            >
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </NativeSelect>
            <FieldError message={e.category} />
          </div>
          <div className="space-y-2.5">
            <Label htmlFor="difficulty">Dificuldade</Label>
            <NativeSelect
              id="difficulty"
              name="difficulty"
              defaultValue={initial.difficulty}
            >
              <option value="">Não informar</option>
              {DIFFICULTIES.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </NativeSelect>
            <FieldError message={e.difficulty} />
          </div>
          <div className="space-y-2.5">
            <Label htmlFor="totalTimeMinutes">Tempo total (minutos)</Label>
            <Input
              id="totalTimeMinutes"
              name="totalTimeMinutes"
              type="number"
              inputMode="numeric"
              min={1}
              defaultValue={initial.totalTimeMinutes}
              placeholder="45"
              aria-invalid={!!e.totalTimeMinutes}
            />
            <FieldError message={e.totalTimeMinutes} />
          </div>
          <div className="space-y-2.5">
            <Label htmlFor="servings">Rende (porções)</Label>
            <Input
              id="servings"
              name="servings"
              type="number"
              inputMode="numeric"
              min={1}
              defaultValue={initial.servings}
              placeholder="4"
              aria-invalid={!!e.servings}
            />
            <FieldError message={e.servings} />
          </div>
        </div>
      </Section>

      <Section title="Foto">
        <ImagePicker currentSrc={initial.imageSrc} error={e.image} />
      </Section>

      <Section title="Ingredientes">
        <div className="space-y-2.5">
          <Label htmlFor="ingredients">Um por linha</Label>
          <Textarea
            id="ingredients"
            name="ingredients"
            defaultValue={initial.ingredients}
            className="min-h-48 font-mono text-[14px] md:text-[14px]"
            placeholder={"Massa:\n3 cenouras médias\n3 ovos\n1 xícara de óleo\n\nCobertura:\n1 colher de manteiga"}
            aria-invalid={!!e.ingredients}
          />
          <Hint>
            Termine uma linha com dois-pontos (ex.: “Cobertura:”) para criar um
            subtítulo.
          </Hint>
          <FieldError message={e.ingredients} />
        </div>
      </Section>

      <Section title="Modo de preparo">
        <div className="space-y-2.5">
          <Label htmlFor="steps">Um passo por linha</Label>
          <Textarea
            id="steps"
            name="steps"
            defaultValue={initial.steps}
            className="min-h-56"
            placeholder={"Preaqueça o forno a 180 °C.\nBata no liquidificador as cenouras, os ovos e o óleo.\nMisture a farinha e o açúcar e asse por 40 minutos."}
            aria-invalid={!!e.steps}
          />
          <Hint>Cada linha vira um passo numerado.</Hint>
          <FieldError message={e.steps} />
        </div>
      </Section>

      <Section title="Extras">
        <div className="space-y-2.5">
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            name="notes"
            defaultValue={initial.notes}
            placeholder="Dicas, substituições, como congelar…"
            maxLength={4000}
            aria-invalid={!!e.notes}
          />
          <FieldError message={e.notes} />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="source">Fonte</Label>
          <Input
            id="source"
            name="source"
            defaultValue={initial.source}
            placeholder="Link ou “Receita da vó Maria”"
            maxLength={500}
            aria-invalid={!!e.source}
          />
          <FieldError message={e.source} />
        </div>
      </Section>

      <div className="sticky bottom-0 z-30 -mx-4 border-t border-white/10 bg-obsidian/85 px-4 py-4 backdrop-blur-2xl sm:mx-0 sm:rounded-t-[16px] sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <p role="status" className="text-sm text-destructive">
            {state?.message}
          </p>
          <div className="flex shrink-0 gap-2">
            <Button asChild variant="ghost">
              <Link href={cancelHref}>Cancelar</Link>
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? (
                <>
                  <LoaderCircle className="animate-spin" /> Salvando
                </>
              ) : (
                <>
                  Salvar receita <ArrowRight />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
