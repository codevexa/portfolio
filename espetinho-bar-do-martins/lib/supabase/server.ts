import "server-only"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env"

/** Cliente com a sessão do usuário logado: toda gravação passa pela RLS do banco. */
export async function createSessionClient() {
  const cookieStore = await cookies()
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          for (const { name, value, options } of toSet) cookieStore.set(name, value, options)
        } catch {
          // Chamado durante a renderização de Server Component: o proxy renova a sessão.
        }
      },
    },
  })
}
