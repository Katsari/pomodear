<script setup lang="ts">
const { tasks, taskProgress, addTask, toggleTask, editTask, removeTask, moveTask } = useTasks()
const { closePanel } = usePanels()

const newTaskText = ref('')
const panelHeight = useLocalStorage('pomodear-tasks-height', 240)
const isResizing = ref(false)
let resizeStartY = 0
let resizeStartHeight = 0

// --- Drag-to-reorder state ---
const listRef = ref<HTMLElement | null>(null)
const dragIndex = ref(-1)
const dragOverIndex = ref(-1)

function onDragStart(index: number, e: PointerEvent) {
  if (tasks.value[index]?.completed) return
  e.preventDefault()
  dragIndex.value = index
  dragOverIndex.value = index
  document.addEventListener('pointermove', onDragMove)
  document.addEventListener('pointerup', onDragEnd)
}

function onDragMove(e: PointerEvent) {
  if (dragIndex.value < 0 || !listRef.value) return
  const children = Array.from(listRef.value.children) as HTMLElement[]
  for (let i = 0; i < children.length; i++) {
    const rect = children[i]!.getBoundingClientRect()
    const midY = rect.top + rect.height / 2
    if (e.clientY < midY) {
      dragOverIndex.value = i
      return
    }
  }
  dragOverIndex.value = children.length - 1
}

function onDragEnd() {
  document.removeEventListener('pointermove', onDragMove)
  document.removeEventListener('pointerup', onDragEnd)
  if (dragIndex.value >= 0 && dragOverIndex.value >= 0 && dragIndex.value !== dragOverIndex.value) {
    moveTask(dragIndex.value, dragOverIndex.value)
  }
  dragIndex.value = -1
  dragOverIndex.value = -1
}

// --- Resize ---
function onResizeStart(e: PointerEvent) {
  isResizing.value = true
  resizeStartY = e.clientY
  resizeStartHeight = panelHeight.value
  document.addEventListener('pointermove', onResizeMove)
  document.addEventListener('pointerup', onResizeEnd)
}

function onResizeMove(e: PointerEvent) {
  panelHeight.value = Math.max(120, Math.min(600, resizeStartHeight + (e.clientY - resizeStartY)))
}

function onResizeEnd() {
  isResizing.value = false
  document.removeEventListener('pointermove', onResizeMove)
  document.removeEventListener('pointerup', onResizeEnd)
}

function handleAdd() {
  if (!newTaskText.value.trim()) return
  addTask(newTaskText.value)
  newTaskText.value = ''
}
</script>

<template>
  <div class="glass rounded-2xl border border-(--border-subtle) flex flex-col gap-3 p-4 shadow-lg">
    <PanelHeader
      title="Tasks"
      icon="i-lucide-square-check-big"
      icon-color="var(--accent-green)"
      @close="closePanel('tasks')"
    >
      <template #actions>
        <span class="text-[10px] font-data px-1.5 py-0.5 rounded-md bg-[rgba(196,129,58,0.2)] text-(--accent-primary)">
          {{ taskProgress }}
        </span>
      </template>
    </PanelHeader>

    <!-- Always-visible add input -->
    <form
      class="flex items-center gap-2 px-3 py-2 rounded-[10px] bg-(--bg-surface)"
      @submit.prevent="handleAdd"
    >
      <input
        v-model="newTaskText"
        class="flex-1 bg-transparent text-sm text-(--text-primary) outline-none placeholder-(--text-dimmer)"
        placeholder="Add a task..."
        @keydown.enter="handleAdd"
      >
      <button
        type="submit"
        class="w-6 h-6 flex items-center justify-center rounded-md shrink-0 transition-colors"
        :class="newTaskText.trim()
          ? 'bg-(--accent-green)/15 text-(--accent-green) hover:bg-(--accent-green)/25 cursor-pointer'
          : 'text-(--text-dimmer) cursor-default'"
      >
        <UIcon
          name="i-lucide-plus"
          class="w-4 h-4"
        />
      </button>
    </form>

    <div
      ref="listRef"
      class="flex flex-col gap-2.5 overflow-y-auto scrollbar-glass"
      :class="{ 'select-none': dragIndex >= 0 }"
      :style="{ maxHeight: `${panelHeight}px` }"
    >
      <div
        v-for="(task, index) in tasks"
        :key="task.id"
        class="transition-transform duration-150"
        :class="{
          'opacity-40': dragIndex === index,
          'border-t-2 border-(--accent-primary)': dragOverIndex === index && dragIndex >= 0 && dragIndex !== index
        }"
      >
        <TaskItem
          :task="task"
          @toggle="toggleTask"
          @edit="editTask"
          @remove="removeTask"
          @dragstart.prevent
          @pointerdown-handle="onDragStart(index, $event)"
        />
      </div>
    </div>

    <p
      v-if="!tasks.length"
      class="text-xs text-(--text-dimmer) py-3 text-center"
    >
      No tasks yet. Type above and press Enter.
    </p>

    <!-- Resize handle (desktop only) -->
    <div
      class="h-1 -mb-2 cursor-ns-resize group/resize hidden lg:flex items-center justify-center"
      :class="{ 'select-none': isResizing }"
      @pointerdown.prevent="onResizeStart"
    >
      <div class="w-8 h-0.5 rounded-full bg-(--border-subtle) opacity-0 group-hover/resize:opacity-100 transition-opacity" />
    </div>
  </div>
</template>
