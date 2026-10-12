import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ShopClient } from "@/components/ShopClient";
import { getCatalog, listJerseys } from "@/lib/data/jerseys";

export async function generateMetadata({ params }: PageProps<"/shop/[type]">): Promise<Metadata> {
  const { type } = await params;
  const found = (await getCatalog()).find((t) => t.slug === type);
  return { title: found?.name ?? "Shop" };
}

export default async function TypePage({ params }: PageProps<"/shop/[type]">) {
  const { type } = await params;
  const found = (await getCatalog()).find((t) => t.slug === type);
  if (!found) notFound();
  const items = (await listJerseys()).filter((j) => j.typeSlug === found.slug);
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-5 font-display text-2xl font-semibold">{found.name}</h1>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-white" />}>
        <ShopClient key={found.id} items={items} types={[found]} />
      </Suspense>
    </div>
  );
}
