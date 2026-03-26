<script setup lang="ts">
const props = withDefaults(defineProps<{ size?: number }>(), { size: 210 })

const { displayTime, progress, isRunning, currentMode, currentSession, totalSessions } = useTimer()

const radius = 154
const circumference = 2 * Math.PI * radius
const strokeDashoffset = computed(() => circumference * (1 - progress.value))

const modeLabel = computed(() => {
  switch (currentMode.value) {
    case 'focus': return 'Focus'
    case 'break': return 'Break'
    case 'longBreak': return 'Long Break'
    default: return 'Focus'
  }
})

// Mode-aware accent color
const modeColor = computed(() => {
  switch (currentMode.value) {
    case 'focus': return 'var(--accent-primary)'
    case 'break': return 'var(--accent-green)'
    case 'longBreak': return 'var(--accent-blue)'
    default: return 'var(--accent-primary)'
  }
})

const modeGlowColor = computed(() => {
  switch (currentMode.value) {
    case 'focus': return 'rgba(224, 130, 40, 0.12)'
    case 'break': return 'rgba(124, 144, 112, 0.12)'
    case 'longBreak': return 'rgba(126, 173, 212, 0.12)'
    default: return 'rgba(224, 130, 40, 0.12)'
  }
})

// Completion shimmer
const showShimmer = ref(false)
watch(progress, (val, oldVal) => {
  if (oldVal > 0 && val === 0) {
    showShimmer.value = true
    setTimeout(() => {
      showShimmer.value = false
    }, 800)
  }
})

// Proportional scaling based on size
const scale = computed(() => props.size / 210)
const fontSize = computed(() => `${Math.round(46 * scale.value)}px`)
const labelTop = computed(() => `${Math.round(48 * scale.value)}px`)
const labelFontSize = computed(() => `${Math.round(10 * scale.value)}px`)
const dotsTop = computed(() => `${Math.round(165 * scale.value)}px`)
const handleTop = computed(() => `${Math.round(22 * scale.value)}px`)
</script>

<template>
  <div
    class="relative"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <!-- Outer glow (pulses when running, mode-aware color) -->
    <div
      class="absolute -inset-3 rounded-full transition-opacity duration-1000"
      :class="isRunning ? 'timer-glow opacity-100' : 'opacity-0'"
      :style="{ boxShadow: `0 0 ${Math.round(40 * scale)}px ${modeGlowColor}` }"
    />

    <!-- Completion shimmer -->
    <div
      v-if="showShimmer"
      class="absolute -inset-4 rounded-full timer-shimmer"
      :style="{ boxShadow: `0 0 60px 20px ${modeGlowColor}` }"
    />

    <svg
      class="absolute inset-0 w-full h-full"
      viewBox="0 0 320 320"
    >
      <!-- Background circle -->
      <circle
        cx="160"
        cy="160"
        r="158"
        fill="#2A2724D8"
        stroke="#3A3632"
        stroke-width="2"
      />

      <!-- Progress arc -->
      <circle
        cx="160"
        cy="160"
        :r="radius"
        fill="none"
        :stroke="modeColor"
        stroke-width="6"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashoffset"
        class="transition-[stroke-dashoffset,stroke] duration-1000 ease-linear"
        style="transform: rotate(-90deg); transform-origin: center;"
        opacity="0.85"
      />
    </svg>

    <!-- Drag handle (hidden on mobile / small sizes) -->
    <div
      v-if="size >= 210"
      class="absolute inset-x-0 z-10 flex justify-center cursor-grab"
      :style="{ top: handleTop }"
    >
      <UIcon
        name="i-lucide-grip-horizontal"
        class="text-(--text-dimmer) w-5 h-5 opacity-40 hover:opacity-80 transition-opacity"
      />
    </div>

    <!-- Session label -->
    <span
      class="absolute inset-x-0 text-center font-ui font-medium tracking-wide uppercase"
      :style="{ top: labelTop, fontSize: labelFontSize, color: '#9a9a9a' }"
    >
      {{ modeLabel }} Session {{ currentSession }} of {{ totalSessions }}
    </span>

    <!-- Time display -->
    <div class="absolute inset-0 flex items-center justify-center">
      <span
        class="font-display font-medium text-(--text-primary) tabular-nums"
        :style="{ fontSize, letterSpacing: '-1.5px' }"
      >
        {{ displayTime }}
      </span>
    </div>

    <!-- Progress dots -->
    <div
      class="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5"
      :style="{ top: dotsTop }"
    >
      <div
        v-for="i in totalSessions"
        :key="i"
        class="w-2 h-2 rounded-full transition-all duration-400"
        :class="i < currentSession
          ? 'bg-[#e88419] shadow-[0_0_6px_rgba(232,132,25,0.4)]'
          : i === currentSession
            ? 'bg-[#ee881b]/50'
            : 'bg-[#3A3632]'"
      />
    </div>
  </div>
</template>

<style scoped>
@keyframes timer-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.timer-glow {
  animation: timer-pulse 4s ease-in-out infinite;
}

@keyframes shimmer-expand {
  0% { opacity: 0.8; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.3); }
}

.timer-shimmer {
  animation: shimmer-expand 0.8s ease-out forwards;
}
</style>
