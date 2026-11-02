import * as React from "react";
import { fieldClass } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn(fieldClass, "min-h-[96px] resize-y", className)} {...props} />;
}

export { Textarea };
