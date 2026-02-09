import type { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const metadata: Metadata = {
  title: 'Kontakt - ARMAGEDON',
  description: 'Skontaktuj się z zespołem weselnym ARMAGEDON',
}

export default async function KontaktPage() {
  const payload = await getPayload({ config: configPromise })
  const contactPage = await payload.findGlobal({ slug: 'contact-page' })

  const heading = contactPage?.heading ?? 'Kontakt'
  const subheading = contactPage?.subheading ?? 'Masz pytania? Chętnie na nie odpowiemy!'
  const contactInfoHeading = contactPage?.contactInfoHeading ?? 'Dane kontaktowe'
  const phonePrimary = contactPage?.phonePrimary ?? 'Agnieszka Gołda: 512 369 305'
  const phoneSecondary = contactPage?.phoneSecondary ?? 'Biuro: 505 566 007'
  const email = contactPage?.email ?? 'kontakt@armagedon.com.pl'
  const address = contactPage?.address ?? 'Śląsk, Polska'
  const addressDescription = contactPage?.addressDescription ?? 'Obsługujemy całe województwo śląskie i okolice'
  const hoursWeekday = contactPage?.hoursWeekday ?? 'Pon-Pt: 9:00 - 18:00'
  const hoursWeekend = contactPage?.hoursWeekend ?? 'Sob-Ndz: 10:00 - 16:00'
  const mapUrl = contactPage?.mapUrl ?? 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12372.924054466643!2d19.192822397489532!3d50.895465545454414!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4710b2527c41f9df%3A0xc08840d180fb21c1!2sArmagedon%20-%20zesp%C3%B3%C5%82%20muzyczny%20na%20wesele!5e1!3m2!1spl!2spl!4v1770404374297!5m2!1spl!2spl'
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <h1 className="font-heading text-3xl md:text-4xl text-primary font-bold text-center">
        {heading}
      </h1>
      <p className="text-muted-foreground text-center mt-2 mb-16">
        {subheading}
      </p>

      <div className="max-w-2xl mx-auto">
          <h2 className="font-heading text-2xl text-primary font-bold mb-6">{contactInfoHeading}</h2>

          <div className="space-y-4">
            <Card className="p-4">
              <CardContent className="p-0 flex items-center gap-4">
                <Phone className="text-primary" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Telefon</p>
                  <p className="text-foreground font-medium">{phonePrimary}</p>
                  <p className="text-sm text-muted-foreground">{phoneSecondary}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-4">
              <CardContent className="p-0 flex items-center gap-4">
                <Mail className="text-primary" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">E-mail</p>
                  <p className="text-foreground font-medium">{email}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-4">
              <CardContent className="p-0 flex items-center gap-4">
                <MapPin className="text-primary" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Adres</p>
                  <p className="text-foreground font-medium">{address}</p>
                  <p className="text-sm text-muted-foreground">
                    {addressDescription}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-4">
              <CardContent className="p-0 flex items-center gap-4">
                <Clock className="text-primary" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Godziny kontaktu</p>
                  <p className="text-foreground font-medium">{hoursWeekday}</p>
                  <p className="text-sm text-muted-foreground">{hoursWeekend}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <div className="rounded-lg overflow-hidden border border-border h-64">
              <iframe
                src={mapUrl}
                width="600"
                height="450"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
    </div>
  )
}
