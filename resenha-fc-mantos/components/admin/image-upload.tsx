"use client";

import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ImageUpload({
  name = "foto_url",
  valorInicial = "",
}: {
  name?: string;
  valorInicial?: string;
}) {
  const [url, setUrl] = useState(valorInicial);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function enviar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setErro("Foto muito pesada. O limite é 8 MB.");
      return;
    }

    setErro(null);
    setEnviando(true);

    const supabase = createClient();
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const caminho = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage
      .from("produtos")
      .upload(caminho, file, { cacheControl: "31536000", upsert: false });

    if (error) {
      setErro(error.message);
      setEnviando(false);
      return;
    }

    const { data } = supabase.storage.from("produtos").getPublicUrl(caminho);
    setUrl(data.publicUrl);
    setEnviando(false);
  }

  return (
    <div>
      <input type="hidden" name={name} value={url} />

      <div className="flex items-center gap-4">
        <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl border border-line bg-surface p-2">
          {url ? (
            <Image
              src={url}
              alt="Prévia"
              width={96}
              height={96}
              className="h-full w-full object-contain"
              unoptimized
            />
          ) : (
            <span className="px-2 text-center text-[11px] text-ink-soft">
              sem foto
            </span>
          )}
        </div>

        <div className="flex-1">
          <label className="inline-block cursor-pointer rounded-full border border-line bg-white px-5 py-2.5 text-[13px] font-bold transition hover:border-ink">
            {enviando ? "Enviando…" : url ? "Trocar foto" : "Escolher foto"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={enviar}
              disabled={enviando}
              className="hidden"
            />
          </label>

          {url && (
            <button
              type="button"
              onClick={() => setUrl("")}
              className="ml-2 rounded-full px-4 py-2.5 text-[13px] font-semibold text-ink-soft transition hover:text-ink"
            >
              Remover
            </button>
          )}

          <p className="mt-2 text-[12px] text-ink-soft">
            JPG, PNG ou WEBP, até 8 MB. Sem foto, o site desenha o manto nas
            cores do time.
          </p>
          {erro && (
            <p className="mt-2 text-[12px] font-semibold text-red-700">{erro}</p>
          )}
        </div>
      </div>
    </div>
  );
}
