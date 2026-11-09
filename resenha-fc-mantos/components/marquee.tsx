export function Marquee({ items }: { items: string[] }) {
  const list = [...items, ...items, ...items];
  const strip = (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {list.map((text, i) => (
        <span key={i} className="flex items-center gap-10 whitespace-nowrap">
          <span className="text-[11px] font-bold tracking-[0.12em] text-white/90">
            {text}
          </span>
          <span className="text-brand" aria-hidden="true">
            •
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden bg-ink py-2.5">
      <div className="flex w-max animate-marquee">
        {strip}
        {strip}
      </div>
    </div>
  );
}
