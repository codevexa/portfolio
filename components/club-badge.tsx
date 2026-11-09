import Image from "next/image";

/** Escudo do time. Sem logo cadastrada, mostra as duas cores. */
export function ClubBadge({
  name,
  logo,
  colors,
  size = 24,
}: {
  name: string;
  logo?: string;
  colors: [string, string];
  size?: number;
}) {
  if (logo) {
    return (
      <Image
        src={logo}
        alt={name}
        width={size}
        height={size}
        className="shrink-0 object-contain"
        style={{ width: size, height: size }}
        unoptimized
      />
    );
  }
  return (
    <span
      className="shrink-0 rounded-md"
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${colors[0]} 0 50%, ${colors[1]} 50% 100%)`,
      }}
    />
  );
}
