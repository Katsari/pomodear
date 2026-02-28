import type { PanelName } from '~/types'

let _initialized = false
let _preMuteVolume = 50
const _showShortcuts = ref(false)

export function useKeyboardShortcuts() {
  if (!_initialized && import.meta.client) {
    _initialized = true

    const { togglePlay: timerToggle, skip, restart } = useTimer()
    const { togglePanel } = usePanels()
    const { nextTrack, prevTrack, musicVolume, setMusicVolume } = useAudio()

    const panelKeys: Record<string, PanelName> = {
      1: 'music',
      2: 'tasks',
      3: 'dailyNote',
      4: 'quote'
    }

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return

      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT'
        || target.tagName === 'TEXTAREA'
        || target.isContentEditable
      ) return

      const key = e.key

      // Help
      if (key === '?') {
        _showShortcuts.value = !_showShortcuts.value
        return
      }

      // Timer
      if (e.code === 'Space') {
        e.preventDefault()
        timerToggle()
        return
      }
      if (key === 'r') {
        restart()
        return
      }
      if (key === 's') {
        skip()
        return
      }

      // Panels
      const panel = panelKeys[key]
      if (panel) {
        togglePanel(panel)
        return
      }

      // Music
      if (key === 'n') {
        nextTrack()
        return
      }
      if (key === 'p') {
        prevTrack()
        return
      }
      if (key === 'm') {
        if (musicVolume!.value > 0) {
          _preMuteVolume = musicVolume!.value
          setMusicVolume(0)
        } else {
          setMusicVolume(_preMuteVolume)
        }
      }
    })
  }

  return {
    showShortcuts: _showShortcuts
  }
}
