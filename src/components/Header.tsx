import Link from "next/link";
import { MessageCircle, Search } from "lucide-react";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";
import { MobileNav } from "./MobileNav";
import { LangToggle } from "./LangToggle";
import { waLink } from "@/lib/site";
import { getT } from "@/i18n/server";
import { getCatalog } from "@/lib/data/jerseys";

function SearchBox({ className, label, placeholder, submit }: { className?: string; label: string; placeholder: string; submit: string }) {
  return (
    <form action="/shop" role="search" className={className}>
      <label htmlFor="site-search" className="sr-only">
        {label}
      </label>
      <div className="flex h-11 items-center rounded-xl bg-bg px-4 ring-1 ring-transparent transition focus-within:bg-white focus-within:ring-brand">
        <input
          id="site-search"
          name="q"
          type="search"
          placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
        />
        <button type="submit" aria-label={submit} className="text-ink">
          <Search className="size-5" />
        </button>
      </div>
    </form>
  );
}

export async function Header() {
  const { t } = await getT();
  const types = (await getCatalog()).map((ty) => ({ name: ty.name, slug: ty.slug, groups: ty.groups.map((g) => ({ name: g.name, slug: g.slug })) }));
  const sb = { label: t.common.searchLabel, placeholder: t.common.searchPlaceholder, submit: t.common.search };
  return (
    <header className="relative z-30 border-b border-line bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:py-4">
        <Logo />
        <SearchBox className="mx-auto hidden w-full max-w-xl md:block" {...sb} />
        <div className="ml-auto flex items-center gap-2">
          <a
            href={waLink("Hi Elite Jersey, I have a question.")}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink hover:text-brand sm:inline-flex"
          >
            <MessageCircle className="size-5" />
            {t.common.whatsapp}
          </a>
          <Link
            href="/custom-order"
            className="hidden rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark sm:inline-block"
          >
            {t.common.customOrder}
          </Link>
          <LangToggle />
          <MobileNav types={types} />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-3 md:hidden">
        <SearchBox {...sb} />
      </div>
      <nav aria-label="Main" className="hidden border-t border-line lg:block">
        <div className="mx-auto max-w-7xl px-4">
          <NavLinks types={types} />
        </div>
      </nav>
    </header>
  );
}
