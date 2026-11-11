import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Cliente com a service role key. SÓ no servidor: ele ignora as regras de
 * RLS e enxerga tudo. Nunca importe isto em componente de cliente.
 *
 * A chave vive em SUPABASE_SERVICE_ROLE_KEY, variável privada da Vercel —
 * sem NEXT_PUBLIC_, para o Next nunca mandá-la para o navegador.
 */
export function createAdminClient() {
  const url =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  if (!url || !key) {
    throw new Error(
      "Faltam SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY nas variáveis de ambiente.",
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Diz se o servidor está configurado, sem revelar nada da chave. */
export const temServiceRole = () =>
  Boolean(
    (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
