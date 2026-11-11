/** Caixa de encomenda. Usada no menu e na página de rastreio. */
export function PackageIcon({
  size = 20,
  strokeWidth = 1.8,
  className,
}: {
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.8 3.4 7.2v9.6L12 21.2l8.6-4.4V7.2z" />
      <path d="M3.4 7.2 12 11.6l8.6-4.4M12 11.6v9.6" />
      <path d="m7.7 5 8.6 4.4v3.1" />
    </svg>
  );
}
