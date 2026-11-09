import type { Pattern } from "@/lib/clubs";
import type { Product } from "@/lib/products";

const JERSEY =
  "M60 18 80 10q20 14 40 0l20 8 38 24-18 36-18-10v138q-42 8-84 0V68l-18 10L22 42Z";

/**
 * Sem foto cadastrada, desenhamos o manto com as cores do time.
 * As cores vêm do time (editável no painel) junto com o produto.
 */
export function KitImage({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  return (
    <KitArt
      id={product.id}
      name={product.name}
      category={product.category}
      colors={product.club?.colors}
      pattern={product.club?.pattern}
      className={className}
    />
  );
}

/** A mesma arte, sem depender do tipo Product (usada no carrinho). */
export function KitArt({
  id,
  name,
  category,
  colors,
  pattern: padrao,
  className = "",
}: {
  id: string;
  name: string;
  category: string;
  colors?: [string, string];
  pattern?: Pattern;
  className?: string;
}) {
  const [c1, c2] = colors ?? ["#121212", "#e3ff00"];
  const pattern = padrao ?? "solid";
  const uid = `k-${id}`;

  if (category === "chuteiras") {
    return <BootMark className={className} />;
  }
  if (category === "acessorios") {
    return <BoxMark className={className} c1={c1} c2={c2} />;
  }

  return (
    <svg
      viewBox="0 0 200 220"
      className={className}
      role="img"
      aria-label={name}
    >
      <defs>
        <clipPath id={uid}>
          <path d={JERSEY} />
        </clipPath>
      </defs>

      <path d={JERSEY} fill={c1} />

      <g clipPath={`url(#${uid})`}>
        {pattern === "stripes" &&
          [0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={34 + i * 28} y={0} width={14} height={220} fill={c2} />
          ))}
        {pattern === "hoops" &&
          [0, 1, 2, 3].map((i) => (
            <rect key={i} x={0} y={70 + i * 34} width={200} height={16} fill={c2} />
          ))}
        {pattern === "sash" && (
          <path d="M-10 60 L120 -20 L160 10 L30 200 Z" fill={c2} opacity={0.95} />
        )}
        {pattern === "halves" && (
          <rect x={100} y={0} width={100} height={220} fill={c2} />
        )}
      </g>

      {/* gola */}
      <path
        d="M80 10q20 14 40 0l-6 12q-14 9-28 0Z"
        fill={c2}
        stroke="rgba(0,0,0,.12)"
        strokeWidth="1"
      />
      <path d={JERSEY} fill="none" stroke="rgba(0,0,0,.14)" strokeWidth="2.5" />
    </svg>
  );
}

function BootMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 140" className={className} role="img" aria-label="Chuteira">
      <path
        d="M18 96c0-26 10-44 34-52 22-7 34 2 52 10 16 7 38 10 62 12 24 2 36 10 36 22 0 10-8 16-22 16H34c-10 0-16-4-16-8Z"
        fill="#1d1d1f"
      />
      <path d="M20 100h180c6 0 10 4 10 9s-4 9-10 9H30c-7 0-12-5-12-11Z" fill="#e3ff00" />
      <path d="M60 60c18 6 34 14 48 24" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M74 48c18 6 34 14 48 24" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function BoxMark({
  className = "",
  c1,
  c2,
}: {
  className?: string;
  c1: string;
  c2: string;
}) {
  return (
    <svg viewBox="0 0 200 170" className={className} role="img" aria-label="Caixa">
      <path d="M20 60h160v88a6 6 0 0 1-6 6H26a6 6 0 0 1-6-6Z" fill={c1} />
      <path d="M12 30h176v30H12Z" fill="#1d1d1f" />
      <rect x={88} y={30} width={24} height={124} fill={c2} />
      <path d="M100 30c-14-18-40-14-34 2 4 10 22 10 34-2Zm0 0c14-18 40-14 34 2-4 10-22 10-34-2Z" fill={c2} />
    </svg>
  );
}
