"use client"

import { useEffect, useRef } from "react"
import { saveCategory } from "@/app/admin/actions"
import type { Category } from "@/lib/menu/types"
import { FieldError, FormMessage, SubmitButton, Switch, useFormAction } from "./ui"

export function CategoryForm({ category }: { category?: Category }) {
  const { state, onSubmit, pending } = useFormAction(saveCategory)
  const id = category?.id ?? "nova"
  const ref = useRef<HTMLFormElement>(null)
  // Depois de criar, limpa o formulário de "nova categoria".
  useEffect(() => {
    if (!category && state?.ok) ref.current?.reset()
  }, [state, category])
  return (
    <form ref={ref} onSubmit={onSubmit} className="flex flex-col gap-3" noValidate>
      <input type="hidden" name="id" value={category?.id ?? ""} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`name-${id}`} className="label">Nome</label>
          <input id={`name-${id}`} name="name" className="field" defaultValue={category?.name} maxLength={80} required aria-invalid={!!state?.fieldErrors?.name} />
          <FieldError state={state} name="name" />
        </div>
        <div>
          <label htmlFor={`slug-${id}`} className="label">Endereço (opcional)</label>
          <input id={`slug-${id}`} name="slug" className="field" defaultValue={category?.slug} placeholder="gerado a partir do nome" maxLength={80} />
          <FieldError state={state} name="slug" />
        </div>
      </div>
      <div>
        <label htmlFor={`desc-${id}`} className="label">Descrição</label>
        <textarea id={`desc-${id}`} name="description" className="field min-h-16" defaultValue={category?.description ?? ""} maxLength={500} />
      </div>
      <div>
        <label htmlFor={`note-${id}`} className="label">Informação exibida em todos os produtos da categoria (opcional)</label>
        <textarea id={`note-${id}`} name="infoNote" className="field min-h-16" defaultValue={category?.infoNote ?? ""} placeholder="Ex.: Todos os cachurrascos são recheados com…" maxLength={500} />
      </div>
      <div className="flex flex-wrap gap-x-6">
        <Switch name="isActive" label="Visível no cardápio" defaultChecked={category?.isActive ?? true} />
        <Switch name="isHighlighted" label="Categoria em destaque na página inicial" defaultChecked={category?.isHighlighted ?? false} />
      </div>
      <FormMessage state={state} />
      <SubmitButton pending={pending} className="btn btn-gold self-start">
        {category ? "Salvar categoria" : "Criar categoria"}
      </SubmitButton>
    </form>
  )
}
