import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-co-ink text-co-bg hover:bg-co-green hover:text-co-cta-green-ink",
        onDark:
          "bg-co-green text-co-cta-green-ink hover:bg-co-bg hover:text-co-ink",
        outline:
          "border border-co-border-strong bg-transparent text-co-ink hover:bg-co-bg-alt hover:border-co-ink",
        outlineOnDark:
          "border border-white/30 bg-transparent text-co-panel-fg hover:bg-white/10",
        ghost: "bg-transparent text-co-ink hover:bg-co-bg-alt",
      },
      size: {
        default: "px-6 py-3.5 text-[15px]",
        sm: "px-3.5 py-2 text-sm",
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
