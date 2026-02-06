"use client"

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const slides = [
  { gradient: "bg-gradient-to-br from-[#1a1a2e] to-[#16213e]" },
  { gradient: "bg-gradient-to-br from-[#0f0f23] to-[#1a0a2e]" },
  { gradient: "bg-gradient-to-br from-[#1a1a1a] to-[#2d1810]" },
  { gradient: "bg-gradient-to-br from-[#0a1628] to-[#1a2a1a]" },
  { gradient: "bg-gradient-to-br from-[#1e1e2e] to-[#2e1e1e]" },
]

export default function HeroCarousel() {
  return (
    <Carousel
      opts={{ loop: true }}
      plugins={[Autoplay({ delay: 5000 })]}
      className="w-full h-[80vh]"
    >
      <CarouselContent className="h-[80vh]">
        {slides.map((slide, index) => (
          <CarouselItem key={index} className="h-[80vh]">
            <div className={`relative w-full h-[80vh] ${slide.gradient}`}>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="relative h-full flex flex-col items-center justify-center px-4">
                <h1 className="font-heading text-5xl md:text-7xl text-primary font-bold tracking-wider">
                  ARMAGEDON
                </h1>
                <p className="text-xl md:text-2xl text-foreground font-light mt-4">
                  Zespół muzyczny na wesele
                </p>
                <p className="text-muted-foreground max-w-2xl mx-auto mt-2 text-center">
                  Profesjonalna oprawa muzyczna wesel i imprez. Gramy z pasją od ponad 20 lat.
                </p>
                <Button variant="default" size="lg" asChild className="mt-8 text-lg px-8 py-6">
                  <Link href="/kontakt">Sprawdź dostępność terminu</Link>
                </Button>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
