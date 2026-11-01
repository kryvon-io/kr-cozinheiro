import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center py-20 text-center">
      <p className="caption">Erro 404</p>
      <h1 className="heading mt-2 text-3xl">Receita não encontrada</h1>
      <p className="mt-2 max-w-md text-sm text-graphite">
        Ela pode ter sido excluída ou o endereço está incorreto.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">
          Voltar às receitas <ArrowRight />
        </Link>
      </Button>
    </main>
  );
}
