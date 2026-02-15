import type { Task } from '~/types'

let _tasks: Ref<Task[]> | null = null

export function useTasks() {
  if (!_tasks) _tasks = useLocalStorage<Task[]>('pomodear-tasks', [])

  const completedCount = computed(() => _tasks!.value.filter(t => t.completed).length)
  const totalCount = computed(() => _tasks!.value.length)
  const taskProgress = computed(() => `${completedCount.value}/${totalCount.value}`)

  function addTask(text: string) {
    if (!text.trim()) return
    _tasks!.value = [..._tasks!.value, {
      id: self.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      text: text.trim(),
      completed: false,
      createdAt: Date.now()
    }]
  }

  function toggleTask(id: string) {
    const task = _tasks!.value.find(t => t.id === id)
    if (task) {
      task.completed = !task.completed
      // Sort: incomplete first, completed last (preserve order within each group)
      const incomplete = _tasks!.value.filter(t => !t.completed)
      const completed = _tasks!.value.filter(t => t.completed)
      _tasks!.value = [...incomplete, ...completed]
    }
  }

  function editTask(id: string, text: string) {
    const task = _tasks!.value.find(t => t.id === id)
    if (task && text.trim()) task.text = text.trim()
  }

  function removeTask(id: string) {
    _tasks!.value = _tasks!.value.filter(t => t.id !== id)
  }

  function moveTask(fromIndex: number, toIndex: number) {
    const arr = [..._tasks!.value]
    const [item] = arr.splice(fromIndex, 1)
    if (item) {
      arr.splice(toIndex, 0, item)
      _tasks!.value = arr
    }
  }

  return {
    tasks: _tasks,
    completedCount,
    totalCount,
    taskProgress,
    addTask,
    toggleTask,
    editTask,
    removeTask,
    moveTask
  }
}
