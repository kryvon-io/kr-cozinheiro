"use client";

import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <span className="label-mono text-ash">Algo deu errado</span>
      <h1 className="display mt-6 text-[48px] sm:text-[72px]">
        Não foi possível <em className="italic">carregar</em>
      </h1>
      <p className="mt-5 max-w-md text-ash">
        Verifique a conexão e tente de novo. Se continuar, confira as variáveis
        de ambiente do banco de dados.
      </p>
      {error.digest && (
        <p className="label-mono mt-4 text-fog">Código: {error.digest}</p>
      )}
      <Button onClick={reset} className="mt-10">
        <RotateCcw /> Tentar de novo
      </Button>
    </main>
  );
}
