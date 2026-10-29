import "server-only"
import { createClient } from "@supabase/supabase-js"
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env"

/** Cliente anônimo, sem cookies: lê somente o que a RLS libera ao público (pode ser cacheado). */
export function createPublicClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
