"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";
import { useI18n } from "@/i18n/client";

export function NavLinks({ onNavigate, vertical }: { onNavigate?: () => void; vertical?: boolean }) {
  const pathname = usePathname();
  const { t } = useI18n();
  return (
    <ul className={cn("flex gap-1", vertical ? "flex-col" : "items-center justify-center gap-6")}>
      {site.nav.map((l) => {
        const active = l.href === "/" ? pathname === "/" : pathname === l.href;
        return (
          <li key={l.href}>
            <Link
              href={l.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "block py-3 text-[15px] font-medium transition-colors duration-200 ease-subtle hover:text-brand",
                vertical && "px-2",
                active ? "text-brand" : "text-ink",
              )}
            >
              {t.nav[l.key]}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
