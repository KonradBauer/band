import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import { PlayerProvider, usePlayer } from '@/components/player-context'

function PlayerConsumer() {
  const { state } = usePlayer()
  return React.createElement('div', { 'data-testid': 'player-status' }, state.status)
}

describe('PlayerContext scope', () => {
  it('throws when usePlayer is called outside PlayerProvider', () => {
    // React logs the thrown error to console.error during render — expected noise for this case.
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(React.createElement(PlayerConsumer))).toThrow(
      'usePlayer must be used inside <PlayerProvider>',
    )
    consoleErrorSpy.mockRestore()
  })

  it('provides player state when rendered inside PlayerProvider (e.g. within /audio route)', () => {
    const { getByTestId } = render(
      React.createElement(PlayerProvider, null, React.createElement(PlayerConsumer)),
    )
    expect(getByTestId('player-status').textContent).toBe('idle')
  })
})
