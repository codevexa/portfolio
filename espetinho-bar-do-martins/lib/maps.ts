import type { Settings } from "./menu/types"

/** Link do Google Maps somente quando o endereço foi confirmado no painel. */
export function mapsLink(s: Pick<Settings, "addressLine" | "addressConfirmed" | "mapsQuery" | "city" | "state" | "businessName">): string | null {
  if (!s.addressConfirmed || !s.addressLine) return null
  const query = s.mapsQuery?.trim() || `${s.businessName}, ${s.addressLine}, ${s.city} - ${s.state}`
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

export function fullAddress(s: Pick<Settings, "addressLine" | "city" | "state">): string {
  return [s.addressLine, `${s.city} - ${s.state}`].filter(Boolean).join(", ")
}
