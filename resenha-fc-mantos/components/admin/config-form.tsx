"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { salvarConfig, type ActionState } from "@/app/admin/actions";
import type { StoreSettings } from "@/lib/site";

const DIAS = [
  { v: 0, label: "Dom" },
  { v: 1, label: "Seg" },
  { v: 2, label: "Ter" },
  { v: 3, label: "Qua" },
  { v: 4, label: "Qui" },
  { v: 5, label: "Sex" },
  { v: 6, label: "Sáb" },
];

export function ConfigForm({ settings }: { settings: StoreSettings }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    salvarConfig,
    null,
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-7">
      {state?.erro && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700">
          {state.erro}
        </p>
      )}
      {state?.ok && (
        <p className="rounded-xl bg-brand/25 px-4 py-3 text-[13px] font-semibold text-ink">
          {state.ok}
        </p>
      )}

      <Bloco titulo="Contato">
        <Campo
          label="WhatsApp da loja"
          dica="Só números, com 55 e o DDD. Ex.: 5583999998888. É para onde vão todos os botões do site."
        >
          <input
            name="whatsapp"
            inputMode="numeric"
            defaultValue={settings.whatsapp}
            placeholder="5583999998888"
            className={inputCls}
          />
        </Campo>

        <Campo label="Instagram" dica="Só o @ da loja, sem link.">
          <input
            name="instagram"
            defaultValue={settings.instagram}
            placeholder="resenhafcmantos"
            className={inputCls}
          />
        </Campo>
      </Bloco>

      <Bloco titulo="Atendimento">
        <Campo label="Horário escrito" dica="Como aparece no site.">
          <input
            name="horario"
            defaultValue={settings.hours}
            className={inputCls}
          />
        </Campo>

        <div className="grid gap-4 sm:grid-cols-2">
          <Campo label="Abre às" dica="Hora cheia, 0 a 23.">
            <input
              name="abre_hora"
              type="number"
              min={0}
              max={23}
              defaultValue={settings.openFrom}
              className={inputCls}
            />
          </Campo>
          <Campo label="Fecha às">
            <input
              name="fecha_hora"
              type="number"
              min={0}
              max={23}
              defaultValue={settings.openTo}
              className={inputCls}
            />
          </Campo>
        </div>

        <div>
          <span className="mb-2 block text-[13px] font-bold">
            Dias que a loja atende
          </span>
          <div className="flex flex-wrap gap-2">
            {DIAS.map((d) => (
              <label
                key={d.v}
                className="flex cursor-pointer items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-[13px] font-semibold transition hover:border-ink"
              >
                <input
                  type="checkbox"
                  name="dias_abertos"
                  value={d.v}
                  defaultChecked={settings.openDays.includes(d.v)}
                  className="h-4 w-4 accent-[#0e0e0e]"
                />
                {d.label}
              </label>
            ))}
          </div>
          <p className="mt-2 text-[12px] text-ink-soft">
            Fora desses dias e horários, o site troca “Aberto agora” pelo
            horário de atendimento.
          </p>
        </div>
      </Bloco>

      <Bloco titulo="Textos do site">
        <Campo label="Nome da loja">
          <input
            name="nome_loja"
            defaultValue={settings.storeName}
            className={inputCls}
          />
        </Campo>

        <Campo
          label="Faixa preta do topo"
          dica="Uma frase por linha. Elas ficam rolando no topo."
        >
          <textarea
            name="frase_topo"
            rows={3}
            defaultValue={settings.marquee.join("\n")}
            className={inputCls}
          />
        </Campo>

        <Campo
          label="Frete (R$)"
          dica="Somado a todo pedido no pagamento online. Deixe 0 para frete grátis."
        >
          <input
            name="frete"
            inputMode="decimal"
            defaultValue={(settings.shippingCents / 100).toFixed(2).replace(".", ",")}
            className={inputCls}
          />
        </Campo>

        <Campo
          label="Desconto geral da loja (%)"
          dica="Vale para todo produto. 10 = 10% off. Deixe 0 para desligar."
        >
          <input
            name="desconto"
            inputMode="decimal"
            defaultValue={String(settings.discountPercent).replace(".", ",")}
            className={inputCls}
          />
        </Campo>

        <Campo label="Formas de pagamento" dica="Uma por linha.">
          <textarea
            name="pagamentos"
            rows={2}
            defaultValue={settings.payments.join("\n")}
            className={inputCls}
          />
        </Campo>
      </Bloco>

      <Salvar />
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-ink";

function Salvar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-ink px-7 py-3 text-[13px] font-bold text-white transition hover:bg-ink/85 disabled:opacity-50"
    >
      {pending ? "Salvando…" : "Salvar configurações"}
    </button>
  );
}

function Bloco({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5">
      <h2 className="mb-4 text-[13px] font-bold tracking-[0.1em] text-ink-soft">
        {titulo.toUpperCase()}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Campo({
  label,
  dica,
  children,
}: {
  label: string;
  dica?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-bold">{label}</span>
      {children}
      {dica && <span className="mt-1.5 block text-[12px] text-ink-soft">{dica}</span>}
    </label>
  );
}
