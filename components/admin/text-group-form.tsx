"use client";

import { useActionState } from "react";
import { TEXTOS_PADRAO, type GrupoTexto } from "@/lib/texts";
import { salvarTextos, type ActionState } from "@/app/admin/actions";
import { Erro, Ok, Salvar, inputCls } from "./form-ui";

export function TextGroupForm({
  grupo,
  valores,
}: {
  grupo: GrupoTexto;
  valores: Record<string, string>;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    salvarTextos,
    null,
  );

  return (
    <section
      id={grupo.id}
      className="scroll-mt-24 rounded-2xl border border-line bg-white p-5"
    >
      <h2 className="text-[15px] font-extrabold tracking-tight">
        {grupo.titulo}
      </h2>
      <p className="mb-5 mt-1 text-[13px] text-ink-soft">{grupo.dica}</p>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="grupo" value={grupo.titulo} />
        <Erro msg={state?.erro} />
        <Ok msg={state?.ok} />

        {grupo.campos.map((c) => {
          const atual = valores[c.chave] ?? TEXTOS_PADRAO[c.chave];
          const mudado = atual !== TEXTOS_PADRAO[c.chave];
          return (
            <label key={c.chave} className="block">
              <span className="mb-1.5 flex flex-wrap items-center gap-2 text-[13px] font-bold">
                {c.label}
                {mudado && (
                  <span className="rounded-full bg-brand/30 px-2 py-0.5 text-[10px] font-bold tracking-wide text-ink">
                    EDITADO
                  </span>
                )}
              </span>
              <input type="hidden" name="chave" value={c.chave} />
              {c.longo ? (
                <textarea
                  name={`t:${c.chave}`}
                  rows={4}
                  defaultValue={atual}
                  placeholder={TEXTOS_PADRAO[c.chave]}
                  className={inputCls}
                />
              ) : (
                <input
                  name={`t:${c.chave}`}
                  defaultValue={atual}
                  placeholder={TEXTOS_PADRAO[c.chave]}
                  className={inputCls}
                />
              )}
            </label>
          );
        })}

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Salvar label="Salvar este bloco" />
          <span className="text-[12px] text-ink-soft">
            Apague o campo e salve para voltar ao texto original.
          </span>
        </div>
      </form>
    </section>
  );
}
