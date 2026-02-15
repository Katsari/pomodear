<template>
  <div class="flex-1 relative min-h-0">
    <!-- Timer group positioned at top-left of center area -->
    <div
      class="absolute top-11"
      style="left: calc(35% - 70px);"
    >
      <DraggableWrapper class="flex flex-col items-center gap-5">
        <TimerRing />
        <TimerControls />
      </DraggableWrapper>
    </div>
  </div>
</template>
