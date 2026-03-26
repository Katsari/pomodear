export interface Task {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

export interface TimerSettings {
  focusDuration: number
  breakDuration: number
  longBreakDuration: number
  sessionsBeforeLong: number
}

export type TimerMode = 'focus' | 'break' | 'longBreak'

export interface AudioTrack {
  title: string
  artist: string
  src: string
  duration: number
}

export type AmbientSound = 'rain' | 'fireplace' | 'forest' | 'ocean'

export interface DailyNote {
  date: string
  plan: string
  write: string
  lastEdited: number
}

export type PanelName = 'music' | 'tasks' | 'dailyNote' | 'quote'

export interface SessionRecord {
  id: string
  date: string // YYYY-MM-DD
  startTime: number // unix ms
  duration: number // seconds
  type: 'focus' | 'shortBreak' | 'longBreak'
}

export type TimeRange = 'today' | 'week' | 'month'
