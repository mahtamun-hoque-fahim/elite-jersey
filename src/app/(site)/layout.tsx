import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OrderProvider } from "@/components/OrderProvider";
import { WhatsAppFab } from "@/components/WhatsAppFab";

// Public storefront chrome. The admin dashboard has its own layout and does not use this.
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <OrderProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFab />
    </OrderProvider>
  );
}
