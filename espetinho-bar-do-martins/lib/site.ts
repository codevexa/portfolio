/** URL pública do site, usada em SEO (canonical, sitemap, Open Graph). */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, "")
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercel) return `https://${vercel}`
  return "http://localhost:3000"
}

export const SEO_DESCRIPTION =
  "Espetinho Bar do Martins: espetinhos na brasa, carnes assadas e cachurrascos de 30 cm em Porto Alegre. Veja o cardápio com preços e faça seu pedido pelo WhatsApp."

export const SEO_KEYWORDS = [
  "Espetinho Bar do Martins",
  "espetinhos em Porto Alegre",
  "cachurrasco em Porto Alegre",
  "espetinho na brasa",
  "pão de churrasco de 30 cm",
  "espetaria em Porto Alegre",
]
