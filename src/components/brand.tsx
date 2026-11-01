import Link from "next/link";
import { ChefHat } from "lucide-react";

export function Brand() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 rounded-sm text-ink outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
    >
      <span className="inline-flex size-8 items-center justify-center rounded-lg bg-teal text-white">
        <ChefHat className="size-[18px]" strokeWidth={1.75} aria-hidden />
      </span>
      <span className="text-[15px] font-medium tracking-[-0.01em]">
        KR Cozinheiro
      </span>
    </Link>
  );
}
