<script setup lang="ts">
const open = defineModel<boolean>({ default: false })
const { userName, timerSettings, selectedBackground } = useSettings()

const backgrounds = [
  { key: 'benny-cafe', label: 'Benny\'s Café', image: '/images/benny_cafe.png' },
  { key: 'sensei', label: 'Sensei', image: '/images/sensei.jpg' },
  { key: 'birds', label: 'Birds', image: '/images/birds.jpg' },
  { key: 'coffee-dragon', label: 'Coffee Dragon', image: '/images/coffee_dragon.jpg' },
  { key: 'dragon-shrine', label: 'Dragon Shrine', image: '/images/dragon_shrine.jpg' },
  { key: 'sea', label: 'Sea', image: '/images/sea.png' },
  { key: 'workspace', label: 'Workspace', image: '/images/workspace.jpg' },
  { key: 'capy-crow', label: 'Capy & Crow', image: '/images/capy_crow.png' }
]
</script>

<template>
  <UModal
    v-model:open="open"
    title="Settings"
    :close="true"
    :ui="{
      content: 'bg-(--bg-surface) border border-(--border-subtle) rounded-2xl max-w-md',
      header: 'border-b border-(--border-subtle)',
      title: 'font-display text-lg font-semibold text-(--text-primary)',
      body: 'p-5 flex flex-col gap-5',
      close: 'text-(--text-dim) hover:text-(--text-secondary)',
      overlay: 'bg-black/50'
    }"
  >
    <template #body>
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
        <div class="grid grid-cols-4 gap-2">
          <button
            v-for="bg in backgrounds"
            :key="bg.key"
            class="aspect-video rounded-lg border-2 overflow-hidden flex items-center justify-center text-[10px] text-(--text-dimmer) transition-colors"
            :class="selectedBackground === bg.key
              ? 'border-(--accent-primary)'
              : 'border-(--border-subtle) hover:border-(--text-dimmer)'"
            :style="bg.image ? { backgroundImage: `url(${bg.image})`, backgroundSize: 'cover' } : { backgroundColor: 'var(--bg-surface-dark)' }"
            @click="selectedBackground = bg.key"
          >
            <span v-if="!bg.image">{{ bg.label }}</span>
          </button>
        </div>
      </div>
    </template>
  </UModal>
</template>
