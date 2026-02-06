"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Music2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Track {
  title: string;
  src: string;
}

interface AudioPlayerProps {
  tracks: Track[];
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export default function AudioPlayer({ tracks }: AudioPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handlePlayPause = (index: number) => {
    if (currentTrack === index) {
      if (isPlaying) {
        audioRef.current?.pause()
        setIsPlaying(false)
      } else {
        audioRef.current?.play()
        setIsPlaying(true)
      }
    } else {
      setCurrentTrack(index)
      setIsPlaying(true)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleEnded = () => {
    if (currentTrack !== null && currentTrack < tracks.length - 1) {
      setCurrentTrack(currentTrack + 1)
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
      setCurrentTrack(null)
      setProgress(0)
      setCurrentTime(0)
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && currentTrack !== null) {
      const rect = e.currentTarget.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const percentage = clickX / rect.width
      const newTime = percentage * audioRef.current.duration
      audioRef.current.currentTime = newTime
    }
  }

  useEffect(() => {
    if (currentTrack !== null && audioRef.current) {
      audioRef.current.src = tracks[currentTrack].src
      if (isPlaying) {
        audioRef.current.play()
      }
    }
  }, [currentTrack, tracks, isPlaying])

  return (
    <div className="space-y-1">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      {tracks.map((track, index) => {
        const isActive = currentTrack === index
        const isCurrentlyPlaying = isActive && isPlaying

        return (
          <div key={index}>
            <div
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-lg transition-colors border",
                isActive
                  ? "bg-primary/10 border-primary/20"
                  : "hover:bg-card border-transparent"
              )}
            >
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handlePlayPause(index)}
              >
                {isCurrentlyPlaying ? (
                  <Pause className={cn("size-[18px]", isActive && "text-primary")} />
                ) : (
                  <Play className={cn("size-[18px]", isActive && "text-primary")} />
                )}
              </Button>

              <span className="text-sm text-muted-foreground w-6 text-right">
                {index + 1}
              </span>

              <Music2
                className={cn(
                  "size-4 text-primary",
                  !isActive && "hidden"
                )}
              />

              <span
                className={cn(
                  "text-sm font-medium flex-1",
                  isActive ? "text-primary" : "text-foreground"
                )}
              >
                {track.title}
              </span>

              <span className="text-xs text-muted-foreground">
                {isActive
                  ? `${formatTime(currentTime)} / ${formatTime(duration)}`
                  : formatTime(duration)}
              </span>
            </div>

            {isActive && (
              <div
                className="h-1 bg-border rounded-full overflow-hidden mt-2 mx-4 cursor-pointer"
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
  )
}
