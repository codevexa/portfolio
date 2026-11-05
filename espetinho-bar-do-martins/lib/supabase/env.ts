export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

/** Sem estas variáveis o site mostra o cardápio inicial em modo somente leitura e o painel fica desativado. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

export const IMAGE_BUCKET = "menu-images"
