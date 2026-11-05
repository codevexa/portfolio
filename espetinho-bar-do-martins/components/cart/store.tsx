"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { addLine, resolveCart, setNotes as setLineNotes, setQuantity as setLineQuantity, type CartLine } from "@/lib/cart"
import type { Catalog, Settings } from "@/lib/menu/types"

const STORAGE_KEY = "ebm-carrinho-v1"

type Toast = { id: number; message: string; tone: "success" | "error" }

type StoreValue = {
  catalog: Catalog
  settings: Settings
  hydrated: boolean
  lines: CartLine[]
  cart: ReturnType<typeof resolveCart>
  add: (item: Omit<CartLine, "key">) => void
  setQuantity: (key: string, quantity: number) => void
  setNotes: (key: string, notes: string) => void
  remove: (key: string) => void
  clear: () => void
  toast: Toast | null
  notify: (message: string, tone?: Toast["tone"]) => void
}

const StoreContext = createContext<StoreValue | null>(null)

function readStorage(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (l): l is CartLine =>
        l && typeof l.key === "string" && typeof l.productId === "string" && typeof l.variantId === "string" &&
        Number.isInteger(l.quantity) && l.quantity > 0 && typeof l.notes === "string",
    )
  } catch {
    return []
  }
}

export function StoreProvider({ catalog, settings, children }: { catalog: Catalog; settings: Settings; children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setLines(readStorage())
    setHydrated(true)
    // Mantém abas diferentes em sincronia.
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setLines(readStorage())
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      // Navegação privada ou armazenamento bloqueado: o carrinho segue funcionando na sessão.
    }
  }, [lines, hydrated])

  const notify = useCallback((message: string, tone: Toast["tone"] = "success") => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), message, tone })
    toastTimer.current = setTimeout(() => setToast(null), 3200)
  }, [])

  const add = useCallback((item: Omit<CartLine, "key">) => setLines((prev) => addLine(prev, item)), [])
  const setQuantity = useCallback((key: string, q: number) => setLines((prev) => setLineQuantity(prev, key, q)), [])
  const setNotes = useCallback((key: string, notes: string) => setLines((prev) => setLineNotes(prev, key, notes)), [])
  const remove = useCallback((key: string) => setLines((prev) => prev.filter((l) => l.key !== key)), [])
  const clear = useCallback(() => setLines([]), [])

  const cart = useMemo(() => resolveCart(lines, catalog), [lines, catalog])

  const value = useMemo(
    () => ({ catalog, settings, hydrated, lines, cart, add, setQuantity, setNotes, remove, clear, toast, notify }),
    [catalog, settings, hydrated, lines, cart, add, setQuantity, setNotes, remove, clear, toast, notify],
  )
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore precisa estar dentro de <StoreProvider>")
  return ctx
}
