import Link from "next/link";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "./BrandIcons";
import { Logo } from "./Logo";
import { site, waLink } from "@/lib/site";

export function Footer() {
  const { facebook, instagram } = site.social;
  return (
    <footer className="mt-16 border-t border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted">{site.tagline}</p>
          <div className="flex gap-2">
            <a
              href={waLink("Hi Elite Jersey!")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="grid size-10 place-items-center rounded-full bg-bg text-ink transition-colors hover:bg-brand hover:text-white"
            >
              <MessageCircle className="size-5" />
            </a>
            {facebook && (
              <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook page" className="grid size-10 place-items-center rounded-full bg-bg text-ink transition-colors hover:bg-brand hover:text-white">
                <FacebookIcon className="size-5" />
              </a>
            )}
            {instagram && (
              <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid size-10 place-items-center rounded-full bg-bg text-ink transition-colors hover:bg-brand hover:text-white">
                <InstagramIcon className="size-5" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-display text-base font-semibold">Shop</h2>
          <ul className="space-y-2.5 text-sm text-muted">
            {site.nav.slice(1, 6).map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-brand">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-display text-base font-semibold">Company</h2>
          <ul className="space-y-2.5 text-sm text-muted">
            <li><Link href="/custom-order" className="transition-colors hover:text-brand">Custom Order</Link></li>
            <li><Link href="/contact" className="transition-colors hover:text-brand">Contact us</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-display text-base font-semibold">Contact</h2>
          <ul className="space-y-3 text-sm text-muted">
            {site.address && (
              <li className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0" />{site.address}</li>
            )}
            {site.phone && (
              <li className="flex gap-2"><Phone className="mt-0.5 size-4 shrink-0" />{site.phone}</li>
            )}
            <li className="flex gap-2"><MessageCircle className="mt-0.5 size-4 shrink-0" />Order and ask on WhatsApp</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-muted">
        &copy; 2026 {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
