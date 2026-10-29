import { describe, expect, it } from "vitest"
import { formatBRL, parseBRL } from "@/lib/money"
import { normalizeBrPhone } from "@/lib/phone"
import { addLine, computeTotals, resolveCart, setNotes, setQuantity, type CartLine } from "@/lib/cart"
import { buildOrderMessage, whatsappLink } from "@/lib/whatsapp"
import { groupHours, isOpenAt } from "@/lib/hours"
import { seedCatalog, seedSettings } from "@/lib/menu/seed-data"

const product = (slug: string) => seedCatalog.products.find((p) => p.slug === slug)!

describe("dinheiro", () => {
  it("formata centavos em reais", () => {
    expect(formatBRL(1590)).toBe("R$ 15,90")
    expect(formatBRL(7990)).toBe("R$ 79,90")
    expect(formatBRL(123456)).toBe("R$ 1.234,56")
  })
  it("interpreta valores digitados no painel", () => {
    expect(parseBRL("15,90")).toBe(1590)
    expect(parseBRL("15.90")).toBe(1590)
    expect(parseBRL("R$ 1.234,56")).toBe(123456)
    expect(parseBRL("7")).toBe(700)
    expect(parseBRL("abc")).toBeNull()
    expect(parseBRL("1,234")).toBeNull()
  })
})

describe("telefone", () => {
  it("aceita celular e fixo com DDD", () => {
    expect(normalizeBrPhone("(51) 99426-1019")).toBe("51994261019")
    expect(normalizeBrPhone("+55 51 99426-1019")).toBe("51994261019")
    expect(normalizeBrPhone("51 3333-4444")).toBe("5133334444")
  })
  it("rejeita números incompletos", () => {
    expect(normalizeBrPhone("99426-1019")).toBeNull()
    expect(normalizeBrPhone("51 89426-10190")).toBeNull()
  })
})

describe("carrinho", () => {
  const cach = product("cachurrasco-30-cm")
  const parm2 = cach.variants.find((v) => v.groupName === "Pão Parmesão 30 cm" && v.name === "2 espetinhos")!
  const trad1 = cach.variants.find((v) => v.groupName === "Pão Tradicional 30 cm" && v.name === "1 espetinho")!
  const gado = product("espetinho-de-gado")
  const batata = product("porcao-de-batatas")
  const grande = batata.variants.find((v) => v.name === "Grande")!

  it("calcula preço pela variação escolhida e soma o subtotal", () => {
    let lines: CartLine[] = []
    lines = addLine(lines, { productId: cach.id, variantId: parm2.id, quantity: 2, notes: "" })
    lines = addLine(lines, { productId: cach.id, variantId: trad1.id, quantity: 1, notes: "" })
    lines = addLine(lines, { productId: gado.id, variantId: gado.variants[0].id, quantity: 3, notes: "bem passado" })
    lines = addLine(lines, { productId: batata.id, variantId: grande.id, quantity: 1, notes: "" })
    const cart = resolveCart(lines, seedCatalog)
    // 2×41,90 + 26,90 + 3×15,90 + 30,00
    expect(cart.subtotalCents).toBe(8380 + 2690 + 4770 + 3000)
    expect(cart.itemCount).toBe(7)
    expect(cart.lines[0].variantText).toBe("Pão Parmesão 30 cm · 2 espetinhos")
  })

  it("mesmo item com mesma observação soma quantidade; observação diferente vira outra linha", () => {
    let lines: CartLine[] = []
    lines = addLine(lines, { productId: gado.id, variantId: gado.variants[0].id, quantity: 1, notes: "" })
    lines = addLine(lines, { productId: gado.id, variantId: gado.variants[0].id, quantity: 2, notes: "" })
    lines = addLine(lines, { productId: gado.id, variantId: gado.variants[0].id, quantity: 1, notes: "sem sal" })
    expect(lines).toHaveLength(2)
    expect(lines[0].quantity).toBe(3)
  })

  it("altera quantidade, remove com zero e une linhas ao editar observação", () => {
    let lines: CartLine[] = []
    lines = addLine(lines, { productId: gado.id, variantId: gado.variants[0].id, quantity: 1, notes: "a" })
    lines = addLine(lines, { productId: gado.id, variantId: gado.variants[0].id, quantity: 1, notes: "b" })
    lines = setNotes(lines, lines[1].key, "a")
    expect(lines).toHaveLength(1)
    expect(lines[0].quantity).toBe(2)
    lines = setQuantity(lines, lines[0].key, 5)
    expect(lines[0].quantity).toBe(5)
    lines = setQuantity(lines, lines[0].key, 0)
    expect(lines).toHaveLength(0)
  })

  it("item que saiu do cardápio ou ficou indisponível não entra no total", () => {
    const catalog = {
      ...seedCatalog,
      products: seedCatalog.products.map((p) => (p.id === gado.id ? { ...p, isAvailable: false } : p)),
    }
    const cart = resolveCart(
      [
        { key: "1", productId: gado.id, variantId: gado.variants[0].id, quantity: 2, notes: "" },
        { key: "2", productId: "nao-existe", variantId: "x", quantity: 1, notes: "" },
        { key: "3", productId: batata.id, variantId: grande.id, quantity: 1, notes: "" },
      ],
      catalog,
    )
    expect(cart.subtotalCents).toBe(3000)
    expect(cart.hasUnavailable).toBe(true)
  })

  it("não inventa taxa de entrega quando ela não está cadastrada", () => {
    expect(computeTotals(5000, "entrega", { deliveryFeeCents: null })).toMatchObject({ feeKnown: false, totalCents: 5000 })
    expect(computeTotals(5000, "entrega", { deliveryFeeCents: 700 })).toMatchObject({ feeKnown: true, totalCents: 5700 })
    expect(computeTotals(5000, "retirada", { deliveryFeeCents: 700 })).toMatchObject({ feeApplies: false, totalCents: 5000 })
  })
})

describe("mensagem do WhatsApp", () => {
  const cach = product("cachurrasco-30-cm")
  const v = cach.variants.find((x) => x.groupName === "Pão Tradicional 30 cm" && x.name === "3 espetinhos")!
  const cart = resolveCart([{ key: "k", productId: cach.id, variantId: v.id, quantity: 2, notes: "sem tomate" }], seedCatalog)

  it("segue o formato combinado", () => {
    const totals = computeTotals(cart.subtotalCents, "entrega", { deliveryFeeCents: 600 })
    const msg = buildOrderMessage({
      businessName: seedSettings.businessName,
      customerName: "Ana",
      customerPhone: "51988887777",
      orderType: "entrega",
      address: "Rua A, 10 — Centro",
      lines: cart.lines,
      generalNotes: "Troco para 200",
      ...totals,
    })
    expect(msg).toContain("*PEDIDO — ESPETINHO BAR DO MARTINS*")
    expect(msg).toContain("Nome do cliente: Ana")
    expect(msg).toContain("Telefone: (51) 98888-7777")
    expect(msg).toContain("Tipo de pedido: Entrega")
    expect(msg).toContain("Endereço: Rua A, 10 — Centro")
    expect(msg).toContain("• 2 × Cachurrasco 30 cm")
    expect(msg).toContain("Variação: Pão Tradicional 30 cm · 3 espetinhos")
    expect(msg).toContain("Observações: sem tomate")
    expect(msg).toContain("Preço unitário: R$ 55,90")
    expect(msg).toContain("Subtotal: R$ 111,80")
    expect(msg).toContain("Taxa de entrega: R$ 6,00")
    expect(msg).toContain("*Total: R$ 117,80*")
    expect(msg).toContain("Observações gerais: Troco para 200")
  })

  it("retirada não mostra endereço nem taxa; taxa não cadastrada fica 'a confirmar'", () => {
    const base = { businessName: "X", customerName: "Ana", customerPhone: "51988887777", lines: cart.lines, generalNotes: "" }
    const pickup = buildOrderMessage({ ...base, orderType: "retirada", address: "Rua", ...computeTotals(cart.subtotalCents, "retirada", { deliveryFeeCents: 600 }) })
    expect(pickup).not.toContain("Endereço")
    expect(pickup).not.toContain("Taxa de entrega")
    const noFee = buildOrderMessage({ ...base, orderType: "entrega", address: "Rua", ...computeTotals(cart.subtotalCents, "entrega", { deliveryFeeCents: null }) })
    expect(noFee).toContain("Taxa de entrega: a confirmar com o estabelecimento")
    expect(noFee).toContain("Total (sem taxa de entrega): R$ 111,80")
  })

  it("gera o link wa.me do número oficial com o texto codificado", () => {
    expect(whatsappLink("+55 51 99426-1019")).toBe("https://wa.me/5551994261019")
    expect(whatsappLink("5551994261019", "a & b")).toBe("https://wa.me/5551994261019?text=a%20%26%20b")
  })
})

describe("horário de funcionamento", () => {
  const hours = seedSettings.openingHours
  it("agrupa segunda a sábado", () => {
    expect(groupHours(hours)).toEqual([
      { days: "Segunda a sábado", text: "17h à meia-noite" },
      { days: "Domingo", text: "Fechado" },
    ])
  })
  it("calcula aberto/fechado no fuso de Porto Alegre", () => {
    // 2026-10-30 é sexta. 20h em Porto Alegre = 23h UTC.
    expect(isOpenAt(hours, new Date("2026-10-30T23:00:00Z"))).toBe(true)
    expect(isOpenAt(hours, new Date("2026-10-30T19:00:00Z"))).toBe(false) // 16h
    expect(isOpenAt(hours, new Date("2026-11-01T23:00:00Z"))).toBe(false) // domingo
    expect(isOpenAt(hours, new Date("2026-10-31T02:59:00Z"))).toBe(true) // sexta 23h59
    expect(isOpenAt(hours, new Date("2026-10-31T03:00:00Z"))).toBe(false) // sábado 0h
  })
})
