import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { SignalDots } from "@/components/ui/signal-dots";
import { cn } from "@/lib/utils";

/*
 * Signal buttons. Square, no shadow, mono labels — controls that look like they belong
 * on an instrument panel.
 *
 * - `primary`   ink fill. Pass `dots` for the green pair on the quote action.
 * - `secondary` 1px ink outline.
 * - `link`      a text link: underline and an arrow (`arrow`).
 * - `onDark` / `secondaryOnDark` / `linkOnDark` are the same three on the ink block.
 *
 * `outline` and `outlineOnDark` are the old names for the text link, kept so existing
 * call sites keep compiling.
 *
 * Hover never turns anything green: the signal is for state, and hover is not state.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-3.5 whitespace-nowrap font-mono text-[12px] font-normal uppercase tracking-[0.06em] transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-co-ink text-co-bg hover:bg-co-ink-soft",
        secondary: "border border-co-ink bg-transparent text-co-ink hover:bg-co-ink hover:text-co-bg",
        link: "border-b border-co-ink bg-transparent text-co-ink hover:border-co-muted-2 hover:text-co-muted",
        onDark: "bg-co-bg text-co-ink hover:bg-co-bg-alt",
        secondaryOnDark:
          "border border-co-panel-fg bg-transparent text-co-panel-fg hover:bg-co-panel-fg hover:text-co-ink",
        linkOnDark:
          "border-b border-co-panel-fg bg-transparent text-co-panel-fg hover:border-co-panel-faint hover:text-co-panel-muted",
        outline: "border-b border-co-ink bg-transparent text-co-ink hover:border-co-muted-2 hover:text-co-muted",
        outlineOnDark:
          "border-b border-co-panel-fg bg-transparent text-co-panel-fg hover:border-co-panel-faint hover:text-co-panel-muted",
        ghost: "bg-transparent text-co-muted hover:text-co-ink",
      },
      size: {
        default: "h-[52px] px-[22px]",
        sm: "h-[42px] px-4",
        lg: "h-[60px] px-7",
      },
    },
    compoundVariants: [
      // Text links carry no box, so they take no height or side padding at any size — and
      // may wrap, so a long "Enquire about …" never pushes a phone layout sideways.
      {
        variant: ["link", "linkOnDark", "outline", "outlineOnDark"],
        className: "h-auto whitespace-normal px-0 pb-1 text-left",
      },
    ],
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
  /** The green dot pair — the quote action. One green thing per view; use sparingly. */
  dots?: boolean;
  /** A trailing arrow that nudges right on hover, for text links. */
  arrow?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  dots = false,
  arrow = false,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props}>
      <Slottable>{children}</Slottable>
      {dots ? <SignalDots /> : null}
      {arrow ? (
        <span
          aria-hidden
          className="-ml-1.5 inline-block transition-transform duration-150 group-hover/button:translate-x-1"
        >
          →
        </span>
      ) : null}
    </Comp>
  );
}

export { Button, buttonVariants };
