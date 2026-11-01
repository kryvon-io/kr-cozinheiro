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
          "h-11 w-full appearance-none rounded-lg border border-input bg-black pr-10 pl-4 text-base text-cloud transition-[border-color,box-shadow] duration-200 outline-none md:text-[15px]",
          "focus-visible:border-white/40 focus-visible:ring-[3px] focus-visible:ring-white/10",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ash"
      />
    </div>
  );
}

export { NativeSelect };
