<script setup lang="ts">
import type { TimerMode } from '~/types'

const { userName } = useSettings()
const { currentMode, setMode } = useTimer()

const showSettings = defineModel<boolean>('showSettings', { default: false })

const modes: { mode: TimerMode, label: string, icon: string }[] = [
  { mode: 'focus', label: 'Focus', icon: 'i-lucide-flame' },
  { mode: 'break', label: 'Break', icon: 'i-lucide-coffee' },
  { mode: 'longBreak', label: 'Long Break', icon: 'i-lucide-sunset' }
]
</script>

<template>
  <nav class="glass-nav relative w-full h-[48px] lg:h-[58px] border-b border-(--border-subtle) z-50">
    <!-- Left: Logo + Greeting (absolute) -->
    <div class="absolute left-3 lg:left-8 top-1/2 -translate-y-1/2 flex items-center gap-3">
      <img
        src="/favicon-192x192.png"
        alt="Pomodear"
        class="w-9 h-9 rounded-[8px] object-cover hidden lg:block"
      >
      <span class="font-display text-[22px] font-semibold text-(--accent-primary) hidden lg:inline">Pomodear</span>
      <span
        v-if="userName"
        class="text-[13px] text-(--text-muted) lg:ml-2"
      >Hi, {{ userName }}!</span>
    </div>

    <!-- Center: Mode Tabs (absolute centered) -->
    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 bg-(--bg-surface-dark) rounded-xl p-1">
      <button
        v-for="m in modes"
        :key="m.mode"
        class="flex items-center gap-1.5 px-2.5 lg:px-4 py-1 lg:py-1.5 rounded-[10px] text-[13px] font-medium transition-all"
        :class="currentMode === m.mode
          ? 'bg-(--accent-primary) text-white'
          : 'text-(--text-dim) hover:text-(--text-secondary)'"
        @click="setMode(m.mode, { advanceSession: true })"
      >
        <UIcon
          :name="m.icon"
          class="w-3.5 h-3.5"
        />
        <span class="hidden lg:inline">{{ m.label }}</span>
      </button>
    </div>

    <!-- Right: Stats + Settings (absolute) -->
    <div class="absolute right-3 lg:right-8 top-1/2 -translate-y-1/2 flex items-center gap-1">
      <NuxtLink
        to="/stats"
        class="w-9 h-9 flex items-center justify-center rounded-lg text-(--text-dim) hover:text-(--text-secondary) hover:bg-(--bg-surface) transition-all"
      >
        <UIcon
          name="i-lucide-bar-chart-2"
          class="w-5 h-5"
        />
      </NuxtLink>
      <button
        class="w-9 h-9 flex items-center justify-center rounded-lg text-(--text-dim) hover:text-(--text-secondary) hover:bg-(--bg-surface) transition-all"
        @click="showSettings = true"
      >
        <UIcon
          name="i-lucide-settings"
          class="w-5 h-5"
        />
      </button>
    </div>
  </nav>
</template>
