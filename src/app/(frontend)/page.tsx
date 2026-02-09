import Link from "next/link";
import { Music, Drama, Volume2, Users, Guitar, Mic, Heart, Star, PartyPopper, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { LucideIcon } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'

const iconMap: Record<string, LucideIcon> = {
  Music,
  Drama,
  Volume2,
  Users,
  Guitar,
  Mic,
  Heart,
  Star,
  PartyPopper,
  Sparkles,
}

const defaultFeatures = [
  { icon: 'Music', title: 'Instrumentarium', description: 'Saksofon, trąbka, klarnet, gitara, keyboard - gramy na żywo na najwyższym poziomie.' },
  { icon: 'Drama', title: 'Skecze weselne', description: 'Autorskie skecze i zabawy, które rozbawią każdego gościa i sprawią, że wesele będzie niezapomniane.' },
  { icon: 'Volume2', title: 'Zaplecze techniczne', description: 'Profesjonalny sprzęt nagłośnieniowy i oświetleniowy. Dbamy o każdy detal.' },
  { icon: 'Users', title: 'Osobowość', description: 'Charyzmatyczni muzycy z poczuciem humoru. Tworzymy niepowtarzalną atmosferę.' },
]

export default async function Home() {
  const payload = await getPayload({ config: configPromise })
  const homePage = await payload.findGlobal({ slug: 'home-page' })

  const hero = homePage?.heroSection
  const featuresData = homePage?.featuresSection
  const about = homePage?.aboutSection
  const cta = homePage?.ctaSection
  const availability = homePage?.availabilitySection

  const features = featuresData?.features && featuresData.features.length > 0
    ? featuresData.features
    : defaultFeatures

  const aboutImageUrl = about?.image && typeof about.image === 'object' && 'sizes' in about.image
    ? ((about.image as { sizes?: { card?: { url?: string } }; url?: string }).sizes?.card?.url ?? (about.image as { url?: string }).url)
    : null

  return (
    <div>
      {/* Hero - statyczny */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#0f0f23] to-[#1a1a2e]">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="relative text-center px-4">
          <h1 className="font-heading text-5xl md:text-7xl text-primary font-bold tracking-wider">
            {hero?.heading ?? 'ARMAGEDON'}
          </h1>
          <p className="text-xl md:text-2xl text-foreground font-light mt-4">
            {hero?.subheading ?? 'Zespół muzyczny na wesele'}
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
            {hero?.description ?? 'Profesjonalna oprawa muzyczna wesel i imprez. Gramy z pasją od ponad 20 lat.'}
          </p>
          <Button variant="default" size="lg" asChild className="mt-8 text-lg px-8 py-6">
            <Link href={hero?.ctaLink ?? '/kontakt'}>{hero?.ctaText ?? 'Sprawdź dostępność terminu'}</Link>
          </Button>
        </div>
      </section>

      {/* Wolne terminy */}
      {availability?.content && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl text-primary font-bold mb-8">
              {availability?.heading ?? 'Wolne terminy'}
            </h2>
            <div className="bg-card rounded-lg border border-border p-8">
              <RichText data={availability.content} />
            </div>
          </div>
        </section>
      )}

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl text-center text-primary font-bold">
          {featuresData?.heading ?? 'Dlaczego ARMAGEDON?'}
        </h2>
        <p className="text-muted-foreground text-center mt-2 mb-12">
          {featuresData?.subheading ?? 'Od ponad 20 lat dostarczamy niezapomniane emocje na weselach'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature: { icon?: string | null; title: string; description?: string | null }, index: number) => {
            const IconComponent = iconMap[feature.icon ?? ''] ?? Music
            return (
              <Card key={index} className="text-center p-6 border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-0">
                  <IconComponent size={40} className="text-primary mx-auto" />
                  <h3 className="text-lg font-semibold mt-4">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="bg-card py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            {aboutImageUrl ? (
              <img
                src={aboutImageUrl}
                alt={about?.heading ?? 'Kim jesteśmy?'}
                className="rounded-lg h-80 w-full object-cover"
              />
            ) : (
              <div className="bg-gradient-to-br from-[#1a1a2e] to-[#2d1810] rounded-lg h-80 w-full" />
            )}
          </div>
          <div className="md:w-1/2">
            <h2 className="font-heading text-3xl text-primary font-bold">
              {about?.heading ?? 'Kim jesteśmy?'}
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              {about?.paragraph1 ?? 'Jesteśmy zespołem z wieloletnim doświadczeniem, który łączy profesjonalizm z autentyczną pasją do muzyki. Nasz repertuar obejmuje utwory z różnych gatunków - od klasycznych przebojów weselnych, przez pop, rock, disco polo, aż po jazz i swing.'}
            </p>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              {about?.paragraph2 ?? 'Każde wesele traktujemy indywidualnie, dostosowując program do potrzeb i oczekiwań Młodej Pary.'}
            </p>
            <Button variant="outline" asChild className="mt-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link href={about?.ctaLink ?? '/kim-jestesmy'}>{about?.ctaText ?? 'Więcej o nas'}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h2 className="font-heading text-3xl md:text-4xl text-primary font-bold">
          {cta?.heading ?? 'Zarezerwuj termin'}
        </h2>
        <p className="text-muted-foreground mt-2 mb-8">
          {cta?.subheading ?? 'Nie zwlekaj - popularne terminy szybko się zapełniają!'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="default" size="lg" asChild className="text-lg px-8 py-6">
            <a href={`tel:${cta?.phoneNumber ?? '505566007'}`}>{cta?.phoneText ?? 'Zadzwoń: 505 566 007'}</a>
          </Button>
          <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link href={cta?.contactLink ?? '/kontakt'}>{cta?.contactText ?? 'Napisz do nas'}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
