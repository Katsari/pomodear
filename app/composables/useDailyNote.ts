import type { DailyNote } from '~/types'
import { DEFAULT_PLAN_TEMPLATE } from '~/utils/dailyNoteTemplate'

let _currentDate: Ref<string> | null = null
let _noteData: Ref<DailyNote> | null = null
let _debounceTimer: ReturnType<typeof setTimeout> | null = null

function todayString(): string {
  return new Date().toISOString().slice(0, 10)
}

function storageKey(date: string): string {
  return `pomodear-daily-${date}`
}

function defaultNote(date: string): DailyNote {
  return {
    date,
    plan: DEFAULT_PLAN_TEMPLATE,
    write: '',
    lastEdited: 0
  }
}

function loadNote(date: string): DailyNote {
  if (!import.meta.client) return defaultNote(date)
  const stored = localStorage.getItem(storageKey(date))
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return defaultNote(date)
    }
  }
  return defaultNote(date)
}

function saveNote(note: DailyNote) {
  if (!import.meta.client) return
  localStorage.setItem(storageKey(note.date), JSON.stringify(note))
}

function countWords(text: string): number {
  // Strip markdown syntax for accurate word count
  const stripped = text
    .replace(/^#{1,6}\s+/gm, '') // headings
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1') // bold/italic
    .replace(/- \[[ x]\]\s*/g, '') // task checkboxes
    .replace(/^[-*+]\s+/gm, '') // list markers
    .replace(/^>\s+/gm, '') // blockquotes
    .replace(/---+/g, '') // horizontal rules
    .trim()
  return stripped ? stripped.split(/\s+/).length : 0
}

export function useDailyNote() {
  if (!_currentDate) {
    _currentDate = ref(todayString())
  }

  if (!_noteData) {
    _noteData = ref(loadNote(_currentDate.value))
  }

  // Watch for date navigation — load the new day's note
  watch(_currentDate, (newDate) => {
    _noteData!.value = loadNote(newDate)
  })

  const isToday = computed(() => _currentDate!.value === todayString())

  const planWordCount = computed(() => countWords(_noteData!.value.plan))
  const writeWordCount = computed(() => countWords(_noteData!.value.write))

  const formattedDate = computed(() => {
    const parts = _currentDate!.value.split('-')
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  })

  function debouncedSave() {
    if (_debounceTimer) clearTimeout(_debounceTimer)
    _debounceTimer = setTimeout(() => {
      _noteData!.value.lastEdited = Date.now()
      saveNote(_noteData!.value)
    }, 500)
  }

  function updatePlan(value: string) {
    _noteData!.value.plan = value
    debouncedSave()
  }

  function updateWrite(value: string) {
    _noteData!.value.write = value
    debouncedSave()
  }

  async function copyToClipboard(mode: 'plan' | 'write' | 'all'): Promise<boolean> {
    const header = `# ${_currentDate!.value}\n\n`
    let content: string
    if (mode === 'plan') {
      content = header + _noteData!.value.plan
    } else if (mode === 'write') {
      content = header + '## Morning Pages\n\n' + _noteData!.value.write
    } else {
      content = header + _noteData!.value.plan + '\n\n---\n\n## Morning Pages\n\n' + _noteData!.value.write
    }
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(content)
        return true
      }
    } catch { /* fall through to legacy method */ }
    // Fallback: textarea + execCommand for when Clipboard API is blocked
    try {
      const ta = document.createElement('textarea')
      ta.value = content
      ta.style.cssText = 'position:fixed;opacity:0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      return true
    } catch {
      return false
    }
  }

  function currentTimestamp(): string {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  // Date navigation
  function goToDate(date: string) {
    _currentDate!.value = date
  }

  function goToToday() {
    _currentDate!.value = todayString()
  }

  function goPreviousDay() {
    const parts = _currentDate!.value.split('-').map(Number)
    const prev = new Date(parts[0]!, parts[1]! - 1, parts[2]! - 1)
    _currentDate!.value = prev.toISOString().slice(0, 10)
  }

  function goNextDay() {
    const today = todayString()
    if (_currentDate!.value >= today) return
    const parts = _currentDate!.value.split('-').map(Number)
    const next = new Date(parts[0]!, parts[1]! - 1, parts[2]! + 1)
    const nextStr = next.toISOString().slice(0, 10)
    if (nextStr <= today) {
      _currentDate!.value = nextStr
    }
  }

  return {
    currentDate: _currentDate,
    noteData: _noteData,
    isToday,
    planWordCount,
    writeWordCount,
    formattedDate,
    updatePlan,
    updateWrite,
    copyToClipboard,
    currentTimestamp,
    goToDate,
    goToToday,
    goPreviousDay,
    goNextDay
  }
}
