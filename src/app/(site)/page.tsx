import Link from "next/link";
import { Download, MessageCircle, MousePointerClick } from "lucide-react";
import { JerseyArt } from "@/components/JerseyArt";
import { img } from "@/data/jerseys";
import { ProductGrid } from "@/components/ProductGrid";
import { SectionHeading } from "@/components/SectionHeading";
import { listJerseys } from "@/lib/data/jerseys";
import { getT } from "@/i18n/server";

export default async function HomePage() {
  const { t } = await getT();
  const all = await listJerseys();
  const heroPick = all.slice(0, 3);
  const hero = [heroPick[1], heroPick[0], heroPick[2]].filter(Boolean);
  const latest = all.slice(0, 10);
  const club = all.filter((j) => j.category === "club").slice(0, 10);
  const country = all.filter((j) => j.category === "national").slice(0, 10);
  const retroSpecial = all.filter((j) => j.category === "retro" || j.category === "special").slice(0, 10);

  return (
    <div className="mx-auto max-w-7xl space-y-14 px-4 py-6">
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-brand-dark via-brand to-brand-light text-white">
        <div className="grid items-center gap-6 px-6 py-10 sm:px-10 lg:grid-cols-2 lg:py-14">
          <div className="order-2 lg:order-1">
            <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {t.home.title}
            </h1>
            <p className="mt-4 max-w-md text-white/85">{t.home.subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/shop" className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-tint">
                {t.home.browse}
              </Link>
              <Link href="/custom-order" className="rounded-lg border border-white/60 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                {t.home.customKit}
              </Link>
            </div>
          </div>
          <div className="relative order-1 mx-auto flex w-full max-w-md items-end justify-center lg:order-2">
            {hero.map((j, i) =>
              j.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={j.id}
                  src={img(j.image, "f_auto,q_auto,w_500")}
                  alt={j.name}
                  className={i === 1 ? "relative z-10 -mx-6 w-1/2 rounded-xl bg-white object-cover shadow-xl" : "w-2/5 rounded-xl bg-white object-cover shadow-lg"}
                />
              ) : (
                <JerseyArt
                  key={j.id}
                  colors={j.colors}
                  pattern={j.pattern}
                  title={j.name}
                  className={i === 1 ? "relative z-10 -mx-6 w-1/2 drop-shadow-xl" : "w-2/5 drop-shadow-lg"}
                />
              ),
            )}
          </div>
        </div>
      </section>

      {[
        { title: t.home.newArrivals, href: "/shop", items: latest },
        { title: t.home.club, href: "/shop/club", items: club },
        { title: t.home.country, href: "/shop/national", items: country },
        { title: t.home.retroSpecial, href: "/shop/retro", items: retroSpecial },
      ].map(
        (s) =>
          s.items.length > 0 && (
            <section key={s.title}>
              <SectionHeading title={s.title} href={s.href} viewAll={t.common.viewAll} />
              <ProductGrid items={s.items} />
            </section>
          ),
      )}

      <section aria-labelledby="how-title" className="rounded-2xl border border-line bg-white p-6 sm:p-8">
        <h2 id="how-title" className="font-display text-xl font-semibold">{t.home.howTitle}</h2>
        <ol className="mt-5 grid gap-5 sm:grid-cols-3">
          {[
            { icon: MousePointerClick, title: t.home.s1, text: t.home.s1t },
            { icon: Download, title: t.home.s2, text: t.home.s2t },
            { icon: MessageCircle, title: t.home.s3, text: t.home.s3t },
          ].map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-tint text-brand">
                <s.icon className="size-5" />
              </span>
              <div>
                <p className="font-semibold">{i + 1}. {s.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-brand-tint p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <h2 className="font-display text-xl font-semibold">{t.home.bannerTitle}</h2>
          <p className="mt-1 text-sm text-muted">{t.home.bannerText}</p>
        </div>
        <Link href="/custom-order" className="rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">
          {t.home.bannerCta}
        </Link>
      </section>
    </div>
  );
}
