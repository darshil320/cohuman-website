import * as React from "react";
import { fieldClass } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/*
  Native select, so the option list is the platform's own (and accessible) on every
  device. `appearance-none` drops the browser chrome; the chevron is drawn back in as a
  1px ink stroke, matching the field's rule.
*/
const CHEVRON =
  "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='7' fill='none'%3E%3Cpath d='M.5.5l5 5 5-5' stroke='%23231F20'/%3E%3C/svg%3E\")] bg-[length:11px_7px] bg-[right_2px_center] bg-no-repeat pr-7";

function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <select className={cn(fieldClass, "appearance-none", CHEVRON, className)} {...props}>
      {children}
    </select>
  );
}

export { Select };
