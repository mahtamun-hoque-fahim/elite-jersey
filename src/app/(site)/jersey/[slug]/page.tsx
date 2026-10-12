import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight } from "lucide-react";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { ProductActions } from "@/components/ProductActions";
import { ProductGrid } from "@/components/ProductGrid";
import { SectionHeading } from "@/components/SectionHeading";
import { img, money, savePercent } from "@/data/jerseys";
import { getT } from "@/i18n/server";
import { fmt } from "@/i18n/dictionaries";
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
  const { t } = await getT();

  const save = savePercent(j);
  const specs = [
    [j.typeName, j.groupName],
    [t.product.season, j.season],
    [t.product.version, j.version === "Fan" ? t.common.fan : t.common.player],
    [t.product.sizes, j.sizes.join(", ")],
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1 text-sm text-muted">
        <Link href="/" className="hover:text-brand">{t.product.home}</Link>
        <ChevronRight className="size-4" />
        <Link href={`/shop/${j.typeSlug}`} className="hover:text-brand">{j.typeName}</Link>
        <ChevronRight className="size-4" />
        <Link href={`/shop/${j.typeSlug}/${j.groupSlug}`} className="text-ink hover:text-brand">{j.groupName}</Link>
      </nav>

      <div className="grid gap-8 rounded-2xl border border-line bg-white p-4 sm:p-6 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-xl bg-linear-to-b from-white to-zinc-200/70">
          {save > 0 && (
            <span className="absolute left-0 top-0 z-10 rounded-br-lg bg-brand px-3 py-1.5 text-xs font-bold text-white">{fmt(t.card.save, { n: save })}</span>
          )}
          {j.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img(j.image, "f_auto,q_auto,w_1000")} alt={j.name} className="aspect-square w-full object-contain" />
          ) : (
            <PhotoPlaceholder label={t.common.photoSoon} className="aspect-square" />
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
        <h2 className="font-display text-lg font-semibold">{t.product.about}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{j.description}</p>
        <p className="mt-3 text-xs text-muted">{t.product.colorNote}</p>
      </section>

      <section className="mt-12">
        <SectionHeading title={t.product.related} href={`/shop/${j.typeSlug}`} viewAll={t.common.viewAll} />
        <ProductGrid items={rel} className="xl:grid-cols-4" />
      </section>
    </div>
  );
}
