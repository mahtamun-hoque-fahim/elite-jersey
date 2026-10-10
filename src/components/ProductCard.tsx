"use client";

import Link from "next/link";
import { JerseyArt } from "./JerseyArt";
import { useOrder } from "./OrderProvider";
import { img, money, savePercent, type Jersey } from "@/data/jerseys";

export function ProductCard({ jersey }: { jersey: Jersey }) {
  const { open } = useOrder();
  const save = savePercent(jersey);
  const badge = save > 0 ? `SAVE ${save}%` : jersey.isNew ? "NEW" : null;

  return (
    <article className="flex flex-col rounded-xl border border-line bg-white p-3 transition-shadow duration-200 ease-subtle hover:shadow-md">
      <Link href={`/jersey/${jersey.slug}`} className="group relative block overflow-hidden rounded-lg bg-linear-to-b from-white to-zinc-200/70" aria-label={jersey.name}>
        {badge && (
          <span className="absolute right-0 top-0 z-10 rounded-bl-lg bg-brand px-2 py-1 text-[11px] font-bold tracking-wide text-white">
            {badge}
          </span>
        )}
        {jersey.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img(jersey.image)} alt={jersey.name} loading="lazy" className="aspect-square w-full object-cover" />
        ) : (
          <JerseyArt colors={jersey.colors} pattern={jersey.pattern} title={jersey.name} className="aspect-square w-full p-3 transition-transform duration-300 ease-subtle group-hover:scale-105" />
        )}
      </Link>

      <Link href={`/jersey/${jersey.slug}`} className="mt-3 line-clamp-2 min-h-10 text-center text-sm font-semibold leading-snug hover:text-brand">
        {jersey.name}
      </Link>

      <p className="mt-1.5 text-center font-display text-base font-bold">
        {money(jersey.price)}
        {jersey.oldPrice && <span className="ml-2 text-sm font-normal text-muted line-through">{money(jersey.oldPrice)}</span>}
      </p>

      {jersey.inStock ? (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => open(jersey)}
            className="h-10 rounded-lg bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Buy Now
          </button>
          <Link
            href={`/jersey/${jersey.slug}`}
            className="grid h-10 place-items-center rounded-lg border border-brand text-sm font-semibold text-brand transition-colors hover:bg-brand-tint"
          >
            Details
          </Link>
        </div>
      ) : (
        <p className="mt-3 grid h-10 place-items-center rounded-lg border border-line text-sm font-medium text-muted">Stock Out</p>
      )}
    </article>
  );
}
