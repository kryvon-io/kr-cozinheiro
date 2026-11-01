import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 px-3.5",
        "w-full min-w-0 rounded-lg border border-warm-mist bg-soft-paper text-base text-ink transition-[border-color,box-shadow] duration-150 outline-none placeholder:text-ash disabled:cursor-not-allowed disabled:opacity-50 md:text-[15px]",
        "focus-visible:border-teal/60 focus-visible:ring-[3px] focus-visible:ring-teal/10",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/15",
        className
      )}
      {...props}
    />
  );
}

export { Input };
