"use client"

import { useId, useMemo, useState } from "react"
import { Minus, Plus, MessageSquarePlus, ShoppingBag } from "lucide-react"
import clsx from "clsx"
import { useStore } from "@/components/cart/store"
import { MAX_NOTES, MAX_QUANTITY } from "@/lib/cart"
import { formatBRL } from "@/lib/money"
import type { Product, Variant } from "@/lib/menu/types"
import { hasChoices, isPurchasable, variantGroups, variantLabel } from "@/lib/menu/variants"

function firstAvailable(variants: Variant[]): Variant | undefined {
  return variants.find((v) => v.isAvailable) ?? variants[0]
}

export function QuantityStepper({
  value,
  onChange,
  label,
  min = 1,
  size = "md",
}: {
  value: number
  onChange: (n: number) => void
  label: string
  min?: number
  size?: "sm" | "md"
}) {
  const btn = size === "sm" ? "h-10 w-10" : "h-12 w-12"
  return (
    <div className="inline-flex items-center rounded-full border border-creme/20 bg-carvao/60" role="group" aria-label={label}>
      <button
        type="button"
        className={clsx(btn, "grid place-items-center rounded-full text-creme hover:text-ambar disabled:opacity-40")}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Diminuir quantidade"
      >
        <Minus className="h-5 w-5" />
      </button>
      <output className="min-w-8 text-center text-lg font-bold tabular-nums" aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className={clsx(btn, "grid place-items-center rounded-full text-creme hover:text-ambar disabled:opacity-40")}
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QUANTITY}
        aria-label="Aumentar quantidade"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  )
}

/** Escolha de variação, quantidade, observação e botão "Adicionar ao pedido". */
export function ProductPurchase({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { add, notify } = useStore()
  const uid = useId()
  const groups = useMemo(() => variantGroups(product), [product])
  const multiGroup = groups.length > 1
  const choices = hasChoices(product)

  const initial = firstAvailable(product.variants)
  const [group, setGroup] = useState(initial?.groupName ?? "")
  const [variantId, setVariantId] = useState(initial?.id ?? "")
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState("")
  const [showNotes, setShowNotes] = useState(false)

  const inGroup = product.variants.filter((v) => (v.groupName ?? "") === group)
  const variant = product.variants.find((v) => v.id === variantId) ?? initial
  const purchasable = !!variant && isPurchasable(product, variant)

  function chooseGroup(g: string) {
    setGroup(g)
    const options = product.variants.filter((v) => (v.groupName ?? "") === g)
    // Mantém a mesma quantidade de espetinhos ao trocar o pão, se existir.
    const same = options.find((v) => v.name === variant?.name && v.isAvailable)
    setVariantId((same ?? firstAvailable(options))?.id ?? "")
  }

  function handleAdd() {
    if (!variant || !purchasable) return
    add({ productId: product.id, variantId: variant.id, quantity, notes })
    const label = variantLabel(variant)
    notify(`${quantity} × ${product.name}${label ? ` (${label})` : ""} adicionado ao pedido`)
    setQuantity(1)
    setNotes("")
    setShowNotes(false)
  }

  if (!product.isAvailable) {
    return (
      <p className="rounded-xl border border-creme/15 bg-carvao/50 px-4 py-3 text-sm font-semibold text-fumaca">
        Indisponível no momento
      </p>
    )
  }

  return (
    <div className={clsx("flex flex-col", compact ? "gap-3" : "gap-5")}>
      {choices && multiGroup && (
        <fieldset>
          <legend className="label">{product.groupLabel || "Opção"}</legend>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={product.groupLabel || "Opção"}>
            {groups.map((g) => {
              const available = product.variants.some((v) => (v.groupName ?? "") === g && v.isAvailable)
              return (
                <button
                  key={g}
                  type="button"
                  role="radio"
                  aria-checked={g === group}
                  className="chip"
                  disabled={!available}
                  onClick={() => chooseGroup(g)}
                >
                  {g.replace(/ 30 cm$/, "")}
                </button>
              )
            })}
          </div>
        </fieldset>
      )}

      {choices && (inGroup.length > 1 || inGroup[0]?.name) && (
        <fieldset>
          <legend className="label">{product.variantLabel || "Escolha"}</legend>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={product.variantLabel || "Escolha"}>
            {inGroup.map((v) => (
              <button
                key={v.id}
                type="button"
                role="radio"
                aria-checked={v.id === variant?.id}
                className="chip gap-2"
                disabled={!v.isAvailable}
                onClick={() => setVariantId(v.id)}
              >
                <span>{v.name || "Único"}</span>
                <span className="text-sm opacity-80 tabular-nums">{formatBRL(v.priceCents)}</span>
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {product.allowsNotes &&
        (showNotes ? (
          <div>
            <label htmlFor={`${uid}-notes`} className="label">
              Observação para a cozinha <span className="font-normal">(opcional)</span>
            </label>
            <textarea
              id={`${uid}-notes`}
              className="field min-h-20 resize-y"
              maxLength={MAX_NOTES}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex.: sem cebola, ponto da carne…"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowNotes(true)}
            className="inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-fumaca underline-offset-4 hover:text-ambar hover:underline"
          >
            <MessageSquarePlus className="h-4 w-4" /> Adicionar observação
          </button>
        ))}

      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper value={quantity} onChange={setQuantity} label={`Quantidade de ${product.name}`} size={compact ? "sm" : "md"} />
        <button
          type="button"
          className="btn btn-primary flex-1 whitespace-nowrap"
          onClick={handleAdd}
          disabled={!purchasable}
        >
          <ShoppingBag className="h-5 w-5" />
          {purchasable ? (
            <span>
              Adicionar ao pedido
              {!compact && <span className="tabular-nums"> · {formatBRL((variant?.priceCents ?? 0) * quantity)}</span>}
            </span>
          ) : (
            "Indisponível"
          )}
        </button>
      </div>
    </div>
  )
}
