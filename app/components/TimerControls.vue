<script setup lang="ts">
const { isRunning, togglePlay, skip, restart } = useTimer()
</script>

<template>
  <div class="flex items-center gap-3">
    <!-- Skip back -->
    <button
      class="w-9 h-9 flex items-center justify-center rounded-lg bg-[#252320] text-[#B0AEA9] hover:text-(--text-secondary) transition-all active:scale-95"
      @click="restart"
    >
      <UIcon
        name="i-lucide-skip-back"
        class="w-[15px] h-[15px]"
      />
    </button>

    <!-- Play / Pause -->
    <button
      class="w-11 h-11 flex items-center justify-center rounded-xl text-white transition-all hover:scale-105 active:scale-[0.97]"
      :class="isRunning ? 'play-btn-pulse' : ''"
      style="background: linear-gradient(180deg, #E08228, #C06A1A); box-shadow: 0 4px 20px #E0822840;"
      @click="togglePlay"
    >
      <UIcon
        :name="isRunning ? 'i-lucide-pause' : 'i-lucide-play'"
        class="w-[18px] h-[18px]"
        :class="!isRunning ? 'ml-0.5' : ''"
      />
    </button>

    <!-- Skip forward -->
    <button
      class="w-9 h-9 flex items-center justify-center rounded-lg bg-[#252320] text-[#B0AEA9] hover:text-(--text-secondary) transition-all active:scale-95"
      @click="skip"
    >
      <UIcon
        name="i-lucide-skip-forward"
        class="w-[15px] h-[15px]"
      />
    </button>
  </div>
</template>

<style scoped>
@keyframes play-pulse {
  0%, 100% { box-shadow: 0 4px 20px #E0822840; }
  50% { box-shadow: 0 4px 28px #E0822860; }
}

.play-btn-pulse {
  animation: play-pulse 3s ease-in-out infinite;
}
</style>
