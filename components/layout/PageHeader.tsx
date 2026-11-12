import Eyebrow from "@/components/ui/Eyebrow";
import LineReveal from "@/components/motion/LineReveal";
import Reveal from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

export default function PageHeader({
  eyebrow,
  lines,
  lead,
  meta,
  className,
}: {
  eyebrow: string;
  lines: string[];
  lead?: string;
  meta?: { label: string; value: string }[];
  className?: string;
}) {
  return (
    <header className={cn("relative overflow-hidden pb-16 pt-36 md:pb-24 md:pt-52", className)}>
      <div aria-hidden className="grid-veil absolute inset-0 opacity-25" />
      <div aria-hidden className="vx-glow -top-24 left-1/4 h-72 w-72 bg-lime/[0.05]" />

      <div className="container-vx relative">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="display mt-8 max-w-[12ch] text-[3rem] leading-[0.92] text-bone sm:text-[4.8rem] lg:text-[6.6rem]">
          <LineReveal lines={lines} delay={0.1} />
        </h1>
        {lead && (
          <Reveal delay={0.45}>
            <p className="text-balance-vx mt-9 max-w-xl text-[1rem] leading-relaxed text-muted sm:text-[1.1rem]">
              {lead}
            </p>
          </Reveal>
        )}
        {meta && meta.length > 0 && (
          <Reveal delay={0.55}>
            <dl className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {meta.map((item) => (
                <div key={item.label} className="bg-ink p-6">
                  <dt className="eyebrow">{item.label}</dt>
                  <dd className="mt-2.5 text-sm leading-relaxed text-bone">{item.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}
      </div>
    </header>
  );
}
