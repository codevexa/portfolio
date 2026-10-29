import Image from "next/image"
import clsx from "clsx"
import { imageUrl, isIllustration } from "@/lib/images"
import { BrandMark } from "@/components/ui/icons"
import type { Product } from "@/lib/menu/types"

export function ProductImage({
  product,
  sizes,
  priority = false,
  className,
  showBadge = true,
}: {
  product: Pick<Product, "imagePath" | "imageAlt" | "name">
  sizes: string
  priority?: boolean
  className?: string
  /** Etiqueta "Imagem ilustrativa"; desligar em miniaturas. */
  showBadge?: boolean
}) {
  const src = imageUrl(product.imagePath)
  return (
    <div className={clsx("relative overflow-hidden bg-madeira", className)}>
      {src ? (
        <Image
          src={src}
          alt={product.imageAlt || product.name}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          // As ilustrações locais já são SVG leves; fotos enviadas passam pela otimização.
          unoptimized={src.endsWith(".svg")}
        />
      ) : (
        <div className="bg-ember absolute inset-0 grid place-items-center" role="img" aria-label={product.name}>
          <BrandMark className="h-16 w-16 opacity-60" />
        </div>
      )}
      {showBadge && isIllustration(product.imagePath) && (
        <span className="absolute bottom-2 left-2 rounded-full bg-carvao/75 px-2 py-0.5 text-[11px] font-medium text-fumaca backdrop-blur">
          Imagem ilustrativa
        </span>
      )}
    </div>
  )
}
