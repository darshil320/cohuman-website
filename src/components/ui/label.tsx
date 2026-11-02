import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

/** Field label: 11px mono caps in steel, the same voice as every other measured label. */
function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return <LabelPrimitive.Root className={cn("co-eyebrow block", className)} {...props} />;
}

export { Label };
