import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Galeria - ARMAGEDON",
  description: "Galeria zdjęć zespołu weselnego ARMAGEDON",
};

export default async function GaleriaPage() {
  const payload = await getPayload({ config: configPromise })
  const galleryPage = await payload.findGlobal({ slug: 'gallery-page' })
  const { docs: albums } = await payload.find({
    collection: 'gallery-albums',
    sort: 'order',
    limit: 50,
  })

  const heading = galleryPage?.heading ?? 'Galeria'
  const subheading = galleryPage?.subheading ?? 'Chwile, które uwieczniamy na każdym wydarzeniu'

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="font-heading text-3xl md:text-4xl text-primary font-bold text-center">
        {heading}
      </h1>
      <p className="text-muted-foreground text-center mt-2 mb-12">
        {subheading}
      </p>

      {albums.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          Brak albumów do wyświetlenia
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => {
            const cover = album.coverImage && typeof album.coverImage === 'object'
              ? album.coverImage as { url?: string; sizes?: { card?: { url?: string } }; alt?: string }
              : null
            const coverUrl = cover?.sizes?.card?.url ?? cover?.url

            return (
              <Link key={album.id} href={`/galeria/${album.slug}`}>
                <Card className="overflow-hidden group cursor-pointer border-border hover:border-primary/50 transition-colors">
                  <div className="relative h-56">
                    {coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt={cover?.alt ?? album.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="h-full bg-gradient-to-br from-[#1a1a2e] to-[#2d1810] flex items-center justify-center transition-transform group-hover:scale-105">
                        <span className="text-muted-foreground/30 text-sm">{album.title}</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h2 className="text-lg font-semibold text-foreground">{album.title}</h2>
                    {album.description && (
                      <p className="text-sm text-muted-foreground mt-1">{album.description}</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  );
}
