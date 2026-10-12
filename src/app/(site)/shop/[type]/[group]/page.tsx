import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ChevronRight } from "lucide-react";
import { ShopClient } from "@/components/ShopClient";
import { getCatalog, listJerseys } from "@/lib/data/jerseys";
import { getT } from "@/i18n/server";

async function resolve(typeSlug: string, groupSlug: string) {
  const type = (await getCatalog()).find((t) => t.slug === typeSlug);
  const group = type?.groups.find((g) => g.slug === groupSlug);
  return type && group ? { type, group } : null;
}

export async function generateMetadata({ params }: PageProps<"/shop/[type]/[group]">): Promise<Metadata> {
  const { type, group } = await params;
  const r = await resolve(type, group);
  return { title: r ? `${r.group.name} ${r.type.name}` : "Shop" };
}

export default async function GroupPage({ params }: PageProps<"/shop/[type]/[group]">) {
  const { type, group } = await params;
  const r = await resolve(type, group);
  if (!r) notFound();
  const { t } = await getT();
  // The whole type is passed so the entry filter can be widened; this entry starts selected.
  const items = (await listJerseys()).filter((j) => j.typeSlug === r.type.slug);
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-1 text-sm text-muted">
        <Link href="/shop" className="hover:text-brand">{t.nav.shop}</Link>
        <ChevronRight className="size-4" />
        <Link href={`/shop/${r.type.slug}`} className="hover:text-brand">{r.type.name}</Link>
      </nav>
      <h1 className="mb-5 font-display text-2xl font-semibold">{r.group.name}</h1>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-white" />}>
        <ShopClient key={r.group.id} items={items} types={[r.type]} initialGroups={[r.group.id]} />
      </Suspense>
    </div>
  );
}
