"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLinks } from "./NavLinks";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="grid size-10 place-items-center rounded-lg text-ink hover:bg-bg"
      >
        {open ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>
      {open && (
        <nav aria-label="Mobile" className="absolute inset-x-0 top-full z-40 border-b border-line bg-white px-4 pb-3 shadow-sm">
          <NavLinks vertical onNavigate={() => setOpen(false)} />
        </nav>
      )}
    </div>
  );
}
