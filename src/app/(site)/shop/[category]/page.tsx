import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ShopClient } from "@/components/ShopClient";
import { categoryLabels, type Category } from "@/data/jerseys";
import { getT } from "@/i18n/server";
import { listJerseys } from "@/lib/data/jerseys";

const keys = Object.keys(categoryLabels) as Category[];

export function generateStaticParams() {
  return keys.map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[category]">): Promise<Metadata> {
  const { category } = await params;
  return { title: keys.includes(category as Category) ? categoryLabels[category as Category] : "Shop" };
}

export default async function CategoryPage({ params }: PageProps<"/shop/[category]">) {
  const { category } = await params;
  if (!keys.includes(category as Category)) notFound();
  const c = category as Category;
  const items = await listJerseys();
  const { t } = await getT();
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-5 font-display text-2xl font-semibold">{t.categories[c]}</h1>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-white" />}>
        <ShopClient key={c} items={items} initialCategory={c} />
      </Suspense>
    </div>
  );
}
