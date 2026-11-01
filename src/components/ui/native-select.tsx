import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

function NativeSelect({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <div className="relative w-full">
      <select
        data-slot="native-select"
        className={cn(
          "h-11 appearance-none pr-10 pl-3.5",
          "w-full min-w-0 rounded-lg border border-warm-mist bg-soft-paper text-base text-ink transition-[border-color,box-shadow] duration-150 outline-none placeholder:text-ash disabled:cursor-not-allowed disabled:opacity-50 md:text-[15px]",
        "focus-visible:border-teal/60 focus-visible:ring-[3px] focus-visible:ring-teal/10",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/15",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-graphite"
      />
    </div>
  );
}

export { NativeSelect };
