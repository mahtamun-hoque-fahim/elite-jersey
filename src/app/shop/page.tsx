import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopClient } from "@/components/ShopClient";

export const metadata: Metadata = { title: "Shop" };

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-5 font-display text-2xl font-semibold">Shop</h1>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-white" />}>
        <ShopClient />
      </Suspense>
    </div>
  );
}
