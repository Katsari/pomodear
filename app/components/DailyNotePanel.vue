<script setup lang="ts">
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Underline from '@tiptap/extension-underline'

// Cast needed: task extensions resolve @tiptap/core@3.19 vs Nuxt UI's pinned @3.17
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const editorExtensions: any[] = [TaskList, TaskItem, Underline]

const {
  noteData,
  isToday,
  planWordCount,
  writeWordCount,
  formattedDate,
  updatePlan,
  updateWrite,
  copyToClipboard,
  currentTimestamp,
  goPreviousDay,
  goNextDay,
  goToToday
} = useDailyNote()
const { closePanel } = usePanels()

const activeTab = ref<'plan' | 'write'>('plan')
const isZenMode = ref(false)
const copied = ref(false)
const showToolbar = ref(false)
let toolbarHideTimer: ReturnType<typeof setTimeout> | null = null

function onEditorFocusIn() {
  if (toolbarHideTimer) clearTimeout(toolbarHideTimer)
  showToolbar.value = true
}

function onEditorFocusOut() {
  toolbarHideTimer = setTimeout(() => {
    showToolbar.value = false
  }, 200)
}

// Template ref for accessing editor instance (for timestamp insertion)
const planEditorRef = ref()

const activeWordCount = computed(() =>
  activeTab.value === 'plan' ? planWordCount.value : writeWordCount.value
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toolbarItems: any[][] = [
  [
    { kind: 'heading', level: 2, icon: 'i-lucide-heading-2', tooltip: { text: 'Heading 2' } },
    { kind: 'heading', level: 3, icon: 'i-lucide-heading-3', tooltip: { text: 'Heading 3' } }
  ],
  [
    { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold', tooltip: { text: 'Bold' } },
    { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic', tooltip: { text: 'Italic' } },
    { kind: 'mark', mark: 'underline', icon: 'i-lucide-underline', tooltip: { text: 'Underline' } }
  ],
  [
    { kind: 'taskList', icon: 'i-lucide-square-check-big', tooltip: { text: 'Task List' } },
    { kind: 'bulletList', icon: 'i-lucide-list', tooltip: { text: 'Bullet List' } },
    { kind: 'orderedList', icon: 'i-lucide-list-ordered', tooltip: { text: 'Numbered List' } }
  ],
  [
    { kind: 'horizontalRule', icon: 'i-lucide-minus', tooltip: { text: 'Separator' } },
    { kind: 'codeBlock', icon: 'i-lucide-square-code', tooltip: { text: 'Code Block' } },
    { kind: 'mark', mark: 'code', icon: 'i-lucide-code', tooltip: { text: 'Inline Code' } }
  ]
]

function onPlanUpdate(value: string) {
  updatePlan(value)
}

function onWriteUpdate(value: string) {
  updateWrite(value)
}

async function handleCopy() {
  const success = await copyToClipboard(activeTab.value)
  if (success) {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}

function insertTimestamp() {
  if (activeTab.value !== 'plan') return
  const editor = planEditorRef.value?.editor
  if (!editor) return
  const ts = currentTimestamp()
  editor.chain().focus()
    .insertContent(`- **${ts}** - `)
    .run()
}

// Zen mode keyboard shortcut
if (import.meta.client) {
  const handler = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'f') {
      e.preventDefault()
      isZenMode.value = !isZenMode.value
    }
    if (e.key === 'Escape' && isZenMode.value) {
      isZenMode.value = false
    }
  }
  onMounted(() => document.addEventListener('keydown', handler))
  onUnmounted(() => document.removeEventListener('keydown', handler))
}
</script>

<template>
  <div class="glass-writing rounded-2xl border border-(--border-subtle) flex flex-col gap-3 p-4 shadow-lg">
    <PanelHeader
      title="Daily Note"
      icon="i-lucide-notebook-pen"
      icon-color="var(--accent-primary)"
      @close="closePanel('dailyNote')"
    >
      <template #actions>
        <!-- Date navigation -->
        <div class="flex items-center gap-1">
          <button
            class="w-5 h-5 flex items-center justify-center rounded text-(--text-dimmer) hover:text-(--text-secondary) transition-colors"
            @click="goPreviousDay"
          >
            <UIcon
              name="i-lucide-chevron-left"
              class="w-3 h-3"
            />
          </button>
          <button
            class="text-[10px] font-data px-1.5 py-0.5 rounded-md transition-colors"
            :class="isToday
              ? 'bg-[rgba(196,129,58,0.2)] text-(--accent-primary)'
              : 'bg-(--bg-surface) text-(--text-dim) hover:text-(--text-secondary)'"
            @click="goToToday"
          >
            {{ formattedDate }}
          </button>
          <button
            class="w-5 h-5 flex items-center justify-center rounded transition-colors"
            :class="isToday
              ? 'text-(--text-dimmer) cursor-default'
              : 'text-(--text-dimmer) hover:text-(--text-secondary)'"
            :disabled="isToday"
            @click="goNextDay"
          >
            <UIcon
              name="i-lucide-chevron-right"
              class="w-3 h-3"
            />
          </button>
        </div>

        <!-- Zen mode toggle -->
        <button
          class="w-5 h-5 flex items-center justify-center rounded text-(--text-dimmer) hover:text-(--text-secondary) transition-colors"
          @click="isZenMode = true"
        >
          <UIcon
            name="i-lucide-maximize-2"
            class="w-3 h-3"
          />
        </button>
      </template>
    </PanelHeader>

    <!-- Tabs -->
    <div class="flex gap-1 px-1">
      <button
        class="flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors"
        :class="activeTab === 'plan'
          ? 'bg-(--bg-surface) text-(--text-primary)'
          : 'text-(--text-dimmer) hover:text-(--text-secondary)'"
        @click="activeTab = 'plan'"
      >
        Plan
      </button>
      <button
        class="flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors"
        :class="activeTab === 'write'
          ? 'bg-(--bg-surface) text-(--text-primary)'
          : 'text-(--text-dimmer) hover:text-(--text-secondary)'"
        @click="activeTab = 'write'"
      >
        Write
      </button>
    </div>

    <!-- Editor (hidden when zen mode is active to prevent dual-editor sync conflicts) -->
    <div
      v-if="!isZenMode"
      class="daily-editor rounded-xl bg-(--bg-surface) p-3"
      @focusin="onEditorFocusIn"
      @focusout="onEditorFocusOut"
    >
      <UEditor
        v-if="activeTab === 'plan'"
        v-slot="{ editor }"
        ref="planEditorRef"
        :key="`plan-${noteData.date}`"
        :model-value="noteData.plan"
        content-type="markdown"
        placeholder="What does a good day look like?"
        :extensions="editorExtensions"
        :image="false"
        :mention="false"
        :ui="{ root: 'border-0 bg-transparent shadow-none ring-0', content: 'p-0', base: 'sm:px-0' }"
        @update:model-value="onPlanUpdate"
      >
        <Transition name="toolbar-slide">
          <UEditorToolbar
            v-if="editor && showToolbar"
            :editor="editor"
            :items="toolbarItems"
          />
        </Transition>
      </UEditor>
      <UEditor
        v-else
        v-slot="{ editor }"
        :key="`write-${noteData.date}`"
        :model-value="noteData.write"
        content-type="markdown"
        placeholder="Free-write, reflect, or brainstorm..."
        :extensions="editorExtensions"
        :image="false"
        :mention="false"
        :ui="{ root: 'border-0 bg-transparent shadow-none ring-0', content: 'p-0', base: 'sm:px-0' }"
        @update:model-value="onWriteUpdate"
      >
        <Transition name="toolbar-slide">
          <UEditorToolbar
            v-if="editor && showToolbar"
            :editor="editor"
            :items="toolbarItems"
          />
        </Transition>
      </UEditor>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between px-1">
      <div class="flex items-center gap-2">
        <!-- Timestamp insert (plan tab only) -->
        <button
          v-if="activeTab === 'plan' && isToday"
          class="flex items-center gap-1 text-[10px] text-(--text-dimmer) hover:text-(--text-secondary) transition-colors"
          @click="insertTimestamp"
        >
          <UIcon
            name="i-lucide-clock"
            class="w-3 h-3"
          />
          <span>Log</span>
        </button>

        <!-- Copy to clipboard -->
        <button
          class="flex items-center gap-1 text-[10px] transition-colors"
          :class="copied ? 'text-(--accent-green)' : 'text-(--text-dimmer) hover:text-(--text-secondary)'"
          @click="handleCopy"
        >
          <UIcon
            :name="copied ? 'i-lucide-check' : 'i-lucide-clipboard-copy'"
            class="w-3 h-3"
          />
          <span>{{ copied ? 'Copied!' : 'Copy' }}</span>
        </button>
      </div>

      <span class="text-[10px] font-data text-(--text-dimmer)">
        {{ activeWordCount }} words
      </span>
    </div>
    <!-- Zen Mode Overlay -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="isZenMode"
          class="fixed inset-0 z-200 flex flex-col items-center"
        >
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-[#1A1916]/85 backdrop-blur-sm" />

          <!-- Zen content -->
          <div class="relative z-10 w-full max-w-3xl flex flex-col h-full py-12 px-6">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-4">
                <span class="font-display text-lg text-(--text-muted)">
                  {{ formattedDate }}
                </span>
                <!-- Tabs in zen mode -->
                <div class="flex gap-1">
                  <button
                    class="text-xs px-3 py-1 rounded-lg font-medium transition-colors"
                    :class="activeTab === 'plan'
                      ? 'bg-(--bg-surface) text-(--text-primary)'
                      : 'text-(--text-dimmer) hover:text-(--text-secondary)'"
                    @click="activeTab = 'plan'"
                  >
                    Plan
                  </button>
                  <button
                    class="text-xs px-3 py-1 rounded-lg font-medium transition-colors"
                    :class="activeTab === 'write'
                      ? 'bg-(--bg-surface) text-(--text-primary)'
                      : 'text-(--text-dimmer) hover:text-(--text-secondary)'"
                    @click="activeTab = 'write'"
                  >
                    Write
                  </button>
                </div>
              </div>
              <button
                class="text-(--text-dim) hover:text-(--text-primary) transition-colors"
                @click="isZenMode = false"
              >
                <UIcon
                  name="i-lucide-minimize-2"
                  class="w-5 h-5"
                />
              </button>
            </div>

            <!-- Zen Editor -->
            <div class="zen-editor flex-1 flex flex-col min-h-0 overflow-y-auto scrollbar-glass">
              <UEditor
                v-if="activeTab === 'plan'"
                v-slot="{ editor }"
                :key="`zen-plan-${noteData.date}`"
                :model-value="noteData.plan"
                content-type="markdown"
                :extensions="editorExtensions"
                :image="false"
                :mention="false"
                :ui="{ root: 'border-0 bg-transparent shadow-none ring-0 flex-1 flex flex-col', content: 'p-0 flex-1', base: 'sm:px-0' }"
                @update:model-value="onPlanUpdate"
              >
                <UEditorToolbar
                  v-if="editor"
                  :editor="editor"
                  :items="toolbarItems"
                />
              </UEditor>
              <UEditor
                v-else
                v-slot="{ editor }"
                :key="`zen-write-${noteData.date}`"
                :model-value="noteData.write"
                content-type="markdown"
                placeholder="Start writing..."
                :extensions="editorExtensions"
                :image="false"
                :mention="false"
                :ui="{ root: 'border-0 bg-transparent shadow-none ring-0 flex-1 flex flex-col', content: 'p-0 flex-1', base: 'sm:px-0' }"
                @update:model-value="onWriteUpdate"
              >
                <UEditorToolbar
                  v-if="editor"
                  :editor="editor"
                  :items="toolbarItems"
                />
              </UEditor>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between mt-4 text-xs text-(--text-dimmer)">
              <div class="flex items-center gap-3">
                <button
                  v-if="activeTab === 'plan' && isToday"
                  class="hover:text-(--text-secondary) transition-colors flex items-center gap-1"
                  @click="insertTimestamp"
                >
                  <UIcon
                    name="i-lucide-clock"
                    class="w-3.5 h-3.5"
                  />
                  <span>Log</span>
                </button>
                <button
                  class="transition-colors flex items-center gap-1"
                  :class="copied ? 'text-(--accent-green)' : 'hover:text-(--text-secondary)'"
                  @click="handleCopy"
                >
                  <UIcon
                    :name="copied ? 'i-lucide-check' : 'i-lucide-clipboard-copy'"
                    class="w-3.5 h-3.5"
                  />
                  <span>{{ copied ? 'Copied!' : 'Copy' }}</span>
                </button>
              </div>
              <span class="font-data">{{ activeWordCount }} words</span>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.toolbar-slide-enter-active,
.toolbar-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
  transform-origin: top;
}
.toolbar-slide-enter-from,
.toolbar-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
