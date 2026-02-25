import type { TimerSettings } from '~/types'

const defaultSettings: TimerSettings = {
  focusDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLong: 4
}

// Shared singleton state
let _userName: Ref<string> | null = null
let _timerSettings: Ref<TimerSettings> | null = null
let _selectedBackground: Ref<string> | null = null

export function useSettings() {
  if (!_userName) _userName = useLocalStorage('pomodear-username', '')
  if (!_timerSettings) _timerSettings = useLocalStorage<TimerSettings>('pomodear-settings', defaultSettings)
  if (!_selectedBackground) _selectedBackground = useLocalStorage('pomodear-background', 'dragon-shrine')

  return {
    userName: _userName,
    timerSettings: _timerSettings,
    selectedBackground: _selectedBackground
  }
}
