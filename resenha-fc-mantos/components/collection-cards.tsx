import Link from "next/link";

type Card = {
  href: string;
  title: string;
  cta: string;
  from: string;
  to: string;
};

export function CollectionCards({ cards }: { cards: Card[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <Link
          key={c.href}
          href={c.href}
          className="group relative flex min-h-[150px] flex-col justify-between overflow-hidden rounded-2xl p-5"
          style={{
            background: `radial-gradient(110% 110% at 90% 10%, ${c.to}40 0%, transparent 60%), ${c.from}`,
          }}
        >
          <h3 className="max-w-[70%] text-lg font-extrabold uppercase leading-tight tracking-tight text-white">
            {c.title}
          </h3>
          <span
            className="w-fit rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-wide text-ink transition group-hover:translate-x-1"
            style={{ background: c.to }}
          >
            {c.cta} →
          </span>
        </Link>
      ))}
    </div>
  );
}
