<script setup lang="ts">
const { ambientVolume, setAmbientVolume } = useAudio()

function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  setAmbientVolume(Number(target.value))
}
</script>

<template>
  <div class="flex items-center gap-2 px-1">
    <UIcon
      :name="ambientVolume > 0 ? 'i-lucide-volume-2' : 'i-lucide-volume-x'"
      class="w-3.5 h-3.5 text-(--text-dim) shrink-0"
    />
    <div class="flex-1">
      <input
        type="range"
        min="0"
        max="100"
        :value="ambientVolume"
        class="slider-input slider-green w-full"
        :style="{ '--slider-percent': `${ambientVolume}%` }"
        @input="onInput"
      >
    </div>
    <span class="font-data text-[10px] text-(--text-dimmer) w-7 text-right shrink-0">{{ ambientVolume }}%</span>
  </div>
</template>
