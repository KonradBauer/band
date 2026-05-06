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
import { TextReveal } from "@/components/animations/text-reveal"
import { ScrollZoomHero } from "@/components/animations/scroll-zoom-hero"
import { ParallaxSection } from "@/components/animations/parallax-section"
import { SmokeEffect } from "@/components/animations/smoke-effect"
import { alignClass } from "@/lib/textAlign"

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
  const [homePage, siteSettings] = await Promise.all([
    payload.findGlobal({ slug: 'home-page' }),
    payload.findGlobal({ slug: 'site-settings' }),
  ])

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

  const heroHeading = hero?.heading ?? 'ARMAGEDON'

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#080808]">
        {/* Stage spotlight — radial gold glow from top-center */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(201,168,76,0.18)_0%,rgba(201,168,76,0.04)_45%,transparent_70%)]" />
        {/* Ghost band name — decorative background text, clipped to viewport */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden select-none pointer-events-none">
          <span
            className="font-heading font-black text-white/[0.025] whitespace-nowrap leading-none block"
            style={{ fontSize: 'clamp(2rem, 14vw, 18rem)', letterSpacing: '0.1em' }}
          >
            {heroHeading.split('\n')[0]}
          </span>
        </div>
        {/* Subtle horizontal scan line at top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <FloatingParticles count={8} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <SmokeEffect />
        <ScrollZoomHero className="relative">
          <div className="relative text-center px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <HeroAnimations>
              <HeroItem>
                {/* Decorative line above heading */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/60" />
                  <span className="text-[11px] tracking-[0.4em] text-primary/70 uppercase font-medium">Zespół weselny</span>
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/60" />
                </div>
                <h1 className={`font-heading text-6xl md:text-8xl font-bold tracking-[0.12em] gold-gradient-text whitespace-pre-line ${alignClass(hero?.headingAlign as string, 'text-center')}`}>
                  <TextReveal text={heroHeading} />
                </h1>
              </HeroItem>
              <HeroItem>
                <p className={`text-lg md:text-xl text-foreground/80 font-light mt-5 tracking-wide whitespace-pre-line ${alignClass(hero?.subheadingAlign as string, 'text-center')}`}>
                  {hero?.subheading ?? 'Muzyczna oprawa wesel i imprez'}
                </p>
              </HeroItem>
              <HeroItem>
                <p className={`text-muted-foreground max-w-xl mx-auto mt-3 leading-relaxed whitespace-pre-line ${alignClass(hero?.descriptionAlign as string, 'text-center')}`}>
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
                {/* Decorative line below content, before CTA */}
                <div className="flex items-center justify-center gap-6 mt-10 mb-6">
                  <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent to-border" />
                  <div className="h-1 w-1 rounded-full bg-primary/50" />
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  <div className="h-1 w-1 rounded-full bg-primary/50" />
                  <div className="h-px flex-1 max-w-24 bg-gradient-to-l from-transparent to-border" />
                </div>
                <Button variant="default" size="lg" asChild className="text-base px-10 py-6 glow-button cta-pulse tracking-wider">
                  <a href="#wolne-terminy">Sprawdź dostępne terminy</a>
                </Button>
              </HeroItem>
            </HeroAnimations>
          </div>
        </ScrollZoomHero>
      </section>

      <SectionDivider className="my-0" />

      {/* Wolne terminy */}
      <section id="wolne-terminy" className="py-16 px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll direction="up">
          <div className={`max-w-4xl mx-auto ${alignClass(availability?.headingAlign as string, 'text-center')}`}>
            <h2 className="font-heading text-3xl md:text-4xl shimmer-gold font-bold mb-8 whitespace-pre-line">
              {availability?.heading ?? 'Wolne terminy'}
            </h2>
            {availability?.content ? (
              <div className="glass-card rounded-lg p-8 prose prose-invert max-w-none">
                <RichText data={availability.content} />
              </div>
            ) : (
              <div className="glass-card rounded-lg p-8 text-center">
                <p className="text-muted-foreground">
                  Skontaktuj się z nami, aby sprawdzić dostępność terminów.
                </p>
                <Button variant="default" size="lg" asChild className="mt-6 text-lg px-8 py-6 glow-button">
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
          <h2 className={`font-heading text-3xl md:text-4xl shimmer-gold font-bold pb-6 whitespace-pre-line ${alignClass(featuresData?.headingAlign as string, 'text-center')}`}>
            {featuresData?.heading ?? 'Dlaczego ARMAGEDON?'}
          </h2>
          <p className={`text-muted-foreground mt-2 mb-12 whitespace-pre-line ${alignClass(featuresData?.subheadingAlign as string, 'text-center')}`}>
            {featuresData?.subheading ?? 'Od ponad 20 lat dostarczamy niezapomniane emocje na weselach'}
          </p>
        </AnimateOnScroll>
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature: { icon?: string | null; title: string; description?: string | null; descriptionAlign?: string | null }, index: number) => {
            const IconComponent = iconMap[feature.icon ?? ''] ?? Music
            return (
              <StaggerItem key={index}>
                <div className="glass-card rounded-xl text-center p-6 h-full transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <IconComponent size={32} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mt-4">{feature.title}</h3>
                  <p className={`text-sm text-muted-foreground mt-2 whitespace-pre-line ${alignClass(feature.descriptionAlign, 'text-center')}`}>
                    {feature.description}
                  </p>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerChildren>
      </section>

      <SectionDivider />

      <ParallaxSection className="bg-card py-20 px-4 sm:px-6 lg:px-8">
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
            <h2 className={`font-heading text-3xl shimmer-gold font-bold whitespace-pre-line ${alignClass(about?.headingAlign as string, 'text-left')}`}>
              {about?.heading ?? 'Kim jesteśmy?'}
            </h2>
            <p className={`text-muted-foreground mt-4 leading-relaxed whitespace-pre-line ${alignClass(about?.paragraph1Align as string, 'text-left')}`}>
              {about?.paragraph1 ?? 'Jesteśmy zespołem z wieloletnim doświadczeniem, który łączy profesjonalizm z autentyczną pasją do muzyki. Nasz repertuar obejmuje utwory z różnych gatunków - od klasycznych przebojów weselnych, przez pop, rock, disco polo, aż po jazz i swing.'}
            </p>
            <p className={`text-muted-foreground mt-4 leading-relaxed whitespace-pre-line ${alignClass(about?.paragraph2Align as string, 'text-left')}`}>
              {about?.paragraph2 ?? 'Każde wesele traktujemy indywidualnie, dostosowując program do potrzeb i oczekiwań Młodej Pary.'}
            </p>
            <Button variant="outline" asChild className="mt-6 border-primary text-primary hover:bg-primary/20 hover:text-white glow-button">
              <Link href={about?.ctaLink ?? '/kim-jestesmy'}>{about?.ctaText ?? 'Więcej o nas'}</Link>
            </Button>
          </AnimateOnScroll>
        </div>
      </ParallaxSection>

      <SectionDivider />

      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1a1a2e]/50 via-background to-[#1a1a2e]/30">
        <FloatingParticles count={6} />
        <AnimateOnScroll direction="scale">
          <div className="relative max-w-7xl mx-auto">
            <h2 className={`font-heading text-3xl md:text-4xl shimmer-gold font-bold whitespace-pre-line ${alignClass(cta?.headingAlign as string, 'text-center')}`}>
              {cta?.heading ?? 'Zarezerwuj termin'}
            </h2>
            <p className={`text-muted-foreground mt-2 mb-8 whitespace-pre-line ${alignClass(cta?.subheadingAlign as string, 'text-center')}`}>
              {cta?.subheading ?? 'Nie zwlekaj - popularne terminy szybko się zapełniają!'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="default" size="lg" asChild className="text-lg px-8 py-6 glow-button cta-pulse">
                <a href={`tel:${(siteSettings?.phone ?? '512369305').replace(/\s/g, '')}`}>Zadzwoń: {siteSettings?.phone ?? '512 369 305'}</a>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary/20 hover:text-white glow-button">
                <Link href={cta?.contactLink ?? '/kontakt'}>{cta?.contactText ?? 'Napisz do nas'}</Link>
              </Button>
            </div>
          </div>
        </AnimateOnScroll>
      </section>
    </div>
  );
}
