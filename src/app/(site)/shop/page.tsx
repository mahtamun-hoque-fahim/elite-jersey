import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopClient } from "@/components/ShopClient";
import { listJerseys } from "@/lib/data/jerseys";
import { getT } from "@/i18n/server";

export const metadata: Metadata = { title: "Shop" };

export default async function ShopPage() {
  const items = await listJerseys();
  const { t } = await getT();
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-5 font-display text-2xl font-semibold">{t.shop.title}</h1>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-white" />}>
        <ShopClient items={items} />
      </Suspense>
    </div>
  );
}
