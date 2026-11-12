import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/** Mockup de celular — moldura desenhada em CSS, sem imagem de apoio. */
export function PhoneFrame({ src, alt, className, priority, sizes = "(max-width: 768px) 70vw, 300px" }: Props) {
  return (
    <div
      className={cn(
        "relative aspect-[9/19.5] w-full rounded-[2.2rem] border border-white/12 bg-gradient-to-b from-white/10 to-white/[0.02] p-[3px] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]",
        className,
      )}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-ink">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover object-top"
        />
        {/* Ilha dinâmica */}
        <div
          aria-hidden
          className="absolute left-1/2 top-[0.6rem] h-[1.1rem] w-[28%] -translate-x-1/2 rounded-full bg-black/85"
        />
        {/* Reflexo de vidro */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.08]"
        />
      </div>
    </div>
  );
}

/** Mockup de navegador — para telas de desktop. */
export function BrowserFrame({ src, alt, className, priority, sizes = "(max-width: 1024px) 92vw, 760px" }: Props) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-line bg-graphite shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-line bg-elevated px-4 py-3">
        <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span aria-hidden className="ml-3 h-5 flex-1 rounded-full bg-white/[0.04]" />
      </div>
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}

export default function DeviceFrame({
  frame,
  ...props
}: Props & { frame: "phone" | "browser" }) {
  return frame === "phone" ? <PhoneFrame {...props} /> : <BrowserFrame {...props} />;
}
