import type { Metadata } from 'next'
import { CardContent } from '@/components/ui/card'
import { Phone, Mail, MapPin, Clock, Facebook, CreditCard, FileText } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { AnimateOnScroll } from '@/components/animations/animate-on-scroll'
import { StaggerChildren, StaggerItem } from '@/components/animations/stagger-children'
import { SectionDivider } from '@/components/animations/section-divider'
import { PageTransition } from '@/components/animations/page-transition'
import { alignClass } from '@/lib/textAlign'

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
  const email = contactPage?.email ?? 'zespolarmagedon@gmail.com'
  const address = contactPage?.address ?? 'ul. Jana Pawła II 44, KOŚCIELEC 42-240'
  const addressDescription = contactPage?.addressDescription ?? 'Obsługujemy całe województwo śląskie i okolice'
  const nip = contactPage?.nip ?? '573-239-90-62'
  const bankAccount = contactPage?.bankAccount ?? '63 1140 2004 0000 3602 8225 4870'
  const facebookUrl = contactPage?.facebookUrl ?? 'https://www.facebook.com/armagedon.wesele/'
  const hoursWeekday = contactPage?.hoursWeekday ?? 'Pon-Pt: 9:00 - 18:00'
  const hoursWeekend = contactPage?.hoursWeekend ?? 'Sob-Ndz: 10:00 - 16:00'
  const mapUrl = contactPage?.mapUrl ?? 'https://maps.google.com/maps?q=POLSKA%20KO%C5%9ACIELEC%20JANA%20PAW%C5%81A%20II%2044&t=m&z=13&output=embed&iwloc=near'

  return (
    <PageTransition>
    <div className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">

      <AnimateOnScroll direction="up">
        <h1 className={`font-heading text-3xl md:text-4xl shimmer-gold font-bold whitespace-pre-line ${alignClass(contactPage?.headingAlign as string, 'text-center')}`}>
          {heading}
        </h1>
        <p className={`text-muted-foreground mt-2 mb-16 whitespace-pre-line ${alignClass(contactPage?.subheadingAlign as string, 'text-center')}`}>
          {subheading}
        </p>
      </AnimateOnScroll>

      <div className="max-w-2xl mx-auto">
        <AnimateOnScroll direction="up">
          <h2 className={`font-heading text-2xl text-primary font-bold mb-6 whitespace-pre-line ${alignClass(contactPage?.contactInfoHeadingAlign as string, 'text-left')}`}>{contactInfoHeading}</h2>
        </AnimateOnScroll>

        <StaggerChildren className="space-y-4">
          <StaggerItem>
            <div className="glass-card rounded-xl p-4">
              <CardContent className="p-0 flex items-center gap-4">
                <Phone className="text-primary shrink-0" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Telefon</p>
                  <p className="text-foreground font-medium whitespace-pre-line">{phonePrimary}</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{phoneSecondary}</p>
                </div>
              </CardContent>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="glass-card rounded-xl p-4">
              <CardContent className="p-0 flex items-center gap-4">
                <Mail className="text-primary shrink-0" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">E-mail</p>
                  <p className="text-foreground font-medium">{email}</p>
                </div>
              </CardContent>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="glass-card rounded-xl p-4">
              <CardContent className="p-0 flex items-center gap-4">
                <MapPin className="text-primary shrink-0" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Adres</p>
                  <p className="text-foreground font-medium whitespace-pre-line">{address}</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{addressDescription}</p>
                </div>
              </CardContent>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="glass-card rounded-xl p-4">
              <CardContent className="p-0 flex items-center gap-4">
                <Clock className="text-primary shrink-0" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Godziny kontaktu</p>
                  <p className="text-foreground font-medium whitespace-pre-line">{hoursWeekday}</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{hoursWeekend}</p>
                </div>
              </CardContent>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="glass-card rounded-xl p-4">
              <CardContent className="p-0 flex items-center gap-4">
                <FileText className="text-primary shrink-0" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">NIP</p>
                  <p className="text-foreground font-medium">{nip}</p>
                </div>
              </CardContent>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="glass-card rounded-xl p-4">
              <CardContent className="p-0 flex items-center gap-4">
                <CreditCard className="text-primary shrink-0" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Konto bankowe (m-bank)</p>
                  <p className="text-foreground font-medium">{bankAccount}</p>
                </div>
              </CardContent>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="glass-card rounded-xl p-4">
              <CardContent className="p-0 flex items-center gap-4">
                <Facebook className="text-primary shrink-0" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Facebook</p>
                  <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                    facebook.com/armagedon.wesele
                  </a>
                </div>
              </CardContent>
            </div>
          </StaggerItem>
        </StaggerChildren>

        <SectionDivider className="my-8" />

        <AnimateOnScroll direction="up">
          <h2 className="font-heading text-2xl text-primary font-bold mb-4">Mapa dojazdu</h2>
          <div className="rounded-lg overflow-hidden border border-border h-64">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </AnimateOnScroll>
      </div>
    </div>
    </PageTransition>
  )
}
