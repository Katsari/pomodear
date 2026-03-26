<script setup lang="ts">
const props = defineProps<{
  dailyMinutes: Map<string, number>
  maxMinutes: number
}>()

const today = new Date().toISOString().slice(0, 10)
const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())

const monthLabel = computed(() => {
  const d = new Date(currentYear.value, currentMonth.value, 1)
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const isCurrentMonth = computed(() => {
  const now = new Date()
  return currentMonth.value === now.getMonth() && currentYear.value === now.getFullYear()
})

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (isCurrentMonth.value) return
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

interface CellData {
  dateStr: string
  minutes: number
  intensity: number
  day: number
  row: number
  col: number
}

const grid = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()

  const firstDow = firstDay.getDay()
  const startOffset = firstDow === 0 ? 6 : firstDow - 1

  const weeks: (CellData | null)[][] = []
  let currentWeek: (CellData | null)[] = []

  for (let i = 0; i < startOffset; i++) {
    currentWeek.push(null)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const isFuture = dateStr > today
    const col = currentWeek.length
    const row = weeks.length
    if (isFuture) {
      currentWeek.push(null)
    } else {
      const minutes = props.dailyMinutes.get(dateStr) ?? 0
      const intensity = props.maxMinutes > 0 ? Math.min(minutes / props.maxMinutes, 1) : 0
      currentWeek.push({ dateStr, minutes, intensity, day, row, col })
    }

    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null)
    }
    weeks.push(currentWeek)
  }

  return weeks
})

const hoveredCell = ref<CellData | null>(null)

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y!, m! - 1, d!).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

function cellColor(intensity: number): string {
  if (intensity === 0) return '#2A2724'
  if (intensity < 0.25) return 'rgba(196, 129, 58, 0.25)'
  if (intensity < 0.5) return 'rgba(196, 129, 58, 0.45)'
  if (intensity < 0.75) return 'rgba(196, 129, 58, 0.65)'
  return 'rgba(196, 129, 58, 0.9)'
}

// Tooltip positioning via DOM measurement
const gridRef = ref<HTMLElement | null>(null)
const tooltipPos = ref<{ x: number, y: number } | null>(null)

function updateTooltipPos(event: MouseEvent) {
  if (!gridRef.value) return
  const gridRect = gridRef.value.getBoundingClientRect()
  const target = event.currentTarget as HTMLElement
  const cellRect = target.getBoundingClientRect()
  tooltipPos.value = {
    x: cellRect.left - gridRect.left + cellRect.width / 2,
    y: cellRect.top - gridRect.top - 8
  }
}

function onCellEnter(cell: CellData, event: MouseEvent) {
  hoveredCell.value = cell
  updateTooltipPos(event)
}

function onCellLeave() {
  hoveredCell.value = null
  tooltipPos.value = null
}
</script>

<template>
  <div>
    <!-- Header with month navigation -->
    <div class="flex items-center justify-between mb-3">
      <h3 class="font-display text-base text-(--accent-primary)">
        Focus Heatmap
      </h3>
      <div class="flex items-center gap-0.5">
        <button
          class="w-6 h-6 flex items-center justify-center rounded-md text-(--text-dim) hover:text-(--text-secondary) hover:bg-(--bg-surface) transition-all"
          @click="prevMonth"
        >
          <UIcon
            name="i-lucide-chevron-left"
            class="w-3.5 h-3.5"
          />
        </button>
        <span class="text-[12px] text-(--text-muted) font-medium min-w-[110px] text-center">
          {{ monthLabel }}
        </span>
        <button
          class="w-6 h-6 flex items-center justify-center rounded-md transition-all"
          :class="isCurrentMonth
            ? 'text-(--text-dimmer) cursor-default'
            : 'text-(--text-dim) hover:text-(--text-secondary) hover:bg-(--bg-surface)'"
          :disabled="isCurrentMonth"
          @click="nextMonth"
        >
          <UIcon
            name="i-lucide-chevron-right"
            class="w-3.5 h-3.5"
          />
        </button>
      </div>
    </div>

    <!-- Calendar grid wrapper -->
    <div
      ref="gridRef"
      class="relative"
    >
      <div class="grid grid-cols-7 gap-1.5">
        <!-- Day of week headers -->
        <div
          v-for="(label, i) in dayLabels"
          :key="i"
          class="text-[10px] text-(--text-dimmer) text-center pb-0.5"
        >
          {{ label }}
        </div>

        <!-- Calendar cells -->
        <template
          v-for="(week, wi) in grid"
          :key="wi"
        >
          <template
            v-for="(cell, di) in week"
            :key="`${wi}-${di}`"
          >
            <div v-if="cell">
              <div
                class="heatmap-cell w-full aspect-square rounded-[5px] cursor-default"
                :class="cell.dateStr === today ? 'ember-pulse' : ''"
                :style="{
                  backgroundColor: cellColor(cell.intensity),
                  animationDelay: `${(wi * 7 + di) * 12}ms`
                }"
                @mouseenter="onCellEnter(cell, $event)"
                @mouseleave="onCellLeave"
                @click="hoveredCell = hoveredCell === cell ? null : cell"
              />
            </div>
            <!-- Only render empty spacers for leading nulls (first week) -->
            <div
              v-else-if="wi === 0"
              class="w-full aspect-square"
            />
          </template>
        </template>
      </div>

      <!-- Floating tooltip -->
      <div
        v-if="hoveredCell && tooltipPos"
        class="absolute bg-(--bg-surface) text-(--text-primary) text-[11px] px-2.5 py-1.5 rounded-lg whitespace-nowrap z-20 pointer-events-none border border-(--border-subtle) shadow-lg"
        :style="{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px`, transform: 'translateX(-50%) translateY(-100%)' }"
      >
        <span class="font-medium">{{ formatDate(hoveredCell.dateStr) }}</span>
        <span class="text-(--text-dim)"> · {{ hoveredCell.minutes > 0 ? `${hoveredCell.minutes}m focused` : 'no sessions' }}</span>
      </div>
    </div>

    <!-- Legend -->
    <div class="flex items-center gap-1 mt-2">
      <span class="text-[9px] text-(--text-dimmer) mr-0.5">Less</span>
      <div class="w-3 h-3 rounded-[2px] bg-[#2A2724]" />
      <div class="w-3 h-3 rounded-[2px] bg-[rgba(196,129,58,0.25)]" />
      <div class="w-3 h-3 rounded-[2px] bg-[rgba(196,129,58,0.45)]" />
      <div class="w-3 h-3 rounded-[2px] bg-[rgba(196,129,58,0.65)]" />
      <div class="w-3 h-3 rounded-[2px] bg-[rgba(196,129,58,0.9)]" />
      <span class="text-[9px] text-(--text-dimmer) ml-0.5">More</span>
    </div>
  </div>
</template>

<style scoped>
.heatmap-cell {
  animation: cellFadeIn 0.2s ease both;
}

.ember-pulse {
  animation: cellFadeIn 0.2s ease both, emberPulse 3s infinite;
}

@keyframes cellFadeIn {
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes emberPulse {
  0%, 100% { box-shadow: 0 0 6px rgba(196, 129, 58, 0.25); }
  50% { box-shadow: 0 0 12px rgba(196, 129, 58, 0.4); }
}

@media (prefers-reduced-motion: reduce) {
  .heatmap-cell, .ember-pulse {
    animation: none !important;
  }
}
</style>
