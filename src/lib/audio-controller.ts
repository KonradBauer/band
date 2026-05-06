import { Howl } from 'howler'
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

const FADE_OUT_DURATION = 300  // ms — pause fade-out only
const SEEK_INTERVAL = 250      // ms between progress updates

// ─── Singleton ───────────────────────────────────────────────────────────────

class AudioController {
  private active: Howl | null = null
  private lookahead: Howl | null = null
  private lookaheadSrc: string | null = null
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
    this.stopSeekTimer()
    this.active.fade(1, 0, FADE_OUT_DURATION)
    setTimeout(() => this.active?.pause(), FADE_OUT_DURATION)
    this.setState({ status: 'paused' })
  }

  resume() {
    if (!this.active) return
    this.setState({ status: 'playing' })
    this.active.play()
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

    this.setState({ status: 'loading', track, trackIndex: index, playlist, currentTime: 0, duration: 0 })
    this.teardown()

    // Reuse lookahead only when its src matches the requested track
    if (this.lookahead && this.lookaheadSrc === track.src) {
      this.active = this.lookahead
      this.lookahead = null
      this.lookaheadSrc = null
    } else {
      this.discardLookahead()
      this.active = this.createHowl(track.src)
    }

    const howl = this.active

    const startPlay = () => {
      // Guard against stale callbacks if a newer loadAndPlay superseded this one
      if (this.active !== howl) return
      this.setState({ duration: howl.duration() })
      howl.play()
      this.setState({ status: 'playing' })
      this.startSeekTimer()
      this.updateMediaSession(track, playlist, index)
      this.scheduleLookahead(playlist, index)
      this.bufferFullTrack(track.src)
    }

    // If howl already loaded (lookahead reuse), on('load') won't fire — call directly
    if (howl.state() === 'loaded') {
      startPlay()
    } else {
      howl.once('load', startPlay)
    }

    howl.on('play', () => {
      if (this.active !== howl) return
      this.setState({ status: 'playing' })
      this.startSeekTimer()
    })

    howl.on('pause', () => {
      if (this.active !== howl) return
      this.setState({ status: 'paused' })
      this.stopSeekTimer()
    })

    howl.on('end', () => {
      if (this.active !== howl) return
      this.stopSeekTimer()
      this.setState({ currentTime: 0 })
      const next = index + 1
      if (next < playlist.length) {
        this.loadAndPlay(playlist, next)
      } else {
        this.setState({ status: 'idle', currentTime: 0 })
      }
    })

    howl.on('loaderror', (_id: number, err: unknown) => {
      captureException(err, { context: '[AudioController] load error', src: track.src })
      this.setState({ status: 'error' })
      this.stopSeekTimer()
    })

    howl.on('playerror', (_id: number, err: unknown) => {
      if (String(err).includes('NotAllowedError')) {
        this.setState({ status: 'paused' })
        return
      }
      captureException(err, { context: '[AudioController] play error', src: track.src })
      this.setState({ status: 'error' })
    })
  }

  private scheduleLookahead(playlist: AudioTrack[], currentIndex: number) {
    const nextIndex = currentIndex + 1
    if (nextIndex >= playlist.length) return

    const nextTrack = playlist[nextIndex]
    this.discardLookahead()

    this.lookaheadSrc = nextTrack.src
    this.lookahead = new Howl({
      src: [nextTrack.src],
      html5: true,
      preload: true,
      volume: 1,
      autoplay: false,
    })
  }

  private bufferFullTrack(src: string) {
    if (typeof fetch === 'undefined') return
    fetch(src).catch(() => {})
  }

  private discardLookahead() {
    if (this.lookahead) {
      this.lookahead.unload()
      this.lookahead = null
      this.lookaheadSrc = null
    }
  }

  private createHowl(src: string): Howl {
    return new Howl({
      src: [src],
      html5: true,
      preload: true,
      volume: 1,
      autoplay: false,
      format: ['mp3', 'ogg', 'wav', 'flac', 'm4a'],
    })
  }

  private teardown() {
    if (this.active) {
      this.stopSeekTimer()
      this.active.off()
      this.active.unload()
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

export const audioController = new AudioController()
