"use client"

import { useEffect, useState } from "react"
import { isOpenAt } from "@/lib/hours"
import type { OpeningHour } from "@/lib/menu/types"

/** Calculado no navegador para não ficar desatualizado no cache da página. */
export function OpenNowBadge({ hours }: { hours: OpeningHour[] }) {
  const [open, setOpen] = useState<boolean | null>(null)
  useEffect(() => {
    const update = () => setOpen(isOpenAt(hours, new Date()))
    update()
    const t = setInterval(update, 60_000)
    return () => clearInterval(t)
  }, [hours])
  if (open === null) return <span className="h-7" aria-hidden="true" />
  return (
    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-carvao/60 px-3 py-1 text-sm font-semibold">
      <span className={`h-2.5 w-2.5 rounded-full ${open ? "animate-flicker bg-[#3ccf6e]" : "bg-pimenta-2"}`} aria-hidden="true" />
      {open ? "Aberto agora" : "Fechado agora"}
      <span className="font-normal text-fumaca">· conforme horário cadastrado</span>
    </span>
  )
}
