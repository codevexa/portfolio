import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
  icon?: React.ReactNode;
  "aria-label"?: string;
};

const base =
  "group/btn relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-7 py-3.5 font-[family-name:var(--font-mono)] text-[0.72rem] uppercase tracking-[0.16em] transition-colors duration-500 ease-[cubic-bezier(.16,1,.3,1)]";

const variants: Record<Variant, string> = {
  primary: "bg-lime text-ink hover:text-ink",
  outline: "border border-line text-bone hover:border-lime/50 hover:text-ink",
  ghost: "text-muted hover:text-bone",
};

export default function ButtonLink({
  href,
  children,
  variant = "primary",
  external,
  className,
  icon,
  ...rest
}: Props) {
  const content = (
    <>
      {variant !== "ghost" && (
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 -z-10 origin-bottom scale-y-0 transition-transform duration-[650ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover/btn:scale-y-100",
            variant === "primary" ? "bg-bone" : "bg-lime",
          )}
        />
      )}
      <span className="relative">{children}</span>
      <span className="relative transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover/btn:translate-x-1">
        {icon ?? <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />}
      </span>
    </>
  );

  const classes = cn(base, variants[variant], className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}
