import { ProductCard } from "./ProductCard";
import type { Jersey } from "@/data/jerseys";
import { cn } from "@/lib/cn";

export function ProductGrid({ items, className }: { items: Jersey[]; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5", className)}>
      {items.map((j) => (
        <ProductCard key={j.id} jersey={j} />
      ))}
    </div>
  );
}
