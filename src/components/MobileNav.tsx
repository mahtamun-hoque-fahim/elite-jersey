"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { NavLinks, type NavType } from "./NavLinks";
import { useI18n } from "@/i18n/client";

export function MobileNav({ types }: { types: NavType[] }) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? t.common.closeMenu : t.common.openMenu}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="grid size-10 place-items-center rounded-lg text-ink hover:bg-bg"
      >
        {open ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>
      {open && (
        <nav aria-label="Mobile" className="absolute inset-x-0 top-full z-40 border-b border-line bg-white px-4 pb-3 shadow-sm">
          <NavLinks types={types} vertical onNavigate={() => setOpen(false)} />
          <Link href="/custom-order" onClick={() => setOpen(false)} className="my-2 block rounded-lg bg-brand py-3 text-center text-sm font-semibold text-white">
            {t.common.customOrder}
          </Link>
        </nav>
      )}
    </div>
  );
}
