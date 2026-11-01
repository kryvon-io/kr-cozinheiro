import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-lg border border-input bg-black px-4 py-3 text-base leading-relaxed text-cloud transition-[border-color,box-shadow] duration-200 outline-none placeholder:text-fog disabled:cursor-not-allowed disabled:opacity-50 md:text-[15px]",
        "focus-visible:border-white/40 focus-visible:ring-[3px] focus-visible:ring-white/10",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
