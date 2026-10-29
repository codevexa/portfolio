/** Mantém só os dígitos. */
export const digits = (s: string) => s.replace(/\D/g, "")

/** Telefone brasileiro com DDD: 10 (fixo) ou 11 (celular) dígitos, aceitando +55 na frente. */
export function normalizeBrPhone(input: string): string | null {
  let d = digits(input)
  if ((d.length === 12 || d.length === 13) && d.startsWith("55")) d = d.slice(2)
  if (d.length !== 10 && d.length !== 11) return null
  if (d.startsWith("0")) return null
  if (d.length === 11 && d[2] !== "9") return null
  return d
}

export function formatBrPhone(d: string): string {
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return d
}
