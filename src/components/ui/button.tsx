import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap text-sm font-normal transition-colors duration-150 outline-none focus-visible:ring-[3px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        /* Ação preenchida: fundo Ink, texto Parchment */
        default: "rounded-lg bg-ink text-parchment hover:bg-ink/85",
        /* Ghost com contorno fino */
        outline:
          "rounded-sm border border-warm-mist bg-transparent text-graphite hover:border-ash hover:text-ink",
        /* Selecionado (teal) */
        active: "rounded-lg bg-teal text-white hover:bg-teal/90",
        ghost: "rounded-sm text-graphite hover:bg-ink/[0.05] hover:text-ink",
        destructive:
          "rounded-lg bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/30",
        link: "text-ink underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-3.5",
        sm: "h-8 px-3",
        lg: "h-11 px-4 text-base",
        icon: "size-10",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
