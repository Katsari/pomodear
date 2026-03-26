<script setup lang="ts">
const { isMobile } = useIsMobile()
</script>

<template>
  <div class="flex-1 relative min-h-0">
    <!-- Desktop: fixed position, draggable -->
    <div
      v-if="!isMobile"
      class="fixed top-[144px] z-20"
      style="left: calc(50vw - 105px);"
    >
      <DraggableWrapper class="flex flex-col items-center gap-5">
        <TimerRing />
        <TimerControls />
      </DraggableWrapper>
    </div>

    <!-- Mobile: centered in flow -->
    <div
      v-else
      class="flex flex-col items-center gap-4 pt-12"
    >
      <TimerRing :size="170" />
      <TimerControls />

      <!-- Mobile: now playing mini -->
      <div class="flex flex-col items-center gap-3 mt-4 px-6">
        <MiniNowPlaying />
      </div>
    </div>
  </div>
</template>
