import AudioPlayer from '@/components/audio-player'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const metadata: Metadata = {
  title: 'Audio - ARMAGEDON',
  description: 'Posłuchaj naszych nagrań - zespół weselny ARMAGEDON',
}

const defaultTracks = [
  { title: 'Wesele Hej - Na żywo', src: '/audio/track01.mp3' },
  { title: 'Szła dzieweczka', src: '/audio/track02.mp3' },
  { title: 'Hej sokoły', src: '/audio/track03.mp3' },
  { title: 'Sto lat - wersja instrumentalna', src: '/audio/track04.mp3' },
  { title: 'Macarena - na żywo', src: '/audio/track05.mp3' },
  { title: 'Koko Euro Spoko', src: '/audio/track06.mp3' },
  { title: 'Ona tańczy dla mnie', src: '/audio/track07.mp3' },
  { title: 'Przez twe oczy zielone', src: '/audio/track08.mp3' },
  { title: 'Jak się masz kochanie', src: '/audio/track09.mp3' },
  { title: 'Biały miś', src: '/audio/track10.mp3' },
  { title: 'Everybody Dance Now', src: '/audio/track11.mp3' },
  { title: 'I Will Survive', src: '/audio/track12.mp3' },
  { title: 'Sweet Caroline', src: '/audio/track13.mp3' },
  { title: "Don't Stop Me Now", src: '/audio/track14.mp3' },
  { title: 'Uptown Funk', src: '/audio/track15.mp3' },
]

export default async function AudioPage() {
  const payload = await getPayload({ config: configPromise })
  const audioPage = await payload.findGlobal({ slug: 'audio-page' })

  const { docs: albums } = await payload.find({
    collection: 'audio-albums',
    sort: 'order',
    limit: 50,
  })

  const { docs: trackDocs } = await payload.find({
    collection: 'audio-tracks',
    sort: 'order',
    limit: 200,
  })

  const heading = audioPage?.heading ?? 'Nasze nagrania'
  const subheading = audioPage?.subheading ?? 'Posłuchaj fragmentów naszego repertuaru'
  const footer = audioPage?.footer ?? 'Pełny repertuar omawiamy indywidualnie z Młodą Parą'

  const hasCmsTracks = trackDocs.length > 0

  // Group tracks by album
  const albumsWithTracks = albums.map((album) => {
    const albumTracks = trackDocs
      .filter((t) => {
        const albumRef = t.album
        const albumId = typeof albumRef === 'object' && albumRef !== null ? (albumRef as { id: string }).id : albumRef
        return albumId === album.id
      })
      .map((t) => ({
        title: t.title,
        src: t.url ?? '',
      }))
    return { ...album, tracks: albumTracks }
  })

  // Tracks not assigned to any album
  const assignedTrackIds = new Set(trackDocs.filter((t) => t.album).map((t) => t.id))
  const unassignedTracks = trackDocs
    .filter((t) => !assignedTrackIds.has(t.id) || !t.album)
    .map((t) => ({ title: t.title, src: t.url ?? '' }))

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="font-heading text-3xl md:text-4xl text-primary font-bold text-center">
        {heading}
      </h1>
      <p className="text-muted-foreground text-center mt-2 mb-12">
        {subheading}
      </p>

      {hasCmsTracks ? (
        <div className="space-y-12">
          {albumsWithTracks.map((album) => (
            album.tracks.length > 0 && (
              <div key={album.id}>
                <h2 className="font-heading text-xl text-primary font-bold mb-4">{album.title}</h2>
                {album.description && (
                  <p className="text-sm text-muted-foreground mb-4">{album.description}</p>
                )}
                <AudioPlayer tracks={album.tracks} />
              </div>
            )
          ))}
          {unassignedTracks.length > 0 && (
            <div>
              <AudioPlayer tracks={unassignedTracks} />
            </div>
          )}
        </div>
      ) : (
        <AudioPlayer tracks={defaultTracks} />
      )}

      <p className="text-sm text-muted-foreground text-center mt-8">
        {footer}
      </p>
    </div>
  )
}
