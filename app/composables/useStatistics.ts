import type { SessionRecord, TimeRange } from '~/types'

let _sessions: Ref<SessionRecord[]> | null = null
let _timeRange: Ref<TimeRange> | null = null

function todayString(): string {
  return new Date().toISOString().slice(0, 10)
}

function dateFromString(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y!, m! - 1, d!)
}

function startOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? 6 : day - 1 // Monday = start
  d.setDate(d.getDate() - diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function dayNames(): string[] {
  return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
}

export function useStatistics() {
  if (!_sessions) _sessions = useLocalStorage<SessionRecord[]>('pomodear-sessions', [])
  if (!_timeRange) _timeRange = ref<TimeRange>('week')

  const timeRange = _timeRange
  const sessions = _sessions

  const filteredSessions = computed(() => {
    const now = new Date()
    const today = todayString()

    return sessions.value.filter((s) => {
      if (s.type !== 'focus') return false
      if (timeRange.value === 'today') return s.date === today
      if (timeRange.value === 'week') {
        const weekStart = startOfWeek(now)
        const sDate = dateFromString(s.date)
        return sDate >= weekStart && sDate <= now
      }
      // month
      const monthStart = startOfMonth(now)
      const sDate = dateFromString(s.date)
      return sDate >= monthStart && sDate <= now
    })
  })

  const totalFocusMinutes = computed(() => {
    return Math.round(filteredSessions.value.reduce((sum, s) => sum + s.duration, 0) / 60)
  })

  const sessionCount = computed(() => filteredSessions.value.length)

  const streak = computed(() => {
    const focusDates = new Set(
      sessions.value.filter(s => s.type === 'focus').map(s => s.date)
    )
    let count = 0
    const d = new Date()
    // If no session today, start checking from yesterday
    if (!focusDates.has(d.toISOString().slice(0, 10))) {
      d.setDate(d.getDate() - 1)
    }
    while (focusDates.has(d.toISOString().slice(0, 10))) {
      count++
      d.setDate(d.getDate() - 1)
    }
    return count
  })

  const longestStreak = computed(() => {
    const focusDates = [...new Set(
      sessions.value.filter(s => s.type === 'focus').map(s => s.date)
    )].sort()
    if (focusDates.length === 0) return 0

    let max = 1
    let current = 1
    for (let i = 1; i < focusDates.length; i++) {
      const prev = dateFromString(focusDates[i - 1]!)
      const curr = dateFromString(focusDates[i]!)
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays === 1) {
        current++
        max = Math.max(max, current)
      } else {
        current = 1
      }
    }
    return max
  })

  const bestDayOfWeek = computed((): string | null => {
    const focusSessions = sessions.value.filter(s => s.type === 'focus')
    const dates = new Set(focusSessions.map(s => s.date))
    if (dates.size < 7) return null

    const dayTotals: number[] = [0, 0, 0, 0, 0, 0, 0]
    const dayCounts: number[] = [0, 0, 0, 0, 0, 0, 0]

    for (const s of focusSessions) {
      const d = dateFromString(s.date)
      const day = d.getDay()
      const idx = day === 0 ? 6 : day - 1 // Mon=0 .. Sun=6
      dayTotals[idx]! += s.duration
      dayCounts[idx]!++
    }

    let bestIdx = 0
    let bestAvg = 0
    for (let i = 0; i < 7; i++) {
      const avg = dayCounts[i]! > 0 ? dayTotals[i]! / dayCounts[i]! : 0
      if (avg > bestAvg) {
        bestAvg = avg
        bestIdx = i
      }
    }
    return dayNames()[bestIdx]!
  })

  const bestHour = computed((): number | null => {
    const focusSessions = sessions.value.filter(s => s.type === 'focus')
    const dates = new Set(focusSessions.map(s => s.date))
    if (dates.size < 7) return null

    const hourCounts = new Array(24).fill(0) as number[]
    for (const s of focusSessions) {
      const hour = new Date(s.startTime).getHours()
      hourCounts[hour]!++
    }

    let bestH = 0
    let bestCount = 0
    for (let i = 0; i < 24; i++) {
      if (hourCounts[i]! > bestCount) {
        bestCount = hourCounts[i]!
        bestH = i
      }
    }
    return bestH
  })

  const avgSessionMinutes = computed(() => {
    const focus = sessions.value.filter(s => s.type === 'focus')
    if (focus.length === 0) return 0
    const totalSec = focus.reduce((sum, s) => sum + s.duration, 0)
    return Math.round(totalSec / focus.length / 60)
  })

  const totalSessionsAllTime = computed(() =>
    sessions.value.filter(s => s.type === 'focus').length
  )

  const dailyFocusMinutes = computed(() => {
    const map = new Map<string, number>()
    for (const s of sessions.value) {
      if (s.type !== 'focus') continue
      const current = map.get(s.date) ?? 0
      map.set(s.date, current + Math.round(s.duration / 60))
    }
    return map
  })

  const weeklyData = computed(() => {
    const now = new Date()
    const weekStart = startOfWeek(now)
    const result: number[] = []

    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart)
      d.setDate(d.getDate() + i)
      const key = d.toISOString().slice(0, 10)
      result.push(dailyFocusMinutes.value.get(key) ?? 0)
    }
    return result
  })

  const narrativeGreeting = computed(() => {
    const { userName } = useSettings()
    const name = userName.value ? `, ${userName.value}` : ''
    const mins = totalFocusMinutes.value
    if (mins === 0) return `Ready to begin your focus journey${name}?`
    if (mins < 30) return `A steady start${name}.`
    if (mins < 120) return `Building momentum${name}.`
    if (mins < 300) return `Deep in the flow${name}.`
    return `Remarkable dedication${name}.`
  })

  const narrativeBody = computed(() => {
    const mins = totalFocusMinutes.value
    const count = sessionCount.value
    const s = streak.value

    if (count === 0) {
      return 'Start a focus session and your stats will appear here.'
    }

    const hours = Math.floor(mins / 60)
    const remainMins = mins % 60
    const timeStr = hours > 0
      ? `${hours}h ${remainMins}m`
      : `${remainMins}m`

    const rangeLabel = timeRange.value === 'today'
      ? 'today'
      : timeRange.value === 'week'
        ? 'this week'
        : 'this month'

    let text = `You've focused for ${timeStr} across ${count} session${count !== 1 ? 's' : ''} ${rangeLabel}.`

    if (s > 1) {
      text += ` That's a ${s}-day streak.`
    }

    return text
  })

  function recordSession(duration: number, type: 'focus' | 'shortBreak' | 'longBreak') {
    if (!import.meta.client) return
    const record: SessionRecord = {
      id: crypto.randomUUID(),
      date: todayString(),
      startTime: Date.now() - duration * 1000,
      duration,
      type
    }
    const updated = [...sessions.value, record]
    sessions.value = updated
    // Persist immediately: the reactive watcher may not flush
    // when called from a timer callback outside Vue's render cycle
    localStorage.setItem('pomodear-sessions', JSON.stringify(updated))
  }

  function exportData(format: 'json' | 'csv') {
    if (!import.meta.client) return
    let blob: Blob
    let filename: string

    if (format === 'json') {
      const data = {
        exportedAt: new Date().toISOString(),
        totalSessions: sessions.value.length,
        sessions: sessions.value
      }
      blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      filename = `pomodear-sessions-${todayString()}.json`
    } else {
      const header = 'date,start_time_iso,duration_minutes,duration_seconds,session_type,day_of_week'
      const rows = sessions.value.map((s) => {
        const startIso = new Date(s.startTime).toISOString()
        const durationMin = (s.duration / 60).toFixed(1)
        const dayName = new Date(s.startTime)
          .toLocaleDateString('en-US', { weekday: 'long' })
        return `${s.date},${startIso},${durationMin},${s.duration},${s.type},${dayName}`
      })
      blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv' })
      filename = `pomodear-sessions-${todayString()}.csv`
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    sessions,
    timeRange,
    totalFocusMinutes,
    sessionCount,
    streak,
    longestStreak,
    bestDayOfWeek,
    bestHour,
    avgSessionMinutes,
    totalSessionsAllTime,
    dailyFocusMinutes,
    weeklyData,
    narrativeGreeting,
    narrativeBody,
    recordSession,
    exportData
  }
}
