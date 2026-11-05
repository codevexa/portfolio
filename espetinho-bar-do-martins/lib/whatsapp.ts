import { formatBRL } from "./money"
import { formatBrPhone } from "./phone"
import type { OrderType, ResolvedLine } from "./cart"

export function whatsappLink(number: string, text?: string): string {
  const base = `https://wa.me/${number.replace(/\D/g, "")}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}

export type OrderMessageInput = {
  businessName: string
  customerName: string
  customerPhone: string
  orderType: OrderType
  address: string | null
  lines: ResolvedLine[]
  subtotalCents: number
  deliveryFeeCents: number | null
  feeApplies: boolean
  totalCents: number
  generalNotes: string
}

/** Monta a mensagem do pedido no formato combinado com o estabelecimento. */
export function buildOrderMessage(o: OrderMessageInput): string {
  const out: string[] = []
  out.push(`*PEDIDO — ${o.businessName.toUpperCase()}*`, "")
  out.push(`Nome do cliente: ${o.customerName.trim()}`)
  out.push(`Telefone: ${formatBrPhone(o.customerPhone)}`)
  out.push(`Tipo de pedido: ${o.orderType === "entrega" ? "Entrega" : "Retirada"}`)
  if (o.orderType === "entrega" && o.address) out.push(`Endereço: ${o.address.trim()}`)
  out.push("", "*Itens:*")
  for (const l of o.lines.filter((x) => x.available)) {
    out.push(`• ${l.quantity} × ${l.name}`)
    if (l.variantText) out.push(`   Variação: ${l.variantText}`)
    if (l.notes.trim()) out.push(`   Observações: ${l.notes.trim()}`)
    out.push(`   Preço unitário: ${formatBRL(l.unitCents)}`)
    out.push(`   Subtotal: ${formatBRL(l.subtotalCents)}`)
  }
  out.push("", `Subtotal: ${formatBRL(o.subtotalCents)}`)
  if (o.feeApplies) {
    if (o.deliveryFeeCents === null) {
      out.push("Taxa de entrega: a confirmar com o estabelecimento")
      out.push(`*Total (sem taxa de entrega): ${formatBRL(o.totalCents)}*`)
    } else {
      out.push(`Taxa de entrega: ${formatBRL(o.deliveryFeeCents)}`)
      out.push(`*Total: ${formatBRL(o.totalCents)}*`)
    }
  } else {
    out.push(`*Total: ${formatBRL(o.totalCents)}*`)
  }
  if (o.generalNotes.trim()) out.push("", `Observações gerais: ${o.generalNotes.trim()}`)
  return out.join("\n")
}
