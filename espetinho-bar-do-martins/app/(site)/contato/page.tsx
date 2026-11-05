import type { Metadata } from "next"
import { Clock, MapPin, Navigation, Phone } from "lucide-react"
import { HoursList } from "@/components/site/hours"
import { RestaurantJsonLd } from "@/components/site/json-ld"
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "@/components/ui/icons"
import { getSettings } from "@/lib/data"
import { fullAddress, mapsLink } from "@/lib/maps"
import { whatsappLink } from "@/lib/whatsapp"

export const metadata: Metadata = {
  title: "Contato e localização",
  description: "Fale com o Espetinho Bar do Martins pelo WhatsApp, veja o horário de funcionamento e como chegar em Porto Alegre.",
  alternates: { canonical: "/contato" },
}

export default async function ContactPage() {
  const settings = await getSettings()
  const maps = mapsLink(settings)
  const hasAddress = settings.addressConfirmed && !!settings.addressLine
  const mapEmbed = hasAddress
    ? `https://www.google.com/maps?q=${encodeURIComponent(settings.mapsQuery?.trim() || `${settings.businessName}, ${fullAddress(settings)}`)}&output=embed`
    : null

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20">
      <RestaurantJsonLd settings={settings} />
      <header className="py-10 sm:py-14">
        <p className="eyebrow">Contato</p>
        <h1 className="section-title text-5xl sm:text-6xl">
          Fale com a <span className="text-gold-gradient">gente</span>
        </h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <section className="card-surface flex flex-col gap-4 p-6" aria-labelledby="c-whats">
            <h2 id="c-whats" className="section-title flex items-center gap-2 text-2xl">
              <WhatsAppIcon className="h-6 w-6 text-[#3ccf6e]" /> WhatsApp
            </h2>
            <p className="text-2xl font-bold">{settings.phoneDisplay}</p>
            {settings.serviceMessage && <p className="text-fumaca">{settings.serviceMessage}</p>}
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappLink(settings.whatsappNumber, `Olá! Vim pelo site do ${settings.businessName}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                <WhatsAppIcon className="h-5 w-5" /> Conversar no WhatsApp
              </a>
              <a href={`tel:+${settings.whatsappNumber}`} className="btn btn-ghost">
                <Phone className="h-5 w-5" /> Ligar
              </a>
            </div>
          </section>

          <section className="card-surface flex flex-col gap-4 p-6" aria-labelledby="c-hours">
            <h2 id="c-hours" className="section-title flex items-center gap-2 text-2xl">
              <Clock className="h-6 w-6 text-ouro" /> Horário de funcionamento
            </h2>
            <HoursList hours={settings.openingHours} />
          </section>

          {(settings.instagramUrl || settings.facebookUrl) && (
            <section className="card-surface flex flex-col gap-4 p-6" aria-labelledby="c-social">
              <h2 id="c-social" className="section-title text-2xl">Redes sociais</h2>
              <div className="flex flex-wrap gap-3">
                {settings.instagramUrl && (
                  <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                    <InstagramIcon className="h-5 w-5" /> Instagram
                  </a>
                )}
                {settings.facebookUrl && (
                  <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                    <FacebookIcon className="h-5 w-5" /> Facebook
                  </a>
                )}
              </div>
            </section>
          )}
        </div>

        <section className="card-surface flex flex-col gap-4 overflow-hidden p-6" aria-labelledby="c-local">
          <h2 id="c-local" className="section-title flex items-center gap-2 text-2xl">
            <MapPin className="h-6 w-6 text-ouro" /> Localização
          </h2>
          {hasAddress ? (
            <>
              <p className="text-lg">{fullAddress(settings)}</p>
              {mapEmbed && (
                <iframe
                  title={`Mapa: ${settings.businessName}`}
                  src={mapEmbed}
                  className="aspect-[4/3] w-full rounded-2xl border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              )}
              {maps && (
                <a href={maps} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
                  <Navigation className="h-5 w-5" /> Como chegar
                </a>
              )}
            </>
          ) : (
            <>
              <p className="text-lg">
                {settings.city} - {settings.state}
              </p>
              <p className="text-fumaca">Para saber o endereço completo, fale com a gente pelo WhatsApp.</p>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
