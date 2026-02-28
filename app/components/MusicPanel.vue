<script setup lang="ts">
const { closePanel } = usePanels()
const { musicVolume, setMusicVolume } = useAudio()

function onMusicInput(e: Event) {
  setMusicVolume(Number((e.target as HTMLInputElement).value))
}
</script>

<template>
  <div class="glass w-full lg:w-[300px] rounded-[20px] border border-(--border-subtle) flex flex-col gap-5 p-5 shadow-xl">
    <PanelHeader
      title="Music & Ambiance"
      icon="i-lucide-music"
      icon-color="var(--accent-blue)"
      @close="closePanel('music')"
    />

    <!-- Now Playing -->
    <NowPlaying />

    <!-- Music Volume -->
    <div class="flex flex-col gap-1">
      <span class="text-[10px] text-(--text-dimmer) font-semibold uppercase tracking-wider px-1">Music Volume</span>
      <div class="flex items-center gap-2 px-1">
        <UIcon
          name="i-lucide-music"
          class="w-3.5 h-3.5 text-(--text-dim) shrink-0"
        />
        <div class="flex-1 relative h-5 flex items-center">
          <div class="w-full h-1 rounded-full bg-(--border-subtle) overflow-hidden">
            <div
              class="h-full rounded-full bg-(--accent-blue)"
              :style="{ width: `${musicVolume}%` }"
            />
          </div>
          <input
            type="range"
            min="0"
            max="100"
            :value="musicVolume"
            class="absolute inset-0 w-full opacity-0 cursor-pointer"
            @input="onMusicInput"
          >
        </div>
        <span class="font-data text-[10px] text-(--text-dimmer) w-7 text-right shrink-0">{{ musicVolume }}%</span>
      </div>
    </div>

    <!-- Ambient Sounds Section -->
    <div class="flex flex-col gap-2">
      <span class="text-xs text-(--text-muted) font-semibold uppercase tracking-wider">Ambient Sounds</span>
      <AmbientSounds />
      <div class="flex flex-col gap-1 mt-1">
        <span class="text-[10px] text-(--text-dimmer) font-semibold uppercase tracking-wider px-1">Ambient Volume</span>
        <VolumeSlider />
      </div>
    </div>
  </div>
</template>
