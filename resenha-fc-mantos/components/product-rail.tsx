"use client";

import { useRef } from "react";
import type { Product } from "@/lib/products";
import { ProductCard } from "./product-card";

export function ProductRail({ products }: { products: Product[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={ref}
        className="rail -mx-4 flex gap-3 overflow-x-auto scroll-smooth px-4 pb-2 sm:mx-0 sm:px-0"
      >
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Anterior"
        className="absolute -left-4 top-[38%] hidden h-9 w-9 place-items-center rounded-full border border-line bg-white/95 text-lg shadow-sm transition hover:bg-white lg:grid"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Próximo"
        className="absolute -right-4 top-[38%] hidden h-9 w-9 place-items-center rounded-full border border-line bg-white/95 text-lg shadow-sm transition hover:bg-white lg:grid"
      >
        ›
      </button>
    </div>
  );
}
