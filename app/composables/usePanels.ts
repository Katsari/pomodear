import type { PanelName } from '~/types'

let _panels: Ref<Record<PanelName, boolean>> | null = null

export function usePanels() {
  if (!_panels) {
    _panels = useLocalStorage<Record<PanelName, boolean>>('pomodear-panels', {
      music: true,
      tasks: true,
      dailyNote: true,
      quote: true
    })
  }

  function togglePanel(name: PanelName) {
    _panels!.value[name] = !_panels!.value[name]
  }

  function closePanel(name: PanelName) {
    _panels!.value[name] = false
  }

  function openPanel(name: PanelName) {
    _panels!.value[name] = true
  }

  return {
    panels: _panels,
    togglePanel,
    closePanel,
    openPanel
  }
}
