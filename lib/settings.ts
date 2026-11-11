import "server-only";
import { cache } from "react";
import { createPublicClient } from "./supabase/server";
import { defaultSettings, type StoreSettings } from "./site";

export type SettingsRow = {
  nome_loja: string;
  whatsapp: string;
  instagram: string;
  horario: string;
  abre_hora: number;
  fecha_hora: number;
  dias_abertos: number[];
  frase_topo: string[];
  pagamentos: string[];
  frete_centavos: number | null;
};

export const getSettings = cache(async (): Promise<StoreSettings> => {
  const { data, error } = await createPublicClient()
    .from("settings")
    .select(
      "nome_loja,whatsapp,instagram,horario,abre_hora,fecha_hora,dias_abertos,frase_topo,pagamentos,frete_centavos",
    )
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) return defaultSettings;
  const r = data as SettingsRow;

  return {
    storeName: r.nome_loja || defaultSettings.storeName,
    whatsapp: r.whatsapp ?? "",
    instagram: r.instagram ?? "",
    hours: r.horario || defaultSettings.hours,
    openFrom: r.abre_hora ?? defaultSettings.openFrom,
    openTo: r.fecha_hora ?? defaultSettings.openTo,
    openDays: r.dias_abertos?.length ? r.dias_abertos : defaultSettings.openDays,
    marquee: r.frase_topo?.length ? r.frase_topo : defaultSettings.marquee,
    payments: r.pagamentos?.length ? r.pagamentos : defaultSettings.payments,
    shippingCents: Math.max(0, Number(r.frete_centavos ?? 0)) || 0,
  };
});
