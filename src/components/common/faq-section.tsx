interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  items: FaqItem[];
}

/** Number / question / marker — the index grid, so answers sit under their question. */
const ROW_GRID =
  "grid grid-cols-[40px_minmax(0,1fr)_28px] gap-x-4 md:grid-cols-[64px_minmax(0,1fr)_28px] lg:grid-cols-[90px_minmax(0,1fr)_28px]";

/**
 * FAQ as numbered hairline rows on native `<details>`, so it opens without JavaScript and
 * stays a server component. The marker is a square mono +/−; an open row fills it with
 * ink. Ink, not green — an open answer is a reading state, not a signal. Nothing fades or
 * rotates: the answer is simply there when the row opens.
 *
 * Emits its own FAQPage JSON-LD from the same items it renders.
 */
export function FaqSection({ items }: FaqSectionProps) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div>
        {items.map((item, index) => (
          <details key={item.question} className="group border-b border-co-border">
            <summary
              className={`${ROW_GRID} cursor-pointer list-none items-center py-5 transition-colors duration-150 marker:content-none hover:bg-co-bg-alt [&::-webkit-details-marker]:hidden`}
            >
              <span className="co-data text-co-muted-2 group-open:text-co-ink">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-[16px] font-medium leading-[1.4] text-co-ink md:text-[17px]">
                {item.question}
              </span>
              <span
                aria-hidden
                className="co-data flex h-7 w-7 items-center justify-center border border-co-ink text-[13px] text-co-ink group-open:bg-co-ink group-open:text-co-bg"
              >
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">−</span>
              </span>
            </summary>
            <div className={`${ROW_GRID} pb-6`}>
              <p className="col-start-2 max-w-[65ch] text-[15px] leading-[1.55] text-co-ink-soft">
                {item.answer}
              </p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
