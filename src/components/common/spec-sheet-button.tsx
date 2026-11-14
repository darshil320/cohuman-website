"use client";

import { Button, type ButtonProps } from "@/components/ui/button";

/**
 * "Download spec sheet": opens the browser's print dialog, where "Save as PDF" is one
 * click — and the print stylesheet (globals.css) has already turned the page into a spec
 * sheet: chrome out, every section shown, the ink spec block as ink on paper, and the
 * `PrintMasthead` with the address and contacts on top.
 *
 * While the dialog is open the document title becomes the file name the PDF is saved
 * under ("Stretch S — Meeting table — Cohuman spec sheet"), then goes back.
 */
export function SpecSheetButton({
  title,
  variant = "secondary",
}: {
  /** What the sheet is of, e.g. "Stretch S — Meeting table". */
  title: string;
  variant?: ButtonProps["variant"];
}) {
  const print = () => {
    const previous = document.title;
    document.title = `${title} — Cohuman spec sheet`;
    const restore = () => {
      document.title = previous;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    window.print();
  };

  return (
    <Button type="button" variant={variant} onClick={print} data-print="hide">
      Spec sheet <span aria-hidden>↓</span>
    </Button>
  );
}
