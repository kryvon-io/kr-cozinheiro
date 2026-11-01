import type { Metadata } from "next";

import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { de } = await searchParams;
  const from = typeof de === "string" ? de : "";

  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-16">
      {/* Banda de cor sutil, inspirada no gradiente "atmosfera" do design */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[45vh] bg-[linear-gradient(rgb(15,16,17),rgb(19,29,39)_30%,rgb(26,71,136)_75%,rgb(64,138,193))] opacity-40"
      />
      <div className="reveal relative w-full max-w-[420px]">
        <div className="mb-10 text-center">
          <span className="label-mono inline-flex rounded-full border border-white/15 bg-white/[0.08] px-5 py-2.5 text-white/90">
            Caderno de receitas
          </span>
          <h1 className="display mt-7 text-[56px] sm:text-[72px]">
            <em className="italic">Bem-</em>vindo
            <br />
            de volta
          </h1>
          <p className="mt-5 text-[17px] font-light text-ash">
            Entre para ver e salvar suas receitas.
          </p>
        </div>
        <LoginForm from={from} />
      </div>
    </main>
  );
}
