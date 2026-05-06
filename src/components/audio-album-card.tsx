'use client'

import React, { useMemo, memo, useCallback } from 'react'
import Image from 'next/image'
import { Play, Pause, Disc3 } from 'lucide-react'
import { cn, formatTime } from '@/lib/utils'
import { usePlayer } from '@/components/player-context'
import type { AudioTrack } from '@/lib/audio-controller'

// Module-level set — avoid duplicate hover prefetches across card instances
const prefetchedSrcs = new Set<string>()

interface Track {
  title: string
  src: string
}

interface AudioAlbumCardProps {
  title: string
  description?: string | null
  coverUrl?: string | null
  tracks: Track[]
}

// ── SeekBar ──────────────────────────────────────────────────────────────────

const SeekBar = memo(function SeekBar({
  currentTime,
  duration,
  onSeek,
}: {
  currentTime: number
  duration: number
  onSeek: (e: React.MouseEvent<HTMLDivElement>) => void
}) {
  const progress = duration > 0 ? currentTime / duration : 0
  return (
    <div
      className='mx-3 mb-2.5 h-[3px] rounded-full bg-border/80 cursor-pointer relative group/seek'
      onClick={onSeek}
    >
      <div
        className='absolute inset-y-0 left-0 bg-primary rounded-full transition-[width] duration-200'
        style={{ width: `${progress * 100}%` }}
      />
      <div
        className='absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-2.5 bg-foreground rounded-full shadow opacity-0 group-hover/seek:opacity-100 transition-opacity pointer-events-none'
        style={{ left: `${progress * 100}%` }}
      />
    </div>
  )
})

// ── EqualizerBars ─────────────────────────────────────────────────────────────

function EqualizerBars({ playing }: { playing: boolean }) {
  return (
    <span className='inline-flex items-end gap-[2px] h-3.5 w-4' aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className='w-[3px] rounded-sm bg-primary block'
          style={
            playing
              ? { animation: 'eq-bar 0.8s ease-in-out infinite alternate', animationDelay: `${i * 0.2}s` }
              : { height: '4px' }
          }
        />
      ))}
    </span>
  )
}

// ── AudioAlbumCard ────────────────────────────────────────────────────────────

export default function AudioAlbumCard({ title, description, coverUrl, tracks }: AudioAlbumCardProps) {
  const { state, play, pause, resume, seek } = usePlayer()

  // Build AudioTrack[] once — stable reference, includes album metadata for Media Session
  const playlist = useMemo<AudioTrack[]>(
    () => tracks.map((t) => ({
      title: t.title,
      src: t.src,
      albumTitle: title,
      albumArt: coverUrl ?? undefined,
    })),
    [tracks, title, coverUrl],
  )

  // Determine if this album is the active one
  const isThisAlbum = state.playlist === playlist ||
    (state.playlist.length > 0 && state.playlist[0]?.src === playlist[0]?.src)

  const activeIndex = isThisAlbum ? state.trackIndex : null
  const isPlaying = isThisAlbum && state.status === 'playing'
  const isLoading = isThisAlbum && state.status === 'loading'

  const handleTrackClick = (index: number) => {
    if (activeIndex === index) {
      // Same track — toggle play/pause
      isPlaying ? pause() : resume()
    } else {
      // Different track — play immediately (optimistic UI in controller)
      play(playlist, index)
    }
  }

  const handleTrackHover = useCallback((src: string) => {
    if (!src || prefetchedSrcs.has(src)) return
    prefetchedSrcs.add(src)
    fetch(src, { headers: { Range: 'bytes=0-524287' } } as RequestInit).catch(() => {})
  }, [])

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    seek(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)))
  }

  return (
    <div className='glass-card rounded-xl overflow-hidden'>
      <div className='flex flex-col md:flex-row'>

        {/* Cover + album info */}
        <div className='md:w-56 shrink-0 p-6 flex flex-col items-center gap-5 bg-card/60 border-b md:border-b-0 md:border-r border-border'>
          {coverUrl ? (
            <div className='relative w-44 h-44 rounded-lg overflow-hidden shadow-xl shadow-black/60 ring-1 ring-white/10'>
              <Image src={coverUrl} alt={title} fill className='object-cover' sizes='176px' />
            </div>
          ) : (
            <div className='w-44 h-44 rounded-lg bg-primary/10 flex items-center justify-center ring-1 ring-primary/20'>
              <Disc3 className='size-16 text-primary/30' />
            </div>
          )}
          <div className='text-center w-full'>
            <h2 className='font-heading text-lg text-primary font-bold leading-snug'>{title}</h2>
            {description && (
              <p className='text-xs text-muted-foreground mt-2 whitespace-pre-line leading-relaxed'>{description}</p>
            )}
          </div>
        </div>

        {/* Track list */}
        <div className='flex-1 px-2 py-3 min-w-0'>
          <div className='flex items-center gap-3 px-3 pb-2 mb-1 border-b border-border/40 text-[11px] text-muted-foreground/50 uppercase tracking-widest'>
            <span className='w-5 text-center'>#</span>
            <span className='flex-1'>Utwór</span>
          </div>

          {tracks.map((track, index) => {
            const isActive = activeIndex === index
            const isActiveAndPlaying = isActive && isPlaying
            const isActiveAndLoading = isActive && isLoading

            return (
              <div
                key={index}
                className={cn(
                  'rounded-md overflow-hidden transition-colors duration-100 group',
                  isActive ? 'bg-primary/10' : 'hover:bg-white/[0.04]',
                )}
                onMouseEnter={() => handleTrackHover(track.src)}
              >
                <div
                  className='flex items-center gap-3 px-3 py-2.5 cursor-pointer select-none'
                  onClick={() => handleTrackClick(index)}
                >
                  {/* Number / state indicator */}
                  <div className='w-5 flex items-center justify-center shrink-0'>
                    {isActiveAndLoading ? (
                      <span className='size-3.5 rounded-full border border-primary/60 border-t-transparent animate-spin block' />
                    ) : isActive ? (
                      <EqualizerBars playing={isActiveAndPlaying} />
                    ) : (
                      <span className='text-xs text-muted-foreground group-hover:hidden'>{index + 1}</span>
                    )}
                    {!isActive && (
                      <Play className='size-3.5 fill-foreground text-foreground hidden group-hover:block' />
                    )}
                  </div>

                  <span className={cn(
                    'text-sm font-medium flex-1 truncate',
                    isActive ? 'text-primary' : 'text-foreground/90',
                  )}>
                    {track.title}
                  </span>

                  {/* Time — only on active track */}
                  {isActive && (
                    <span className='text-[11px] text-muted-foreground tabular-nums hidden sm:inline shrink-0'>
                      {formatTime(state.currentTime)}
                      <span className='opacity-40'> / {formatTime(state.duration)}</span>
                    </span>
                  )}

                  {/* Pause icon overlay on active track hover */}
                  {isActive && (
                    <span className='shrink-0'>
                      {isActiveAndPlaying
                        ? <Pause className='size-3.5 fill-primary text-primary opacity-0 group-hover:opacity-100 transition-opacity' />
                        : <Play className='size-3.5 fill-primary text-primary opacity-0 group-hover:opacity-100 transition-opacity ml-[1px]' />
                      }
                    </span>
                  )}
                </div>

                {/* Seek bar — expands below active row */}
                {isActive && (
                  <SeekBar
                    currentTime={state.currentTime}
                    duration={state.duration}
                    onSeek={handleSeek}
                  />
                )}
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
