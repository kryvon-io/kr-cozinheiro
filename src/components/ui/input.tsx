import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-lg border border-input bg-black px-4 text-base text-cloud transition-[border-color,box-shadow] duration-200 outline-none placeholder:text-fog selection:bg-iris-gleam file:inline-flex file:border-0 file:bg-transparent file:text-sm disabled:cursor-not-allowed disabled:opacity-50 md:text-[15px]",
        "focus-visible:border-white/40 focus-visible:ring-[3px] focus-visible:ring-white/10",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  );
}

export { Input };
