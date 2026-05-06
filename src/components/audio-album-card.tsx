'use client'

import React, { useState, useRef, useEffect, useCallback, memo } from 'react'
import Image from 'next/image'
import { Play, Disc3 } from 'lucide-react'
import { cn, formatTime } from '@/lib/utils'
import { useAudioPlayer } from '@/components/audio-player-context'

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

const SeekBar = memo(function SeekBar({
  currentTime, duration, onSeek,
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
      <div className='absolute inset-y-0 left-0 bg-primary rounded-full' style={{ width: `${progress * 100}%` }} />
      <div
        className='absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-2.5 bg-foreground rounded-full shadow opacity-0 group-hover/seek:opacity-100 transition-opacity pointer-events-none'
        style={{ left: `${progress * 100}%` }}
      />
    </div>
  )
})

export default function AudioAlbumCard({ title, description, coverUrl, tracks }: AudioAlbumCardProps) {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [hoveredTrack, setHoveredTrack] = useState<number | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const currentTrackRef = useRef<number | null>(null)
  const currentTimeRef = useRef(0)
  const cancelCanPlayRef = useRef<(() => void) | null>(null)
  const albumPrefetchedRef = useRef(false)
  const tracksRef = useRef(tracks)
  tracksRef.current = tracks

  const { requestPlay } = useAudioPlayer()

  const stopPlayback = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
    setCurrentTrack(null)
    currentTrackRef.current = null
    setCurrentTime(0)
    setDuration(0)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'auto'
    audioRef.current = audio

    const onTimeUpdate = () => { currentTimeRef.current = audio.currentTime; setCurrentTime(audio.currentTime) }
    const onDurationChange = () => { if (isFinite(audio.duration)) setDuration(audio.duration) }
    const onPlay = () => { setIsPlaying(true); setIsLoading(false) }
    const onPause = () => setIsPlaying(false)
    const onWaiting = () => setIsLoading(true)
    const onPlaying = () => setIsLoading(false)
    const onEnded = () => { setIsPlaying(false); setCurrentTime(0) }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDurationChange)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('ended', onEnded)

    return () => {
      cancelCanPlayRef.current?.()
      audio.pause()
      audio.src = ''
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDurationChange)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('playing', onPlaying)
      audio.removeEventListener('ended', onEnded)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fetch all album tracks into browser cache — runs once per album session.
  // Subsequent audio.src assignments hit the cache → canplay fires instantly.
  const prefetchAlbum = useCallback(() => {
    if (albumPrefetchedRef.current) return
    albumPrefetchedRef.current = true
    tracksRef.current.forEach((track) => {
      fetch(track.src, { priority: 'low' } as RequestInit).catch(() => {})
    })
  }, [])

  const loadAndPlay = useCallback((index: number) => {
    const audio = audioRef.current
    if (!audio) return

    cancelCanPlayRef.current?.()

    setCurrentTrack(index)
    currentTrackRef.current = index
    setIsLoading(true)
    setCurrentTime(0)
    setDuration(0)

    audio.src = tracksRef.current[index].src
    audio.load()

    const onCanPlay = () => {
      audio.play().catch(() => setIsLoading(false))
      prefetchAlbum()
    }
    audio.addEventListener('canplay', onCanPlay, { once: true })
    cancelCanPlayRef.current = () => audio.removeEventListener('canplay', onCanPlay)
  }, [prefetchAlbum])

  const loadAndPlayRef = useRef(loadAndPlay)
  loadAndPlayRef.current = loadAndPlay

  const handleTrackClick = useCallback((index: number) => {
    const audio = audioRef.current
    if (!audio) return
    if (currentTrackRef.current === index) {
      audio.paused ? audio.play().catch(() => {}) : audio.pause()
    } else {
      requestPlay(stopPlayback)
      loadAndPlay(index)
    }
  }, [loadAndPlay, requestPlay, stopPlayback])

  const handleSeekClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    const audio = audioRef.current
    if (!audio || !isFinite(audio.duration)) return
    const rect = e.currentTarget.getBoundingClientRect()
    audio.currentTime = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * audio.duration
  }, [])

  return (
    <div className='glass-card rounded-xl overflow-hidden'>
      <div className='flex flex-col md:flex-row'>

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

        <div className='flex-1 px-2 py-3 min-w-0'>
          <div className='flex items-center gap-3 px-3 pb-2 mb-1 border-b border-border/40 text-[11px] text-muted-foreground/50 uppercase tracking-widest'>
            <span className='w-5 text-center'>#</span>
            <span className='flex-1'>Utwór</span>
          </div>

          {tracks.map((track, index) => {
            const isActive = currentTrack === index
            const isHovered = hoveredTrack === index
            const indicator = isActive
              ? <EqualizerBars playing={isPlaying && !isLoading} />
              : isHovered
                ? <Play className='size-3.5 fill-foreground text-foreground' />
                : <span className='text-xs text-muted-foreground'>{index + 1}</span>

            return (
              <div
                key={index}
                className={cn(
                  'rounded-md overflow-hidden transition-colors duration-100',
                  isActive ? 'bg-primary/10' : 'hover:bg-white/[0.04]',
                )}
              >
                <div
                  className='flex items-center gap-3 px-3 py-2.5 cursor-pointer select-none'
                  onClick={() => handleTrackClick(index)}
                  onMouseEnter={() => setHoveredTrack(index)}
                  onMouseLeave={() => setHoveredTrack(null)}
                >
                  <div className='w-5 flex items-center justify-center shrink-0'>{indicator}</div>

                  <span className={cn(
                    'text-sm font-medium flex-1 truncate',
                    isActive ? 'text-primary' : 'text-foreground/90',
                  )}>
                    {track.title}
                  </span>

                  {isActive && (
                    <span className='text-[11px] text-muted-foreground tabular-nums hidden sm:inline'>
                      {formatTime(currentTime)}<span className='opacity-40'> / {formatTime(duration)}</span>
                    </span>
                  )}
                </div>

                {isActive && (
                  <SeekBar currentTime={currentTime} duration={duration} onSeek={handleSeekClick} />
                )}
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
