import Link from "next/link";
import Image from "next/image";
import { brl } from "@/lib/site";
import { discountPercent, soldOut, type Product } from "@/lib/products";
import { KitImage } from "./kit-image";

export function ProductCard({ product }: { product: Product }) {
  const off = discountPercent(product);
  const esgotado = soldOut(product);

  return (
    <Link
      href={`/produto/${product.slug}`}
      className="group block w-[180px] shrink-0 sm:w-[216px]"
    >
      <div className="relative overflow-hidden rounded-2xl border border-line bg-surface">
        {off !== null && (
          <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold text-white">
            -{off}%
          </span>
        )}
        {esgotado && (
          <span className="absolute right-2.5 top-2.5 z-10 rounded-full bg-ink/80 px-2 py-1 text-[10px] font-bold text-white">
            ESGOTADO
          </span>
        )}

        <div className={`aspect-square overflow-hidden p-4 ${esgotado ? "opacity-45 grayscale" : ""}`}>
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              width={400}
              height={400}
              className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
            />
          ) : (
            <KitImage
              product={product}
              className="h-full w-full transition duration-300 group-hover:scale-105"
            />
          )}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-ink/90 py-2 text-center text-xs font-bold text-white transition group-hover:translate-y-0">
          Espiar
        </div>
      </div>

      <div className="mt-2.5 px-0.5">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-[13px] font-semibold leading-tight">
          {product.name}
        </h3>
        <div className="mt-1 flex items-center gap-0.5 text-brand" aria-label="5 estrelas">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill="#f5a623">
              <path d="m12 17.3-6.2 3.7 1.7-7L2 9.2l7.1-.6L12 2l2.9 6.6 7.1.6-5.5 4.8 1.7 7z" />
            </svg>
          ))}
        </div>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
          {product.oldPrice && (
            <span className="text-xs text-ink-soft line-through">
              {brl(product.oldPrice)}
            </span>
          )}
          <span className="text-base font-extrabold">{brl(product.price)}</span>
        </div>
      </div>
    </Link>
  );
}
