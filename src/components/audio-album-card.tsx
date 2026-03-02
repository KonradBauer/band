'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import WaveSurfer from 'wavesurfer.js'
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
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const wsRef = useRef<WaveSurfer | null>(null)
  const containerRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  const playTrackRef = useRef<(index: number) => void>(undefined)

  const { requestPlay } = useAudioPlayer()

  const destroyWaveSurfer = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.destroy()
      wsRef.current = null
    }
  }, [])

  const resetState = useCallback(() => {
    setIsPlaying(false)
    setCurrentTrack(null)
    setCurrentTime(0)
    setDuration(0)
  }, [])

  const stopPlayback = useCallback(() => {
    destroyWaveSurfer()
    resetState()
  }, [destroyWaveSurfer, resetState])

  const playTrack = useCallback(
    (index: number) => {
      destroyWaveSurfer()

      const container = containerRefs.current.get(index)
      if (!container) return

      const ws = WaveSurfer.create({
        container,
        waveColor: 'rgba(201, 168, 76, 0.3)',
        progressColor: '#c9a84c',
        cursorColor: '#c9a84c',
        barWidth: 2,
        barGap: 2,
        barRadius: 2,
        height: 40,
        url: tracks[index].src,
        backend: 'MediaElement',
      })

      ws.on('ready', () => {
        setDuration(ws.getDuration())
        ws.play()
      })

      ws.on('audioprocess', () => {
        setCurrentTime(ws.getCurrentTime())
      })

      ws.on('seeking', () => {
        setCurrentTime(ws.getCurrentTime())
      })

      ws.on('finish', () => {
        if (index < tracks.length - 1) {
          playTrackRef.current?.(index + 1)
        } else {
          destroyWaveSurfer()
          resetState()
        }
      })

      wsRef.current = ws
      setCurrentTrack(index)
      setIsPlaying(true)
    },
    [tracks, destroyWaveSurfer, resetState],
  )

  playTrackRef.current = playTrack

  const handlePlayPause = (index: number) => {
    if (currentTrack === index && wsRef.current) {
      if (isPlaying) {
        wsRef.current.pause()
        setIsPlaying(false)
      } else {
        requestPlay(stopPlayback)
        wsRef.current.play()
        setIsPlaying(true)
      }
    } else {
      requestPlay(stopPlayback)
      playTrack(index)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      wsRef.current?.destroy()
    }
  }, [])

  return (
    <div className="glass-card rounded-xl overflow-hidden">
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
              <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{description}</p>
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

                  {/* Waveform container - always rendered, visible only when active */}
                  <div
                    ref={(el) => {
                      if (el) containerRefs.current.set(index, el)
                    }}
                    className={cn(
                      'mx-3 mt-1 transition-all duration-300',
                      isActive ? 'h-10 opacity-100' : 'h-0 opacity-0 overflow-hidden',
                    )}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
