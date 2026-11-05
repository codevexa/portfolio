import Link from "next/link"
import { MapPin, Phone } from "lucide-react"
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "@/components/ui/icons"
import { fullAddress, mapsLink } from "@/lib/maps"
import type { Settings } from "@/lib/menu/types"
import { whatsappLink } from "@/lib/whatsapp"
import { HoursList } from "./hours"
import { Logo } from "./logo"

export function Footer({ settings }: { settings: Settings }) {
  const maps = mapsLink(settings)
  return (
    <footer className="bg-wood border-t border-ouro/15 pb-28 md:pb-10">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Logo name={settings.businessName} logoPath={settings.logoPath} />
          <p className="text-sm text-fumaca">Espetinhos na brasa, carnes assadas e cachurrascos em {settings.city} - {settings.state}.</p>
          <div className="flex gap-2">
            {settings.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-11 w-11 place-items-center rounded-full border border-creme/20 hover:border-ouro hover:text-ambar">
                <InstagramIcon className="h-5 w-5" />
              </a>
            )}
            {settings.facebookUrl && (
              <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid h-11 w-11 place-items-center rounded-full border border-creme/20 hover:border-ouro hover:text-ambar">
                <FacebookIcon className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h2 className="section-title mb-3 text-lg text-ambar">Navegação</h2>
          <ul className="flex flex-col gap-1">
            {[
              ["/", "Início"],
              ["/cardapio", "Cardápio"],
              ["/#sobre", "Sobre nós"],
              ["/contato", "Contato e localização"],
              ["/carrinho", "Meu pedido"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="inline-block py-1.5 text-creme/85 hover:text-ambar">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="section-title mb-3 text-lg text-ambar">Contato</h2>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <a href={whatsappLink(settings.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-ambar">
                <WhatsAppIcon className="h-4 w-4 text-[#3ccf6e]" /> {settings.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`tel:+${settings.whatsappNumber}`} className="flex items-center gap-2 hover:text-ambar">
                <Phone className="h-4 w-4 text-ouro" /> Ligar
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ouro" />
              {settings.addressConfirmed && settings.addressLine ? (
                maps ? (
                  <a href={maps} target="_blank" rel="noopener noreferrer" className="hover:text-ambar">
                    {fullAddress(settings)}
                  </a>
                ) : (
                  fullAddress(settings)
                )
              ) : (
                <span>
                  {settings.city} - {settings.state}
                  <span className="block text-fumaca">Endereço completo pelo WhatsApp.</span>
                </span>
              )}
            </li>
          </ul>
        </div>

        <div>
          <h2 className="section-title mb-3 text-lg text-ambar">Horário</h2>
          <div className="text-sm">
            <HoursList hours={settings.openingHours} showStatus={false} />
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-2 border-t border-creme/10 px-4 pt-6 text-xs text-fumaca sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} {settings.businessName}. Todos os direitos reservados.</p>
        <p>Pedidos confirmados somente após resposta do estabelecimento no WhatsApp.</p>
      </div>
    </footer>
  )
}
