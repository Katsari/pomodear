<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Pomodear',
  ogTitle: 'Pomodear - Cozy Pomodoro Timer',
  description: 'A cozy Pomodoro timer with ambient sounds, music playback, task tracking, and daily notes — stay focused in style.',
  ogDescription: 'A cozy Pomodoro timer with ambient sounds, music playback, task tracking, and daily notes — stay focused in style.',
  ogImage: 'https://pomodear.pages.dev/og-image.png',
  ogType: 'website',
  ogUrl: 'https://pomodear.pages.dev',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Pomodear - Cozy Pomodoro Timer',
  twitterDescription: 'A cozy Pomodoro timer with ambient sounds, music playback, task tracking, and daily notes — stay focused in style.',
  twitterImage: 'https://pomodear.pages.dev/og-image.png'
})

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Pomodear',
      'url': 'https://pomodear.pages.dev',
      'applicationCategory': 'ProductivityApplication',
      'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' }
    })
  }]
})
</script>
