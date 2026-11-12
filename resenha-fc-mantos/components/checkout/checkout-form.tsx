"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCarrinho } from "@/components/cart/cart-provider";
import { KitArt } from "@/components/kit-image";
import { subtotalItem } from "@/lib/cart";
import { brl } from "@/lib/site";

export function CheckoutForm({
  /** Em REAIS, já convertido na página. O banco guarda em centavos. */
  freteReais,
  pagamentoAtivo,
}: {
  freteReais: number;
  pagamentoAtivo: boolean;
}) {
  const { itens, pronto, pecas, subtotal, limpar } = useCarrinho();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const total = subtotal + freteReais;

  async function pagar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Só o que comprar. Nenhum preço: quem calcula é o servidor.
        body: JSON.stringify({
          nome,
          email,
          telefone,
          itens: itens.map((i) => ({
            productId: i.productId,
            size: i.tamanho,
            quantity: i.quantidade,
          })),
        }),
      });

      const dados = await r.json();

      if (!r.ok || !dados.url) {
        setErro(dados.erro ?? "Não consegui abrir o pagamento agora.");
        setEnviando(false);
        return;
      }

      // O carrinho é esvaziado só depois de o pedido existir no banco.
      limpar();
      window.location.href = dados.url;
    } catch {
      setErro("Falha de conexão. Confira a internet e tente de novo.");
      setEnviando(false);
    }
  }

  if (!pronto) {
    return <div className="h-64 animate-pulse rounded-3xl border border-line bg-surface" />;
  }

  if (itens.length === 0) {
    return (
      <div className="rounded-3xl border border-line bg-white px-6 py-16 text-center">
        <h2 className="text-xl font-extrabold tracking-tight">
          Seu carrinho está vazio
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
          Escolha os mantos que você quer antes de fechar o pedido.
        </p>
        <Link
          href="/catalogo"
          className="mt-7 inline-flex rounded-full bg-ink px-7 py-3 text-[13px] font-bold text-white transition hover:bg-ink/85"
        >
          Ver o catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
      <form onSubmit={pagar} className="space-y-5">
        <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <h2 className="text-[13px] font-bold tracking-[0.1em] text-ink-soft">
            SEUS DADOS
          </h2>

          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold">Nome completo</span>
              <input
                required
                minLength={3}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                autoComplete="name"
                className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-ink"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold">E-mail</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
                className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-ink"
              />
              <span className="mt-1.5 block text-[12px] text-ink-soft">
                O comprovante da compra vai para esse e-mail.
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold">
                WhatsApp <span className="font-normal text-ink-soft">(opcional)</span>
              </span>
              <input
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                autoComplete="tel"
                inputMode="tel"
                placeholder="+55 83 99999-8888"
                className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-ink"
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <h2 className="text-[13px] font-bold tracking-[0.1em] text-ink-soft">
            O QUE VOCÊ ESTÁ LEVANDO
          </h2>
          <ul className="mt-4 space-y-3">
            {itens.map((i) => (
              <li key={i.id} className="flex items-center gap-3">
                <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface p-1.5">
                  {i.foto ? (
                    <Image
                      src={i.foto}
                      alt=""
                      width={56}
                      height={56}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <KitArt
                      id={i.id}
                      name={i.nome}
                      category={i.categoria}
                      colors={i.cor1 && i.cor2 ? [i.cor1, i.cor2] : undefined}
                      pattern={i.padrao}
                      className="h-full w-full"
                    />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-bold">{i.nome}</span>
                  <span className="text-[12px] text-ink-soft">
                    {i.quantidade}x{i.tamanho ? ` · tam. ${i.tamanho}` : ""}
                  </span>
                </span>
                <span className="text-[13px] font-extrabold">
                  {brl(subtotalItem(i))}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/carrinho"
            className="mt-4 inline-block text-[12px] font-semibold text-ink-soft underline-offset-2 hover:text-ink hover:underline"
          >
            Alterar o carrinho
          </Link>
        </section>

        {erro && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700"
          >
            {erro}
          </p>
        )}

        {!pagamentoAtivo && (
          <p className="rounded-xl bg-amber-50 px-4 py-3 text-[13px] font-semibold text-amber-900">
            O pagamento online ainda não está ligado. Veja as pendências no
            arquivo COMO-ATIVAR.md.
          </p>
        )}
      </form>

      <aside className="rounded-2xl border border-line bg-white p-5 lg:sticky lg:top-28">
        <h2 className="text-[13px] font-bold tracking-[0.1em] text-ink-soft">
          RESUMO
        </h2>

        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-soft">
              {pecas} {pecas === 1 ? "peça" : "peças"}
            </dt>
            <dd className="font-semibold">{brl(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Frete</dt>
            <dd className="text-[13px] font-semibold">
              {freteReais === 0 ? "Grátis" : brl(freteReais)}
            </dd>
          </div>
        </dl>

        <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
          <span className="text-sm font-bold">Total</span>
          <span className="text-2xl font-extrabold tracking-tight">{brl(total)}</span>
        </div>

        <button
          type="submit"
          onClick={pagar}
          disabled={enviando || !pagamentoAtivo}
          className="mt-5 w-full rounded-full bg-ink px-6 py-4 text-sm font-bold text-white transition hover:bg-ink/85 disabled:opacity-50"
        >
          {enviando ? "Abrindo o pagamento…" : "Ir para o pagamento"}
        </button>

        <p className="mt-3 text-center text-[12px] leading-relaxed text-ink-soft">
          Você vai para a página segura da InfinitePay para pagar no PIX ou
          no cartão, e volta para cá no fim.
        </p>
      </aside>
    </div>
  );
}
