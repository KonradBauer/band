import { Howl, Howler } from 'howler'
import { captureException } from '@/lib/error-reporting'

export interface AudioTrack {
  title: string
  src: string
  albumTitle?: string
  albumArt?: string
}

export type PlayerStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error'

export interface PlayerState {
  status: PlayerStatus
  track: AudioTrack | null
  trackIndex: number | null
  playlist: AudioTrack[]
  currentTime: number
  duration: number
}

type StateListener = (state: PlayerState) => void

const FADE_DURATION = 500   // ms fade-in to hide latency / click sounds
const SEEK_INTERVAL = 250   // ms between progress updates

// ─── Singleton ───────────────────────────────────────────────────────────────
// One class instance shared across the entire app. Navigation doesn't destroy it.

class AudioController {
  private active: Howl | null = null
  private lookahead: Howl | null = null   // next-track buffer
  private seekTimer: ReturnType<typeof setInterval> | null = null
  private listeners = new Set<StateListener>()

  state: PlayerState = {
    status: 'idle',
    track: null,
    trackIndex: null,
    playlist: [],
    currentTime: 0,
    duration: 0,
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  play(playlist: AudioTrack[], index: number) {
    if (
      this.state.trackIndex === index &&
      this.state.playlist === playlist &&
      this.state.status !== 'idle'
    ) {
      this.resume()
      return
    }

    this.loadAndPlay(playlist, index)
  }

  pause() {
    if (!this.active) return
    this.active.fade(this.active.volume(), 0, FADE_DURATION)
    setTimeout(() => this.active?.pause(), FADE_DURATION)
    this.setState({ status: 'paused' })
  }

  resume() {
    if (!this.active) return
    // Optimistic UI — update state immediately before buffer is ready
    this.setState({ status: 'playing' })
    this.active.play()
    this.active.fade(0, 1, FADE_DURATION)
    this.startSeekTimer()
  }

  seek(ratio: number) {
    if (!this.active) return
    const duration = this.active.duration()
    if (!isFinite(duration) || duration === 0) return
    this.active.seek(ratio * duration)
    this.setState({ currentTime: ratio * duration })
  }

  stop() {
    this.teardown()
    this.setState({
      status: 'idle',
      track: null,
      trackIndex: null,
      currentTime: 0,
      duration: 0,
    })
  }

  subscribe(fn: StateListener): () => void {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  // ── Internal ───────────────────────────────────────────────────────────────

  private loadAndPlay(playlist: AudioTrack[], index: number) {
    const track = playlist[index]
    if (!track) return

    // Optimistic UI: reflect intent immediately
    this.setState({ status: 'loading', track, trackIndex: index, playlist, currentTime: 0, duration: 0 })

    this.teardown()

    // Reuse look-ahead buffer if it was preloaded for this track
    if (this.lookahead && this.state.playlist[index]?.src === track.src) {
      this.active = this.lookahead
      this.lookahead = null
    } else {
      this.discardLookahead()
      this.active = this.createHowl(track.src)
    }

    this.active.on('load', () => {
      this.setState({ duration: this.active!.duration() })
      this.active!.volume(0)
      this.active!.play()
      this.active!.fade(0, 1, FADE_DURATION)
      this.setState({ status: 'playing' })
      this.startSeekTimer()
      this.updateMediaSession(track, playlist, index)
      this.scheduleLookahead(playlist, index)
    })

    this.active.on('play', () => {
      this.setState({ status: 'playing' })
      this.startSeekTimer()
    })

    this.active.on('pause', () => {
      this.setState({ status: 'paused' })
      this.stopSeekTimer()
    })

    this.active.on('end', () => {
      this.stopSeekTimer()
      this.setState({ currentTime: 0 })
      const next = index + 1
      if (next < playlist.length) {
        this.loadAndPlay(playlist, next)
      } else {
        this.setState({ status: 'idle', currentTime: 0 })
      }
    })

    this.active.on('loaderror', (_id: number, err: unknown) => {
      captureException(err, { context: '[AudioController] load error', src: track.src })
      this.setState({ status: 'error' })
      this.stopSeekTimer()
    })

    this.active.on('playerror', (_id: number, err: unknown) => {
      // Autoplay policy blocked — wait for next user gesture
      if (String(err).includes('NotAllowedError')) {
        this.setState({ status: 'paused' })
        return
      }
      captureException(err, { context: '[AudioController] play error', src: track.src })
      this.setState({ status: 'error' })
    })
  }

  // Preload next track silently into browser memory while current plays.
  // Howl with preload:true + html5:true fetches via range request, zero volume.
  private scheduleLookahead(playlist: AudioTrack[], currentIndex: number) {
    const nextIndex = currentIndex + 1
    if (nextIndex >= playlist.length) return

    const nextTrack = playlist[nextIndex]
    this.discardLookahead()

    this.lookahead = new Howl({
      src: [nextTrack.src],
      html5: true,
      preload: true,
      volume: 0,
      autoplay: false,
    })
  }

  private discardLookahead() {
    if (this.lookahead) {
      this.lookahead.unload()
      this.lookahead = null
    }
  }

  private createHowl(src: string): Howl {
    return new Howl({
      src: [src],
      html5: true,          // streaming via range requests, no full-file decode
      preload: true,
      volume: 1,
      autoplay: false,
      format: ['mp3', 'ogg', 'wav', 'flac', 'm4a'],
    })
  }

  private teardown() {
    if (this.active) {
      this.stopSeekTimer()
      this.active.off()     // remove all event listeners
      this.active.unload()  // release memory / HTTP connections
      this.active = null
    }
  }

  private startSeekTimer() {
    this.stopSeekTimer()
    this.seekTimer = setInterval(() => {
      if (!this.active) return
      const t = this.active.seek() as number
      if (typeof t === 'number' && isFinite(t)) {
        this.setState({ currentTime: t })
      }
    }, SEEK_INTERVAL)
  }

  private stopSeekTimer() {
    if (this.seekTimer !== null) {
      clearInterval(this.seekTimer)
      this.seekTimer = null
    }
  }

  private setState(partial: Partial<PlayerState>) {
    this.state = { ...this.state, ...partial }
    this.listeners.forEach((fn) => fn(this.state))
  }

  // ── Media Session API ──────────────────────────────────────────────────────
  // Shows track info + controls on mobile lock screen / notification centre.

  private updateMediaSession(track: AudioTrack, playlist: AudioTrack[], index: number) {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.albumTitle ?? '',
      artwork: track.albumArt
        ? [{ src: track.albumArt, sizes: '512x512', type: 'image/jpeg' }]
        : [],
    })

    navigator.mediaSession.setActionHandler('play', () => this.resume())
    navigator.mediaSession.setActionHandler('pause', () => this.pause())
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      const prev = index - 1
      if (prev >= 0) this.loadAndPlay(playlist, prev)
    })
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      const next = index + 1
      if (next < playlist.length) this.loadAndPlay(playlist, next)
    })
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime !== undefined && this.active) {
        this.active.seek(details.seekTime)
      }
    })
  }
}

// Export singleton — same instance across all imports
export const audioController = new AudioController()
