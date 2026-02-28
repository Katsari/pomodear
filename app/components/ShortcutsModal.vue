<script setup lang="ts">
const open = defineModel<boolean>({ default: false })

const sections = [
  {
    title: 'Timer',
    shortcuts: [
      { key: 'Space', action: 'Play / Pause' },
      { key: 'R', action: 'Restart session' },
      { key: 'S', action: 'Skip to next session' }
    ]
  },
  {
    title: 'Panels',
    shortcuts: [
      { key: '1', action: 'Toggle Music' },
      { key: '2', action: 'Toggle Tasks' },
      { key: '3', action: 'Toggle Daily Note' },
      { key: '4', action: 'Toggle Quote' }
    ]
  },
  {
    title: 'Music',
    shortcuts: [
      { key: 'N', action: 'Next track' },
      { key: 'P', action: 'Previous track' },
      { key: 'M', action: 'Mute / Unmute' }
    ]
  }
]
</script>

<template>
  <UModal
    v-model:open="open"
    title="Keyboard Shortcuts"
    description="Available keyboard shortcuts"
    :close="true"
    :ui="{
      content: 'bg-(--bg-surface) border border-(--border-subtle) rounded-2xl max-w-sm',
      header: 'border-b border-(--border-subtle)',
      title: 'font-display text-lg font-semibold text-(--text-primary)',
      description: 'sr-only',
      body: 'p-5 flex flex-col gap-5',
      close: 'text-(--text-dim) hover:text-(--text-secondary)',
      overlay: 'bg-black/50'
    }"
  >
    <template #body>
      <div
        v-for="section in sections"
        :key="section.title"
        class="flex flex-col gap-2"
      >
        <h3 class="text-xs text-(--text-dim) font-medium uppercase tracking-wider">
          {{ section.title }}
        </h3>
        <div
          v-for="shortcut in section.shortcuts"
          :key="shortcut.key"
          class="flex items-center justify-between"
        >
          <span class="text-sm text-(--text-secondary)">{{ shortcut.action }}</span>
          <kbd class="px-2 py-0.5 rounded bg-(--bg-surface-dark) border border-(--border-subtle) text-xs font-mono text-(--text-muted)">
            {{ shortcut.key }}
          </kbd>
        </div>
      </div>
    </template>
  </UModal>
</template>
