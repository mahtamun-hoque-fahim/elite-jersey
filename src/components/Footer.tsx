import Link from "next/link";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "./BrandIcons";
import { Logo } from "./Logo";
import { site, waLink } from "@/lib/site";
import { getT } from "@/i18n/server";
import { getCatalog } from "@/lib/data/jerseys";

export async function Footer() {
  const { t } = await getT();
  const types = await getCatalog();
  const { facebook, instagram } = site.social;
  return (
    <footer className="mt-16 border-t border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted">{t.footer.tagline}</p>
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
          <h2 className="mb-4 font-display text-base font-semibold">{t.footer.shop}</h2>
          <ul className="space-y-2.5 text-sm text-muted">
            <li><Link href="/shop" className="transition-colors hover:text-brand">{t.nav.shop}</Link></li>
            {types.map((ty) => (
              <li key={ty.slug}>
                <Link href={`/shop/${ty.slug}`} className="transition-colors hover:text-brand">{ty.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-display text-base font-semibold">{t.footer.company}</h2>
          <ul className="space-y-2.5 text-sm text-muted">
            <li><Link href="/custom-order" className="transition-colors hover:text-brand">{t.nav.custom}</Link></li>
            <li><Link href="/contact" className="transition-colors hover:text-brand">{t.footer.contactUs}</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-display text-base font-semibold">{t.footer.contact}</h2>
          <ul className="space-y-3 text-sm text-muted">
            {site.address && (
              <li className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0" />{site.address}</li>
            )}
            {site.phone && (
              <li className="flex gap-2"><Phone className="mt-0.5 size-4 shrink-0" />{site.phone}</li>
            )}
            <li className="flex gap-2"><MessageCircle className="mt-0.5 size-4 shrink-0" />{t.footer.orderAsk}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-muted">
        &copy; 2026 {site.name}. {t.footer.rights}
      </div>
    </footer>
  );
}
