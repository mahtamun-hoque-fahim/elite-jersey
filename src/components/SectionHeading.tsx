import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({ title, href, viewAll }: { title: string; href?: string; viewAll?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <h2 className="relative pb-2 font-display text-lg font-semibold sm:text-xl">
        {title}
        <span className="absolute bottom-0 left-0 h-0.5 w-10 bg-brand" />
      </h2>
      {href && (
        <Link href={href} className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-brand hover:underline">
          {viewAll} <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}
