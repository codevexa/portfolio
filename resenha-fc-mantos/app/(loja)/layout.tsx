import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { CarrinhoProvider } from "@/components/cart/cart-provider";

export default function LojaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <CarrinhoProvider>
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppFloat />
    </CarrinhoProvider>
  );
}
