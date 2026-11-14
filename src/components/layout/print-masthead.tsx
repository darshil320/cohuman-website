"use client";

import { usePathname } from "next/navigation";
import { Logo } from "@/components/common/logo";
import { siteConfig } from "@/lib/site-config";

/**
 * The top of a printed page (print only): the logo, the page's own address and the
 * contacts, so a spec sheet that leaves the building still says where it came from and
 * who to call. Never shown on screen.
 */
export function PrintMasthead() {
  const pathname = usePathname();
  const host = siteConfig.url.replace(/^https?:\/\//, "");
  return (
    <div
      aria-hidden
      className="mb-8 hidden items-end justify-between gap-6 border-b border-co-ink pb-4 print:flex"
    >
      <Logo className="w-[140px]" sizes="140px" />
      <p className="co-data text-right text-co-muted-2">
        <span className="block text-co-ink">
          Spec sheet · {host}
          {pathname === "/" ? "" : pathname}
        </span>
        <span className="block">
          {siteConfig.phoneDisplay} · {siteConfig.email}
        </span>
      </p>
    </div>
  );
}
