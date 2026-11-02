import { cn } from "@/lib/utils";

/**
 * A registration cross — the 17px "┼" printers use to align plates, used here to pin the
 * corners of a figure the way a drawing set does. Two 1px strokes, `currentColor`, so it
 * takes the tone of whatever it sits on. Position it with `className` (it is usually
 * `absolute` in a figure corner).
 */
export function RegistrationCross({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("pointer-events-none absolute block h-[17px] w-[17px]", className)}>
      <span className="absolute left-2 top-0 block h-full w-px bg-current" />
      <span className="absolute left-0 top-2 block h-px w-full bg-current" />
    </span>
  );
}
