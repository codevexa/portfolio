export function PageHeader({
  title,
  subtitle,
  count,
}: {
  title: string;
  subtitle?: string;
  count?: number;
}) {
  return (
    <div className="border-b border-line bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {title}
        </h1>
        {subtitle && <p className="mt-2 text-sm text-ink-soft">{subtitle}</p>}
        {typeof count === "number" && (
          <p className="mt-3 text-[13px] font-semibold text-gold-deep">
            {count} {count === 1 ? "produto" : "produtos"}
          </p>
        )}
      </div>
    </div>
  );
}
