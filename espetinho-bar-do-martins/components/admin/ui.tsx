"use client"

import { startTransition, useActionState, type FormEvent } from "react"
import { CircleCheck, LoaderCircle, TriangleAlert } from "lucide-react"
import clsx from "clsx"
import type { ActionResult } from "@/lib/admin/validation"

/**
 * Envia o formulário para a ação do servidor SEM limpar os campos (o padrão do React 19 limpa
 * o formulário a cada envio, o que apagaria o que o administrador digitou quando há erro).
 */
export function useFormAction(
  action: (prev: ActionResult | null, fd: FormData) => Promise<ActionResult>,
  initial: ActionResult | null = null,
) {
  const [state, dispatch, pending] = useActionState(action, initial)
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(() => dispatch(fd))
  }
  return { state, onSubmit, pending }
}

export function SubmitButton({ children, pending, className = "btn btn-primary" }: { children: React.ReactNode; pending: boolean; className?: string }) {
  return (
    <button type="submit" className={className} disabled={pending} aria-busy={pending}>
      {pending && <LoaderCircle className="h-5 w-5 animate-spin" />}
      {pending ? "Salvando…" : children}
    </button>
  )
}

export function FormMessage({ state }: { state: ActionResult | null }) {
  if (!state?.message) return null
  return (
    <p
      role={state.ok ? "status" : "alert"}
      className={clsx(
        "flex items-start gap-2 rounded-xl px-4 py-3 text-sm font-semibold",
        state.ok ? "bg-[#1f8a4c]/20 text-[#7be3a4]" : "bg-pimenta/20 text-[#ff8a99]",
      )}
    >
      {state.ok ? <CircleCheck className="h-5 w-5 shrink-0" /> : <TriangleAlert className="h-5 w-5 shrink-0" />}
      {state.message}
    </p>
  )
}

export function FieldError({ state, name }: { state: ActionResult | null; name: string }) {
  const msg = state?.fieldErrors?.[name]
  if (!msg) return null
  return <p className="mt-1 text-sm text-[#ff8a99]">{msg}</p>
}

/** Interruptor acessível (checkbox nativo estilizado). */
export function Switch({
  name,
  label,
  description,
  defaultChecked,
  checked,
  onChange,
  disabled,
}: {
  name?: string
  label: string
  description?: string
  defaultChecked?: boolean
  checked?: boolean
  onChange?: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <label className={clsx("flex min-h-11 cursor-pointer items-start gap-3", disabled && "cursor-not-allowed opacity-60")}>
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input
          type="checkbox"
          name={name}
          className="peer sr-only"
          defaultChecked={defaultChecked}
          checked={checked}
          onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
          disabled={disabled}
        />
        <span className="h-7 w-12 rounded-full bg-creme/20 transition-colors peer-checked:bg-[#1f8a4c] peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-ambar" />
        <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
      </span>
      <span>
        <span className="block font-semibold">{label}</span>
        {description && <span className="block text-sm text-fumaca">{description}</span>}
      </span>
    </label>
  )
}
