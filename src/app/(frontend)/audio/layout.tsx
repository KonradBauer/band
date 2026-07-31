import React from 'react'
import { PlayerProvider } from '@/components/player-context'

export default function AudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <PlayerProvider>{children}</PlayerProvider>
}
