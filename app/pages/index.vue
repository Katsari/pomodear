<script setup lang="ts">
const { panels, closeAllPanels, activeMobilePanel } = usePanels()
const { selectedBackground } = useSettings()
const { isMobile } = useIsMobile()
const showSettings = ref(false)

const { showShortcuts } = useKeyboardShortcuts()

const sheetEl = ref<HTMLElement | null>(null)
const dragStartY = ref(0)
const dragOffset = ref(0)
const isDragging = ref(false)

function onDragStart(e: PointerEvent) {
  isDragging.value = true
  dragStartY.value = e.clientY
  dragOffset.value = 0
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function onDragMove(e: PointerEvent) {
  if (!isDragging.value) return
  const dy = e.clientY - dragStartY.value
  dragOffset.value = Math.max(0, dy)
}

function onDragEnd() {
  if (!isDragging.value) return
  isDragging.value = false
  if (dragOffset.value > 80) {
    closeAllPanels()
  }
  dragOffset.value = 0
}

const backgrounds: Record<string, string> = {
  'dragon-shrine': '/images/dragon_shrine.webp',
  'sensei': '/images/sensei.webp',
  'birds': '/images/birds.webp',
  'coffee-dragon': '/images/coffee_dragon.webp',
  'sea': '/images/sea.webp',
  'workspace': '/images/workspace.webp',
  'capy-crow': '/images/capy_crow.webp',
  'leafeon': '/images/leafeon.webp'
}

const backgroundSrc = computed(() => backgrounds[selectedBackground.value] ?? '/images/dragon_shrine.webp')
</script>

<template>
  <div class="relative w-screen h-screen overflow-hidden">
    <!-- Background layers -->
    <BackgroundLayer :src="backgroundSrc" />

    <!-- App content -->
    <div class="relative z-10 flex flex-col h-full">
      <NavBar v-model:show-settings="showSettings" />

      <!-- Desktop: draggable floating ActionBar -->
      <div
        v-if="!isMobile"
        class="flex justify-center py-3 h-[56px] shrink-0"
      >
        <DraggableWrapper>
          <ActionBar />
        </DraggableWrapper>
      </div>

      <!-- Main layout -->
      <div class="flex-1 flex items-stretch px-2 lg:px-4 pb-4 gap-6 min-h-0">
        <!-- Left: Music + Quote (desktop only) -->
        <div class="hidden lg:flex w-[300px] shrink-0 flex-col gap-3">
          <Transition name="slide-left">
            <DraggableWrapper
              v-if="panels.music"
              class="flex items-start"
            >
              <MusicPanel />
            </DraggableWrapper>
          </Transition>
          <Transition name="slide-left">
            <DraggableWrapper v-if="panels.quote">
              <QuotePanel />
            </DraggableWrapper>
          </Transition>
        </div>

        <!-- Center: Timer -->
        <TimerArea />

        <!-- Right: Tasks + Daily Note (desktop only) -->
        <div class="hidden lg:flex w-[480px] shrink-0 flex-col gap-4 min-h-0 overflow-y-auto scrollbar-glass">
          <Transition name="slide-right">
            <DraggableWrapper v-if="panels.tasks">
              <TasksPanel />
            </DraggableWrapper>
          </Transition>
          <Transition name="slide-right">
            <DraggableWrapper v-if="panels.dailyNote">
              <DailyNotePanel />
            </DraggableWrapper>
          </Transition>
        </div>
      </div>
    </div>

    <!-- Mobile: fixed bottom ActionBar dock -->
    <div
      v-if="isMobile"
      class="fixed bottom-0 inset-x-0 z-30 flex justify-center p-2 pb-safe"
    >
      <ActionBar />
    </div>

    <!-- Mobile: panel slide-up sheets -->
    <Teleport to="body">
      <!-- Backdrop -->
      <Transition name="fade">
        <div
          v-if="isMobile && activeMobilePanel"
          class="fixed inset-0 z-40 bg-black/40"
          @click="closeAllPanels"
        />
      </Transition>
      <!-- Sheet -->
      <Transition
        name="slide-up"
        @after-leave="dragOffset = 0"
      >
        <div
          v-if="isMobile && activeMobilePanel"
          ref="sheetEl"
          class="fixed inset-x-0 bottom-0 z-50 max-h-[80vh] rounded-t-2xl overflow-hidden"
          :style="dragOffset > 0 ? { transform: `translateY(${dragOffset}px)`, transition: isDragging ? 'none' : 'transform 0.25s ease' } : {}"
        >
          <!-- Drag handle -->
          <div
            class="sticky top-0 z-10 flex justify-center py-2 glass-nav border-t border-x border-(--border-subtle) rounded-t-2xl touch-none cursor-grab active:cursor-grabbing"
            @pointerdown="onDragStart"
            @pointermove="onDragMove"
            @pointerup="onDragEnd"
            @pointercancel="onDragEnd"
            @click="closeAllPanels"
          >
            <div class="w-10 h-1 rounded-full bg-(--text-dimmer)" />
          </div>
          <div class="overflow-y-auto max-h-[calc(80vh-28px)] scrollbar-glass pb-safe">
            <MusicPanel
              v-if="activeMobilePanel === 'music'"
              class="rounded-t-none border-t-0"
            />
            <TasksPanel
              v-if="activeMobilePanel === 'tasks'"
              class="rounded-t-none border-t-0"
            />
            <DailyNotePanel
              v-if="activeMobilePanel === 'dailyNote'"
              class="rounded-t-none border-t-0"
            />
            <QuotePanel
              v-if="activeMobilePanel === 'quote'"
              class="rounded-t-none border-t-0"
            />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Modals -->
    <SettingsPanel v-model="showSettings" />
    <ShortcutsModal v-model="showShortcuts" />
  </div>
</template>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.slide-left-enter-from,
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.slide-right-enter-from,
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
