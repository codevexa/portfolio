import type { Metadata } from "next"
import { SettingsForm } from "@/components/admin/settings-form"
import { requireAdmin } from "@/lib/admin/auth"
import { getAdminSettings } from "@/lib/admin/catalog"

export const metadata: Metadata = { title: "Configurações" }

export default async function SettingsAdmin() {
  const session = await requireAdmin()
  const settings = await getAdminSettings(session)
  return (
    <div className="flex flex-col gap-6">
      <h1 className="section-title text-4xl">Configurações</h1>
      {settings ? (
        <SettingsForm settings={settings} />
      ) : (
        <p className="card-surface p-5">
          A linha de configurações ainda não existe no banco. Aplique a migration de carga inicial (veja o README).
        </p>
      )}
    </div>
  )
}
