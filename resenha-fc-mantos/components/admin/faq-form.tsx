"use client";

import { useActionState } from "react";
import type { Pergunta } from "@/lib/texts";
import {
  excluirPergunta,
  salvarPergunta,
  type ActionState,
} from "@/app/admin/actions";
import { Erro, Ok, Salvar, inputCls } from "./form-ui";

export function FaqForm({ item }: { item?: Pergunta }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    salvarPergunta,
    null,
  );

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <form action={formAction} className="space-y-4">
        {item && <input type="hidden" name="id" value={item.id} />}
        <Erro msg={state?.erro} />
        <Ok msg={state?.ok} />

        <label className="block">
          <span className="mb-1.5 block text-[13px] font-bold">Pergunta</span>
          <input
            name="pergunta"
            required
            defaultValue={item?.pergunta ?? ""}
            placeholder="Qual o prazo de entrega?"
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[13px] font-bold">Resposta</span>
          <textarea
            name="resposta"
            required
            rows={4}
            defaultValue={item?.resposta ?? ""}
            className={inputCls}
          />
          <span className="mt-1.5 block text-[12px] text-ink-soft">
            Use {"{pagamentos}"} para listar as formas de pagamento das
            Configurações.
          </span>
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold">Ordem</span>
            <input
              name="ordem"
              type="number"
              defaultValue={item?.ordem ?? 0}
              className={inputCls}
            />
          </label>
          <label className="flex cursor-pointer items-center gap-2 self-end rounded-xl border border-line px-4 py-3">
            <input
              type="checkbox"
              name="ativo"
              defaultChecked={item?.ativo ?? true}
              className="h-4 w-4 accent-[#0e0e0e]"
            />
            <span className="text-[13px] font-bold">No ar</span>
          </label>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <Salvar label={item ? "Salvar" : "Criar pergunta"} />
          {item && (
            <button
              type="submit"
              formAction={excluirPergunta}
              name="id"
              value={item.id}
              className="rounded-full border border-red-200 px-5 py-2.5 text-[12px] font-bold text-red-700 transition hover:bg-red-50"
            >
              Excluir
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
