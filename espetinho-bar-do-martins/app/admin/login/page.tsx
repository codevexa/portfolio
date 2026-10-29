import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { BrandMark } from "@/components/ui/icons"
import { getAdmin } from "@/lib/admin/auth"
import { LoginForm } from "./login-form"

export const metadata: Metadata = { title: "Entrar" }

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin")
  return (
    <div className="bg-wood flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="card-surface w-full max-w-sm p-6 sm:p-8">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <BrandMark className="h-16 w-16" />
          <h1 className="section-title text-3xl">Painel do Martins</h1>
          <p className="text-sm text-fumaca">Acesso restrito aos administradores.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
