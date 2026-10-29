"use client"

import { useState, useTransition } from "react"
import { ArrowDown, ArrowUp, LoaderCircle, Trash2 } from "lucide-react"
import { Switch } from "./ui"
import {
  deleteCategory,
  deleteProduct,
  moveCategory,
  moveProduct,
  toggleCategoryActive,
  toggleProductFlag,
} from "@/app/admin/actions"
import type { ActionResult } from "@/lib/admin/validation"

function useAction() {
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const run = (fn: () => Promise<ActionResult>) =>
    start(async () => {
      setError(null)
      try {
        const res = await fn()
        if (!res.ok) setError(res.message)
      } catch {
        setError("Falha de conexão. Tente novamente.")
      }
    })
  return { pending, error, run }
}

export function MoveButtons({ kind, id, first, last }: { kind: "product" | "category"; id: string; first: boolean; last: boolean }) {
  const { pending, error, run } = useAction()
  const fn = kind === "product" ? moveProduct : moveCategory
  return (
    <div className="flex items-center gap-1">
      <button type="button" className="grid h-10 w-10 place-items-center rounded-full border border-creme/15 hover:border-ouro disabled:opacity-30" disabled={first || pending} onClick={() => run(() => fn(id, "up"))} aria-label="Mover para cima">
        <ArrowUp className="h-4 w-4" />
      </button>
      <button type="button" className="grid h-10 w-10 place-items-center rounded-full border border-creme/15 hover:border-ouro disabled:opacity-30" disabled={last || pending} onClick={() => run(() => fn(id, "down"))} aria-label="Mover para baixo">
        <ArrowDown className="h-4 w-4" />
      </button>
      {error && <span role="alert" className="text-xs text-[#ff8a99]">{error}</span>}
    </div>
  )
}

type Flags = { isActive: boolean; isAvailable: boolean; isFeatured: boolean; isNew: boolean }

export function ProductFlags({ id, flags }: { id: string; flags: Flags }) {
  const { pending, error, run } = useAction()
  const item = (key: keyof Flags, column: "is_active" | "is_available" | "is_featured" | "is_new", label: string) => (
    <Switch label={label} checked={flags[key]} disabled={pending} onChange={(v) => run(() => toggleProductFlag(id, column, v))} />
  )
  return (
    <div className="flex flex-col gap-1">
      <div className="grid grid-cols-2 gap-x-4 sm:flex sm:flex-wrap">
        {item("isActive", "is_active", "No cardápio")}
        {item("isAvailable", "is_available", "Disponível")}
        {item("isFeatured", "is_featured", "Destaque")}
        {item("isNew", "is_new", "Novidade")}
      </div>
      {pending && <LoaderCircle className="h-4 w-4 animate-spin text-fumaca" aria-label="Salvando" />}
      {error && <p role="alert" className="text-sm text-[#ff8a99]">{error}</p>}
    </div>
  )
}

export function CategoryActiveSwitch({ id, active }: { id: string; active: boolean }) {
  const { pending, error, run } = useAction()
  return (
    <div>
      <Switch label="Visível no cardápio" checked={active} disabled={pending} onChange={(v) => run(() => toggleCategoryActive(id, v))} />
      {error && <p role="alert" className="text-sm text-[#ff8a99]">{error}</p>}
    </div>
  )
}

export function DeleteButton({ kind, id, name }: { kind: "product" | "category"; id: string; name: string }) {
  const { pending, error, run } = useAction()
  const [confirming, setConfirming] = useState(false)
  const fn = kind === "product" ? deleteProduct : deleteCategory
  if (!confirming) {
    return (
      <div>
        <button type="button" className="btn btn-ghost min-h-10! px-3! text-sm hover:border-pimenta! hover:text-[#ff8a99]!" onClick={() => setConfirming(true)}>
          <Trash2 className="h-4 w-4" /> Excluir
        </button>
        {error && <p role="alert" className="mt-1 text-sm text-[#ff8a99]">{error}</p>}
      </div>
    )
  }
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl bg-pimenta/15 p-2 text-sm">
      <span>Excluir “{name}” de vez?</span>
      <button type="button" className="btn btn-primary min-h-9! px-3! text-sm" disabled={pending} onClick={() => run(async () => { const r = await fn(id); if (r.ok) setConfirming(false); return r })}>
        {pending ? "Excluindo…" : "Sim, excluir"}
      </button>
      <button type="button" className="btn btn-ghost min-h-9! px-3! text-sm" onClick={() => setConfirming(false)}>
        Cancelar
      </button>
    </div>
  )
}
