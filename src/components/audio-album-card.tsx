'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Play, Pause, SkipBack, SkipForward, Disc3 } from 'lucide-react'
import { cn } from '@/lib/utils'
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

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds) || seconds < 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
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
              ? {
                  animation: 'eq-bar 0.8s ease-in-out infinite alternate',
                  animationDelay: `${i * 0.2}s`,
                }
              : { height: '4px' }
          }
        />
      ))}
    </span>
  )
}

export default function AudioAlbumCard({ title, description, coverUrl, tracks }: AudioAlbumCardProps) {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [hoveredTrack, setHoveredTrack] = useState<number | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  // Silent element used only for prefetching next track into browser HTTP cache
  const prefetchRef = useRef<HTMLAudioElement | null>(null)
  // Ref so event handlers always see the latest track index without stale closure
  const currentTrackRef = useRef<number | null>(null)
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

  // Create single audio element once on mount
  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'auto'
    audioRef.current = audio

    // Silent prefetch element — loads next track into browser HTTP cache while current plays
    const prefetch = new Audio()
    prefetch.preload = 'auto'
    prefetch.volume = 0
    prefetch.muted = true
    prefetchRef.current = prefetch

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onDurationChange = () => {
      if (isFinite(audio.duration)) setDuration(audio.duration)
    }
    const onPlay = () => { setIsPlaying(true); setIsLoading(false) }
    const onPause = () => setIsPlaying(false)
    const onWaiting = () => setIsLoading(true)
    const onPlaying = () => setIsLoading(false)
    const onEnded = () => {
      const idx = currentTrackRef.current
      if (idx !== null && idx < tracksRef.current.length - 1) {
        loadAndPlayRef.current(idx + 1)
      } else {
        setIsPlaying(false)
        setCurrentTime(0)
      }
    }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDurationChange)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.pause()
      audio.src = ''
      prefetch.src = ''
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

  const loadAndPlay = useCallback((index: number) => {
    const audio = audioRef.current
    if (!audio) return

    setCurrentTrack(index)
    currentTrackRef.current = index
    setIsLoading(true)
    setCurrentTime(0)
    setDuration(0)

    audio.src = tracksRef.current[index].src
    audio.load()

    // canplay fires when enough data is buffered — no need to wait for full download
    const onCanPlay = () => {
      audio.play().catch(() => setIsLoading(false))
      audio.removeEventListener('canplay', onCanPlay)
    }
    audio.addEventListener('canplay', onCanPlay)
  }, [])

  // Stable ref so the `ended` handler can always call the latest loadAndPlay
  const loadAndPlayRef = useRef(loadAndPlay)
  loadAndPlayRef.current = loadAndPlay

  const handleTrackClick = useCallback((index: number) => {
    const audio = audioRef.current
    if (!audio) return

    if (currentTrackRef.current === index) {
      if (audio.paused) {
        audio.play().catch(() => {})
      } else {
        audio.pause()
      }
    } else {
      requestPlay(stopPlayback)
      loadAndPlay(index)
    }
  }, [loadAndPlay, requestPlay, stopPlayback])

  const handlePrev = useCallback(() => {
    const idx = currentTrackRef.current
    if (idx === null) return
    // If >3s in, restart; otherwise go to previous
    if (currentTime > 3 && audioRef.current) {
      audioRef.current.currentTime = 0
    } else if (idx > 0) {
      loadAndPlay(idx - 1)
    }
  }, [currentTime, loadAndPlay])

  const handleNext = useCallback(() => {
    const idx = currentTrackRef.current
    if (idx === null || idx >= tracks.length - 1) return
    loadAndPlay(idx + 1)
  }, [loadAndPlay, tracks.length])

  const handleTrackHover = useCallback((index: number) => {
    setHoveredTrack(index)
    // Prefetch on hover — user hovers ~100-300ms before clicking, enough for a head start
    const pf = prefetchRef.current
    if (!pf) return
    const src = tracksRef.current[index].src
    if (pf.src !== src && index !== currentTrackRef.current) {
      pf.src = src
      pf.load()
    }
  }, [])

  const handleSeekClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !isFinite(audio.duration)) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    audio.currentTime = ratio * audio.duration
  }, [])

  const handlePlayAll = useCallback(() => {
    if (currentTrackRef.current !== null) {
      handleTrackClick(currentTrackRef.current)
    } else if (tracks.length > 0) {
      requestPlay(stopPlayback)
      loadAndPlay(0)
    }
  }, [handleTrackClick, loadAndPlay, requestPlay, stopPlayback, tracks.length])

  const progress = duration > 0 ? currentTime / duration : 0

  return (
    <div className='glass-card rounded-xl overflow-hidden'>
      <div className='flex flex-col md:flex-row'>

        {/* Left column — cover + album info */}
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
              <p className='text-xs text-muted-foreground mt-2 whitespace-pre-line leading-relaxed'>
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Right column — tracks + controls */}
        <div className='flex-1 flex flex-col min-w-0'>

          {/* Track list */}
          <div className='flex-1 px-2 py-3 overflow-y-auto'>
            {/* Column header */}
            <div className='flex items-center gap-3 px-3 pb-2 mb-1 border-b border-border/40 text-[11px] text-muted-foreground/50 uppercase tracking-widest'>
              <span className='w-5 text-center'>#</span>
              <span className='flex-1'>Utwór</span>
            </div>

            {tracks.map((track, index) => {
              const isActive = currentTrack === index
              const isHovered = hoveredTrack === index

              return (
                <div
                  key={index}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer select-none transition-colors duration-100',
                    isActive ? 'bg-primary/10' : 'hover:bg-white/[0.04]',
                  )}
                  onClick={() => handleTrackClick(index)}
                  onMouseEnter={() => handleTrackHover(index)}
                  onMouseLeave={() => setHoveredTrack(null)}
                >
                  {/* Number / state indicator */}
                  <div className='w-5 flex items-center justify-center shrink-0 text-center'>
                    {isActive ? (
                      <EqualizerBars playing={isPlaying && !isLoading} />
                    ) : isHovered ? (
                      <Play className='size-3.5 fill-foreground text-foreground' />
                    ) : (
                      <span className='text-xs text-muted-foreground'>{index + 1}</span>
                    )}
                  </div>

                  <span
                    className={cn(
                      'text-sm font-medium flex-1 truncate',
                      isActive ? 'text-primary' : 'text-foreground/90',
                    )}
                  >
                    {track.title}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Player controls bar */}
          <div className='border-t border-border/50 bg-card/40 px-4 pt-3 pb-4 space-y-2.5'>

            {/* Seek bar */}
            <div className='flex items-center gap-2.5'>
              <span className='text-[11px] text-muted-foreground tabular-nums w-7 text-right'>
                {formatTime(currentTime)}
              </span>

              <div
                className='flex-1 h-1 rounded-full bg-border/80 cursor-pointer relative group/seek'
                onClick={handleSeekClick}
              >
                {/* Filled portion */}
                <div
                  className='absolute inset-y-0 left-0 bg-primary rounded-full'
                  style={{ width: `${progress * 100}%` }}
                />
                {/* Hover thumb */}
                <div
                  className='absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-3 bg-foreground rounded-full shadow opacity-0 group-hover/seek:opacity-100 transition-opacity pointer-events-none'
                  style={{ left: `${progress * 100}%` }}
                />
              </div>

              <span className='text-[11px] text-muted-foreground tabular-nums w-7'>
                {formatTime(duration)}
              </span>
            </div>

            {/* Buttons */}
            <div className='flex items-center justify-center gap-6'>
              <button
                onClick={handlePrev}
                disabled={currentTrack === null}
                className='text-muted-foreground hover:text-foreground transition-colors disabled:opacity-25 disabled:cursor-not-allowed'
                aria-label='Poprzedni utwór'
              >
                <SkipBack className='size-[18px] fill-current' />
              </button>

              <button
                onClick={handlePlayAll}
                className={cn(
                  'size-10 rounded-full flex items-center justify-center',
                  'bg-primary text-primary-foreground',
                  'hover:scale-105 active:scale-95 transition-transform',
                  isLoading && 'animate-pulse',
                )}
                aria-label={isPlaying ? 'Pauza' : 'Odtwórz'}
              >
                {isPlaying && !isLoading ? (
                  <Pause className='size-[18px] fill-current' />
                ) : (
                  <Play className='size-[18px] fill-current ml-0.5' />
                )}
              </button>

              <button
                onClick={handleNext}
                disabled={currentTrack === null || currentTrack >= tracks.length - 1}
                className='text-muted-foreground hover:text-foreground transition-colors disabled:opacity-25 disabled:cursor-not-allowed'
                aria-label='Następny utwór'
              >
                <SkipForward className='size-[18px] fill-current' />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
