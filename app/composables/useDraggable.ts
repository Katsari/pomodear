const NAVBAR_HEIGHT = 68

export function useDraggable(handleSelector = '.cursor-grab') {
  const { isMobile } = useIsMobile()
  const isDetached = ref(false)
  const isDragging = ref(false)
  const elementRef = ref<HTMLElement | null>(null)
  const fixedPos = ref({ left: 0, top: 0 })
  const fixedSize = ref({ width: 0, height: 0 })

  let startX = 0
  let startY = 0
  let startLeft = 0
  let startTop = 0
  let placeholder: HTMLElement | null = null

  function onPointerDown(e: PointerEvent) {
    if (isMobile.value) return

    const handle = (e.target as HTMLElement).closest(handleSelector)
    if (!handle) return

    // Don't start panel drag if the event is from a task drag handle
    if ((e.target as HTMLElement).closest('.drag-handle')) return

    e.preventDefault()

    const rect = elementRef.value!.getBoundingClientRect()

    // First drag: capture size, insert placeholder to hold layout space, detach to fixed
    if (!isDetached.value) {
      fixedPos.value = { left: rect.left, top: rect.top }
      fixedSize.value = { width: rect.width, height: rect.height }
      isDetached.value = true

      placeholder = document.createElement('div')
      placeholder.style.width = `${rect.width}px`
      placeholder.style.height = `${rect.height}px`
      placeholder.style.flexShrink = '0'
      placeholder.style.pointerEvents = 'none'
      elementRef.value!.parentNode!.insertBefore(placeholder, elementRef.value)
    }

    isDragging.value = true
    startX = e.clientX
    startY = e.clientY
    startLeft = fixedPos.value.left
    startTop = fixedPos.value.top

    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onPointerUp)
  }

  function onPointerMove(e: PointerEvent) {
    if (!isDragging.value || !elementRef.value) return

    const rect = elementRef.value.getBoundingClientRect()
    let newLeft = startLeft + (e.clientX - startX)
    let newTop = startTop + (e.clientY - startY)

    // Constrain: don't overlap navbar
    newTop = Math.max(NAVBAR_HEIGHT, newTop)

    // Constrain: keep at least 100px visible horizontally
    newLeft = Math.max(-rect.width + 100, Math.min(window.innerWidth - 100, newLeft))

    // Constrain: keep at least 50px visible vertically (below navbar)
    newTop = Math.min(window.innerHeight - 50, newTop)

    fixedPos.value = { left: newLeft, top: newTop }
  }

  function onPointerUp() {
    isDragging.value = false
    document.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('pointerup', onPointerUp)
  }

  const style = computed(() => {
    if (!isDetached.value) return {}
    return {
      position: 'fixed' as const,
      left: `${fixedPos.value.left}px`,
      top: `${fixedPos.value.top}px`,
      width: `${fixedSize.value.width}px`,
      zIndex: isDragging.value ? 100 : 50
    }
  })

  onMounted(() => {
    elementRef.value?.addEventListener('pointerdown', onPointerDown)
  })

  onUnmounted(() => {
    elementRef.value?.removeEventListener('pointerdown', onPointerDown)
    document.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('pointerup', onPointerUp)
    placeholder?.remove()
  })

  return {
    elementRef,
    isDragging,
    isDetached,
    style
  }
}
