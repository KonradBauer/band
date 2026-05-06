'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { audioController, PlayerState, AudioTrack } from '@/lib/audio-controller'

interface PlayerContextValue {
  state: PlayerState
  play: (playlist: AudioTrack[], index: number) => void
  pause: () => void
  resume: () => void
  seek: (ratio: number) => void
  stop: () => void
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlayerState>(audioController.state)

  useEffect(() => {
    // Subscribe to controller state changes
    const unsub = audioController.subscribe(setState)
    return unsub
  }, [])

  const play = useCallback((playlist: AudioTrack[], index: number) => {
    audioController.play(playlist, index)
  }, [])

  const pause = useCallback(() => audioController.pause(), [])
  const resume = useCallback(() => audioController.resume(), [])
  const seek = useCallback((ratio: number) => audioController.seek(ratio), [])
  const stop = useCallback(() => audioController.stop(), [])

  return (
    <PlayerContext.Provider value={{ state, play, pause, resume, seek, stop }}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used inside <PlayerProvider>')
  return ctx
}
