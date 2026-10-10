import { Logo } from "@/components/Logo";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/auth/session";
import { newSubmissionCount } from "@/lib/data/submissions";

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  const session = await requireAdmin();
  const newCount = await newSubmissionCount();
  return (
    <div className="min-h-screen md:grid md:grid-cols-[15rem_1fr]">
      <aside className="border-b border-line bg-white p-3 md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r md:p-4">
        <div className="mb-3 flex items-center justify-between md:mb-6 md:block">
          <Logo />
          <p className="truncate text-xs text-muted md:mt-1">{session.user.email}</p>
        </div>
        <AdminNav newCount={newCount} />
      </aside>
      <main className="mx-auto w-full max-w-5xl p-4 sm:p-6">{children}</main>
    </div>
  );
}
