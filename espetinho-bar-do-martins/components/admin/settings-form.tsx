"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Upload } from "lucide-react"
import { saveSettings } from "@/app/admin/actions"
import { DAY_NAMES } from "@/lib/hours"
import { imageUrl } from "@/lib/images"
import { centsToInput } from "@/lib/money"
import type { Settings } from "@/lib/menu/types"
import type { ActionResult } from "@/lib/admin/validation"
import { FieldError, FormMessage, SubmitButton, Switch, useFormAction } from "./ui"

function Text({
  name,
  label,
  defaultValue,
  state,
  hint,
  textarea,
  ...rest
}: {
  name: string
  label: string
  defaultValue?: string | null
  state: ActionResult | null
  hint?: string
  textarea?: boolean
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "defaultValue" | "name">) {
  return (
    <div>
      <label htmlFor={name} className="label">{label}</label>
      {textarea ? (
        <textarea id={name} name={name} className="field min-h-24" defaultValue={defaultValue ?? ""} maxLength={rest.maxLength} aria-invalid={!!state?.fieldErrors?.[name]} />
      ) : (
        <input id={name} name={name} className="field" defaultValue={defaultValue ?? ""} aria-invalid={!!state?.fieldErrors?.[name]} {...rest} />
      )}
      {hint && <p className="mt-1 text-xs text-fumaca">{hint}</p>}
      <FieldError state={state} name={name} />
    </div>
  )
}

export function SettingsForm({ settings }: { settings: Settings }) {
  const { state, onSubmit, pending } = useFormAction(saveSettings)
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      <FormMessage state={state} />
      {/* Recriado quando as configurações salvas mudam; a mensagem acima continua visível. */}
      <SettingsFields key={JSON.stringify(settings)} settings={settings} state={state} />
      <div className="sticky bottom-0 -mx-4 border-t border-creme/10 bg-carvao/95 px-4 py-3 backdrop-blur">
        <SubmitButton pending={pending} className="btn btn-primary w-full sm:w-auto">Salvar configurações</SubmitButton>
      </div>
    </form>
  )
}

function SettingsFields({ settings, state }: { settings: Settings; state: ActionResult | null }) {
  const [preview, setPreview] = useState<string | null>(null)
  const [removeLogo, setRemoveLogo] = useState(false)
  const [closed, setClosed] = useState(() => Object.fromEntries(settings.openingHours.map((h) => [h.day, h.closed])))
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])
  const logo = preview ?? (removeLogo ? null : imageUrl(settings.logoPath))
  const hourOf = (day: number) => settings.openingHours.find((h) => h.day === day) ?? { day, open: "17:00", close: "00:00", closed: true }

  return (
    <>
      <input type="hidden" name="currentLogoPath" value={settings.logoPath ?? ""} />
      <input type="hidden" name="removeLogo" value={removeLogo ? "true" : ""} />

      <section className="card-surface grid gap-4 p-5 md:grid-cols-2">
        <h2 className="font-display text-xl uppercase md:col-span-2">Estabelecimento</h2>
        <Text name="businessName" label="Nome" defaultValue={settings.businessName} state={state} maxLength={120} />
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-madeira">
            {logo && <Image src={logo} alt="" fill sizes="64px" className="object-cover" unoptimized />}
          </div>
          <div className="flex flex-col gap-1">
            <label className="btn btn-ghost min-h-10! cursor-pointer text-sm">
              <Upload className="h-4 w-4" /> {logo ? "Trocar logotipo" : "Enviar logotipo"}
              <input type="file" name="logo" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" onChange={(e) => {
                const f = e.target.files?.[0]
                setPreview(f ? URL.createObjectURL(f) : null)
                if (f) setRemoveLogo(false)
              }} />
            </label>
            {logo && !preview && (
              <button type="button" className="text-left text-xs text-fumaca hover:text-[#ff8a99]" onClick={() => setRemoveLogo(true)}>
                Usar a marca padrão
              </button>
            )}
            <FieldError state={state} name="logo" />
          </div>
        </div>
        <div className="md:col-span-2">
          <Text name="aboutText" label="Texto do “Sobre nós”" defaultValue={settings.aboutText} state={state} textarea maxLength={2000} />
        </div>
      </section>

      <section className="card-surface grid gap-4 p-5 md:grid-cols-2">
        <h2 className="font-display text-xl uppercase md:col-span-2">WhatsApp e atendimento</h2>
        <Text name="whatsappNumber" label="Número do WhatsApp (recebe os pedidos)" defaultValue={settings.whatsappNumber} state={state} inputMode="numeric" hint="55 + DDD + número, só dígitos. Ex.: 5551994261019" maxLength={20} />
        <Text name="phoneDisplay" label="Telefone exibido no site" defaultValue={settings.phoneDisplay} state={state} maxLength={40} />
        <div className="md:col-span-2">
          <Text name="serviceMessage" label="Mensagem de atendimento (aparece após montar o pedido)" defaultValue={settings.serviceMessage} state={state} textarea maxLength={500} />
        </div>
      </section>

      <section id="pedidos" className="card-surface grid scroll-mt-32 gap-4 p-5 md:grid-cols-2">
        <h2 className="font-display text-xl uppercase md:col-span-2">Entrega e retirada</h2>
        <Switch name="pickupEnabled" label="Retirada no local" defaultChecked={settings.pickupEnabled} />
        <Switch name="deliveryEnabled" label="Entrega" defaultChecked={settings.deliveryEnabled} />
        <Text name="deliveryFee" label="Taxa de entrega (R$)" defaultValue={centsToInput(settings.deliveryFeeCents)} state={state} inputMode="decimal" placeholder="Em branco = a confirmar" hint="Deixe em branco se a taxa varia; o pedido mostrará “taxa a confirmar”." />
        <Text name="deliveryNote" label="Observação sobre entrega (opcional)" defaultValue={settings.deliveryNote} state={state} placeholder="Ex.: bairros atendidos" maxLength={300} />
      </section>

      <section id="endereco" className="card-surface grid scroll-mt-32 gap-4 p-5 md:grid-cols-2">
        <h2 className="font-display text-xl uppercase md:col-span-2">Endereço</h2>
        <div className="md:col-span-2">
          <Text name="addressLine" label="Endereço (rua, número, bairro)" defaultValue={settings.addressLine} state={state} maxLength={300} />
        </div>
        <Text name="city" label="Cidade" defaultValue={settings.city} state={state} maxLength={80} />
        <Text name="state" label="Estado" defaultValue={settings.state} state={state} maxLength={40} />
        <div className="md:col-span-2">
          <Text name="mapsQuery" label="Busca no Google Maps (opcional)" defaultValue={settings.mapsQuery} state={state} hint="Se o pino do mapa não cair no lugar certo, cole aqui o nome exato do local no Google Maps." maxLength={300} />
        </div>
        <div className="md:col-span-2">
          <Switch name="addressConfirmed" label="Endereço confirmado com o estabelecimento" description="Só depois de confirmado o endereço aparece no site, com o botão “Como chegar”." defaultChecked={settings.addressConfirmed} />
          <FieldError state={state} name="addressLine" />
        </div>
      </section>

      <section className="card-surface flex flex-col gap-3 p-5">
        <h2 className="font-display text-xl uppercase">Horário de funcionamento</h2>
        <p className="text-sm text-fumaca">Para fechar à meia-noite, use 00:00.</p>
        <ul className="flex flex-col gap-2">
          {[1, 2, 3, 4, 5, 6, 0].map((day) => {
            const h = hourOf(day)
            return (
              <li key={day} className="grid grid-cols-[90px_1fr] items-center gap-3 rounded-xl bg-carvao/40 p-3 sm:grid-cols-[110px_160px_1fr]">
                <span className="font-semibold">{DAY_NAMES[day]}</span>
                <Switch name={`closed-${day}`} label="Fechado" checked={closed[day]} onChange={(v) => setClosed((c) => ({ ...c, [day]: v }))} />
                <div className={`col-span-2 flex items-center gap-2 sm:col-span-1 ${closed[day] ? "opacity-40" : ""}`}>
                  <label className="sr-only" htmlFor={`open-${day}`}>Abre {DAY_NAMES[day]}</label>
                  <input id={`open-${day}`} name={`open-${day}`} type="time" className="field" defaultValue={h.open} />
                  <span>às</span>
                  <label className="sr-only" htmlFor={`close-${day}`}>Fecha {DAY_NAMES[day]}</label>
                  <input id={`close-${day}`} name={`close-${day}`} type="time" className="field" defaultValue={h.close} />
                </div>
              </li>
            )
          })}
        </ul>
        <FieldError state={state} name="openingHours" />
      </section>

      <section id="redes" className="card-surface grid scroll-mt-32 gap-4 p-5 md:grid-cols-2">
        <h2 className="font-display text-xl uppercase md:col-span-2">Redes sociais</h2>
        <Text name="instagramUrl" label="Instagram" defaultValue={settings.instagramUrl} state={state} placeholder="https://www.instagram.com/…" inputMode="url" />
        <Text name="facebookUrl" label="Facebook" defaultValue={settings.facebookUrl} state={state} placeholder="https://www.facebook.com/…" inputMode="url" />
      </section>

      <section className="card-surface flex flex-col gap-4 p-5">
        <h2 className="font-display text-xl uppercase">Aviso temporário</h2>
        <Text name="noticeText" label="Texto do aviso (faixa no topo do site)" defaultValue={settings.noticeText} state={state} placeholder="Ex.: Hoje abriremos às 19h." maxLength={300} />
        <Switch name="noticeActive" label="Mostrar aviso no site" defaultChecked={settings.noticeActive} />
      </section>
    </>
  )
}
