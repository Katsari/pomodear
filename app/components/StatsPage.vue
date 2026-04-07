<script setup lang="ts">
import type { TimeRange } from '~/types'

const { selectedBackground } = useSettings()
const {
  timeRange,
  dailyFocusMinutes,
  weeklyData,
  narrativeGreeting,
  narrativeBody,
  exportData
} = useStatistics()

const backgrounds: Record<string, string> = {
  'dragon-shrine': '/images/dragon_shrine.webp',
  'sensei': '/images/sensei.webp',
  'birds': '/images/birds.webp',
  'coffee-dragon': '/images/coffee_dragon.webp',
  'sea': '/images/sea.webp',
  'workspace': '/images/workspace.webp',
  'capy-crow': '/images/capy_crow.webp',
  'leafeon': '/images/leafeon.webp'
}

const backgroundSrc = computed(() => backgrounds[selectedBackground.value] ?? '/images/dragon_shrine.webp')

const ranges: { value: TimeRange, label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' }
]

const maxDailyMinutes = computed(() => {
  let max = 0
  for (const v of dailyFocusMinutes.value.values()) {
    if (v > max) max = v
  }
  return max
})
</script>

<template>
  <div class="relative w-full h-full overflow-y-auto scrollbar-glass">
    <div class="fixed inset-0">
      <BackgroundLayer :src="backgroundSrc" />
      <!-- Dark overlay -->
      <div class="absolute inset-0 bg-[#1A1916]/55" />
    </div>

    <div class="relative z-10 flex flex-col min-h-full">
      <!-- Header -->
      <div class="flex flex-col gap-3 px-4 lg:px-10 pt-4 lg:pt-5 pb-3 shrink-0">
        <!-- Top row: back + title + export -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <NuxtLink
              to="/"
              class="w-9 h-9 flex items-center justify-center rounded-lg text-(--text-dim) hover:text-(--text-secondary) hover:bg-(--bg-surface) transition-all"
            >
              <UIcon
                name="i-lucide-arrow-left"
                class="w-5 h-5"
              />
            </NuxtLink>
            <h1 class="font-display text-xl lg:text-3xl text-(--text-primary)">
              Your Focus Journey
            </h1>
          </div>

          <button
            class="w-9 h-9 flex items-center justify-center rounded-lg text-(--text-dim) hover:text-(--text-secondary) hover:bg-(--bg-surface) transition-all"
            title="Export data"
            @click="exportData('csv')"
          >
            <UIcon
              name="i-lucide-download"
              class="w-5 h-5"
            />
          </button>
        </div>

        <!-- Time range selector (full row on mobile) -->
        <div class="flex items-center gap-1 bg-(--bg-surface-dark) rounded-xl p-1 self-start">
          <button
            v-for="r in ranges"
            :key="r.value"
            class="px-3 py-1.5 rounded-[10px] text-[13px] font-medium transition-all"
            :class="timeRange === r.value
              ? 'bg-[#C4813A28] text-(--accent-primary) font-semibold'
              : 'text-(--text-dim) hover:text-(--text-secondary)'"
            @click="timeRange = r.value"
          >
            {{ r.label }}
          </button>
        </div>
      </div>

      <!-- Stats body -->
      <div class="flex-1 px-4 lg:px-10 pb-8 flex flex-col gap-5 lg:gap-6">
        <!-- Narrative card -->
        <div class="glass rounded-2xl p-5 lg:p-7 max-w-[480px] border border-[#C4813A20] shadow-[0_0_40px_#C4813A08]">
          <p class="font-display text-lg lg:text-xl text-(--text-primary) mb-2 lg:mb-3">
            {{ narrativeGreeting }}
          </p>
          <p class="text-[13px] lg:text-[14px] text-(--text-muted) leading-relaxed">
            {{ narrativeBody }}
          </p>
        </div>

        <!-- Data grid: heatmap | chart | patterns -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-start gap-4 lg:gap-5">
          <div class="rounded-xl bg-[#22201D] p-4 lg:p-5">
            <StatsHeatmap
              :daily-minutes="dailyFocusMinutes"
              :max-minutes="maxDailyMinutes"
            />
          </div>
          <div class="rounded-xl bg-[#22201D] p-4 lg:p-5">
            <StatsChart :data="weeklyData" />
          </div>
          <div class="rounded-xl bg-[#22201D] p-4 lg:p-5 md:col-span-2 xl:col-span-1">
            <StatsPatterns />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
