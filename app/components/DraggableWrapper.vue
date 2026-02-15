<script setup lang="ts">
const { elementRef, style, isDragging } = useDraggable()
</script>

<template>
  <div
    ref="elementRef"
    :style="style"
    :class="{ 'select-none': isDragging }"
  >
    <slot />
  </div>
</template>
