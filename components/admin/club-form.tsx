"use client";

import Link from "next/link";
import { useActionState } from "react";
import { PATTERNS, type Club, type League } from "@/lib/clubs";
import { excluirTime, salvarTime, type ActionState } from "@/app/admin/actions";
import { ImageUpload } from "./image-upload";
import { Bloco, Campo, Cor, Erro, Excluir, Marcar, Salvar, inputCls } from "./form-ui";

export function ClubForm({ time, ligas }: { time?: Club; ligas: League[] }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    salvarTime,
    null,
  );

  return (
    <>
      <form action={formAction} className="max-w-2xl space-y-7">
        {time && <input type="hidden" name="id_atual" value={time.id} />}
        <Erro msg={state?.erro} />

        <Bloco titulo="Escudo do time">
          <ImageUpload name="logo_url" valorInicial={time?.logo ?? ""} />
          <p className="text-[12px] text-ink-soft">
            PNG com fundo transparente fica melhor. Sem escudo, o site usa um
            quadrado com as duas cores do time.
          </p>
        </Bloco>

        <Bloco titulo="Identificação">
          <Campo label="Nome do time">
            <input name="nome" required defaultValue={time?.name ?? ""} className={inputCls} />
          </Campo>

          <Campo
            label="Endereço no site (slug)"
            dica={
              time
                ? "Mudar aqui muda o link /time/… e atualiza os produtos automaticamente."
                : "Deixe vazio para gerar a partir do nome."
            }
          >
            <input
              name="id"
              defaultValue={time?.id ?? ""}
              placeholder="flamengo"
              className={inputCls}
            />
          </Campo>

          <div className="grid gap-4 sm:grid-cols-2">
            <Campo label="Liga">
              <select name="liga" defaultValue={time?.league ?? ""} className={inputCls}>
                <option value="">— nenhuma —</option>
                {ligas.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </Campo>
            <Campo label="Ordem" dica="Menor número aparece primeiro.">
              <input
                name="ordem"
                type="number"
                defaultValue={time?.order ?? 0}
                className={inputCls}
              />
            </Campo>
          </div>
        </Bloco>

        <Bloco titulo="Manto desenhado">
          <p className="text-[12px] text-ink-soft">
            Usado quando o produto não tem foto cadastrada.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <Cor name="cor1" label="Cor principal" valor={time?.colors[0] ?? "#121212"} />
            <Cor name="cor2" label="Cor secundária" valor={time?.colors[1] ?? "#e3ff00"} />
            <Campo label="Padrão">
              <select name="padrao" defaultValue={time?.pattern ?? "solid"} className={inputCls}>
                {PATTERNS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </Campo>
          </div>
        </Bloco>

        <Bloco titulo="Situação">
          <div className="space-y-3">
            <Marcar
              name="ativo"
              defaultChecked={time?.active ?? true}
              titulo="Vendo esse time"
              texto="Desmarque e o time some do site inteiro, sem apagar o cadastro."
            />
            <Marcar
              name="destaque"
              defaultChecked={time?.featured ?? false}
              titulo="Vitrine na home"
              texto="Cria um trilho só com os produtos desse time na página inicial."
            />
          </div>
        </Bloco>

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
          <Salvar label="Salvar time" />
          <Link
            href="/admin/times"
            className="rounded-full border border-line px-6 py-3 text-[13px] font-bold transition hover:border-ink"
          >
            Cancelar
          </Link>
        </div>
      </form>

      {time && (
        <Excluir
          action={excluirTime}
          id={time.id}
          titulo="Excluir time"
          texto="Se houver produtos ligados a ele, prefira desmarcar “Vendo esse time”."
        />
      )}
    </>
  );
}
