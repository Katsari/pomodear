<template>
  <div class="flex-1 relative min-h-0">
    <div
      class="fixed top-[144px] z-20"
      style="left: calc(50vw - 105px);"
    >
      <DraggableWrapper class="flex flex-col items-center gap-5">
        <TimerRing />
        <TimerControls />
      </DraggableWrapper>
    </div>
  </div>
</template>
