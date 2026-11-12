import Image from "next/image";
import { cn } from "@/lib/utils";

/** Monograma VX extraído da marca original. */
export function Mark({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/images/vexa-mark-white.png"
      alt=""
      aria-hidden
      width={531}
      height={295}
      priority={priority}
      className={cn("h-auto w-full select-none", className)}
    />
  );
}

/** Logotipo tipográfico VEXA. */
export function Wordmark({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "text-[1.05rem] tracking-[0.34em]",
    md: "text-[1.35rem] tracking-[0.36em]",
    lg: "text-[2.6rem] md:text-[4rem] tracking-[0.3em]",
  };
  return (
    <span
      className={cn(
        "font-[family-name:var(--font-display)] font-bold uppercase leading-none",
        sizes[size],
        className,
      )}
    >
      {/* O tracking adiciona espaço à direita da última letra: compensado com margem negativa. */}
      <span className="-mr-[0.3em] inline-block">VEXA</span>
    </span>
  );
}

/** Marca completa: monograma + logotipo. */
export default function Logo({
  className,
  withMark = true,
  size = "md",
}: {
  className?: string;
  withMark?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      {withMark && (
        <span className={cn("block shrink-0", size === "lg" ? "w-12" : "w-7")}>
          <Mark priority />
        </span>
      )}
      <Wordmark size={size} />
    </span>
  );
}
