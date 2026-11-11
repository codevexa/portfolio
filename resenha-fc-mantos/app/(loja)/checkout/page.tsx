import type { Metadata } from "next";
import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { createPublicClient } from "@/lib/supabase/server";
import { temServiceRole } from "@/lib/supabase/admin";
import { handleDaLoja } from "@/lib/infinitepay";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Finalizar compra",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  // O frete vem do banco, nunca do navegador.
  const { data } = await createPublicClient()
    .from("settings")
    .select("frete_centavos")
    .eq("id", 1)
    .maybeSingle();

  const frete = Math.max(
    0,
    Number((data as { frete_centavos?: number } | null)?.frete_centavos ?? 0),
  );

  return (
    <>
      <PageHeader
        title="Finalizar compra"
        subtitle="Confira o pedido, preencha seus dados e vá para o pagamento."
      />
      <Section className="py-10">
        <CheckoutForm
          frete={frete}
          pagamentoAtivo={temServiceRole() && Boolean(handleDaLoja())}
        />
      </Section>
    </>
  );
}
