'use client'

import React, { createContext, useContext, useRef, useCallback } from 'react'

type PauseCallback = () => void

interface AudioPlayerContextType {
  requestPlay: (pause: PauseCallback) => void
}

const AudioPlayerContext = createContext<AudioPlayerContextType>({
  requestPlay: () => {},
})

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const activePauseRef = useRef<PauseCallback | null>(null)

  const requestPlay = useCallback((pause: PauseCallback) => {
    if (activePauseRef.current && activePauseRef.current !== pause) {
      activePauseRef.current()
    }
    activePauseRef.current = pause
  }, [])

  return (
    <AudioPlayerContext.Provider value={{ requestPlay }}>
      {children}
    </AudioPlayerContext.Provider>
  )
}

export function useAudioPlayer() {
  return useContext(AudioPlayerContext)
}
