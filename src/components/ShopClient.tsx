"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { ProductGrid } from "./ProductGrid";
import { ALL_SIZES, categoryLabels, type Category, type Jersey } from "@/data/jerseys";
import { cn } from "@/lib/cn";

const PER_PAGE = 12;
const MAX_PRICE = 2000;

type Sort = "default" | "price-asc" | "price-desc" | "name";

function toggle<T>(list: T[], v: T) {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

export function ShopClient({ items, initialCategory }: { items: Jersey[]; initialCategory?: Category }) {
  const q = (useSearchParams().get("q") ?? "").trim().toLowerCase();
  const [cats, setCats] = useState<Category[]>(initialCategory ? [initialCategory] : []);
  const [teams, setTeams] = useState<string[]>([]);
  const [seasons, setSeasons] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [sort, setSort] = useState<Sort>("default");
  const [page, setPage] = useState(1);
  const [sheet, setSheet] = useState(false);

  const teamOptions = useMemo(() => [...new Set(items.map((j) => j.team))].sort(), [items]);
  const seasonOptions = useMemo(() => [...new Set(items.map((j) => j.season))].sort().reverse(), [items]);

  const filtered = useMemo(() => {
    const list = items.filter(
      (j) =>
        (!cats.length || cats.includes(j.category)) &&
        (!teams.length || teams.includes(j.team)) &&
        (!seasons.length || seasons.includes(j.season)) &&
        (!sizes.length || sizes.some((s) => j.sizes.includes(s))) &&
        j.price <= maxPrice &&
        (!q || j.name.toLowerCase().includes(q)),
    );
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [items, cats, teams, seasons, sizes, maxPrice, sort, q]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const hasFilters = cats.length + teams.length + seasons.length + sizes.length > 0 || maxPrice < MAX_PRICE;

  function reset() {
    setCats([]);
    setTeams([]);
    setSeasons([]);
    setSizes([]);
    setMaxPrice(MAX_PRICE);
    setPage(1);
  }

  const panel = (
    <div className="space-y-4">
      <Group title="Category">
        {(Object.keys(categoryLabels) as Category[]).map((c) => (
          <Check key={c} label={categoryLabels[c]} checked={cats.includes(c)} onChange={() => { setCats(toggle(cats, c)); setPage(1); }} />
        ))}
      </Group>
      <Group title="Club / Country">
        <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
          {teamOptions.map((t) => (
            <Check key={t} label={t} checked={teams.includes(t)} onChange={() => { setTeams(toggle(teams, t)); setPage(1); }} />
          ))}
        </div>
      </Group>
      <Group title="Season">
        {seasonOptions.map((s) => (
          <Check key={s} label={s} checked={seasons.includes(s)} onChange={() => { setSeasons(toggle(seasons, s)); setPage(1); }} />
        ))}
      </Group>
      <Group title="Size">
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={sizes.includes(s)}
              onClick={() => { setSizes(toggle(sizes, s)); setPage(1); }}
              className={cn("h-8 min-w-10 rounded-full border px-3 text-xs font-medium transition-colors", sizes.includes(s) ? "border-brand bg-brand text-white" : "border-line hover:border-brand")}
            >
              {s}
            </button>
          ))}
        </div>
      </Group>
      <Group title="Price range">
        <input
          type="range"
          min={500}
          max={MAX_PRICE}
          step={50}
          value={maxPrice}
          aria-label="Maximum price"
          onChange={(e) => { setMaxPrice(Number(e.target.value)); setPage(1); }}
          className="w-full accent-brand"
        />
        <p className="text-xs text-muted">Up to ৳{maxPrice.toLocaleString("en-US")}</p>
      </Group>
      {hasFilters && (
        <button type="button" onClick={reset} className="text-sm font-semibold text-brand hover:underline">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[17rem_1fr]">
      <aside className="hidden self-start rounded-xl border border-line bg-white p-5 lg:block">{panel}</aside>

      <div>
        <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-line bg-white p-3">
          <button type="button" onClick={() => setSheet(true)} className="inline-flex items-center gap-2 text-sm font-semibold lg:hidden">
            <SlidersHorizontal className="size-4" /> Filters
          </button>
          <p className="hidden text-sm text-muted lg:block">
            {q ? `Results for "${q}": ` : ""}
            {filtered.length} jerseys
          </p>
          <label className="ml-auto flex items-center gap-2 text-sm">
            <span className="font-semibold">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-9 rounded-lg border border-line bg-white px-2 text-sm"
            >
              <option value="default">Default sorting</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name</option>
            </select>
          </label>
        </div>

        {visible.length ? (
          <ProductGrid items={visible} className="lg:grid-cols-3 xl:grid-cols-4" />
        ) : (
          <div className="rounded-xl border border-dashed border-line bg-white p-10 text-center">
            <p className="font-semibold">No jerseys found</p>
            <p className="mt-1 text-sm text-muted">Try removing a filter or searching for something else.</p>
            {hasFilters && (
              <button type="button" onClick={reset} className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
                Clear filters
              </button>
            )}
          </div>
        )}

        {pages > 1 && (
          <nav aria-label="Pagination" className="mt-8 flex items-center justify-between text-sm text-muted">
            <p>
              Showing {(current - 1) * PER_PAGE + 1} - {Math.min(current * PER_PAGE, filtered.length)} of {filtered.length} results
            </p>
            <div className="flex items-center gap-1">
              <button type="button" aria-label="Previous page" disabled={current === 1} onClick={() => setPage(current - 1)} className="grid size-9 place-items-center rounded-lg hover:bg-white disabled:opacity-40">
                <ChevronLeft className="size-4" />
              </button>
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-current={current === i + 1 ? "page" : undefined}
                  onClick={() => setPage(i + 1)}
                  className={cn("grid size-9 place-items-center rounded-lg font-medium", current === i + 1 ? "bg-brand text-white" : "hover:bg-white")}
                >
                  {i + 1}
                </button>
              ))}
              <button type="button" aria-label="Next page" disabled={current === pages} onClick={() => setPage(current + 1)} className="grid size-9 place-items-center rounded-lg hover:bg-white disabled:opacity-40">
                <ChevronRight className="size-4" />
              </button>
            </div>
          </nav>
        )}
      </div>

      {sheet && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button type="button" aria-label="Close filters" className="absolute inset-0 bg-black/50" onClick={() => setSheet(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Filters</h2>
              <button type="button" aria-label="Close" onClick={() => setSheet(false)} className="grid size-9 place-items-center rounded-full hover:bg-bg">
                <X className="size-5" />
              </button>
            </div>
            {panel}
            <button type="button" onClick={() => setSheet(false)} className="mt-6 h-12 w-full rounded-xl bg-brand font-semibold text-white">
              Show {filtered.length} jerseys
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details open className="group border-b border-line pb-4 last:border-0">
      <summary className="mb-3 cursor-pointer list-none font-display text-sm font-semibold uppercase tracking-wide">
        {title}
        <span className="mt-1 block h-0.5 w-8 bg-brand" />
      </summary>
      <div className="space-y-2">{children}</div>
    </details>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-muted hover:text-ink">
      <input type="checkbox" checked={checked} onChange={onChange} className="size-4 rounded border-line accent-brand" />
      {label}
    </label>
  );
}
