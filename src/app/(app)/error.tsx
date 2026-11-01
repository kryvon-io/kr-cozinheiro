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
    <main className="flex flex-col items-center py-20 text-center">
      <p className="caption">Algo deu errado</p>
      <h1 className="heading mt-2 text-3xl">Não foi possível carregar</h1>
      <p className="mt-2 max-w-md text-sm text-graphite">
        Verifique a conexão e tente de novo. Se continuar, confira as variáveis
        de ambiente do banco de dados.
      </p>
      {error.digest && (
        <p className="mt-2 text-xs text-ash">Código: {error.digest}</p>
      )}
      <Button onClick={reset} className="mt-6">
        <RotateCcw /> Tentar de novo
      </Button>
    </main>
  );
}
