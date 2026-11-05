import Image from "next/image"
import Link from "next/link"
import { BrandMark } from "@/components/ui/icons"
import { imageUrl } from "@/lib/images"

export function Logo({ name, logoPath }: { name: string; logoPath: string | null }) {
  const src = imageUrl(logoPath)
  const [first, ...rest] = name.split(" do ")
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={`${name} — página inicial`}>
      {src ? (
        <Image src={src} alt="" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
      ) : (
        <BrandMark className="h-11 w-11 shrink-0" />
      )}
      <span className="flex flex-col leading-none">
        <span className="font-display text-[0.7rem] uppercase tracking-[0.28em] text-fumaca">{rest.length ? first : ""}</span>
        <span className="font-display text-xl font-bold uppercase tracking-wide text-gold-gradient">
          {rest.length ? `do ${rest.join(" do ")}` : name}
        </span>
      </span>
    </Link>
  )
}
