import type { TimerMode } from '~/types'

// Shared singleton state
let _initialized = false
const _currentMode = ref<TimerMode>('focus')
const _currentSession = ref(1)
const _timeRemaining = ref(25 * 60)
const _isRunning = ref(false)
let _intervalId: ReturnType<typeof setInterval> | null = null
let _endTime = 0 // Absolute timestamp when timer should complete

export function useTimer() {
  const { timerSettings } = useSettings()

  // Initialize from localStorage once
  if (!_initialized && import.meta.client) {
    _initialized = true
    const savedMode = localStorage.getItem('pomodear-mode')
    if (savedMode) _currentMode.value = JSON.parse(savedMode)
    const savedSession = localStorage.getItem('pomodear-session-current')
    if (savedSession) _currentSession.value = JSON.parse(savedSession)

    // Watch to persist
    watch(_currentMode, val => localStorage.setItem('pomodear-mode', JSON.stringify(val)))
    watch(_currentSession, val => localStorage.setItem('pomodear-session-current', JSON.stringify(val)))

    // Reset timer when settings change (only if not running)
    watch(() => timerSettings.value, () => {
      if (!_isRunning.value) {
        _timeRemaining.value = durationForMode.value
      }
    }, { deep: true })

    // Recover timer when tab becomes visible again
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && _isRunning.value) {
        tick()
      }
    })
  }

  const totalSessions = computed(() => timerSettings.value.sessionsBeforeLong)

  const durationForMode = computed(() => {
    switch (_currentMode.value) {
      case 'focus': return timerSettings.value.focusDuration * 60
      case 'break': return timerSettings.value.breakDuration * 60
      case 'longBreak': return timerSettings.value.longBreakDuration * 60
    }
  })

  const progress = computed(() => {
    const total = durationForMode.value
    return total > 0 ? (total - _timeRemaining.value) / total : 0
  })

  const displayTime = computed(() => {
    const m = String(Math.floor(_timeRemaining.value / 60)).padStart(2, '0')
    const s = String(_timeRemaining.value % 60).padStart(2, '0')
    return `${m}:${s}`
  })

  function clearTimer() {
    if (_intervalId) {
      clearInterval(_intervalId)
      _intervalId = null
    }
  }

  function setMode(mode: TimerMode, { advanceSession = false } = {}) {
    clearTimer()
    _isRunning.value = false

    // Advance session counter when transitioning from focus to break
    if (advanceSession && _currentMode.value === 'focus' && mode !== 'focus') {
      if (_currentSession.value >= totalSessions.value) {
        _currentSession.value = 1
      } else {
        _currentSession.value++
      }
    }

    _currentMode.value = mode
    _timeRemaining.value = (() => {
      switch (mode) {
        case 'focus': return timerSettings.value.focusDuration * 60
        case 'break': return timerSettings.value.breakDuration * 60
        case 'longBreak': return timerSettings.value.longBreakDuration * 60
      }
    })()
  }

  function onTimerComplete() {
    clearTimer()
    _isRunning.value = false

    // Play bell notification
    const { playBell } = useAudio()
    playBell()

    // Record completed session
    const { recordSession } = useStatistics()
    if (_currentMode.value === 'focus') {
      recordSession(timerSettings.value.focusDuration * 60, 'focus')
    } else if (_currentMode.value === 'break') {
      recordSession(timerSettings.value.breakDuration * 60, 'shortBreak')
    } else {
      recordSession(timerSettings.value.longBreakDuration * 60, 'longBreak')
    }

    if (_currentMode.value === 'focus') {
      const isLong = _currentSession.value >= totalSessions.value
      setMode(isLong ? 'longBreak' : 'break', { advanceSession: true })
    } else {
      setMode('focus')
    }
  }

  function tick() {
    const remaining = Math.round((_endTime - Date.now()) / 1000)
    if (remaining <= 0) {
      _timeRemaining.value = 0
      onTimerComplete()
      return
    }
    _timeRemaining.value = remaining
  }

  function start() {
    if (_isRunning.value) return
    _isRunning.value = true
    _endTime = Date.now() + _timeRemaining.value * 1000
    _intervalId = setInterval(tick, 1000)
  }

  function pause() {
    clearTimer()
    _isRunning.value = false
    // Sync remaining time from the clock one last time
    if (_endTime > 0) {
      const remaining = Math.round((_endTime - Date.now()) / 1000)
      _timeRemaining.value = Math.max(0, remaining)
    }
  }

  function togglePlay() {
    if (_isRunning.value) pause()
    else start()
  }

  function skip() {
    onTimerComplete()
  }

  function restart() {
    clearTimer()
    _isRunning.value = false
    _timeRemaining.value = durationForMode.value
  }

  // Initialize timeRemaining from current mode on first mount
  if (!_initialized || _timeRemaining.value === 0) {
    _timeRemaining.value = durationForMode.value
  }

  return {
    currentMode: _currentMode,
    currentSession: _currentSession,
    totalSessions,
    timeRemaining: _timeRemaining,
    isRunning: _isRunning,
    progress,
    displayTime,
    start,
    pause,
    togglePlay,
    skip,
    restart,
    setMode
  }
}
