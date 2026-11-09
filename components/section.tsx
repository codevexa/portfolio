export function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`mx-auto max-w-7xl px-4 ${className}`}>
      {children}
    </section>
  );
}
