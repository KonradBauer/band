'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Howl } from 'howler'
import { Button } from '@/components/ui/button'
import { Play, Pause, Music2, Disc3 } from 'lucide-react'
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
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function AudioAlbumCard({
  title,
  description,
  coverUrl,
  tracks,
}: AudioAlbumCardProps) {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  const howlRef = useRef<Howl | null>(null)
  const rafRef = useRef<number>(0)
  const playTrackRef = useRef<(index: number) => void>(undefined)

  const { requestPlay } = useAudioPlayer()

  const destroyHowl = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    if (howlRef.current) {
      howlRef.current.unload()
      howlRef.current = null
    }
  }, [])

  const resetState = useCallback(() => {
    setIsPlaying(false)
    setCurrentTrack(null)
    setProgress(0)
    setCurrentTime(0)
    setDuration(0)
  }, [])

  const stopPlayback = useCallback(() => {
    destroyHowl()
    resetState()
  }, [destroyHowl, resetState])

  const playTrack = useCallback(
    (index: number) => {
      destroyHowl()

      const howl = new Howl({
        src: [tracks[index].src],
        html5: true,
        onload() {
          setDuration(howl.duration())
        },
        onend() {
          if (index < tracks.length - 1) {
            playTrackRef.current?.(index + 1)
          } else {
            destroyHowl()
            resetState()
          }
        },
      })

      howlRef.current = howl
      setCurrentTrack(index)
      setIsPlaying(true)
      howl.play()
    },
    [tracks, destroyHowl, resetState],
  )

  playTrackRef.current = playTrack

  const handlePlayPause = (index: number) => {
    if (currentTrack === index && howlRef.current) {
      if (isPlaying) {
        howlRef.current.pause()
        setIsPlaying(false)
      } else {
        requestPlay(stopPlayback)
        howlRef.current.play()
        setIsPlaying(true)
      }
    } else {
      requestPlay(stopPlayback)
      playTrack(index)
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (howlRef.current && currentTrack !== null) {
      const rect = e.currentTarget.getBoundingClientRect()
      const percentage = (e.clientX - rect.left) / rect.width
      howlRef.current.seek(percentage * howlRef.current.duration())
    }
  }

  // Progress tracking via requestAnimationFrame
  useEffect(() => {
    const tick = () => {
      if (howlRef.current && howlRef.current.playing()) {
        const seek = howlRef.current.seek()
        const dur = howlRef.current.duration()
        setCurrentTime(seek)
        setProgress(dur > 0 ? (seek / dur) * 100 : 0)
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    if (isPlaying) {
      rafRef.current = requestAnimationFrame(tick)
    } else {
      cancelAnimationFrame(rafRef.current)
    }

    return () => cancelAnimationFrame(rafRef.current)
  }, [isPlaying])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current)
      howlRef.current?.unload()
    }
  }, [])

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Cover + album info */}
        <div className="md:w-64 shrink-0 p-6 flex flex-col items-center md:items-start gap-4 bg-card/80">
          {coverUrl ? (
            <div className="relative w-48 h-48 md:w-52 md:h-52 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={coverUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 192px, 208px"
              />
            </div>
          ) : (
            <div className="w-48 h-48 md:w-52 md:h-52 rounded-lg bg-primary/10 flex items-center justify-center">
              <Disc3 className="size-16 text-primary/40" />
            </div>
          )}
          <div className="text-center md:text-left">
            <h2 className="font-heading text-xl text-primary font-bold">{title}</h2>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </div>

        {/* Tracks */}
        <div className="flex-1 p-4 md:p-6">
          <div className="space-y-1">
            {tracks.map((track, index) => {
              const isActive = currentTrack === index
              const isCurrentlyPlaying = isActive && isPlaying

              return (
                <div key={index}>
                  <div
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors border',
                      isActive
                        ? 'bg-primary/10 border-primary/20'
                        : 'hover:bg-card border-transparent',
                    )}
                  >
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handlePlayPause(index)}
                    >
                      {isCurrentlyPlaying ? (
                        <Pause className={cn('size-[18px]', isActive && 'text-primary')} />
                      ) : (
                        <Play className={cn('size-[18px]', isActive && 'text-primary')} />
                      )}
                    </Button>

                    <span className="text-sm text-muted-foreground w-5 text-right">
                      {index + 1}
                    </span>

                    <Music2
                      className={cn('size-4 text-primary', !isActive && 'hidden')}
                    />

                    <span
                      className={cn(
                        'text-sm font-medium flex-1',
                        isActive ? 'text-primary' : 'text-foreground',
                      )}
                    >
                      {track.title}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {isActive
                        ? `${formatTime(currentTime)} / ${formatTime(duration)}`
                        : ''}
                    </span>
                  </div>

                  {isActive && (
                    <div
                      className="h-1 bg-border rounded-full overflow-hidden mt-1 mx-3 cursor-pointer"
                      onClick={handleProgressClick}
                    >
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
