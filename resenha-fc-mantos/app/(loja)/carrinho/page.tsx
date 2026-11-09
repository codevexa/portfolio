import type { Metadata } from "next";
import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { CartList } from "@/components/cart/cart-list";
import { getSettings } from "@/lib/settings";
import { getTexts } from "@/lib/db";

export const metadata: Metadata = {
  title: "Meu carrinho",
  description: "Os mantos que você escolheu na Resenha FC Mantos.",
  robots: { index: false, follow: true },
};

export default async function CarrinhoPage() {
  const [s, t] = await Promise.all([getSettings(), getTexts()]);
  return (
    <>
      <PageHeader
        title={t["carrinho.titulo"]}
        subtitle={t["carrinho.sub"]}
      />
      <Section className="py-10">
        <CartList whatsapp={s.whatsapp} loja={s.storeName} textos={t} />
      </Section>
    </>
  );
}
