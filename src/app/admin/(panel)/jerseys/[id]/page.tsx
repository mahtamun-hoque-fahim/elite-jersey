import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JerseyForm } from "@/components/admin/JerseyForm";
import { requireAdmin } from "@/lib/auth/session";
import { adminCatalog, adminGetJersey } from "@/lib/data/jerseys";

export const metadata: Metadata = { title: "Edit jersey" };

export default async function EditJerseyPage({ params }: PageProps<"/admin/jerseys/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const [jersey, types] = await Promise.all([adminGetJersey(id), adminCatalog()]);
  if (!jersey) notFound();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Edit jersey</h1>
      <JerseyForm key={jersey.id} jersey={jersey} types={types} />
    </div>
  );
}
