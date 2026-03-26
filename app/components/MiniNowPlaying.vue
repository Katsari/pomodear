<script setup lang="ts">
const { isPlaying, currentTrack, togglePlay } = useAudio()
const { openPanel } = usePanels()

function openMusic() {
  openPanel('music')
}
</script>

<template>
  <div
    v-if="currentTrack"
    class="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-bar border border-(--border-subtle)/50 max-w-[260px]"
  >
    <button
      class="w-6 h-6 flex items-center justify-center rounded-full shrink-0 transition-colors"
      :class="isPlaying ? 'text-(--accent-primary)' : 'text-(--text-dim)'"
      @click="togglePlay"
    >
      <UIcon
        :name="isPlaying ? 'i-lucide-pause' : 'i-lucide-play'"
        class="w-3.5 h-3.5"
        :class="!isPlaying ? 'ml-0.5' : ''"
      />
    </button>
    <button
      class="text-xs text-(--text-muted) truncate hover:text-(--text-secondary) transition-colors"
      @click="openMusic"
    >
      {{ currentTrack.title }}
    </button>
  </div>
</template>
