import type { Metadata } from "next";
import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { getTexts } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { waLink } from "@/lib/site";
import { buscarPedido } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Meus pedidos",
  description: "Consulte o andamento da sua compra.",
};

export default async function MeusPedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const [{ erro }, t, s] = await Promise.all([
    searchParams,
    getTexts(),
    getSettings(),
  ]);

  return (
    <>
      <PageHeader title={t["pedidos.titulo"]} subtitle={t["pedidos.sub"]} />
      <Section className="py-10 sm:py-12">
        <div className="mx-auto max-w-xl">
          <form
            action={buscarPedido}
            className="rounded-3xl border border-line bg-white p-6 sm:p-8"
          >
            <label htmlFor="numero" className="mb-1.5 block text-[13px] font-bold">
              {t["pedidos.numero"]}
            </label>
            <input
              id="numero"
              name="numero"
              required
              autoComplete="off"
              spellCheck={false}
              placeholder="RFC-000000-XXXXXXXXXX"
              className="w-full rounded-xl border border-line bg-white px-4 py-3.5 text-sm uppercase outline-none placeholder:normal-case focus:border-ink"
            />

            <label
              htmlFor="email"
              className="mb-1.5 mt-4 block text-[13px] font-bold"
            >
              {t["pedidos.email"]}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              className="w-full rounded-xl border border-line bg-white px-4 py-3.5 text-sm outline-none focus:border-ink"
            />

            {erro && (
              <p
                role="alert"
                className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700"
              >
                {t["pedidos.erro"]}
              </p>
            )}

            <button
              type="submit"
              className="mt-5 w-full rounded-full bg-ink px-6 py-4 text-sm font-bold text-white transition hover:bg-ink/85"
            >
              {t["pedidos.botao"]}
            </button>

            <p className="mt-4 text-center text-[12px] leading-relaxed text-ink-soft">
              {t["pedidos.dica"]}
            </p>
          </form>

          <p className="mt-6 text-center text-[13px] text-ink-soft">
            {t["pedidos.ajuda"]}{" "}
            <a
              href={waLink(s.whatsapp, "Olá! Quero saber do meu pedido.")}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-ink underline underline-offset-2"
            >
              {t["pedidos.ajuda_link"]}
            </a>
          </p>
        </div>
      </Section>
    </>
  );
}
