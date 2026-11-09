"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { League } from "@/lib/clubs";
import type { Category } from "@/lib/products";
import type { Textos } from "@/lib/texts";

export function MobileMenu({
  leagues,
  categorias,
  textos,
}: {
  leagues: League[];
  categorias: Category[];
  textos: Textos;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Abrir menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="grid h-9 w-9 place-items-center lg:hidden"
      >
        <span className="sr-only">Menu</span>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <nav className="absolute inset-y-0 left-0 w-[86%] max-w-sm overflow-y-auto bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-bold tracking-wide">MENU</span>
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full border border-line text-lg"
              >
                ×
              </button>
            </div>

            <Link href="/" onClick={() => setOpen(false)} className="block py-2 text-base font-bold">
              {textos["menu.inicio"]}
            </Link>
            <Link href="/pronta-entrega" onClick={() => setOpen(false)} className="block py-2 text-base font-bold">
              {textos["menu.pronta"]}
            </Link>
            <Link href="/carrinho" onClick={() => setOpen(false)} className="block py-2 text-base font-bold">
              {textos["menu.carrinho"]}
            </Link>

            <p className="mt-6 mb-1 text-[11px] font-bold tracking-[0.12em] text-ink-soft">
              {textos["menu.categorias"]}
            </p>
            {categorias.map((c) => (
              <Link
                key={c.id}
                href={
                  c.id === "pronta-entrega"
                    ? "/pronta-entrega"
                    : `/categoria/${c.id}`
                }
                onClick={() => setOpen(false)}
                className="block py-1.5 text-sm text-ink-soft"
              >
                {c.name}
              </Link>
            ))}

            <p className="mt-6 mb-1 text-[11px] font-bold tracking-[0.12em] text-ink-soft">
              {textos["menu.ligas"]}
            </p>
            {leagues.map((l) => (
              <Link
                key={l.id}
                href={`/liga/${l.id}`}
                onClick={() => setOpen(false)}
                className="block py-1.5 text-sm text-ink-soft"
              >
                {l.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
