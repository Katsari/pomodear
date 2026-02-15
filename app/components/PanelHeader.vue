<script setup lang="ts">
defineProps<{
  title: string
  icon: string
  iconColor?: string
}>()

defineEmits<{
  close: []
}>()
</script>

<template>
  <div class="flex items-center gap-2 w-full">
    <UIcon
      name="i-lucide-grip-horizontal"
      class="text-(--text-dimmer) w-3.5 h-3.5 cursor-grab shrink-0"
    />
    <div class="flex items-center gap-2 flex-1 min-w-0">
      <UIcon
        :name="icon"
        class="w-4 h-4 shrink-0"
        :style="{ color: iconColor }"
      />
      <span class="font-display text-lg font-medium text-(--text-primary) truncate">{{ title }}</span>
      <slot name="actions" />
    </div>
    <button
      class="w-[22px] h-[22px] flex items-center justify-center rounded-md bg-[#3A363280] text-(--text-dim) hover:text-(--text-secondary) transition-colors shrink-0"
      @click="$emit('close')"
    >
      <UIcon
        name="i-lucide-x"
        class="w-3 h-3"
      />
    </button>
  </div>
</template>
