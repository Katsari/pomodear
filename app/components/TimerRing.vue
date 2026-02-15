<script setup lang="ts">
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
</script>

<template>
  <div class="relative w-[210px] h-[210px]">
    <!-- Outer glow (pulses when running) -->
    <div
      class="absolute inset-[-12px] rounded-full transition-opacity duration-1000"
      :class="isRunning ? 'timer-glow opacity-100' : 'opacity-0'"
      style="background: radial-gradient(circle, rgba(94, 158, 207, 0.12) 0%, transparent 70%);"
    />

    <svg
      class="absolute inset-0 w-full h-full"
      viewBox="0 0 320 320"
    >
      <!-- Outer ring with dark fill and border -->
      <circle
        cx="160"
        cy="160"
        r="158"
        fill="#2A2724D8"
        stroke="#3A3632"
        stroke-width="3"
      />

      <defs>
        <radialGradient
          id="innerGlow"
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop
            offset="0%"
            stop-color="#7EADD4"
            stop-opacity="0.04"
          />
          <stop
            offset="100%"
            stop-color="#7EADD4"
            stop-opacity="0"
          />
        </radialGradient>

        <!-- Diffuse rain glow from above -->
        <radialGradient
          id="rainGlow"
          cx="50%"
          cy="30%"
          r="60%"
        >
          <stop
            offset="0%"
            stop-color="#5B9ECF"
            stop-opacity="0.18"
          />
          <stop
            offset="40%"
            stop-color="#5B9ECF"
            stop-opacity="0.07"
          />
          <stop
            offset="100%"
            stop-color="#5B9ECF"
            stop-opacity="0"
          />
        </radialGradient>

        <clipPath id="innerClip">
          <circle
            cx="160"
            cy="160"
            r="155"
          />
        </clipPath>

        <filter
          id="arcGlow"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation="4"
            result="blur"
          />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

      </defs>

      <!-- Base inner glow -->
      <circle
        cx="160"
        cy="160"
        r="140"
        fill="url(#innerGlow)"
      />

      <!-- Rain glow (fades in when running) -->
      <circle
        cx="160"
        cy="160"
        r="150"
        fill="url(#rainGlow)"
        class="transition-opacity duration-1000"
        :opacity="isRunning ? 1 : 0.15"
        clip-path="url(#innerClip)"
      />

      <!-- Progress arc glow layer -->
      <circle
        v-if="progress > 0"
        cx="160"
        cy="160"
        :r="radius"
        fill="none"
        stroke="var(--accent-primary)"
        stroke-width="8"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashoffset"
        class="transition-[stroke-dashoffset] duration-1000 ease-linear"
        style="transform: rotate(-90deg); transform-origin: center;"
        opacity="0.25"
        filter="url(#arcGlow)"
      />

      <!-- Progress arc -->
      <circle
        cx="160"
        cy="160"
        :r="radius"
        fill="none"
        stroke="var(--accent-primary)"
        stroke-width="6"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashoffset"
        class="transition-[stroke-dashoffset] duration-1000 ease-linear"
        style="transform: rotate(-90deg); transform-origin: center;"
        opacity="0.85"
      />
    </svg>

    <!-- Drag handle -->
    <div
      class="absolute inset-x-0 z-10 flex justify-center cursor-grab"
      style="top: 22px;"
    >
      <UIcon
        name="i-lucide-grip-horizontal"
        class="text-(--text-dimmer) w-5 h-5 opacity-40 hover:opacity-80 transition-opacity"
      />
    </div>

    <!-- Session label -->
    <span
      class="absolute inset-x-0 text-center font-ui text-[10px] font-medium tracking-wide uppercase"
      style="top: 48px; color: #9a9a9a;"
    >
      {{ modeLabel }} Session {{ currentSession }} of {{ totalSessions }}
    </span>

    <!-- Time display -->
    <div class="absolute inset-0 flex items-center justify-center">
      <span
        class="font-display text-[46px] font-medium text-(--text-primary) tabular-nums"
        style="letter-spacing: -1.5px;"
      >
        {{ displayTime }}
      </span>
    </div>

    <!-- Progress dots -->
    <div
      class="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5"
      style="top: 165px;"
    >
      <div
        v-for="i in totalSessions"
        :key="i"
        class="w-2 h-2 rounded-full transition-colors"
        :class="i < currentSession
          ? 'bg-[#e88419]'
          : i === currentSession
            ? 'bg-[#ee881b]/50'
            : 'bg-[#3A3632]'"
      />
    </div>
  </div>
</template>

<style scoped>
@keyframes timer-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.05); }
}

.timer-glow {
  animation: timer-pulse 4s ease-in-out infinite;
}
</style>
