import type { Metadata } from "next";
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import PhotoGallery from "@/components/photo-gallery";

export const metadata: Metadata = {
  title: "Galeria - ARMAGEDON",
  description: "Galeria zdjęć zespołu weselnego ARMAGEDON",
};

export default async function GaleriaPage() {
  const payload = await getPayload({ config: configPromise })
  const galleryPage = await payload.findGlobal({ slug: 'gallery-page' })
  const { docs: photoDocs } = await payload.find({
    collection: 'gallery-photos',
    sort: 'order',
    limit: 200,
  })

  const heading = galleryPage?.heading ?? 'Galeria'
  const subheading = galleryPage?.subheading ?? 'Chwile, które uwieczniamy na każdym wydarzeniu'

  const photos = photoDocs.map((photo) => {
    const sizes = photo.sizes as {
      thumbnail?: { url?: string; width?: number; height?: number }
      large?: { url?: string }
    } | undefined
    const origW = photo.width ?? 800
    const origH = photo.height ?? 600
    return {
      id: photo.id,
      url: photo.url ?? '',
      width: origW,
      height: origH,
      thumbnailUrl: sizes?.thumbnail?.url,
      thumbnailWidth: sizes?.thumbnail?.width ?? origW,
      thumbnailHeight: sizes?.thumbnail?.height ?? origH,
      largeUrl: sizes?.large?.url,
      alt: photo.alt,
    }
  })

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="font-heading text-3xl md:text-4xl text-primary font-bold text-center">
        {heading}
      </h1>
      <p className="text-muted-foreground text-center mt-2 mb-12">
        {subheading}
      </p>

      {photos.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          Brak zdjęć do wyświetlenia
        </p>
      ) : (
        <PhotoGallery photos={photos} />
      )}
    </div>
  );
}
