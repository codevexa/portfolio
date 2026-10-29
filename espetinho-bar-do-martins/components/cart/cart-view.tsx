"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, MessageSquarePlus, ShoppingBag, Trash2, TriangleAlert } from "lucide-react"
import clsx from "clsx"
import { useStore } from "./store"
import { QuantityStepper } from "@/components/menu/product-purchase"
import { ProductImage } from "@/components/menu/product-image"
import { MAX_NOTES, type ResolvedLine } from "@/lib/cart"
import { formatBRL } from "@/lib/money"

export function CartSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="Carregando carrinho">
      {[0, 1].map((i) => (
        <div key={i} className="card-surface h-32 animate-pulse" />
      ))}
    </div>
  )
}

export function EmptyCart() {
  return (
    <div className="card-surface flex flex-col items-center gap-4 p-10 text-center">
      <ShoppingBag className="h-12 w-12 text-ouro" />
      <h2 className="font-display text-2xl uppercase">Seu pedido está vazio</h2>
      <p className="text-fumaca">Escolha seus espetinhos e cachurrascos no cardápio.</p>
      <Link href="/cardapio" className="btn btn-gold">
        Ver cardápio
      </Link>
    </div>
  )
}

function LineItem({ line }: { line: ResolvedLine }) {
  const { setQuantity, setNotes, remove } = useStore()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(line.notes)

  return (
    <li className={clsx("card-surface flex gap-3 p-3 sm:gap-4 sm:p-4", !line.available && "border-pimenta/60!")}>
      {line.product ? (
        <Link href={`/cardapio/${line.product.slug}`} className="shrink-0">
          <ProductImage product={line.product} sizes="112px" showBadge={false} className="h-20 w-20 rounded-xl sm:h-28 sm:w-28" />
        </Link>
      ) : (
        <div className="h-20 w-20 shrink-0 rounded-xl bg-madeira sm:h-28 sm:w-28" />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-display text-lg uppercase leading-tight">{line.name}</h3>
            {line.variantText && <p className="text-sm text-ambar">{line.variantText}</p>}
          </div>
          <button
            type="button"
            onClick={() => remove(line.key)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-fumaca hover:bg-pimenta/20 hover:text-pimenta-2"
            aria-label={`Remover ${line.name}`}
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        {!line.available ? (
          <p className="flex items-center gap-2 text-sm font-semibold text-pimenta-2">
            <TriangleAlert className="h-4 w-4" /> Indisponível no momento — não será incluído no pedido.
          </p>
        ) : (
          <>
            {editing ? (
              <div className="flex flex-col gap-2">
                <label htmlFor={`obs-${line.key}`} className="sr-only">Observação de {line.name}</label>
                <textarea
                  id={`obs-${line.key}`}
                  className="field min-h-16 text-sm"
                  maxLength={MAX_NOTES}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Ex.: sem cebola"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn btn-gold min-h-10! text-sm"
                    onClick={() => {
                      setNotes(line.key, draft.trim())
                      setEditing(false)
                    }}
                  >
                    Salvar observação
                  </button>
                  <button type="button" className="btn btn-ghost min-h-10! text-sm" onClick={() => { setDraft(line.notes); setEditing(false) }}>
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="flex min-h-9 items-start gap-1.5 text-left text-sm text-fumaca hover:text-ambar"
              >
                <MessageSquarePlus className="mt-0.5 h-4 w-4 shrink-0" />
                {line.notes ? <span>Obs.: {line.notes}</span> : <span>Adicionar observação</span>}
              </button>
            )}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <QuantityStepper value={line.quantity} onChange={(n) => setQuantity(line.key, n)} label={`Quantidade de ${line.name}`} size="sm" />
              <p className="text-right">
                <span className="block text-xs text-fumaca tabular-nums">{formatBRL(line.unitCents)} cada</span>
                <span className="font-display text-xl font-bold tabular-nums text-ambar">{formatBRL(line.subtotalCents)}</span>
              </p>
            </div>
          </>
        )}
      </div>
    </li>
  )
}

export function CartView() {
  const { cart, hydrated, clear } = useStore()
  const [confirmClear, setConfirmClear] = useState(false)

  if (!hydrated) return <CartSkeleton />
  if (cart.lines.length === 0) return <EmptyCart />

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
      <div className="flex flex-col gap-4">
        <ul className="flex flex-col gap-3" aria-label="Itens do pedido">
          {cart.lines.map((l) => (
            <LineItem key={l.key} line={l} />
          ))}
        </ul>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/cardapio" className="btn btn-ghost">
            <ArrowLeft className="h-4 w-4" /> Continuar escolhendo
          </Link>
          {confirmClear ? (
            <span className="flex items-center gap-2 text-sm">
              Esvaziar o pedido?
              <button type="button" className="btn btn-primary min-h-10! text-sm" onClick={() => { clear(); setConfirmClear(false) }}>
                Sim, esvaziar
              </button>
              <button type="button" className="btn btn-ghost min-h-10! text-sm" onClick={() => setConfirmClear(false)}>
                Não
              </button>
            </span>
          ) : (
            <button type="button" className="text-sm text-fumaca underline-offset-4 hover:text-pimenta-2 hover:underline" onClick={() => setConfirmClear(true)}>
              Esvaziar pedido
            </button>
          )}
        </div>
      </div>

      <aside className="card-surface flex flex-col gap-4 p-5 lg:sticky lg:top-28" aria-label="Resumo do pedido">
        <h2 className="font-display text-2xl uppercase">Resumo</h2>
        <dl className="flex flex-col gap-2">
          <div className="flex justify-between">
            <dt className="text-fumaca">Itens</dt>
            <dd className="tabular-nums">{cart.itemCount}</dd>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <dt>Subtotal</dt>
            <dd className="tabular-nums text-ambar">{formatBRL(cart.subtotalCents)}</dd>
          </div>
        </dl>
        <p className="text-sm text-fumaca">Entrega ou retirada e eventual taxa são definidas na próxima etapa.</p>
        {cart.hasUnavailable && (
          <p className="text-sm text-pimenta-2">Há itens indisponíveis no carrinho; eles não entram no pedido.</p>
        )}
        {cart.itemCount > 0 ? (
          <Link href="/finalizar" className="btn btn-primary text-lg">
            Finalizar pedido
          </Link>
        ) : (
          <button type="button" className="btn btn-primary text-lg" disabled>
            Finalizar pedido
          </button>
        )}
      </aside>
    </div>
  )
}
