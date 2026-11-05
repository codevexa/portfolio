import "server-only"
import { redirect } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { createSessionClient } from "@/lib/supabase/server"

type SessionClient = Awaited<ReturnType<typeof createSessionClient>>
export type AdminSession = { supabase: SessionClient; user: User }

/** Usuário logado E cadastrado na tabela admins. Confere no servidor do Supabase (getUser), não só no cookie. */
export async function getAdmin(): Promise<AdminSession | null> {
  if (!isSupabaseConfigured) return null
  const supabase = await createSessionClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return null
  const { data: isAdmin, error: rpcError } = await supabase.rpc("is_admin")
  if (rpcError || isAdmin !== true) return null
  return { supabase, user: data.user }
}

/** Para páginas do painel: sem acesso, volta para o login. */
export async function requireAdmin(): Promise<AdminSession> {
  const admin = await getAdmin()
  if (!admin) redirect("/admin/login")
  return admin
}
