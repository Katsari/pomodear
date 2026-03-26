import type { AmbientSound, AudioTrack } from '~/types'

const playlist: AudioTrack[] = [
  { title: 'Sweet September', artist: 'Arulo', src: '/audio/music/sweet-september.ogg', duration: 99 },
  { title: 'Sleepy Cat', artist: 'A. M.', src: '/audio/music/sleepy-cat.ogg', duration: 119 },
  { title: 'Tokyo Sunset', artist: 'HoliznaCC0', src: '/audio/music/tokyo-sunset.ogg', duration: 138 },
  { title: 'Lucid', artist: 'HoliznaCC0', src: '/audio/music/lucid.ogg', duration: 150 },
  { title: 'Moon Unit', artist: 'HoliznaCC0', src: '/audio/music/moon-unit.ogg', duration: 162 },
  { title: 'Shimmer', artist: 'HoliznaCC0', src: '/audio/music/shimmer.ogg', duration: 144 },
  { title: 'Morning Coffee', artist: 'HoliznaCC0', src: '/audio/music/morning-coffee.ogg', duration: 191 },
  { title: 'Creature Comforts', artist: 'HoliznaCC0', src: '/audio/music/creature-comforts.ogg', duration: 174 },
  { title: 'Autumn', artist: 'HoliznaCC0', src: '/audio/music/autumn.ogg', duration: 169 }
]

const AMBIENT_FILES: Record<AmbientSound, string> = {
  rain: '/audio/ambient/gentle-rain.ogg',
  fireplace: '/audio/ambient/fireplace.ogg',
  forest: '/audio/ambient/forest.ogg',
  ocean: '/audio/ambient/ocean.ogg'
}

// Singleton state
let _initialized = false
const _isPlaying = ref(false)
const _currentTrackIndex = ref(0)
const _trackProgress = ref(0)
const _trackDuration = ref(0)
const _shuffle = ref(false)
const _repeat = ref<'off' | 'all' | 'one'>('off')
let _musicVolume: Ref<number> | null = null
let _ambientVolume: Ref<number> | null = null
let _ambientVolumes: Ref<Record<AmbientSound, number>> | null = null

// Audio elements (created once on client)
let _musicAudio: HTMLAudioElement | null = null
let _ambientAudios: Record<AmbientSound, HTMLAudioElement> | null = null
let _bellAudio: HTMLAudioElement | null = null
let _progressRaf: number | null = null

// Shuffle history for fair shuffling
let _shuffleHistory: number[] = []

export function useAudio() {
  if (!_musicVolume) _musicVolume = useLocalStorage('pomodear-volume-music', 60)
  if (!_ambientVolume) _ambientVolume = useLocalStorage('pomodear-volume-ambient', 50)
  if (!_ambientVolumes) {
    _ambientVolumes = useLocalStorage<Record<AmbientSound, number>>('pomodear-volume-ambients', {
      rain: 0,
      fireplace: 0,
      forest: 0,
      ocean: 0
    })
  }

  // Initialize audio elements once on client
  if (import.meta.client && !_initialized) {
    _initialized = true

    // Music player
    _musicAudio = new Audio()
    _musicAudio.volume = 0
    _musicAudio.preload = 'auto'

    _musicAudio.addEventListener('loadedmetadata', () => {
      if (_musicAudio!.duration && isFinite(_musicAudio!.duration)) {
        _trackDuration.value = _musicAudio!.duration
        const track = playlist[_currentTrackIndex.value]
        if (track) track.duration = _musicAudio!.duration
      }
    })

    _musicAudio.addEventListener('ended', () => {
      onTrackEnded()
    })

    // Ambient audio elements (looping)
    _ambientAudios = {} as Record<AmbientSound, HTMLAudioElement>
    for (const [key, src] of Object.entries(AMBIENT_FILES)) {
      const audio = new Audio(src)
      audio.loop = true
      audio.volume = 0
      audio.preload = 'none'
      _ambientAudios[key as AmbientSound] = audio
    }

    // Bell notification sound
    _bellAudio = new Audio('/audio/sfx/bell-calm.ogg')
    _bellAudio.preload = 'auto'
    _bellAudio.volume = 0.7

    // Load first track
    loadTrack(_currentTrackIndex.value)

    // Track progress via requestAnimationFrame
    function updateProgress() {
      if (_musicAudio && _isPlaying.value && _musicAudio.duration) {
        _trackProgress.value = _musicAudio.currentTime / _musicAudio.duration
      }
      _progressRaf = requestAnimationFrame(updateProgress)
    }
    _progressRaf = requestAnimationFrame(updateProgress)

    // React to volume changes
    watch(() => _musicVolume!.value, () => {
      if (_musicAudio) {
        _musicAudio.volume = _musicVolume!.value / 100
      }
    }, { immediate: true })

    watch(() => _ambientVolume!.value, applyAmbientVolumes, { immediate: true })

    // React to per-sound ambient volume changes (play/pause sounds)
    watch(() => _ambientVolumes!.value, () => {
      applyAmbientVolumes()
      syncAmbientPlayback()
    }, { deep: true })

    // On first user interaction after page load, resume any ambient sounds
    // that were persisted but blocked by browser autoplay policy.
    // Must be a direct event listener (not a watcher) so the browser
    // treats audio.play() as triggered by a user gesture.
    const resumeAmbient = () => {
      applyAmbientVolumes()
      syncAmbientPlayback()
      document.removeEventListener('pointerdown', resumeAmbient)
    }
    document.addEventListener('pointerdown', resumeAmbient)

    // When tab becomes visible, re-sync ambient playback
    // (browsers may suspend audio when tab is backgrounded)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        syncAmbientPlayback()
      }
    })
  }

  /**
   * Ensure each ambient sound's play/pause state matches its volume setting.
   * Sounds with volume > 0 should be playing; sounds at 0 should be paused.
   */
  function syncAmbientPlayback() {
    if (!_ambientAudios || !_ambientVolumes) return
    for (const [key, audio] of Object.entries(_ambientAudios)) {
      const vol = _ambientVolumes.value[key as AmbientSound]
      if (vol > 0 && audio.paused) {
        audio.play().catch(() => {})
      } else if (vol === 0 && !audio.paused) {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }

  /**
   * Apply the computed volume (master * per-sound) to each ambient element.
   */
  function applyAmbientVolumes() {
    if (!_ambientAudios || !_ambientVolumes || !_ambientVolume) return
    const master = _ambientVolume.value / 100
    for (const [key, audio] of Object.entries(_ambientAudios)) {
      const perSound = _ambientVolumes.value[key as AmbientSound] / 100
      audio.volume = Math.min(1, master * perSound)
    }
  }

  function onTrackEnded() {
    if (_repeat.value === 'one') {
      // Replay same track
      if (_musicAudio) {
        _musicAudio.currentTime = 0
        _musicAudio.play().catch(() => {})
      }
      return
    }

    const nextIdx = getNextTrackIndex()
    if (nextIdx === -1) {
      // No repeat, end of playlist
      _isPlaying.value = false
      _trackProgress.value = 0
      return
    }

    _currentTrackIndex.value = nextIdx
    loadAndPlayCurrent()
  }

  function getNextTrackIndex(): number {
    if (_shuffle.value) {
      _shuffleHistory.push(_currentTrackIndex.value)
      const available = playlist
        .map((_, i) => i)
        .filter(i => i !== _currentTrackIndex.value)
      if (available.length === 0) return _repeat.value !== 'off' ? 0 : -1
      return available[Math.floor(Math.random() * available.length)]!
    }

    const next = _currentTrackIndex.value + 1
    if (next >= playlist.length) {
      return _repeat.value === 'all' ? 0 : -1
    }
    return next
  }

  function loadTrack(index: number) {
    if (!_musicAudio) return
    const track = playlist[index]
    if (!track) return
    _musicAudio.src = track.src
    _musicAudio.load()
    _trackProgress.value = 0
    _trackDuration.value = track.duration
  }

  function loadAndPlayCurrent() {
    loadTrack(_currentTrackIndex.value)
    _musicAudio?.play().catch(() => {})
  }

  const currentTrack = computed(() => playlist[_currentTrackIndex.value])
  const currentTrackIndex = computed(() => _currentTrackIndex.value)

  const activeAmbients = computed(() => {
    return (Object.keys(_ambientVolumes!.value) as AmbientSound[])
      .filter(key => _ambientVolumes!.value[key] > 0)
  })

  function togglePlay() {
    if (!_musicAudio) return
    if (_isPlaying.value) {
      _musicAudio.pause()
      _isPlaying.value = false
    } else {
      _musicAudio.play().catch(() => {})
      _isPlaying.value = true
    }
    // Any user-initiated action is a chance to resume blocked ambient sounds
    syncAmbientPlayback()
  }

  function playTrack(index: number) {
    if (index < 0 || index >= playlist.length) return
    _currentTrackIndex.value = index
    loadAndPlayCurrent()
    _isPlaying.value = true
    syncAmbientPlayback()
  }

  function nextTrack() {
    if (_shuffle.value) {
      const nextIdx = getNextTrackIndex()
      _currentTrackIndex.value = nextIdx === -1 ? 0 : nextIdx
    } else {
      _currentTrackIndex.value = (_currentTrackIndex.value + 1) % playlist.length
    }
    if (_isPlaying.value) loadAndPlayCurrent()
    else loadTrack(_currentTrackIndex.value)
  }

  function prevTrack() {
    if (_musicAudio && _musicAudio.currentTime > 3) {
      _musicAudio.currentTime = 0
      _trackProgress.value = 0
      return
    }
    if (_shuffle.value && _shuffleHistory.length > 0) {
      _currentTrackIndex.value = _shuffleHistory.pop()!
    } else {
      _currentTrackIndex.value = (_currentTrackIndex.value - 1 + playlist.length) % playlist.length
    }
    if (_isPlaying.value) loadAndPlayCurrent()
    else loadTrack(_currentTrackIndex.value)
  }

  function toggleShuffle() {
    _shuffle.value = !_shuffle.value
    if (!_shuffle.value) _shuffleHistory = []
  }

  function toggleRepeat() {
    const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one']
    const idx = modes.indexOf(_repeat.value)
    _repeat.value = modes[(idx + 1) % modes.length]!
  }

  function setAmbientVolume(vol: number) {
    _ambientVolume!.value = Math.max(0, Math.min(100, vol))
  }

  function setMusicVolume(vol: number) {
    _musicVolume!.value = Math.max(0, Math.min(100, vol))
  }

  function toggleAmbient(sound: AmbientSound) {
    if (_ambientVolumes!.value[sound] > 0) {
      _ambientVolumes!.value[sound] = 0
    } else {
      _ambientVolumes!.value[sound] = 50
    }
    // Sync immediately within the user gesture so browsers allow playback
    applyAmbientVolumes()
    syncAmbientPlayback()
  }

  function isAmbientActive(sound: AmbientSound) {
    return _ambientVolumes!.value[sound] > 0
  }

  function playBell() {
    if (!_bellAudio) return
    const loudest = Math.max(_musicVolume?.value ?? 0, _ambientVolume?.value ?? 0) / 100
    _bellAudio.volume = Math.min(1, Math.max(0.5, loudest + 0.3))
    _bellAudio.currentTime = 0
    _bellAudio.play().catch(() => {})
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${String(s).padStart(2, '0')}`
  }

  const currentTimeDisplay = computed(() => {
    if (!_musicAudio || !_trackDuration.value) return '0:00'
    return formatTime(_trackProgress.value * _trackDuration.value)
  })

  const totalTimeDisplay = computed(() => {
    if (!_trackDuration.value) return '0:00'
    return formatTime(_trackDuration.value)
  })

  return {
    isPlaying: _isPlaying,
    currentTrack,
    currentTrackIndex,
    playlist,
    trackProgress: _trackProgress,
    musicVolume: _musicVolume,
    ambientVolume: _ambientVolume,
    ambientVolumes: _ambientVolumes,
    activeAmbients,
    shuffle: _shuffle,
    repeat: _repeat,
    currentTimeDisplay,
    totalTimeDisplay,
    togglePlay,
    playTrack,
    nextTrack,
    prevTrack,
    toggleShuffle,
    toggleRepeat,
    setMusicVolume,
    setAmbientVolume,
    toggleAmbient,
    isAmbientActive,
    playBell
  }
}
