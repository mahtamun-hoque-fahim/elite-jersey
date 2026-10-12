"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ExternalLink, Inbox, Layers, LayoutDashboard, LogOut, Shirt, Users } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/cn";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/jerseys", label: "Jerseys", icon: Shirt },
  { href: "/admin/types", label: "Types", icon: Layers },
  { href: "/admin/inbox", label: "Inbox", icon: Inbox },
  { href: "/admin/admins", label: "Admins", icon: Users },
];

export function AdminNav({ newCount }: { newCount: number }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await authClient.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <nav aria-label="Dashboard" className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
      {links.map((l) => {
        const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-brand-tint text-brand" : "text-ink hover:bg-bg",
            )}
          >
            <l.icon className="size-5" />
            {l.label}
            {l.href === "/admin/inbox" && newCount > 0 && (
              <span className="ml-auto rounded-full bg-brand px-2 py-0.5 text-xs font-bold text-white">{newCount}</span>
            )}
          </Link>
        );
      })}
      <div className="mt-2 hidden border-t border-line pt-2 md:block" />
      <Link href="/" target="_blank" className="flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:bg-bg hover:text-ink">
        <ExternalLink className="size-5" />
        View site
      </Link>
      <button type="button" onClick={signOut} className="flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:bg-bg hover:text-ink">
        <LogOut className="size-5" />
        Sign out
      </button>
    </nav>
  );
}
