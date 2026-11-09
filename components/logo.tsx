import Image from "next/image";
import { site } from "@/lib/site";

/**
 * Logo oficial da loja (escudo RFC).
 * Para trocar: substitua public/logo.webp (e public/icon.webp, usado como favicon).
 */
const LOGO_SRC: string | null = "/logo.webp";

export function LogoMark({ size = 50 }: { size?: number }) {
  if (LOGO_SRC) {
    return (
      <Image
        src={LOGO_SRC}
        alt={site.name}
        width={size}
        height={size}
        className="rounded-xl object-contain"
        priority
      />
    );
  }

  // Marca provisória: escudo com as iniciais RFC.
  return (
    <span
      className="grid shrink-0 place-items-center rounded-xl bg-ink"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 48 48" fill="none">
        <path
          d="M24 3.5 41 9v15.5c0 9.7-6.7 17.4-17 20.9C13.7 41.9 7 34.2 7 24.5V9L24 3.5Z"
          stroke="var(--color-brand)"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path
          d="M18 32V17h7.5a4.5 4.5 0 0 1 0 9H18m8 6-5-6"
          stroke="var(--color-brand)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
