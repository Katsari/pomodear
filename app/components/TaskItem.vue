<script setup lang="ts">
import type { Task } from '~/types'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  toggle: [id: string]
  edit: [id: string, text: string]
  remove: [id: string]
  pointerdownHandle: [e: PointerEvent]
}>()

const isEditing = ref(false)
const editText = ref('')
const editRef = ref<HTMLInputElement | null>(null)

function startEdit() {
  if (props.task.completed) return
  editText.value = props.task.text
  isEditing.value = true
  nextTick(() => {
    editRef.value?.focus()
    editRef.value?.select()
  })
}

function commitEdit() {
  if (editText.value.trim()) {
    emit('edit', props.task.id, editText.value.trim())
  }
  isEditing.value = false
}

function onEditKeydown(e: KeyboardEvent) {
  if (e.isComposing) return
  if (e.key === 'Enter' || e.keyCode === 13) {
    e.preventDefault()
    commitEdit()
  } else if (e.key === 'Escape') {
    isEditing.value = false
  }
}
</script>

<template>
  <div
    class="group flex items-center gap-2.5 w-full px-3 py-2 rounded-[10px] bg-(--bg-surface) hover:bg-(--bg-surface-dark) transition-colors"
  >
    <!-- Drag handle (only for incomplete tasks) -->
    <UIcon
      v-if="!task.completed"
      name="i-lucide-grip-vertical"
      class="drag-handle w-3.5 h-3.5 text-(--text-dimmer) shrink-0 opacity-0 group-hover:opacity-50 hover:opacity-100! transition-opacity"
      style="cursor: grab"
      @pointerdown.stop="emit('pointerdownHandle', $event)"
    />
    <div
      v-else
      class="w-3.5 shrink-0"
    />

    <!-- Checkbox -->
    <button
      class="w-[18px] h-[18px] rounded shrink-0 flex items-center justify-center border transition-colors"
      :class="task.completed
        ? 'bg-(--accent-green) border-(--accent-green)'
        : 'border-(--border-subtle)'"
      @click="$emit('toggle', task.id)"
    >
      <UIcon
        v-if="task.completed"
        name="i-lucide-check"
        class="w-3 h-3 text-white"
      />
    </button>

    <!-- Text / Edit input -->
    <input
      v-if="isEditing"
      ref="editRef"
      v-model="editText"
      class="text-sm flex-1 bg-transparent text-(--text-primary) outline-none"
      @keydown="onEditKeydown"
      @blur="commitEdit"
    >
    <span
      v-else
      class="text-sm flex-1 truncate transition-colors cursor-text"
      :class="task.completed ? 'text-(--text-dim) line-through' : 'text-(--text-primary)'"
      @click="startEdit"
    >
      {{ task.text }}
    </span>

    <!-- Actions -->
    <div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        class="w-5 h-5 flex items-center justify-center rounded text-(--text-dimmer) hover:text-red-400 transition-colors"
        @click="$emit('remove', task.id)"
      >
        <UIcon
          name="i-lucide-x"
          class="w-3 h-3"
        />
      </button>
    </div>
  </div>
</template>
