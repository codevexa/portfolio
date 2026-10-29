"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowDown, ArrowUp, ArrowLeft, Plus, Trash2, Upload } from "lucide-react"
import { saveProduct } from "@/app/admin/actions"
import { FieldError, FormMessage, SubmitButton, Switch, useFormAction } from "./ui"
import { centsToInput } from "@/lib/money"
import { imageUrl, isIllustration } from "@/lib/images"
import type { Category, Product } from "@/lib/menu/types"
import { slugify, type ActionResult } from "@/lib/admin/validation"

type VariantRow = { key: string; id: string; groupName: string; name: string; price: string; isAvailable: boolean }

let seq = 0
const newRow = (over: Partial<VariantRow> = {}): VariantRow => ({ key: `n${++seq}`, id: "", groupName: "", name: "", price: "", isAvailable: true, ...over })

/**
 * O estado da ação (mensagem de sucesso/erro) fica aqui fora; os campos ficam em <ProductFields>,
 * que é recriado quando os dados salvos mudam (para receber, por exemplo, os ids das novas variações).
 */
export function ProductForm({ product, categories, created }: { product?: Product; categories: Category[]; created?: boolean }) {
  const { state, onSubmit, pending } = useFormAction(
    saveProduct,
    created ? { ok: true, message: "Produto criado. Já está no cardápio, se estiver marcado como visível." } : null,
  )
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      <ProductFields key={product ? JSON.stringify(product) : "novo"} product={product} categories={categories} state={state} />
      <div className="sticky bottom-0 -mx-4 border-t border-creme/10 bg-carvao/95 px-4 py-3 backdrop-blur">
        <SubmitButton pending={pending} className="btn btn-primary w-full sm:w-auto">Salvar produto</SubmitButton>
      </div>
    </form>
  )
}

function ProductFields({ product, categories, state }: { product?: Product; categories: Category[]; state: ActionResult | null }) {
  const [name, setName] = useState(product?.name ?? "")
  const [slug, setSlug] = useState(product?.slug ?? "")
  const [slugTouched, setSlugTouched] = useState(!!product)
  const [rows, setRows] = useState<VariantRow[]>(
    product?.variants.map((v) => ({
      key: v.id,
      id: v.id,
      groupName: v.groupName ?? "",
      name: v.name,
      price: centsToInput(v.priceCents),
      isAvailable: v.isAvailable,
    })) ?? [newRow()],
  )
  const [useGroups, setUseGroups] = useState(!!product?.variants.some((v) => v.groupName))
  const [preview, setPreview] = useState<string | null>(null)
  const [removeImage, setRemoveImage] = useState(false)

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name))
  }, [name, slugTouched])

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  const currentImage = removeImage ? null : imageUrl(product?.imagePath)
  const shownImage = preview ?? currentImage
  const err = (k: string) => state?.fieldErrors?.[k]

  const update = (key: string, patch: Partial<VariantRow>) => setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)))
  const moveRow = (i: number, d: -1 | 1) =>
    setRows((rs) => {
      const next = [...rs]
      ;[next[i], next[i + d]] = [next[i + d], next[i]]
      return next
    })

  const variantsJson = JSON.stringify(
    rows.map((r) => ({ id: r.id, groupName: useGroups ? r.groupName : "", name: r.name, price: r.price, isAvailable: r.isAvailable })),
  )

  return (
    <>
      <input type="hidden" name="id" value={product?.id ?? ""} />
      <input type="hidden" name="variants" value={variantsJson} />
      <input type="hidden" name="currentImagePath" value={product?.imagePath ?? ""} />
      <input type="hidden" name="removeImage" value={removeImage ? "true" : ""} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/produtos" className="inline-flex min-h-11 items-center gap-2 text-sm text-fumaca hover:text-ambar">
          <ArrowLeft className="h-4 w-4" /> Produtos
        </Link>
        {product && (
          <Link href={`/cardapio/${product.slug}`} target="_blank" className="text-sm text-fumaca underline-offset-4 hover:text-ambar hover:underline">
            Ver no site
          </Link>
        )}
      </div>
      <h1 className="section-title text-4xl">{product ? "Editar produto" : "Novo produto"}</h1>

      <FormMessage state={state} />

      <section className="card-surface grid gap-4 p-5 md:grid-cols-2">
        <h2 className="font-display text-xl uppercase md:col-span-2">Informações</h2>
        <div className="md:col-span-2">
          <label htmlFor="name" className="label">Nome</label>
          <input id="name" name="name" className="field" value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} aria-invalid={!!err("name")} />
          <FieldError state={state} name="name" />
        </div>
        <div>
          <label htmlFor="categoryId" className="label">Categoria</label>
          <select id="categoryId" name="categoryId" className="field" defaultValue={product?.categoryId ?? categories[0]?.id} required>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {!c.isActive ? " (oculta)" : ""}
              </option>
            ))}
          </select>
          <FieldError state={state} name="categoryId" />
        </div>
        <div>
          <label htmlFor="slug" className="label">Endereço da página</label>
          <div className="flex items-center gap-1 text-sm text-fumaca">
            <span className="shrink-0">/cardapio/</span>
            <input
              id="slug"
              name="slug"
              className="field"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true)
                setSlug(e.target.value)
              }}
              maxLength={120}
              aria-invalid={!!err("slug")}
            />
          </div>
          <FieldError state={state} name="slug" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="description" className="label">Descrição curta</label>
          <textarea id="description" name="description" className="field min-h-20" defaultValue={product?.description ?? ""} maxLength={1000} />
          <FieldError state={state} name="description" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="details" className="label">Ingredientes e informações (opcional)</label>
          <textarea id="details" name="details" className="field min-h-20" defaultValue={product?.details ?? ""} maxLength={2000} />
          <FieldError state={state} name="details" />
        </div>
      </section>

      <section className="card-surface flex flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl uppercase">Preços e variações</h2>
          <Switch label="Usar dois níveis de escolha" description="Ex.: tipo de pão + quantidade de espetinhos" checked={useGroups} onChange={setUseGroups} />
        </div>
        <p className="text-sm text-fumaca">
          Produto de preço único: deixe uma linha só, sem nome. Para tamanhos ou pesos, crie uma linha para cada opção.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {useGroups && (
            <div>
              <label htmlFor="groupLabel" className="label">Título do 1º nível</label>
              <input id="groupLabel" name="groupLabel" className="field" placeholder="Ex.: Pão" defaultValue={product?.groupLabel ?? ""} maxLength={60} />
            </div>
          )}
          <div>
            <label htmlFor="variantLabel" className="label">Título da escolha</label>
            <input id="variantLabel" name="variantLabel" className="field" placeholder="Ex.: Tamanho, Peso, Quantidade de espetinhos" defaultValue={product?.variantLabel ?? ""} maxLength={60} />
          </div>
        </div>
        {!useGroups && <input type="hidden" name="groupLabel" value="" />}

        <ul className="flex flex-col gap-3">
          {rows.map((r, i) => (
            <li key={r.key} className="rounded-2xl border border-creme/10 bg-carvao/40 p-3">
              <div className={`grid gap-3 ${useGroups ? "sm:grid-cols-[1fr_1fr_140px]" : "sm:grid-cols-[1fr_140px]"}`}>
                {useGroups && (
                  <div>
                    <label htmlFor={`g-${r.key}`} className="label">1º nível</label>
                    <input id={`g-${r.key}`} className="field" placeholder="Ex.: Pão Parmesão 30 cm" value={r.groupName} onChange={(e) => update(r.key, { groupName: e.target.value })} maxLength={80} />
                  </div>
                )}
                <div>
                  <label htmlFor={`n-${r.key}`} className="label">Opção</label>
                  <input id={`n-${r.key}`} className="field" placeholder={rows.length > 1 ? "Ex.: Média, 300 g, 2 espetinhos" : "(vazio = preço único)"} value={r.name} onChange={(e) => update(r.key, { name: e.target.value })} maxLength={80} aria-invalid={!!err(`variants.${i}.name`)} />
                  {err(`variants.${i}.name`) && <p className="mt-1 text-sm text-[#ff8a99]">{err(`variants.${i}.name`)}</p>}
                </div>
                <div>
                  <label htmlFor={`p-${r.key}`} className="label">Preço (R$)</label>
                  <input id={`p-${r.key}`} className="field tabular-nums" inputMode="decimal" placeholder="15,90" value={r.price} onChange={(e) => update(r.key, { price: e.target.value })} required aria-invalid={!!err(`variants.${i}.price`)} />
                  {err(`variants.${i}.price`) && <p className="mt-1 text-sm text-[#ff8a99]">{err(`variants.${i}.price`)}</p>}
                </div>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <Switch label="Disponível" checked={r.isAvailable} onChange={(v) => update(r.key, { isAvailable: v })} />
                <div className="flex gap-1">
                  <button type="button" className="grid h-10 w-10 place-items-center rounded-full border border-creme/15 disabled:opacity-30" disabled={i === 0} onClick={() => moveRow(i, -1)} aria-label="Mover opção para cima">
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button type="button" className="grid h-10 w-10 place-items-center rounded-full border border-creme/15 disabled:opacity-30" disabled={i === rows.length - 1} onClick={() => moveRow(i, 1)} aria-label="Mover opção para baixo">
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button type="button" className="grid h-10 w-10 place-items-center rounded-full border border-creme/15 hover:border-pimenta disabled:opacity-30" disabled={rows.length === 1} onClick={() => setRows((rs) => rs.filter((x) => x.key !== r.key))} aria-label="Remover opção">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {state?.fieldErrors?.variants && <p className="text-sm text-[#ff8a99]">{state.fieldErrors.variants}</p>}
        <button type="button" className="btn btn-ghost self-start" onClick={() => setRows((rs) => [...rs, newRow({ groupName: useGroups ? rs.at(-1)?.groupName ?? "" : "" })])}>
          <Plus className="h-4 w-4" /> Adicionar opção
        </button>
      </section>

      <section className="card-surface grid gap-4 p-5 md:grid-cols-[220px_1fr]">
        <h2 className="font-display text-xl uppercase md:col-span-2">Foto</h2>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-madeira">
          {shownImage ? (
            <Image src={shownImage} alt="" fill sizes="220px" className="object-cover" unoptimized />
          ) : (
            <div className="grid h-full place-items-center text-sm text-fumaca">Sem foto</div>
          )}
        </div>
        <div className="flex flex-col gap-3">
          {product && isIllustration(product.imagePath) && !preview && !removeImage && (
            <p className="text-sm text-ouro">Esta é uma ilustração provisória. Envie uma foto real do prato.</p>
          )}
          <label className="btn btn-gold cursor-pointer self-start">
            <Upload className="h-4 w-4" /> {shownImage ? "Substituir foto" : "Enviar foto"}
            <input
              type="file"
              name="image"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0]
                setPreview(f ? URL.createObjectURL(f) : null)
                if (f) setRemoveImage(false)
              }}
            />
          </label>
          <p className="text-xs text-fumaca">JPG, PNG, WebP ou AVIF, até 5 MB. De preferência na horizontal (4:3).</p>
          <FieldError state={state} name="image" />
          {currentImage && !preview && (
            <button type="button" className="self-start text-sm text-fumaca underline-offset-4 hover:text-[#ff8a99] hover:underline" onClick={() => setRemoveImage(true)}>
              Remover foto
            </button>
          )}
          <div>
            <label htmlFor="imageAlt" className="label">Descrição da foto (acessibilidade e Google)</label>
            <input id="imageAlt" name="imageAlt" className="field" placeholder="Ex.: Cachurrasco de 30 cm com espetinhos e maionese verde" defaultValue={product?.imageAlt ?? ""} maxLength={200} />
          </div>
        </div>
      </section>

      <section className="card-surface grid gap-2 p-5 sm:grid-cols-2">
        <h2 className="font-display text-xl uppercase sm:col-span-2">Exibição</h2>
        <Switch name="isActive" label="Visível no cardápio" description="Desligado: some do site, mas fica salvo aqui." defaultChecked={product?.isActive ?? true} />
        <Switch name="isAvailable" label="Disponível para pedido" description="Desligado: aparece como “Indisponível no momento”." defaultChecked={product?.isAvailable ?? true} />
        <Switch name="isFeatured" label="Destaque na página inicial" defaultChecked={product?.isFeatured ?? false} />
        <Switch name="isNew" label="Novidade (card especial)" defaultChecked={product?.isNew ?? false} />
        <Switch name="allowsNotes" label="Aceita observações do cliente" defaultChecked={product?.allowsNotes ?? true} />
      </section>
    </>
  )
}
