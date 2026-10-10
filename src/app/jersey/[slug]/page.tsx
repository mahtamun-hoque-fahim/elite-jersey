import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight } from "lucide-react";
import { JerseyArt } from "@/components/JerseyArt";
import { ProductActions } from "@/components/ProductActions";
import { ProductGrid } from "@/components/ProductGrid";
import { SectionHeading } from "@/components/SectionHeading";
import { categoryLabels, img, money, savePercent } from "@/data/jerseys";
import { getJerseyBySlug, listJerseys, relatedFrom } from "@/lib/data/jerseys";

export async function generateMetadata({ params }: PageProps<"/jersey/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const j = await getJerseyBySlug(slug);
  return j ? { title: j.name, description: j.description } : { title: "Jersey not found" };
}

export default async function JerseyPage({ params }: PageProps<"/jersey/[slug]">) {
  const { slug } = await params;
  const j = await getJerseyBySlug(slug);
  if (!j) notFound();
  const rel = relatedFrom(await listJerseys(), j);

  const save = savePercent(j);
  const specs = [
    ["Type", categoryLabels[j.category]],
    ["Club / Country", j.team],
    ["Season", j.season],
    ["Version", j.version],
    ["Sizes available", j.sizes.join(", ")],
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1 text-sm text-muted">
        <Link href="/" className="hover:text-brand">Home</Link>
        <ChevronRight className="size-4" />
        <Link href={`/shop/${j.category}`} className="hover:text-brand">{categoryLabels[j.category]}</Link>
        <ChevronRight className="size-4" />
        <span className="text-ink">{j.team}</span>
      </nav>

      <div className="grid gap-8 rounded-2xl border border-line bg-white p-4 sm:p-6 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-xl bg-linear-to-b from-white to-zinc-200/70">
          {save > 0 && (
            <span className="absolute left-0 top-0 z-10 rounded-br-lg bg-brand px-3 py-1.5 text-xs font-bold text-white">SAVE {save}%</span>
          )}
          {j.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img(j.image, "f_auto,q_auto,w_1000")} alt={j.name} className="aspect-square w-full object-cover" />
          ) : (
            <JerseyArt colors={j.colors} pattern={j.pattern} title={j.name} className="aspect-square w-full p-8" />
          )}
        </div>

        <div className="space-y-5">
          <h1 className="font-display text-2xl font-semibold leading-snug sm:text-3xl">{j.name}</h1>
          <p className="font-display text-3xl font-bold">
            {money(j.price)}
            {j.oldPrice && <span className="ml-3 text-lg font-normal text-muted line-through">{money(j.oldPrice)}</span>}
          </p>
          <ProductActions jersey={j} />
          <ul className="space-y-2.5 border-t border-line pt-5 text-sm">
            {specs.map(([k, v]) => (
              <li key={k} className="flex gap-3">
                <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                <span><span className="font-semibold">{k}:</span> <span className="text-muted">{v}</span></span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-line bg-white p-6">
        <h2 className="font-display text-lg font-semibold">About this jersey</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{j.description}</p>
        <p className="mt-3 text-xs text-muted">Photo colors may vary slightly depending on your screen.</p>
      </section>

      <section className="mt-12">
        <SectionHeading title="Related jerseys" href={`/shop/${j.category}`} />
        <ProductGrid items={rel} className="xl:grid-cols-4" />
      </section>
    </div>
  );
}
