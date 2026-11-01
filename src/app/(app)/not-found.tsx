import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <span className="label-mono text-ash">Erro 404</span>
      <h1 className="display mt-6 text-[56px] sm:text-[80px]">
        Receita <em className="italic">não</em> encontrada
      </h1>
      <p className="mt-5 max-w-md text-ash">
        Ela pode ter sido excluída ou o endereço está incorreto.
      </p>
      <Button asChild className="mt-10">
        <Link href="/">
          Voltar às receitas <ArrowRight />
        </Link>
      </Button>
    </main>
  );
}
