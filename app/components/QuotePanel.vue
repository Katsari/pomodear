<script setup lang="ts">
const { currentQuote, updateQuoteText, updateQuoteAuthor } = useQuote()
const { closePanel } = usePanels()

function onTextBlur(e: Event) {
  const el = e.target as HTMLElement
  const text = el.innerText.trim()
  if (text) updateQuoteText(text)
}

function onAuthorBlur(e: Event) {
  const el = e.target as HTMLElement
  const author = el.innerText.replace(/^—\s*/, '').trim()
  if (author) updateQuoteAuthor(author)
}

function preventNewline(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    ;(e.target as HTMLElement).blur()
  }
}
</script>

<template>
  <div class="glass-accent rounded-2xl border border-(--border-subtle)/50 flex flex-col gap-2.5 p-4 shadow-sm">
    <PanelHeader
      title="Daily Quote"
      icon="i-lucide-sparkles"
      icon-color="var(--text-primary)"
      @close="closePanel('quote')"
    />

    <div
      :key="currentQuote.text"
      class="rounded-xl p-3.5 flex flex-col gap-2 quote-fade-in"
      style="background: linear-gradient(180deg, #C4813A12, #7C907008); border: 1px solid #C4813A18;"
    >
      <UIcon
        name="i-lucide-quote"
        class="w-4 h-4 text-(--accent-primary)/60"
      />
      <p
        contenteditable="true"
        spellcheck="false"
        class="font-display text-[13px] italic text-(--text-quote) leading-relaxed outline-none cursor-text rounded px-0.5 -mx-0.5 transition-colors focus:bg-white/5"
        @blur="onTextBlur"
        @keydown.enter="preventNewline"
      >
        {{ currentQuote.text }}
      </p>
      <p
        contenteditable="true"
        spellcheck="false"
        class="text-[10px] text-(--text-dim) font-medium font-ui outline-none cursor-text rounded px-0.5 -mx-0.5 transition-colors focus:bg-white/5"
        @blur="onAuthorBlur"
        @keydown.enter="preventNewline"
      >
        — {{ currentQuote.author }}
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.quote-fade-in {
  animation: fade-in-up 0.4s ease-out;
}
</style>
