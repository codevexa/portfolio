"use client";

import { useActionState } from "react";
import type { League } from "@/lib/clubs";
import { excluirLiga, salvarLiga, type ActionState } from "@/app/admin/actions";
import { Cor, Erro, Ok, Salvar, inputCls } from "./form-ui";

export function LeagueForm({ liga }: { liga?: League }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    salvarLiga,
    null,
  );

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <form action={formAction} className="space-y-4">
        {liga && <input type="hidden" name="id_atual" value={liga.id} />}
        <Erro msg={state?.erro} />
        <Ok msg={state?.ok} />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold">Nome</span>
            <input name="nome" required defaultValue={liga?.name ?? ""} className={inputCls} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold">Slug</span>
            <input
              name="id"
              defaultValue={liga?.id ?? ""}
              placeholder="brasileirao"
              className={inputCls}
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-[13px] font-bold">Descrição</span>
          <input
            name="descricao"
            defaultValue={liga?.blurb ?? ""}
            placeholder="Os 20 do Brasil"
            className={inputCls}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-4">
          <Cor name="cor_fundo" label="Fundo do card" valor={liga?.from ?? "#0b0b0b"} />
          <Cor name="cor_destaque" label="Destaque" valor={liga?.to ?? "#e3ff00"} />
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold">Ordem</span>
            <input
              name="ordem"
              type="number"
              defaultValue={liga?.order ?? 0}
              className={inputCls}
            />
          </label>
          <label className="flex cursor-pointer items-center gap-2 self-end rounded-xl border border-line px-4 py-3">
            <input
              type="checkbox"
              name="ativo"
              defaultChecked={liga?.active ?? true}
              className="h-4 w-4 accent-[#0e0e0e]"
            />
            <span className="text-[13px] font-bold">No ar</span>
          </label>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <Salvar label={liga ? "Salvar" : "Criar liga"} />
          {liga && (
            <button
              type="submit"
              formAction={excluirLiga}
              name="id"
              value={liga.id}
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
