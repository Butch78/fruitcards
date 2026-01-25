import { createSharedComposable } from '@vueuse/core'

const _useDashboard = () => {
  const route = useRoute()
  const router = useRouter()
  const isNotificationsSlideOverOpen = ref(false)

  defineShortcuts({
    'g-h': () => router.push('/'),
    'g-i': () => router.push('/inbox'),
    'g-c': () => router.push('/customers'),
    'g-s': () => router.push('/settings'),
    'n': () => isNotificationsSlideOverOpen.value = !isNotificationsSlideOverOpen.value
  })

  watch(() => route.fullPath, () => {
    isNotificationsSlideOverOpen.value = false
  })

  return {
    isNotificationsSlideOverOpen
  }
}

export const useDashboard = createSharedComposable(_useDashboard)
