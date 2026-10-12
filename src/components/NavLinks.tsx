"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { useI18n } from "@/i18n/client";
import { fmt } from "@/i18n/dictionaries";

export interface NavType {
  name: string;
  slug: string;
  groups: { name: string; slug: string }[];
}

const linkCls = "block py-3 text-[15px] font-medium transition-colors duration-200 ease-subtle hover:text-brand";

/** Home and Shop are fixed. Every other item is a type (with its entries) from the database. */
export function NavLinks({ types, onNavigate, vertical }: { types: NavType[]; onNavigate?: () => void; vertical?: boolean }) {
  const pathname = usePathname();
  const { t } = useI18n();
  const active = (href: string) => (href === "/" ? pathname === "/" : pathname === href);
  const inType = (slug: string) => pathname === `/shop/${slug}` || pathname.startsWith(`/shop/${slug}/`);

  const fixed = [
    { href: "/", label: t.nav.home },
    { href: "/shop", label: t.nav.shop },
  ];

  if (vertical) {
    return (
      <ul className="flex flex-col gap-1">
        {fixed.map((l) => (
          <li key={l.href}>
            <Link href={l.href} onClick={onNavigate} aria-current={active(l.href) ? "page" : undefined} className={cn(linkCls, "px-2", active(l.href) ? "text-brand" : "text-ink")}>
              {l.label}
            </Link>
          </li>
        ))}
        {types.map((ty) => (
          <li key={ty.slug}>
            <details className="group" open={inType(ty.slug)}>
              <summary className={cn(linkCls, "flex cursor-pointer list-none items-center justify-between px-2", inType(ty.slug) ? "text-brand" : "text-ink")}>
                {ty.name}
                <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
              </summary>
              <ul className="mb-2 ml-3 border-l border-line pl-3">
                <li>
                  <Link href={`/shop/${ty.slug}`} onClick={onNavigate} className="block py-2 text-sm font-semibold text-brand">
                    {fmt(t.nav.allOf, { name: ty.name })}
                  </Link>
                </li>
                {ty.groups.map((g) => (
                  <li key={g.slug}>
                    <Link href={`/shop/${ty.slug}/${g.slug}`} onClick={onNavigate} className="block py-2 text-sm text-ink hover:text-brand">
                      {g.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-6">
      {fixed.map((l) => (
        <li key={l.href}>
          <Link href={l.href} aria-current={active(l.href) ? "page" : undefined} className={cn(linkCls, active(l.href) ? "text-brand" : "text-ink")}>
            {l.label}
          </Link>
        </li>
      ))}
      {types.map((ty) => (
        <li key={ty.slug} className="group relative">
          <Link href={`/shop/${ty.slug}`} className={cn(linkCls, "inline-flex items-center gap-1", inType(ty.slug) ? "text-brand" : "text-ink")}>
            {ty.name}
            {ty.groups.length > 0 && <ChevronDown className="size-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />}
          </Link>
          {ty.groups.length > 0 && (
            <div className="invisible absolute left-1/2 top-full z-40 w-60 -translate-x-1/2 rounded-xl border border-line bg-white p-2 opacity-0 shadow-lg transition duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <ul className="max-h-80 overflow-y-auto">
                <li>
                  <Link href={`/shop/${ty.slug}`} className="block rounded-lg px-3 py-2 text-sm font-semibold text-brand hover:bg-brand-tint">
                    {fmt(t.nav.allOf, { name: ty.name })}
                  </Link>
                </li>
                {ty.groups.map((g) => (
                  <li key={g.slug}>
                    <Link href={`/shop/${ty.slug}/${g.slug}`} className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-bg hover:text-brand">
                      {g.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
