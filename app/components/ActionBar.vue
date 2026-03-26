<script setup lang="ts">
import type { PanelName } from '~/types'

const { panels, togglePanel } = usePanels()
const { activeAmbients } = useAudio()
const { isMobile } = useIsMobile()

const buttons: { name: PanelName, icon: string, color: string, activeColor: string }[] = [
  { name: 'music', icon: 'i-lucide-music', color: '#7EADD4', activeColor: 'rgba(126,173,212,0.15)' },
  { name: 'tasks', icon: 'i-lucide-square-check-big', color: '#7C9070', activeColor: 'rgba(124,144,112,0.15)' },
  { name: 'dailyNote', icon: 'i-lucide-notebook-pen', color: '#C4813A', activeColor: 'rgba(196,129,58,0.15)' },
  { name: 'quote', icon: 'i-lucide-sparkles', color: '#F0EFEC', activeColor: 'rgba(240,239,236,0.1)' }
]
</script>

<template>
  <div class="glass-bar flex items-center gap-1 px-2 py-1.5 rounded-xl border border-(--border-subtle)">
    <UIcon
      name="i-lucide-grip-horizontal"
      class="text-(--text-dimmer) w-4 h-4 cursor-grab mx-1 hidden lg:block"
    />
    <div class="w-px h-5 bg-(--border-subtle) mx-1 hidden lg:block" />
    <button
      v-for="btn in buttons"
      :key="btn.name"
      class="relative w-10 h-10 lg:w-8 lg:h-8 flex items-center justify-center rounded-lg transition-all"
      :style="{
        backgroundColor: panels[btn.name] ? btn.activeColor : 'transparent',
        color: panels[btn.name] ? btn.color : 'var(--text-dimmer)'
      }"
      @click="togglePanel(btn.name)"
    >
      <UIcon
        :name="btn.icon"
        class="w-4 h-4"
      />
      <!-- Ambient activity dot (mobile only, music button only) -->
      <span
        v-if="isMobile && btn.name === 'music' && activeAmbients.length > 0"
        class="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-(--accent-primary)"
      />
    </button>
  </div>
</template>
