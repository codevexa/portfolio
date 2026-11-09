import type { Product } from "@/lib/products";
import { TEXTOS_PADRAO } from "@/lib/texts";
import { ProductCard } from "./product-card";

export function ProductGrid({
  products,
  vazio = TEXTOS_PADRAO["grid.vazio"],
}: {
  products: Product[];
  vazio?: string;
}) {
  if (products.length === 0) {
    return (
      <p className="rounded-2xl border border-line bg-surface px-5 py-10 text-center text-sm text-ink-soft">
        {vazio}
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 justify-items-center gap-x-3 gap-y-7 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
