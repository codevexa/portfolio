const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

/** Formata centavos como "R$ 15,90" (com espaço comum, seguro para WhatsApp). */
export function formatBRL(cents: number): string {
  return brl.format(cents / 100).replace(/\s/g, " ")
}

/** Converte "15,90", "15.90" ou "R$ 1.234,56" em centavos. Retorna null se inválido. */
export function parseBRL(input: string): number | null {
  const clean = input.replace(/[R$\s]/g, "")
  if (!/^\d{1,3}(\.?\d{3})*(,\d{1,2})?$|^\d+([.,]\d{1,2})?$/.test(clean)) return null
  let normalized = clean
  if (clean.includes(",")) normalized = clean.replace(/\./g, "").replace(",", ".")
  const value = Math.round(Number(normalized) * 100)
  return Number.isFinite(value) ? value : null
}

/** Centavos → "15,90" para campos de formulário. */
export function centsToInput(cents: number | null): string {
  if (cents === null) return ""
  return (cents / 100).toFixed(2).replace(".", ",")
}
