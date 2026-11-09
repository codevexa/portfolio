/**
 * Carrinho de compras (cesto sobre rodinhas).
 * Um só desenho para o selo do topo e para o estado vazio, assim os dois
 * nunca ficam diferentes.
 */
export function CartIcon({
  size = 21,
  strokeWidth = 1.9,
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
      <path d="M2.5 4h2.2l2.5 10.5a1.7 1.7 0 0 0 1.66 1.3h7.78a1.7 1.7 0 0 0 1.66-1.28L20 8H5.7" />
      <circle cx="9.8" cy="19.3" r="1.4" />
      <circle cx="17" cy="19.3" r="1.4" />
    </svg>
  );
}
