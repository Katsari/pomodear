let _isMobile: Ref<boolean> | null = null

export function useIsMobile() {
  if (!_isMobile) {
    _isMobile = ref(false)
    if (import.meta.client) {
      const mql = window.matchMedia('(max-width: 1023px)')
      _isMobile.value = mql.matches
      mql.addEventListener('change', (e) => {
        _isMobile!.value = e.matches
      })
    }
  }
  return { isMobile: _isMobile }
}
