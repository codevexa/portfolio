import { cn } from "@/lib/utils";

export default function Marquee({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  const row = [...items, ...items];
  return (
    <div className={cn("vx-marquee relative overflow-hidden", className)} aria-hidden>
      <div className="vx-marquee-track">
        {row.map((item, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-10 whitespace-nowrap pr-10 font-[family-name:var(--font-mono)] text-[0.7rem] uppercase tracking-[0.2em] text-dim"
          >
            {item}
            <span className="block h-1 w-1 rounded-full bg-lime/60" />
          </span>
        ))}
      </div>
    </div>
  );
}
