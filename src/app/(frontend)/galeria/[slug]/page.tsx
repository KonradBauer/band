import { notFound } from "next/navigation";
import Link from "next/link";
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import PhotoGallery from "@/components/photo-gallery";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface AlbumPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: AlbumPageProps) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'gallery-albums',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const album = docs[0]
  if (!album) return { title: 'Album - ARMAGEDON' }

  return {
    title: `${album.title} - Galeria ARMAGEDON`,
    description: album.description ?? `Album zdjęć: ${album.title}`,
  }
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const { docs: albums } = await payload.find({
    collection: 'gallery-albums',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const album = albums[0]
  if (!album) notFound()

  const { docs: photoDocs } = await payload.find({
    collection: 'gallery-photos',
    where: { album: { equals: album.id } },
    sort: 'order',
    limit: 100,
  })

  const photos = photoDocs.map((photo) => ({
    id: photo.id,
    url: photo.url ?? '',
    thumbnailUrl: (photo.sizes as { thumbnail?: { url?: string } })?.thumbnail?.url,
    largeUrl: (photo.sizes as { large?: { url?: string } })?.large?.url,
    alt: photo.alt,
  }))

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Button variant="ghost" asChild className="mb-8 text-muted-foreground hover:text-primary">
        <Link href="/galeria">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Powrót do galerii
        </Link>
      </Button>

      <h1 className="font-heading text-3xl md:text-4xl text-primary font-bold text-center">
        {album.title}
      </h1>
      {album.description && (
        <p className="text-muted-foreground text-center mt-2 mb-12">
          {album.description}
        </p>
      )}

      {photos.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          Brak zdjęć w tym albumie
        </p>
      ) : (
        <div className="mt-12">
          <PhotoGallery photos={photos} />
        </div>
      )}
    </div>
  );
}
