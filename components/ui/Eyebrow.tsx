import { cn } from "@/lib/utils";

export default function Eyebrow({
  children,
  className,
  dot = true,
}: {
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span className={cn("eyebrow inline-flex items-center gap-2.5", className)}>
      {dot && <span aria-hidden className="block h-1 w-1 rounded-full bg-lime" />}
      {children}
    </span>
  );
}
