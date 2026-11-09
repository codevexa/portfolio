"use client";

import Link from "next/link";
import { useCarrinho } from "./cart-provider";

export function CartLink() {
  const { pecas, pronto } = useCarrinho();

  return (
    <Link
      href="/carrinho"
      aria-label={pecas > 0 ? `Carrinho com ${pecas} itens` : "Carrinho"}
      className="relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-surface"
    >
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 7h13l-1.3 9.3a2 2 0 0 1-2 1.7H9.3a2 2 0 0 1-2-1.7L6 7Z" />
        <path d="M9 7a3 3 0 0 1 6 0" />
      </svg>
      {pronto && pecas > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-extrabold text-ink">
          {pecas > 99 ? "99+" : pecas}
        </span>
      )}
    </Link>
  );
}
