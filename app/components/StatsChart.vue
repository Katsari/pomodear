<script setup lang="ts">
const props = defineProps<{
  data: number[]
  title?: string
}>()

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const maxValue = computed(() => Math.max(...props.data, 1))

const peakIdx = computed(() => {
  let best = 0
  for (let i = 1; i < props.data.length; i++) {
    if (props.data[i]! > props.data[best]!) best = i
  }
  return props.data[best]! > 0 ? best : -1
})

const totalMinutes = computed(() => props.data.reduce((a, b) => a + b, 0))

function barHeightPct(value: number): number {
  return maxValue.value > 0 ? (value / maxValue.value) * 100 : 0
}

function isWeekend(idx: number): boolean {
  return idx >= 5
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-display text-lg text-(--accent-blue)">
        {{ title ?? 'This Week' }}
      </h3>
      <span
        v-if="totalMinutes > 0"
        class="font-data text-[12px] text-(--text-dimmer)"
      >
        {{ Math.floor(totalMinutes / 60) }}h {{ totalMinutes % 60 }}m total
      </span>
    </div>

    <div class="flex items-end gap-2 h-[250px]">
      <div
        v-for="(value, idx) in data"
        :key="idx"
        class="flex-1 flex flex-col items-center justify-end h-full"
      >
        <!-- Best day label -->
        <span
          v-if="idx === peakIdx && value > 0"
          class="text-[9px] text-(--accent-primary) whitespace-nowrap font-semibold tracking-wide h-3"
        >
          best day
        </span>
        <span
          v-else
          class="h-3"
        />
        <!-- Bar container -->
        <div class="w-full flex-1 flex items-end justify-center">
          <div
            class="chart-bar w-full rounded-t-lg"
            :class="idx === peakIdx ? 'opacity-100' : 'opacity-80'"
            :style="{
              height: `${Math.max(barHeightPct(value), value > 0 ? 4 : 1)}%`,
              background: isWeekend(idx)
                ? 'linear-gradient(to top, rgba(124, 144, 112, 0.6), #7C9070)'
                : idx === peakIdx
                  ? 'linear-gradient(to top, rgba(196, 129, 58, 0.7), #E89565, #F0C890)'
                  : 'linear-gradient(to top, rgba(196, 129, 58, 0.6), #C4813A)',
              animationDelay: `${idx * 80}ms`
            }"
          />
        </div>
        <!-- Day label -->
        <span
          class="text-[11px] mt-2"
          :class="idx === peakIdx && value > 0 ? 'text-(--accent-primary) font-semibold' : 'text-(--text-dimmer)'"
        >
          {{ weekdays[idx] }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-bar {
  animation: barGrow 0.5s cubic-bezier(0.25, 1, 0.5, 1) both;
  transform-origin: bottom;
  transition: height 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}

@keyframes barGrow {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}

@media (prefers-reduced-motion: reduce) {
  .chart-bar {
    animation: none !important;
  }
}
</style>
