"use client"

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

interface Slide {
  image?: {
    url?: string
    sizes?: {
      hero?: { url?: string }
    }
    alt?: string
  } | null
  gradient?: string | null
}

interface HeroCarouselProps {
  slides?: Slide[]
  heading?: string
  subheading?: string
  description?: string
  ctaText?: string
  ctaLink?: string
}

const defaultSlides: Slide[] = [
  { gradient: "from-[#1a1a2e] to-[#16213e]" },
  { gradient: "from-[#0f0f23] to-[#1a0a2e]" },
  { gradient: "from-[#1a1a1a] to-[#2d1810]" },
  { gradient: "from-[#0a1628] to-[#1a2a1a]" },
  { gradient: "from-[#1e1e2e] to-[#2e1e1e]" },
]

export default function HeroCarousel({
  slides,
  heading = "ARMAGEDON",
  subheading = "Zespół muzyczny na wesele",
  description = "Profesjonalna oprawa muzyczna wesel i imprez. Gramy z pasją od ponad 20 lat.",
  ctaText = "Sprawdź dostępność terminu",
  ctaLink = "/kontakt",
}: HeroCarouselProps) {
  const displaySlides = slides && slides.length > 0 ? slides : defaultSlides

  return (
    <Carousel
      opts={{ loop: true }}
      plugins={[Autoplay({ delay: 5000 })]}
      className="w-full h-[80vh]"
    >
      <CarouselContent className="h-[80vh]">
        {displaySlides.map((slide, index) => {
          const imageUrl = slide.image?.sizes?.hero?.url ?? slide.image?.url
          const hasImage = !!imageUrl

          return (
            <CarouselItem key={index} className="h-[80vh]">
              <div className="relative w-full h-[80vh]">
                {hasImage ? (
                  <Image
                    src={imageUrl}
                    alt={slide.image?.alt ?? heading}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient ?? "from-[#1a1a2e] to-[#16213e]"}`} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="relative h-full flex flex-col items-center justify-center px-4">
                  <h1 className="font-heading text-5xl md:text-7xl text-primary font-bold tracking-wider">
                    {heading}
                  </h1>
                  <p className="text-xl md:text-2xl text-foreground font-light mt-4">
                    {subheading}
                  </p>
                  <p className="text-muted-foreground max-w-2xl mx-auto mt-2 text-center">
                    {description}
                  </p>
                  <Button variant="default" size="lg" asChild className="mt-8 text-lg px-8 py-6">
                    <Link href={ctaLink}>{ctaText}</Link>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          )
        })}
      </CarouselContent>
    </Carousel>
  )
}
