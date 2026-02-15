<script setup lang="ts">
import type { AmbientSound } from '~/types'

const { toggleAmbient, isAmbientActive } = useAudio()

const sounds: { id: AmbientSound, icon: string, label: string }[] = [
  { id: 'rain', icon: 'i-lucide-cloud-rain', label: 'Rain' },
  { id: 'fireplace', icon: 'i-lucide-flame', label: 'Fire' },
  { id: 'forest', icon: 'i-lucide-trees', label: 'Forest' },
  { id: 'ocean', icon: 'i-lucide-waves', label: 'Ocean' }
]
</script>

<template>
  <div class="flex gap-2">
    <button
      v-for="sound in sounds"
      :key="sound.id"
      class="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl border transition-all"
      :class="isAmbientActive(sound.id)
        ? 'bg-[rgba(196,129,58,0.1)] border-(--accent-primary) text-(--accent-primary)'
        : 'bg-(--bg-surface-dark) border-transparent text-(--text-dim) hover:text-(--text-secondary)'"
      @click="toggleAmbient(sound.id)"
    >
      <UIcon
        :name="sound.icon"
        class="w-4 h-4"
      />
      <span class="text-[10px] font-medium">{{ sound.label }}</span>
    </button>
  </div>
</template>
