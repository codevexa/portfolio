import { mapsLink } from "@/lib/maps"
import type { Settings } from "@/lib/menu/types"
import { siteUrl } from "@/lib/site"

const SCHEMA_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

/** Dados estruturados de restaurante apenas com informações cadastradas (sem notas ou avaliações). */
export function RestaurantJsonLd({ settings }: { settings: Settings }) {
  const url = siteUrl()
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: settings.businessName,
    url,
    telephone: `+${settings.whatsappNumber}`,
    servesCuisine: ["Brasileira", "Churrasco", "Espetinhos"],
    hasMenu: `${url}/cardapio`,
    acceptsReservations: false,
    address: {
      "@type": "PostalAddress",
      addressLocality: settings.city,
      addressRegion: settings.state,
      addressCountry: "BR",
      ...(settings.addressConfirmed && settings.addressLine ? { streetAddress: settings.addressLine } : {}),
    },
    openingHoursSpecification: settings.openingHours
      .filter((h) => !h.closed)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${SCHEMA_DAYS[h.day]}`,
        opens: h.open,
        closes: h.close === "00:00" ? "23:59" : h.close,
      })),
  }
  const maps = mapsLink(settings)
  if (maps) data.hasMap = maps
  const sameAs = [settings.instagramUrl, settings.facebookUrl].filter(Boolean)
  if (sameAs.length) data.sameAs = sameAs
  return (
    <script
      type="application/ld+json"
      // JSON.stringify não escapa "<"; evita fechar a tag script por engano.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  )
}
