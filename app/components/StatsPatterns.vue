<script setup lang="ts">
const { bestHour, bestDayOfWeek, avgSessionMinutes, totalSessionsAllTime } = useStatistics()
const { writingStreak, longestWritingStreak } = useWritingStats()

function formatHourRange(h: number): string {
  const start = h === 0 ? '12' : h > 12 ? `${h - 12}` : `${h}`
  const end = (h + 1) % 12 === 0 ? '12' : (h + 1) > 12 ? `${(h + 1) - 12}` : `${h + 1}`
  const period = h < 12 ? 'AM' : 'PM'
  return `${start} \u2013 ${end} ${period}`
}
</script>

<template>
  <div>
    <h3 class="font-display text-base text-(--text-dim) mb-3">
      Patterns
    </h3>
    <div class="flex flex-col gap-2.5">
      <!-- Peak Hour -->
      <div
        class="rounded-xl p-4 bg-(--bg-surface) border border-[#E8956515]"
        style="background: linear-gradient(135deg, #E8956510 0%, #2A2724 100%);"
      >
        <div class="flex items-center gap-2 mb-2">
          <UIcon
            name="i-lucide-sunrise"
            class="w-4 h-4 text-[#E89565]"
          />
          <span class="text-[13px] font-medium text-[#E8956590]">
            peak focus hour
          </span>
        </div>
        <p
          v-if="bestHour !== null"
          class="font-data text-xl text-(--text-primary)"
        >
          {{ formatHourRange(bestHour) }}
        </p>
        <p
          v-else
          class="text-sm text-(--text-dim) italic"
        >
          Keep going, patterns will emerge with more sessions.
        </p>
      </div>

      <!-- Strongest Day -->
      <div
        class="rounded-xl p-4 bg-(--bg-surface) border border-[#7EADD412]"
        style="background: linear-gradient(135deg, #7EADD408 0%, #2A2724 100%);"
      >
        <div class="flex items-center gap-2 mb-2">
          <UIcon
            name="i-lucide-calendar-heart"
            class="w-4 h-4 text-(--accent-blue)"
          />
          <span class="text-[13px] font-medium text-[#7EADD490]">
            strongest day
          </span>
        </div>
        <template v-if="bestDayOfWeek">
          <p class="font-data text-xl text-(--text-primary)">
            {{ bestDayOfWeek }}
          </p>
          <p class="text-[12px] text-(--text-dimmer) mt-1">
            avg {{ avgSessionMinutes }}m per session
          </p>
        </template>
        <p
          v-else
          class="text-sm text-(--text-dim) italic"
        >
          A week of data needed to find your rhythm.
        </p>
      </div>

      <!-- Sessions Completed -->
      <div
        class="rounded-xl p-4 bg-(--bg-surface) border border-[#7C907012] flex items-center gap-3"
        style="background: linear-gradient(135deg, #7C907008 0%, #2A2724 100%);"
      >
        <div class="w-11 h-11 rounded-full bg-[#7C907018] flex items-center justify-center shrink-0">
          <span class="font-data text-sm font-bold text-(--accent-green)">
            {{ totalSessionsAllTime }}
          </span>
        </div>
        <div>
          <p class="text-[13px] font-medium text-(--text-muted)">
            sessions completed
          </p>
          <p class="text-[12px] text-(--text-dimmer)">
            avg {{ avgSessionMinutes }}m each
          </p>
        </div>
      </div>

      <!-- Writing Streak -->
      <div
        class="rounded-xl p-4 bg-(--bg-surface) border border-[#C4813A12] flex items-center gap-2.5"
        style="background: linear-gradient(135deg, #C4813A08 0%, #2A2724 100%);"
      >
        <UIcon
          name="i-lucide-pen-line"
          class="w-4 h-4 text-(--accent-primary) shrink-0"
        />
        <div>
          <div class="flex items-center gap-1.5">
            <span class="font-data text-base font-bold text-(--accent-primary)">
              {{ writingStreak }}
            </span>
            <span class="text-[13px] font-medium text-[#C4813A80]">
              day writing streak
            </span>
          </div>
          <p class="text-[12px] text-(--text-dimmer)">
            longest: {{ longestWritingStreak }} {{ longestWritingStreak === 1 ? 'day' : 'days' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
