import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/*
 * Square, unrounded, no shadow. `outline` variants carry a single bottom rule rather
 * than a box, which is the action language the rest of the site uses — an outlined
 * rectangle was the last thing reading as a card wherever two actions sat together.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-co-ink text-co-bg hover:bg-co-green-light hover:text-co-cta-green-ink",
        onDark: "bg-co-bg text-co-ink hover:bg-co-green-light hover:text-co-cta-green-ink",
        outline:
          "border-b-2 border-co-ink bg-transparent px-0 text-co-ink hover:border-co-placeholder hover:text-co-muted",
        outlineOnDark:
          "border-b-2 border-co-panel-fg bg-transparent px-0 text-co-panel-fg hover:border-co-panel-faint hover:text-co-panel-muted",
        ghost: "bg-transparent text-co-muted hover:text-co-ink",
      },
      size: {
        default: "px-6 py-3.5 text-[15px]",
        sm: "px-4 py-2.5 text-[13.5px]",
        lg: "px-8 py-4 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
