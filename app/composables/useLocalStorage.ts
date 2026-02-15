export function useLocalStorage<T>(key: string, defaultValue: T) {
  const data = ref<T>(defaultValue) as Ref<T>

  if (import.meta.client) {
    const stored = localStorage.getItem(key)
    if (stored !== null) {
      try {
        data.value = JSON.parse(stored)
      } catch {
        data.value = defaultValue
      }
    }

    watch(data, (val) => {
      localStorage.setItem(key, JSON.stringify(val))
    }, { deep: true })
  }

  return data
}
