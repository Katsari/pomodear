<script setup lang="ts">
const props = defineProps<{ src: string }>()

const currentSrc = ref(props.src)
const nextSrc = ref('')
const transitioning = ref(false)

watch(() => props.src, (newSrc) => {
  if (newSrc === currentSrc.value || transitioning.value) return
  nextSrc.value = newSrc

  if (!import.meta.client) return
  const img = new Image()
  img.src = newSrc
  const onReady = () => {
    transitioning.value = true
    // Wait for the next frame so the next image is rendered at opacity-0,
    // then trigger the crossfade
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        transitioning.value = true
      })
    })
  }

  if (img.decode) {
    img.decode().then(onReady).catch(onReady)
  } else {
    img.onload = onReady
  }
})

function onTransitionEnd() {
  if (!transitioning.value) return
  // The next image is now fully visible, so swap it to become the current
  currentSrc.value = nextSrc.value
  transitioning.value = false
  // Clear nextSrc after a frame so currentSrc <img> has rendered with the new src
  requestAnimationFrame(() => {
    nextSrc.value = ''
  })
}
</script>

<template>
  <div class="absolute inset-0">
    <!-- Current background -->
    <img
      :src="currentSrc"
      alt=""
      class="absolute inset-0 w-full h-full object-cover object-[center_50%]"
      loading="eager"
    >
    <!-- Next background (crossfade in on top) -->
    <img
      v-if="nextSrc"
      :src="nextSrc"
      alt=""
      class="absolute inset-0 w-full h-full object-cover object-[center_50%] transition-opacity duration-800 ease-in-out"
      :class="transitioning ? 'opacity-100' : 'opacity-0'"
      @transitionend="onTransitionEnd"
    >
    <!-- Warm tint overlay -->
    <div
      class="absolute inset-0"
      style="background-color: rgba(62, 26, 10, 0.20);"
    />
  </div>
</template>
