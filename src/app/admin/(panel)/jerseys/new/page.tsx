import type { Metadata } from "next";
import { JerseyForm } from "@/components/admin/JerseyForm";
import { requireAdmin } from "@/lib/auth/session";
import { adminCatalog } from "@/lib/data/jerseys";

export const metadata: Metadata = { title: "Add jersey" };

export default async function NewJerseyPage() {
  await requireAdmin();
  const types = await adminCatalog();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Add jersey</h1>
      <JerseyForm types={types} />
    </div>
  );
}
