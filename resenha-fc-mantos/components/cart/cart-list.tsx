"use client";

import Image from "next/image";
import Link from "next/link";
import { brl, site, waLink } from "@/lib/site";
import type { Textos } from "@/lib/texts";
import { MAX_POR_ITEM, mensagemPedido, subtotalItem } from "@/lib/cart";
import { KitArt } from "@/components/kit-image";
import { useCarrinho } from "./cart-provider";

export function CartList({
  whatsapp,
  loja,
  textos: t,
}: {
  whatsapp: string;
  loja: string;
  textos: Textos;
}) {
  const { itens, pronto, pecas, subtotal, alterarQtd, remover, limpar } =
    useCarrinho();

  if (!pronto) {
    return (
      <div className="space-y-3" aria-busy="true" aria-live="polite">
        <span className="sr-only">Carregando o carrinho…</span>
        {[0, 1].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl border border-line bg-surface"
          />
        ))}
      </div>
    );
  }

  if (itens.length === 0) {
    return (
      <div className="rounded-3xl border border-line bg-white px-6 py-16 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-surface">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-soft)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 7h13l-1.3 9.3a2 2 0 0 1-2 1.7H9.3a2 2 0 0 1-2-1.7L6 7Z" />
            <path d="M9 7a3 3 0 0 1 6 0" />
          </svg>
        </div>
        <h2 className="mt-5 text-xl font-extrabold tracking-tight">
          {t["carrinho.vazio.titulo"]}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
          {t["carrinho.vazio.texto"]}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/pronta-entrega"
            className="rounded-full bg-ink px-7 py-3 text-[13px] font-bold text-white transition hover:bg-ink/85"
          >
            {t["pronta.titulo"]}
          </Link>
          <Link
            href="/"
            className="rounded-full border border-line px-7 py-3 text-[13px] font-bold transition hover:border-ink"
          >
            {t["404.botao_inicio"]}
          </Link>
        </div>
      </div>
    );
  }

  const mensagem = mensagemPedido(itens, loja, site.url, brl);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
      <div className="space-y-3">
        {itens.map((i) => (
          <article
            key={i.id}
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-white p-4"
          >
            <Link
              href={`/produto/${i.slug}`}
              className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface p-2"
            >
              {i.foto ? (
                <Image
                  src={i.foto}
                  alt={i.nome}
                  width={80}
                  height={80}
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
            </Link>

            <div className="min-w-[150px] flex-1">
              <Link
                href={`/produto/${i.slug}`}
                className="text-sm font-bold leading-tight hover:underline"
              >
                {i.nome}
              </Link>
              {i.tamanho && (
                <p className="mt-0.5 text-[12px] text-ink-soft">
                  {t["produto.tamanho"]} {i.tamanho}
                </p>
              )}
              <p className="mt-1 text-[13px] text-ink-soft">
                {brl(i.preco)} cada
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-full border border-line p-1">
              <button
                type="button"
                aria-label={`Diminuir ${i.nome}`}
                onClick={() => alterarQtd(i.id, i.quantidade - 1)}
                className="grid h-8 w-8 place-items-center rounded-full text-lg transition hover:bg-surface"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-bold">
                {i.quantidade}
              </span>
              <button
                type="button"
                aria-label={`Aumentar ${i.nome}`}
                disabled={i.quantidade >= MAX_POR_ITEM}
                onClick={() => alterarQtd(i.id, i.quantidade + 1)}
                className="grid h-8 w-8 place-items-center rounded-full text-lg transition hover:bg-surface disabled:opacity-30"
              >
                +
              </button>
            </div>

            <div className="ml-auto text-right">
              <p className="text-base font-extrabold">{brl(subtotalItem(i))}</p>
              <button
                type="button"
                onClick={() => remover(i.id)}
                className="mt-1 text-[12px] font-semibold text-ink-soft underline-offset-2 transition hover:text-red-700 hover:underline"
              >
                Remover
              </button>
            </div>
          </article>
        ))}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/pronta-entrega"
            className="rounded-full border border-line px-6 py-3 text-[13px] font-bold transition hover:border-ink"
          >
            {t["carrinho.continuar"]}
          </Link>
          <button
            type="button"
            onClick={() => {
              if (confirm("Esvaziar o carrinho?")) limpar();
            }}
            className="text-[13px] font-semibold text-ink-soft underline-offset-2 transition hover:text-ink hover:underline"
          >
            {t["carrinho.esvaziar"]}
          </button>
        </div>
      </div>

      <aside className="rounded-2xl border border-line bg-white p-5 lg:sticky lg:top-28">
        <h2 className="text-[13px] font-bold tracking-[0.1em] text-ink-soft">
          {t["carrinho.resumo"]}
        </h2>

        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-soft">
              {pecas} {pecas === 1 ? "peça" : "peças"}
            </dt>
            <dd className="font-semibold">{brl(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">{t["carrinho.frete_label"]}</dt>
            <dd className="text-[13px] text-ink-soft">{t["carrinho.frete"]}</dd>
          </div>
        </dl>

        <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
          <span className="text-sm font-bold">{t["carrinho.total"]}</span>
          <span className="text-2xl font-extrabold tracking-tight">
            {brl(subtotal)}
          </span>
        </div>

        <a
          href={waLink(whatsapp, mensagem)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 py-4 text-sm font-bold text-white transition hover:brightness-95"
        >
          <svg viewBox="0 0 24 24" width="19" height="19" fill="#fff" aria-hidden="true">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Z" />
          </svg>
          {t["carrinho.botao"]}
        </a>

        <p className="mt-3 text-center text-[12px] text-ink-soft">
          {t["carrinho.aviso"]}
        </p>
      </aside>
    </div>
  );
}
