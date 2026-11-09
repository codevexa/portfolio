import Link from "next/link";

export function SectionHeading({
  title,
  subtitle,
  href,
  linkLabel = "Ver todos",
}: {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          {title}
        </h2>
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
        {href && (
          <Link
            href={href}
            className="shrink-0 text-sm font-semibold text-ink-soft underline-offset-4 transition hover:text-ink hover:underline"
          >
            {linkLabel}
          </Link>
        )}
      </div>
      {subtitle && <p className="mt-1.5 text-sm text-ink-soft">{subtitle}</p>}
    </div>
  );
}
