import type { Metadata } from "next";

import { Brand } from "@/components/brand";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { de } = await searchParams;
  const from = typeof de === "string" ? de : "";

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-16">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <Brand />
          <h1 className="heading mt-8 text-3xl">Bem-vindo de volta</h1>
          <p className="mt-2 text-sm text-graphite">
            Entre para ver e salvar suas receitas.
          </p>
        </div>
        <LoginForm from={from} />
      </div>
    </main>
  );
}
