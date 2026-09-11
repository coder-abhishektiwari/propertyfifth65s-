import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CustomerProvider } from "@/components/providers/customer-context";
import CustomerIdentityDialog from "@/components/customer-identity-dialog";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <CustomerProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CustomerIdentityDialog />
    </CustomerProvider>
  );
}
