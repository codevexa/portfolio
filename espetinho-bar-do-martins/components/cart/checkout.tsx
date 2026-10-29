"use client"

import Link from "next/link"
import { useEffect, useMemo, useState, type FormEvent } from "react"
import { ArrowLeft, Bike, CircleCheck, Info, Store, TriangleAlert } from "lucide-react"
import clsx from "clsx"
import { useStore } from "./store"
import { CartSkeleton, EmptyCart } from "./cart-view"
import { WhatsAppIcon } from "@/components/ui/icons"
import { computeTotals, type OrderType } from "@/lib/cart"
import { formatBRL } from "@/lib/money"
import { normalizeBrPhone } from "@/lib/phone"
import { buildOrderMessage, whatsappLink } from "@/lib/whatsapp"

const CUSTOMER_KEY = "ebm-cliente-v1"

type Form = { name: string; phone: string; orderType: OrderType | ""; address: string; notes: string }
type Errors = Partial<Record<keyof Form, string>>

export function Checkout() {
  const { cart, hydrated, settings, clear } = useStore()
  const services = useMemo(
    () => [
      ...(settings.deliveryEnabled ? (["entrega"] as const) : []),
      ...(settings.pickupEnabled ? (["retirada"] as const) : []),
    ],
    [settings.deliveryEnabled, settings.pickupEnabled],
  )
  const [form, setForm] = useState<Form>({ name: "", phone: "", orderType: services.length === 1 ? services[0] : "", address: "", notes: "" })
  const [errors, setErrors] = useState<Errors>({})
  const [sentUrl, setSentUrl] = useState<string | null>(null)

  // Lembra nome, telefone e endereço neste aparelho para o próximo pedido.
  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(CUSTOMER_KEY) ?? "{}")
      setForm((f) => ({
        ...f,
        name: typeof saved.name === "string" ? saved.name : f.name,
        phone: typeof saved.phone === "string" ? saved.phone : f.phone,
        address: typeof saved.address === "string" ? saved.address : f.address,
      }))
    } catch {
      // armazenamento indisponível
    }
  }, [])

  const orderType = form.orderType || "retirada"
  const totals = computeTotals(cart.subtotalCents, orderType, settings)

  if (!hydrated) return <CartSkeleton />

  if (sentUrl) {
    return (
      <div className="card-surface mx-auto flex max-w-xl flex-col items-center gap-4 p-8 text-center" role="status">
        <CircleCheck className="h-14 w-14 text-[#3ccf6e]" />
        <h2 className="section-title text-3xl">Mensagem pronta no WhatsApp</h2>
        <p className="text-lg">
          <strong>Seu pedido ainda não foi enviado.</strong> No WhatsApp, toque em <strong>enviar</strong> e aguarde a confirmação do{" "}
          {settings.businessName}.
        </p>
        {settings.serviceMessage && <p className="text-fumaca">{settings.serviceMessage}</p>}
        <a href={sentUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full sm:w-auto">
          <WhatsAppIcon className="h-5 w-5" /> Abrir o WhatsApp novamente
        </a>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button type="button" className="btn btn-ghost" onClick={() => setSentUrl(null)}>
            Voltar e editar
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              clear()
              setSentUrl(null)
            }}
          >
            Já enviei, esvaziar carrinho
          </button>
        </div>
      </div>
    )
  }

  if (cart.itemCount === 0) return <EmptyCart />

  if (services.length === 0) {
    return (
      <div className="card-surface flex flex-col items-center gap-4 p-8 text-center">
        <TriangleAlert className="h-10 w-10 text-ouro" />
        <p className="text-lg">No momento, os pedidos pelo site estão pausados. Fale direto com o estabelecimento.</p>
        <a href={whatsappLink(settings.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
          <WhatsAppIcon className="h-5 w-5" /> {settings.phoneDisplay}
        </a>
      </div>
    )
  }

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function validate(): { errors: Errors; phone: string | null } {
    const e: Errors = {}
    const name = form.name.trim()
    if (name.length < 2) e.name = "Informe seu nome."
    else if (name.length > 80) e.name = "Use no máximo 80 caracteres."
    const phone = normalizeBrPhone(form.phone)
    if (!phone) e.phone = "Informe um telefone com DDD, ex.: (51) 99999-9999."
    if (!form.orderType || !services.includes(form.orderType)) e.orderType = "Escolha entrega ou retirada."
    if (form.orderType === "entrega" && form.address.trim().length < 8) e.address = "Informe rua, número e bairro para a entrega."
    if (form.address.length > 300) e.address = "Use no máximo 300 caracteres."
    if (form.notes.length > 500) e.notes = "Use no máximo 500 caracteres."
    return { errors: e, phone }
  }

  function submit(ev: FormEvent) {
    ev.preventDefault()
    const { errors: e, phone } = validate()
    setErrors(e)
    if (Object.keys(e).length || !phone) {
      const first = Object.keys(e)[0]
      document.getElementById(`f-${first}`)?.focus()
      return
    }
    const message = buildOrderMessage({
      businessName: settings.businessName,
      customerName: form.name,
      customerPhone: phone,
      orderType,
      address: orderType === "entrega" ? form.address : null,
      lines: cart.lines,
      generalNotes: form.notes,
      ...totals,
    })
    const url = whatsappLink(settings.whatsappNumber, message)
    try {
      window.localStorage.setItem(CUSTOMER_KEY, JSON.stringify({ name: form.name.trim(), phone: form.phone, address: form.address }))
    } catch {
      // ignora
    }
    setSentUrl(url)
    const win = window.open(url, "_blank")
    if (win) win.opener = null
    else window.location.href = url
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
      <div className="flex flex-col gap-6">
        <fieldset className="card-surface flex flex-col gap-4 p-5">
          <legend className="sr-only">Seus dados</legend>
          <h2 className="font-display text-2xl uppercase">Seus dados</h2>
          <div>
            <label htmlFor="f-name" className="label">Nome</label>
            <input
              id="f-name"
              className="field"
              autoComplete="name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "e-name" : undefined}
              maxLength={80}
            />
            {errors.name && <p id="e-name" className="mt-1 text-sm text-pimenta-2">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="f-phone" className="label">Telefone / WhatsApp</label>
            <input
              id="f-phone"
              className="field"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="(51) 99999-9999"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "e-phone" : undefined}
              maxLength={20}
            />
            {errors.phone && <p id="e-phone" className="mt-1 text-sm text-pimenta-2">{errors.phone}</p>}
          </div>
        </fieldset>

        <fieldset className="card-surface flex flex-col gap-4 p-5" aria-describedby={errors.orderType ? "e-orderType" : undefined}>
          <legend className="sr-only">Tipo de pedido</legend>
          <h2 className="font-display text-2xl uppercase">Entrega ou retirada</h2>
          <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Tipo de pedido">
            {services.map((s, i) => (
              <button
                key={s}
                id={i === 0 ? "f-orderType" : undefined}
                type="button"
                role="radio"
                aria-checked={form.orderType === s}
                onClick={() => set("orderType", s)}
                className={clsx(
                  "flex min-h-16 items-center gap-3 rounded-2xl border p-4 text-left transition-colors",
                  form.orderType === s ? "border-ouro bg-ouro/10" : "border-creme/20 hover:border-ouro/60",
                )}
              >
                {s === "entrega" ? <Bike className="h-6 w-6 text-ouro" /> : <Store className="h-6 w-6 text-ouro" />}
                <span>
                  <span className="block font-bold">{s === "entrega" ? "Entrega" : "Retirada no local"}</span>
                  <span className="block text-sm text-fumaca">
                    {s === "entrega"
                      ? settings.deliveryFeeCents === null
                        ? "Taxa a confirmar com o estabelecimento"
                        : `Taxa de entrega: ${formatBRL(settings.deliveryFeeCents)}`
                      : "Sem taxa de entrega"}
                  </span>
                </span>
              </button>
            ))}
          </div>
          {errors.orderType && <p id="e-orderType" className="text-sm text-pimenta-2">{errors.orderType}</p>}
          {form.orderType === "entrega" && settings.deliveryNote && (
            <p className="flex gap-2 text-sm text-fumaca">
              <Info className="h-4 w-4 shrink-0 text-ouro" /> {settings.deliveryNote}
            </p>
          )}
          {form.orderType === "entrega" && (
            <div>
              <label htmlFor="f-address" className="label">Endereço de entrega</label>
              <textarea
                id="f-address"
                className="field min-h-24"
                autoComplete="street-address"
                placeholder="Rua, número, complemento, bairro e ponto de referência"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                aria-invalid={!!errors.address}
                aria-describedby={errors.address ? "e-address" : undefined}
                maxLength={300}
              />
              {errors.address && <p id="e-address" className="mt-1 text-sm text-pimenta-2">{errors.address}</p>}
            </div>
          )}
        </fieldset>

        <div className="card-surface p-5">
          <label htmlFor="f-notes" className="font-display text-2xl uppercase">
            Observações gerais <span className="font-sans text-sm normal-case text-fumaca">(opcional)</span>
          </label>
          <textarea
            id="f-notes"
            className="field mt-3 min-h-20"
            placeholder="Ex.: troco, forma de pagamento, horário de retirada…"
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            maxLength={500}
          />
          {errors.notes && <p className="mt-1 text-sm text-pimenta-2">{errors.notes}</p>}
        </div>
      </div>

      <aside className="card-surface flex flex-col gap-4 p-5 lg:sticky lg:top-28" aria-label="Resumo do pedido">
        <h2 className="font-display text-2xl uppercase">Resumo do pedido</h2>
        <ul className="flex flex-col gap-3 text-sm">
          {cart.lines
            .filter((l) => l.available)
            .map((l) => (
              <li key={l.key} className="flex justify-between gap-3 border-b border-creme/10 pb-2">
                <span>
                  <span className="font-semibold">
                    {l.quantity} × {l.name}
                  </span>
                  {l.variantText && <span className="block text-ambar">{l.variantText}</span>}
                  {l.notes && <span className="block text-fumaca">Obs.: {l.notes}</span>}
                  <span className="block text-fumaca tabular-nums">{formatBRL(l.unitCents)} cada</span>
                </span>
                <span className="font-semibold tabular-nums">{formatBRL(l.subtotalCents)}</span>
              </li>
            ))}
        </ul>
        <dl className="flex flex-col gap-2">
          <div className="flex justify-between">
            <dt className="text-fumaca">Subtotal</dt>
            <dd className="tabular-nums">{formatBRL(totals.subtotalCents)}</dd>
          </div>
          {form.orderType === "entrega" && (
            <div className="flex justify-between gap-4">
              <dt className="text-fumaca">Taxa de entrega</dt>
              <dd className="text-right tabular-nums">
                {totals.deliveryFeeCents === null ? "a confirmar" : formatBRL(totals.deliveryFeeCents)}
              </dd>
            </div>
          )}
          <div className="flex justify-between border-t border-creme/10 pt-2 text-xl font-bold">
            <dt>{form.orderType === "entrega" && !totals.feeKnown ? "Total sem taxa" : "Total"}</dt>
            <dd className="tabular-nums text-ambar">{formatBRL(totals.totalCents)}</dd>
          </div>
        </dl>
        <p className="flex gap-2 rounded-xl bg-carvao/60 p-3 text-sm text-creme/90">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-ouro" />
          O WhatsApp abrirá com a mensagem pronta. O pedido só é recebido quando você enviar a mensagem e só vale após a confirmação do
          estabelecimento.
        </p>
        <button type="submit" className="btn btn-whatsapp text-lg">
          <WhatsAppIcon className="h-5 w-5" /> Finalizar pedido pelo WhatsApp
        </button>
        <Link href="/carrinho" className="btn btn-ghost">
          <ArrowLeft className="h-4 w-4" /> Revisar itens
        </Link>
      </aside>
    </form>
  )
}
