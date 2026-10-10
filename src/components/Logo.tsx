import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="Elite Jersey home" className={cn("inline-flex items-baseline gap-1.5 font-display font-bold tracking-tight text-ink", className)}>
      <span className="text-2xl leading-none sm:text-[1.7rem]">ELITE</span>
      <span className="text-2xl leading-none sm:text-[1.7rem]">JERSEY</span>
    </Link>
  );
}
