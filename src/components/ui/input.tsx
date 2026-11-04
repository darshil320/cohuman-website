import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A Signal form field: no box, one ink rule underneath, the value set large in Sequel Sans —
 * a line on a form, not a container. Focus is the global 2px ink outline.
 */
export const fieldClass =
  "w-full rounded-none border-0 border-b border-co-ink bg-transparent px-0 py-2.5 text-[17px] text-co-ink placeholder:text-co-placeholder disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-b-2";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return <input type={type} className={cn(fieldClass, className)} {...props} />;
}

export { Input };
