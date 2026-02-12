import AudioAlbumCard from '@/components/audio-album-card'
import { AudioPlayerProvider } from '@/components/audio-player-context'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const metadata: Metadata = {
  title: 'Audio - ARMAGEDON',
  description: 'Posłuchaj naszych nagrań - zespół weselny ARMAGEDON',
}

export default async function AudioPage() {
  const payload = await getPayload({ config: configPromise })
  const audioPage = await payload.findGlobal({ slug: 'audio-page' })

  const { docs: albums } = await payload.find({
    collection: 'audio-albums',
    sort: 'order',
    limit: 50,
    depth: 1,
  })

  const { docs: trackDocs } = await payload.find({
    collection: 'audio-tracks',
    sort: 'order',
    limit: 200,
    depth: 0,
  })

  const heading = audioPage?.heading ?? 'Nasze nagrania'
  const subheading = audioPage?.subheading ?? 'Posłuchaj fragmentów naszego repertuaru'
  const footer = audioPage?.footer ?? 'Pełny repertuar omawiamy indywidualnie z Młodą Parą'

  const albumsWithTracks = albums.map((album) => {
    const coverImage =
      typeof album.coverImage === 'object' && album.coverImage !== null
        ? album.coverImage
        : null

    const albumTracks = trackDocs
      .filter((t) => {
        if (!t.album) return false
        const albumRef = t.album
        const albumId =
          typeof albumRef === 'object' && albumRef !== null
            ? (albumRef as { id: string }).id
            : albumRef
        return String(albumId) === String(album.id)
      })
      .map((t) => ({
        title: t.title,
        src: t.url ?? '',
      }))

    return {
      id: album.id,
      title: album.title,
      description: album.description ?? null,
      coverUrl: coverImage?.url ?? null,
      tracks: albumTracks,
    }
  })

  const hasContent = albumsWithTracks.some((a) => a.tracks.length > 0)

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <h1 className="font-heading text-3xl md:text-4xl text-primary font-bold text-center">
        {heading}
      </h1>
      <p className="text-muted-foreground text-center mt-2 mb-12">{subheading}</p>

      {hasContent ? (
        <AudioPlayerProvider>
          <div className="space-y-12">
            {albumsWithTracks.map(
              (album) =>
                album.tracks.length > 0 && (
                  <AudioAlbumCard
                    key={album.id}
                    title={album.title}
                    description={album.description}
                    coverUrl={album.coverUrl}
                    tracks={album.tracks}
                  />
                ),
            )}
          </div>
        </AudioPlayerProvider>
      ) : (
        <p className="text-muted-foreground text-center py-12">Brak nagrań do wyświetlenia</p>
      )}

      <p className="text-sm text-muted-foreground text-center mt-12">{footer}</p>
    </div>
  )
}
