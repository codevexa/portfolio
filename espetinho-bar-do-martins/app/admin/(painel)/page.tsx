import type { Metadata } from "next"
import Link from "next/link"
import { Eye, LayoutGrid, Plus, Settings, Tags, TriangleAlert } from "lucide-react"
import { getAdminCatalog, getAdminSettings } from "@/lib/admin/catalog"
import { requireAdmin } from "@/lib/admin/auth"
import { isIllustration } from "@/lib/images"

export const metadata: Metadata = { title: "Visão geral" }

export default async function AdminHome() {
  const session = await requireAdmin()
  const [catalog, settings] = await Promise.all([getAdminCatalog(session), getAdminSettings(session)])
  const active = catalog.products.filter((p) => p.isActive)
  const unavailable = catalog.products.filter((p) => p.isActive && !p.isAvailable)
  const illustrated = catalog.products.filter((p) => isIllustration(p.imagePath) || !p.imagePath)
  const specials = catalog.products.filter((p) => p.slug.startsWith("espetinho-maionese-verde") && !p.details)

  const pending: Array<{ text: string; href: string }> = []
  if (!settings) pending.push({ text: "Configurações não encontradas: aplique a carga inicial do banco (README).", href: "/admin/configuracoes" })
  if (settings && !settings.addressConfirmed) pending.push({ text: "Confirme o endereço com o estabelecimento para ativar o botão “Como chegar”.", href: "/admin/configuracoes#endereco" })
  if (settings && !settings.deliveryEnabled) pending.push({ text: "Entrega desativada: só “Retirada” aparece no pedido. Ative se o estabelecimento entrega.", href: "/admin/configuracoes#pedidos" })
  if (settings?.deliveryEnabled && settings.deliveryFeeCents === null) pending.push({ text: "Entrega ativa sem taxa cadastrada: o pedido mostra “taxa a confirmar”.", href: "/admin/configuracoes#pedidos" })
  if (settings && !settings.instagramUrl && !settings.facebookUrl) pending.push({ text: "Cadastre os links das redes sociais.", href: "/admin/configuracoes#redes" })
  if (illustrated.length) pending.push({ text: `${illustrated.length} produto(s) ainda usam ilustração provisória. Envie as fotos reais.`, href: "/admin/produtos" })
  for (const p of specials) pending.push({ text: `Complete a descrição de “${p.name}” (tipo de carne).`, href: `/admin/produtos/${p.id}` })

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="section-title text-4xl">Visão geral</h1>
        <p className="text-fumaca">Gerencie o cardápio e as informações do estabelecimento.</p>
      </div>

      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Produtos no cardápio", active.length],
          ["Indisponíveis agora", unavailable.length],
          ["Categorias", catalog.categories.length],
          ["Ocultos", catalog.products.length - active.length],
        ].map(([label, value]) => (
          <div key={label} className="card-surface p-4">
            <dt className="text-sm text-fumaca">{label}</dt>
            <dd className="font-display text-4xl text-ambar">{value}</dd>
          </div>
        ))}
      </dl>

      {pending.length > 0 && (
        <section className="card-surface p-5" aria-labelledby="pendencias">
          <h2 id="pendencias" className="mb-3 flex items-center gap-2 font-display text-xl uppercase">
            <TriangleAlert className="h-5 w-5 text-ouro" /> Pendências antes de divulgar
          </h2>
          <ul className="flex flex-col gap-2">
            {pending.map((p) => (
              <li key={p.text}>
                <Link href={p.href} className="block rounded-xl bg-carvao/50 px-4 py-3 hover:bg-carvao/80">
                  {p.text}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { href: "/admin/produtos/novo", label: "Novo produto", icon: Plus },
          { href: "/admin/produtos", label: "Produtos e preços", icon: LayoutGrid },
          { href: "/admin/categorias", label: "Categorias", icon: Tags },
          { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
          { href: "/admin/previa", label: "Prévia do cardápio", icon: Eye },
        ].map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="card-surface flex min-h-20 items-center gap-3 p-4 font-semibold hover:border-ouro/50">
            <Icon className="h-6 w-6 text-ouro" /> {label}
          </Link>
        ))}
      </div>
    </div>
  )
}
