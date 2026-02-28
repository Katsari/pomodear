import type { PanelName } from '~/types'

const panelNames: PanelName[] = ['music', 'tasks', 'dailyNote', 'quote']

let _panels: Ref<Record<PanelName, boolean>> | null = null
let _initialized = false

export function usePanels() {
  const { isMobile } = useIsMobile()

  if (!_panels) {
    _panels = useLocalStorage<Record<PanelName, boolean>>('pomodear-panels', {
      music: true,
      tasks: true,
      dailyNote: true,
      quote: true
    })
  }

  // On mobile, close all panels by default (run once per page load)
  if (!_initialized && import.meta.client) {
    _initialized = true
    if (isMobile.value) {
      for (const name of panelNames) {
        _panels.value[name] = false
      }
    }
  }

  function togglePanel(name: PanelName) {
    if (isMobile.value) {
      const wasOpen = _panels!.value[name]
      closeAllPanels()
      if (!wasOpen) _panels!.value[name] = true
    } else {
      _panels!.value[name] = !_panels!.value[name]
    }
  }

  function closePanel(name: PanelName) {
    _panels!.value[name] = false
  }

  function openPanel(name: PanelName) {
    _panels!.value[name] = true
  }

  function closeAllPanels() {
    for (const name of panelNames) {
      _panels!.value[name] = false
    }
  }

  const activeMobilePanel = computed<PanelName | null>(() => {
    return panelNames.find(n => _panels!.value[n]) ?? null
  })

  return {
    panels: _panels,
    togglePanel,
    closePanel,
    openPanel,
    closeAllPanels,
    activeMobilePanel
  }
}
