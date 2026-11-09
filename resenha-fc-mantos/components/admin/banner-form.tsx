"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { Banner } from "@/lib/db";
import { excluirBanner, salvarBanner, type ActionState } from "@/app/admin/actions";
import { ImageUpload } from "./image-upload";
import { Bloco, Campo, Cor, Erro, Excluir, Marcar, Salvar, inputCls } from "./form-ui";

export function BannerForm({ banner }: { banner?: Banner }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    salvarBanner,
    null,
  );

  return (
    <>
      <form action={formAction} className="max-w-2xl space-y-7">
        {banner && <input type="hidden" name="id" value={banner.id} />}
        <Erro msg={state?.erro} />

        <Bloco titulo="Imagem de fundo">
          <ImageUpload name="imagem_url" valorInicial={banner?.image ?? ""} />
          <p className="text-[12px] text-ink-soft">
            Opcional. Sem imagem, o banner usa só as cores. Use fotos largas
            (ex.: 1600×700).
          </p>
        </Bloco>

        <Bloco titulo="Textos">
          <Campo label="Etiqueta" dica="A tag pequena em cima do título. Opcional.">
            <input
              name="etiqueta"
              defaultValue={banner?.eyebrow ?? ""}
              placeholder="Pronta entrega"
              className={inputCls}
            />
          </Campo>

          <Campo label="Título">
            <input
              name="titulo"
              required
              defaultValue={banner?.title ?? ""}
              placeholder="O manto chega antes do próximo jogo"
              className={inputCls}
            />
          </Campo>

          <Campo label="Texto de apoio">
            <textarea
              name="texto"
              rows={3}
              defaultValue={banner?.text ?? ""}
              className={inputCls}
            />
          </Campo>
        </Bloco>

        <Bloco titulo="Botão">
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo label="Texto do botão" dica="Vazio esconde o botão.">
              <input
                name="cta_texto"
                defaultValue={banner?.ctaLabel ?? ""}
                placeholder="Ver pronta entrega"
                className={inputCls}
              />
            </Campo>
            <Campo label="Link" dica="Ex.: /pronta-entrega ou /time/flamengo">
              <input
                name="cta_link"
                defaultValue={banner?.ctaHref ?? "/pronta-entrega"}
                className={inputCls}
              />
            </Campo>
          </div>
        </Bloco>

        <Bloco titulo="Cores e ordem">
          <div className="grid gap-4 sm:grid-cols-3">
            <Cor name="cor_fundo" label="Fundo" valor={banner?.from ?? "#0b0b0b"} />
            <Cor name="cor_destaque" label="Destaque" valor={banner?.to ?? "#e3ff00"} />
            <Campo label="Ordem">
              <input
                name="ordem"
                type="number"
                defaultValue={banner?.order ?? 0}
                className={inputCls}
              />
            </Campo>
          </div>
          <Marcar
            name="ativo"
            defaultChecked={banner?.active ?? true}
            titulo="Publicado"
            texto="Desmarque para tirar do carrossel sem apagar."
          />
        </Bloco>

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
          <Salvar label="Salvar banner" />
          <Link
            href="/admin/banners"
            className="rounded-full border border-line px-6 py-3 text-[13px] font-bold transition hover:border-ink"
          >
            Cancelar
          </Link>
        </div>
      </form>

      {banner && (
        <Excluir
          action={excluirBanner}
          id={banner.id}
          titulo="Excluir banner"
          texto="Some do carrossel para sempre."
        />
      )}
    </>
  );
}
