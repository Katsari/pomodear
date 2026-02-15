<script setup lang="ts">
const { panels } = usePanels()
const { selectedBackground } = useSettings()
const showSettings = ref(false)

const backgrounds: Record<string, string> = {
  'benny-cafe': '/images/benny_cafe.png',
  'sensei': '/images/sensei.jpg',
  'birds': '/images/birds.jpg',
  'coffee-dragon': '/images/coffee_dragon.jpg',
  'dragon-shrine': '/images/dragon_shrine.jpg',
  'sea': '/images/sea.png',
  'workspace': '/images/workspace.jpg',
  'capy-crow': '/images/capy_crow.png'
}

const backgroundSrc = computed(() => backgrounds[selectedBackground.value] ?? backgrounds['benny-cafe'])
</script>

<template>
  <div class="relative w-screen h-screen overflow-hidden">
    <!-- Background layers -->
    <div class="absolute inset-0">
      <NuxtImg
        :src="backgroundSrc"
        alt=""
        class="absolute inset-0 w-full h-full object-cover object-[center_50%]"
        format="webp"
        quality="80"
        loading="eager"
      />
      <div
        class="absolute inset-0"
        style="background-color: rgba(62, 26, 10, 0.20);"
      />
    </div>

    <!-- App content -->
    <div class="relative z-10 flex flex-col h-full">
      <NavBar v-model:show-settings="showSettings" />

      <div class="flex justify-center py-3 h-[56px] shrink-0">
        <DraggableWrapper>
          <ActionBar />
        </DraggableWrapper>
      </div>

      <!-- Main 3-column layout -->
      <div class="flex-1 flex items-stretch px-4 pb-4 gap-6 min-h-0">
        <!-- Left: Music + Quote -->
        <div class="w-[300px] shrink-0 flex flex-col gap-3">
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

        <!-- Right: Tasks + Daily Note -->
        <div class="w-[440px] shrink-0 flex flex-col gap-3 min-h-0 overflow-y-auto scrollbar-glass">
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

    <!-- Settings Modal -->
    <SettingsModal v-model="showSettings" />
  </div>
</template>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
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
