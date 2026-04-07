<script setup lang="ts">
const open = defineModel<boolean>({ default: false })
const { userName, timerSettings, selectedBackground } = useSettings()

const backgrounds = [
  { key: 'dragon-shrine', label: 'Dragon Shrine', image: '/images/dragon_shrine.webp' },
  { key: 'sensei', label: 'Sensei', image: '/images/sensei.webp' },
  { key: 'birds', label: 'Birds', image: '/images/birds.webp' },
  { key: 'coffee-dragon', label: 'Coffee Dragon', image: '/images/coffee_dragon.webp' },
  { key: 'sea', label: 'Sea', image: '/images/sea.webp' },
  { key: 'workspace', label: 'Workspace', image: '/images/workspace.webp' },
  { key: 'capy-crow', label: 'Capy & Crow', image: '/images/capy_crow.webp' },
  { key: 'leafeon', label: 'Leafeon', image: '/images/leafeon.webp' }
]
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-50 bg-black/40"
        @click="open = false"
      />
    </Transition>

    <!-- Panel -->
    <Transition name="slide-right-full">
      <div
        v-if="open"
        class="fixed inset-y-0 right-0 z-50 w-full sm:w-[360px] glass-nav border-l border-(--border-subtle) flex flex-col overflow-y-auto scrollbar-glass"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-5 border-b border-(--border-subtle)">
          <h2 class="font-display text-lg font-semibold text-(--text-primary)">
            Settings
          </h2>
          <button
            class="w-8 h-8 flex items-center justify-center rounded-lg text-(--text-dim) hover:text-(--text-secondary) hover:bg-(--bg-surface) transition-all"
            @click="open = false"
          >
            <UIcon
              name="i-lucide-x"
              class="w-4 h-4"
            />
          </button>
        </div>

        <!-- Body -->
        <div class="p-5 flex flex-col gap-5 flex-1">
          <!-- User name -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs text-(--text-dim) font-medium">Your Name</label>
            <input
              v-model="userName"
              class="w-full bg-(--bg-surface-dark) rounded-lg px-3 py-2 text-sm text-(--text-primary) outline-none border border-(--border-subtle) focus:border-(--accent-primary) transition-colors"
            >
          </div>

          <!-- Timer durations -->
          <div class="grid grid-cols-3 gap-3">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs text-(--text-dim) font-medium">Focus</label>
              <input
                v-model.number="timerSettings.focusDuration"
                type="number"
                min="1"
                max="120"
                class="w-full bg-(--bg-surface-dark) rounded-lg px-3 py-2 text-sm text-(--text-primary) outline-none border border-(--border-subtle) focus:border-(--accent-primary) transition-colors text-center"
              >
              <span class="text-[10px] text-(--text-dimmer) text-center">minutes</span>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs text-(--text-dim) font-medium">Break</label>
              <input
                v-model.number="timerSettings.breakDuration"
                type="number"
                min="1"
                max="60"
                class="w-full bg-(--bg-surface-dark) rounded-lg px-3 py-2 text-sm text-(--text-primary) outline-none border border-(--border-subtle) focus:border-(--accent-primary) transition-colors text-center"
              >
              <span class="text-[10px] text-(--text-dimmer) text-center">minutes</span>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs text-(--text-dim) font-medium">Long Break</label>
              <input
                v-model.number="timerSettings.longBreakDuration"
                type="number"
                min="1"
                max="60"
                class="w-full bg-(--bg-surface-dark) rounded-lg px-3 py-2 text-sm text-(--text-primary) outline-none border border-(--border-subtle) focus:border-(--accent-primary) transition-colors text-center"
              >
              <span class="text-[10px] text-(--text-dimmer) text-center">minutes</span>
            </div>
          </div>

          <!-- Sessions -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs text-(--text-dim) font-medium">Sessions before long break</label>
            <input
              v-model.number="timerSettings.sessionsBeforeLong"
              type="number"
              min="1"
              max="12"
              class="w-full bg-(--bg-surface-dark) rounded-lg px-3 py-2 text-sm text-(--text-primary) outline-none border border-(--border-subtle) focus:border-(--accent-primary) transition-colors"
            >
          </div>

          <!-- Background selector -->
          <div class="flex flex-col gap-2">
            <label class="text-xs text-(--text-dim) font-medium">Background</label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="bg in backgrounds"
                :key="bg.key"
                class="group relative aspect-video rounded-lg border-2 overflow-hidden transition-colors"
                :class="selectedBackground === bg.key
                  ? 'border-(--accent-primary)'
                  : 'border-(--border-subtle) hover:border-(--text-dimmer)'"
                @click="selectedBackground = bg.key"
              >
                <img
                  :src="bg.image"
                  :alt="bg.label"
                  class="w-full h-full object-cover"
                >
                <span class="absolute inset-x-0 bottom-0 text-[9px] text-white/80 bg-black/40 px-1 py-0.5 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {{ bg.label }}
                </span>
              </button>
            </div>
          </div>

          <!-- Keyboard shortcuts hint -->
          <div class="flex items-center justify-center gap-1.5 text-xs text-(--text-dimmer)">
            <span>Press</span>
            <kbd class="px-1.5 py-0.5 rounded bg-(--bg-surface-dark) border border-(--border-subtle) font-mono text-(--text-muted)">?</kbd>
            <span>for keyboard shortcuts</span>
          </div>

          <!-- Credits -->
          <p class="text-xs text-(--text-dimmer) text-center mt-auto pt-4">
            Art by
            <a
              href="https://www.instagram.com/danielag.art/"
              target="_blank"
              rel="noopener noreferrer"
              class="underline hover:text-(--text-dim) transition-colors"
            >@danielag.art</a>
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.slide-right-full-enter-active,
.slide-right-full-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-full-enter-from,
.slide-right-full-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
