<script setup lang="ts">
const {
  isPlaying, currentTrack, currentTrackIndex, playlist, trackProgress,
  currentTimeDisplay, totalTimeDisplay,
  togglePlay, playTrack, nextTrack, prevTrack,
  shuffle, repeat, toggleShuffle, toggleRepeat
} = useAudio()

const showList = ref(false)
</script>

<template>
  <div class="rounded-xl bg-(--bg-surface) p-4 flex flex-col gap-3">
    <!-- Track info + list toggle -->
    <div class="flex items-start justify-between gap-2">
      <div class="min-w-0">
        <p class="text-sm font-medium text-(--text-primary) truncate">
          {{ currentTrack?.title || 'No Track' }}
        </p>
        <p class="text-xs text-(--text-dim)">
          {{ currentTrack?.artist || 'Unknown Artist' }}
        </p>
      </div>
      <button
        class="w-6 h-6 flex items-center justify-center shrink-0 rounded-md transition-colors"
        :class="showList ? 'text-(--accent-primary)' : 'text-(--text-dim) hover:text-(--text-secondary)'"
        @click="showList = !showList"
      >
        <UIcon
          name="i-lucide-list-music"
          class="w-3.5 h-3.5"
        />
      </button>
    </div>

    <!-- Track list -->
    <Transition name="tracklist">
      <div
        v-if="showList"
        class="flex flex-col max-h-[120px] overflow-y-auto -mx-1 scrollbar-thin"
      >
        <button
          v-for="(track, i) in playlist"
          :key="i"
          class="flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors"
          :class="i === currentTrackIndex
            ? 'bg-(--accent-primary)/10 text-(--accent-primary)'
            : 'text-(--text-dim) hover:bg-white/5 hover:text-(--text-secondary)'"
          @click="playTrack(i)"
        >
          <UIcon
            :name="i === currentTrackIndex && isPlaying ? 'i-lucide-volume-2' : 'i-lucide-music'"
            class="w-3 h-3 shrink-0"
          />
          <span class="text-xs truncate">{{ track.title }}</span>
          <span class="text-[10px] text-(--text-dimmer) ml-auto shrink-0">{{ track.artist }}</span>
        </button>
      </div>
    </Transition>

    <!-- Progress bar -->
    <div class="flex flex-col gap-1.5">
      <div class="w-full h-1 rounded-full bg-(--border-subtle) overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-1000 ease-linear"
          style="background: linear-gradient(90deg, var(--accent-primary), var(--accent-primary-dark))"
          :style="{ width: `${trackProgress * 100}%` }"
        />
      </div>
      <div class="flex justify-between">
        <span class="font-data text-[10px] text-(--text-dimmer)">{{ currentTimeDisplay }}</span>
        <span class="font-data text-[10px] text-(--text-dimmer)">{{ totalTimeDisplay }}</span>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex items-center justify-center gap-5">
      <button
        class="w-7 h-7 flex items-center justify-center transition-colors"
        :class="shuffle ? 'text-(--accent-primary)' : 'text-(--text-dim) hover:text-(--text-secondary)'"
        @click="toggleShuffle"
      >
        <UIcon
          name="i-lucide-shuffle"
          class="w-3.5 h-3.5"
        />
      </button>
      <button
        class="w-7 h-7 flex items-center justify-center text-(--text-dim) hover:text-(--text-secondary) transition-colors"
        @click="prevTrack"
      >
        <UIcon
          name="i-lucide-skip-back"
          class="w-4 h-4"
        />
      </button>
      <button
        class="w-9 h-9 flex items-center justify-center rounded-full text-white"
        style="background: linear-gradient(135deg, var(--accent-primary), var(--accent-primary-dark))"
        @click="togglePlay"
      >
        <UIcon
          :name="isPlaying ? 'i-lucide-pause' : 'i-lucide-play'"
          class="w-4 h-4"
          :class="!isPlaying ? 'ml-0.5' : ''"
        />
      </button>
      <button
        class="w-7 h-7 flex items-center justify-center text-(--text-dim) hover:text-(--text-secondary) transition-colors"
        @click="nextTrack"
      >
        <UIcon
          name="i-lucide-skip-forward"
          class="w-4 h-4"
        />
      </button>
      <button
        class="w-7 h-7 flex items-center justify-center relative transition-colors"
        :class="repeat !== 'off' ? 'text-(--accent-primary)' : 'text-(--text-dim) hover:text-(--text-secondary)'"
        @click="toggleRepeat"
      >
        <UIcon
          :name="repeat === 'one' ? 'i-lucide-repeat-1' : 'i-lucide-repeat'"
          class="w-3.5 h-3.5"
        />
      </button>
    </div>
  </div>
</template>

<style scoped>
.tracklist-enter-active,
.tracklist-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.tracklist-enter-from,
.tracklist-leave-to {
  opacity: 0;
  max-height: 0;
}
.tracklist-enter-to,
.tracklist-leave-from {
  max-height: 120px;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 3px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: var(--border-subtle);
  border-radius: 3px;
}
</style>
