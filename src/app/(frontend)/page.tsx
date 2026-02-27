import Link from "next/link";
import { Music, Drama, Volume2, Users, Guitar, Mic, Heart, Star, PartyPopper, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { LucideIcon } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { AnimateOnScroll } from "@/components/animations/animate-on-scroll"
import { StaggerChildren, StaggerItem } from "@/components/animations/stagger-children"
import { FloatingParticles } from "@/components/animations/floating-particles"
import { HeroAnimations, HeroItem, HeroGlow } from "@/components/animations/hero-animations"
import { SectionDivider } from "@/components/animations/section-divider"
import { FloatingNotes } from "@/components/animations/floating-notes"

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

  const heroImages = (hero?.images as Array<{ image: { sizes?: { thumbnail?: { url?: string } }; url?: string } | string }> | undefined)
    ?.map((item) => {
      if (typeof item.image === 'object' && item.image) {
        return item.image.sizes?.thumbnail?.url ?? item.image.url ?? null
      }
      return null
    })
    .filter(Boolean) as string[] | undefined

  const aboutImageUrl = about?.image && typeof about.image === 'object' && 'sizes' in about.image
    ? ((about.image as { sizes?: { card?: { url?: string } }; url?: string }).sizes?.card?.url ?? (about.image as { url?: string }).url)
    : null

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#0f0f23] to-[#1a1a2e]">
        <FloatingParticles count={20} />
        <FloatingNotes count={10} />
        <HeroGlow />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="relative text-center px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <HeroAnimations>
            <HeroItem>
              <h1 className="font-heading text-5xl md:text-7xl text-primary font-bold tracking-wider">
                {hero?.heading ?? 'ARMAGEDON'}
              </h1>
            </HeroItem>
            <HeroItem>
              <p className="text-xl md:text-2xl text-foreground font-light mt-4">
                {hero?.subheading ?? 'Zespół muzyczny na wesele'}
              </p>
            </HeroItem>
            <HeroItem>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
                {hero?.description ?? 'Profesjonalna oprawa muzyczna wesel i imprez. Gramy z pasją od ponad 20 lat.'}
              </p>
            </HeroItem>
            {heroImages && heroImages.length > 0 && (
              <HeroItem>
                <div className="flex items-center justify-center mt-8 -space-x-3">
                  {heroImages.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt=""
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-primary/50 shadow-lg"
                    />
                  ))}
                </div>
              </HeroItem>
            )}
            <HeroItem>
              <Button variant="default" size="lg" asChild className="mt-8 text-lg px-8 py-6">
                <a href="#wolne-terminy">Sprawdź dostępne terminy</a>
              </Button>
            </HeroItem>
          </HeroAnimations>
        </div>
      </section>

      <SectionDivider className="my-0" />

      {/* Wolne terminy */}
      <section id="wolne-terminy" className="py-16 px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll direction="up">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl text-primary font-bold mb-8">
              {availability?.heading ?? 'Wolne terminy'}
            </h2>
            {availability?.content ? (
              <div className="bg-card rounded-lg border border-border p-8 prose prose-invert max-w-none">
                <RichText data={availability.content} />
              </div>
            ) : (
              <div className="bg-card rounded-lg border border-border p-8">
                <p className="text-muted-foreground">
                  Skontaktuj się z nami, aby sprawdzić dostępność terminów.
                </p>
                <Button variant="default" size="lg" asChild className="mt-6 text-lg px-8 py-6">
                  <Link href="/kontakt">Zapytaj o termin</Link>
                </Button>
              </div>
            )}
          </div>
        </AnimateOnScroll>
      </section>

      <SectionDivider />

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AnimateOnScroll direction="up">
          <h2 className="font-heading text-3xl md:text-4xl text-center text-primary font-bold">
            {featuresData?.heading ?? 'Dlaczego ARMAGEDON?'}
          </h2>
          <p className="text-muted-foreground text-center mt-2 mb-12">
            {featuresData?.subheading ?? 'Od ponad 20 lat dostarczamy niezapomniane emocje na weselach'}
          </p>
        </AnimateOnScroll>
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature: { icon?: string | null; title: string; description?: string | null }, index: number) => {
            const IconComponent = iconMap[feature.icon ?? ''] ?? Music
            return (
              <StaggerItem key={index}>
                <Card className="text-center p-6 border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/5 h-full">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <IconComponent size={32} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mt-4">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            )
          })}
        </StaggerChildren>
      </section>

      <SectionDivider />

      <section className="bg-card py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <AnimateOnScroll direction="left" className="md:w-1/2">
            {aboutImageUrl ? (
              <img
                src={aboutImageUrl}
                alt={about?.heading ?? 'Kim jesteśmy?'}
                className="rounded-lg h-80 w-full object-cover"
              />
            ) : (
              <div className="bg-gradient-to-br from-[#1a1a2e] to-[#2d1810] rounded-lg h-80 w-full" />
            )}
          </AnimateOnScroll>
          <AnimateOnScroll direction="right" className="md:w-1/2">
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
          </AnimateOnScroll>
        </div>
      </section>

      <SectionDivider />

      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1a1a2e]/50 via-background to-[#1a1a2e]/30 text-center">
        <FloatingParticles count={8} />
        <FloatingNotes count={6} />
        <AnimateOnScroll direction="up">
          <div className="relative max-w-7xl mx-auto">
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
          </div>
        </AnimateOnScroll>
      </section>
    </div>
  );
}
