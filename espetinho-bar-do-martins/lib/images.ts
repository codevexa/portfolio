import { IMAGE_BUCKET, SUPABASE_URL } from "./supabase/env"

/** Resolve o caminho salvo no banco para uma URL de imagem. */
export function imageUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.startsWith("/") || path.startsWith("https://")) return path
  if (!SUPABASE_URL) return null
  return `${SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${path.split("/").map(encodeURIComponent).join("/")}`
}

/** Imagens locais em /img/menu são ilustrações provisórias, não fotos reais dos pratos. */
export function isIllustration(path: string | null | undefined): boolean {
  return !!path && path.startsWith("/img/")
}
