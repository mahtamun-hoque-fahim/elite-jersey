import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="font-display text-5xl font-bold text-brand">404</p>
      <h1 className="mt-3 font-display text-xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-muted">The page you are looking for does not exist or was moved.</p>
      <Link href="/shop" className="mt-6 inline-block rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
        Browse jerseys
      </Link>
    </div>
  );
}
