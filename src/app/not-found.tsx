import Link from "next/link";
import { getT } from "@/i18n/server";

export default async function NotFound() {
  const { t } = await getT();
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="font-display text-5xl font-bold text-brand">404</p>
      <h1 className="mt-3 font-display text-xl font-semibold">{t.notFound.title}</h1>
      <p className="mt-2 text-sm text-muted">{t.notFound.text}</p>
      <Link href="/shop" className="mt-6 inline-block rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
        {t.notFound.browse}
      </Link>
    </div>
  );
}
