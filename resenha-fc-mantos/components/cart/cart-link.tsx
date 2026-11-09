"use client";

import Link from "next/link";
import { useCarrinho } from "./cart-provider";
import { CartIcon } from "./cart-icon";

export function CartLink() {
  const { pecas, pronto } = useCarrinho();

  return (
    <Link
      href="/carrinho"
      aria-label={pecas > 0 ? `Carrinho com ${pecas} itens` : "Carrinho"}
      className="relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-surface"
    >
      <CartIcon />
      {pronto && pecas > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-extrabold text-ink">
          {pecas > 99 ? "99+" : pecas}
        </span>
      )}
    </Link>
  );
}
