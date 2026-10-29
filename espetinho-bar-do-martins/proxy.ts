import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

/**
 * Renova a sessão do Supabase nas rotas do painel e manda quem não está logado para o login.
 * É só a primeira barreira: cada página e cada ação do painel confere de novo se o usuário é
 * administrador, e o banco confere mais uma vez pela RLS.
 */
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return NextResponse.next()

  let response = NextResponse.next({ request })
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        for (const { name, value } of toSet) request.cookies.set(name, value)
        response = NextResponse.next({ request })
        for (const { name, value, options } of toSet) response.cookies.set(name, value, options)
      },
    },
  })
  const { data } = await supabase.auth.getUser()

  const isLogin = request.nextUrl.pathname === "/admin/login"
  if (!data.user && !isLogin) {
    const login = request.nextUrl.clone()
    login.pathname = "/admin/login"
    login.search = ""
    return NextResponse.redirect(login)
  }
  return response
}

export const config = {
  matcher: ["/admin/:path*"],
}
