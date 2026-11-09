"use client";

import Link from "next/link";
import { useState } from "react";
import { brl, site, waLink } from "@/lib/site";
import type { Textos } from "@/lib/texts";
import { sizeAvailable, soldOut, type Product } from "@/lib/products";
import { useCarrinho } from "./cart-provider";
import { MAX_POR_ITEM } from "@/lib/cart";

export function AddToCart({
  product,
  whatsapp,
  loja,
  textos: t,
}: {
  product: Product;
  whatsapp: string;
  loja: string;
  textos: Textos;
}) {
  const { adicionar } = useCarrinho();
  const esgotado = soldOut(product);
  const disponiveis = product.sizes.filter((s) => sizeAvailable(product, s));

  const [tamanho, setTamanho] = useState<string | null>(
    disponiveis.length === 1 ? disponiveis[0] : null,
  );
  const [qtd, setQtd] = useState(1);
  const [erro, setErro] = useState<string | null>(null);
  const [adicionado, setAdicionado] = useState(false);

  const precisaTamanho = product.sizes.length > 0;

  function aoAdicionar() {
    if (precisaTamanho && !tamanho) {
      setErro(t["produto.erro_tamanho"]);
      return;
    }
    setErro(null);
    adicionar({
      productId: product.id,
      slug: product.slug,
      nome: product.name,
      preco: product.price,
      quantidade: qtd,
      tamanho,
      foto: product.image,
      categoria: product.category,
      cor1: product.club?.colors[0],
      cor2: product.club?.colors[1],
      padrao: product.club?.pattern,
    });
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 4000);
  }

  if (esgotado) {
    return (
      <div className="space-y-4">
        <p className="rounded-xl bg-surface px-4 py-3 text-[13px] font-semibold text-ink-soft">
          {t["produto.esgotado_aviso"]}
        </p>
        <a
          href={waLink(
            whatsapp,
            `Olá! Esse manto da ${loja} está esgotado:\n\n• ${product.name}\n\nMe avisa quando chegar?`,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center rounded-full bg-ink px-6 py-4 text-sm font-bold text-white transition hover:brightness-110"
        >
          {t["produto.botao_avise"]}
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {precisaTamanho && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[13px] font-bold">
              {t["produto.tamanho"]}
            </span>
            {!tamanho && (
              <span className="text-[12px] text-ink-soft">
                {t["produto.escolha_tamanho"]}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => {
              const tem = sizeAvailable(product, s);
              return (
                <button
                  key={s}
                  type="button"
                  disabled={!tem}
                  onClick={() => {
                    setTamanho(s);
                    setErro(null);
                  }}
                  aria-pressed={tamanho === s}
                  title={tem ? undefined : "Esgotado neste tamanho"}
                  className={`min-w-12 rounded-xl border px-4 py-2.5 text-[13px] font-bold transition ${
                    !tem
                      ? "cursor-not-allowed border-line bg-surface text-ink-soft/50 line-through"
                      : tamanho === s
                        ? "border-ink bg-ink text-white"
                        : "border-line bg-white hover:border-ink"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <span className="text-[13px] font-bold">
          {t["produto.quantidade"]}
        </span>
        <div className="flex items-center gap-1 rounded-full border border-line p-1">
          <button
            type="button"
            aria-label="Diminuir"
            onClick={() => setQtd((q) => Math.max(1, q - 1))}
            className="grid h-8 w-8 place-items-center rounded-full text-lg transition hover:bg-surface"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-bold" aria-live="polite">
            {qtd}
          </span>
          <button
            type="button"
            aria-label="Aumentar"
            onClick={() => setQtd((q) => Math.min(MAX_POR_ITEM, q + 1))}
            className="grid h-8 w-8 place-items-center rounded-full text-lg transition hover:bg-surface"
          >
            +
          </button>
        </div>
      </div>

      {erro && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700">
          {erro}
        </p>
      )}

      <button
        type="button"
        onClick={aoAdicionar}
        className="w-full rounded-full bg-ink px-6 py-4 text-sm font-bold text-white transition hover:bg-ink/85"
      >
        {t["produto.botao_adicionar"]}
      </button>

      {adicionado && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl bg-brand/25 px-4 py-3">
          <span className="text-[13px] font-bold text-ink">
            {t["produto.adicionado"]}
          </span>
          <Link
            href="/carrinho"
            className="rounded-full bg-ink px-4 py-2 text-[12px] font-bold text-white transition hover:bg-ink/85"
          >
            {t["produto.ver_carrinho"]}
          </Link>
        </div>
      )}

      <a
        href={waLink(
          whatsapp,
          [
            `Olá! Quero este manto da ${loja}:`,
            "",
            `• ${product.name}`,
            `• Tamanho: ${tamanho ?? "ainda escolhendo"}`,
            `• Valor: ${brl(product.price)}`,
            "",
            `${site.url}/produto/${product.slug}`,
          ].join("\n"),
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2.5 rounded-full border border-line px-6 py-3.5 text-sm font-bold transition hover:border-ink"
      >
        <svg viewBox="0 0 24 24" width="17" height="17" fill="#25D366" aria-hidden="true">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Z" />
        </svg>
        {t["produto.botao_zap"]}
      </a>
    </div>
  );
}
