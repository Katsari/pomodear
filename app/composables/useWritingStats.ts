import { DEFAULT_PLAN_TEMPLATE } from '~/utils/dailyNoteTemplate'

let _initialized = false
let _writingStreak: Ref<number> | null = null
let _longestWritingStreak: Ref<number> | null = null

function hasNoteContent(date: string): boolean {
  if (!import.meta.client) return false
  const stored = localStorage.getItem(`pomodear-daily-${date}`)
  if (!stored) return false
  try {
    const note = JSON.parse(stored)
    const write = (note.write ?? '').trim()
    const plan = (note.plan ?? '').trim()
    const planModified = plan.length > 0 && plan !== DEFAULT_PLAN_TEMPLATE.trim()
    return write.length > 0 || planModified
  } catch {
    return false
  }
}

function computeStreak(): { current: number, longest: number } {
  if (!import.meta.client) return { current: 0, longest: 0 }

  const d = new Date()
  let current = 0

  if (!hasNoteContent(d.toISOString().slice(0, 10))) {
    d.setDate(d.getDate() - 1)
  }

  while (hasNoteContent(d.toISOString().slice(0, 10))) {
    current++
    d.setDate(d.getDate() - 1)
  }

  // For longest streak, scan back up to 365 days
  let longest = current
  let streak = 0
  const scan = new Date()
  for (let i = 0; i < 365; i++) {
    if (hasNoteContent(scan.toISOString().slice(0, 10))) {
      streak++
      longest = Math.max(longest, streak)
    } else {
      streak = 0
    }
    scan.setDate(scan.getDate() - 1)
  }

  return { current, longest }
}

export function useWritingStats() {
  if (!_writingStreak) _writingStreak = ref(0)
  if (!_longestWritingStreak) _longestWritingStreak = ref(0)

  if (!_initialized && import.meta.client) {
    _initialized = true
    const result = computeStreak()
    _writingStreak.value = result.current
    _longestWritingStreak.value = result.longest
  }

  function refresh() {
    const result = computeStreak()
    _writingStreak!.value = result.current
    _longestWritingStreak!.value = result.longest
  }

  return {
    writingStreak: _writingStreak,
    longestWritingStreak: _longestWritingStreak,
    refresh
  }
}
