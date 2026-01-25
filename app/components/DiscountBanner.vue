<script lang="ts" setup>
/**
 * DiscountBanner - A reusable discount banner component with countdown timer
 *
 * @example
 * <DiscountBanner
 *   :visible="bannerVisible"
 *   sale-end-date="2025-12-31T23:59:59"
 *   discount-code="SAVE50"
 *   discount-amount="$50 OFF"
 *   redirect-to="/pricing"
 *   @close="hideBanner"
 * />
 */

interface Props {
  saleEndDate?: string
  discountCode?: string
  discountAmount?: string
  redirectTo?: string
  visible?: boolean
}

const today = new Date()
today.setHours(0, 0, 0, 0)
const midnight = new Date(today)
midnight.setDate(midnight.getDate() + 1)

const props = withDefaults(defineProps<Props>(), {
  discountCode: 'SAVE10TODAY',
  discountAmount: '10% OFF',
  redirectTo: 'https://nuxtcharts.com/pricing',
  visible: true,
})

const emit = defineEmits<{
  close: []
}>()

const bannerVisible = ref(props.visible)

// Timer for sales banner
const saleEndDate = new Date(
  props.saleEndDate ?? midnight.toISOString(),
).getTime()
const timeLeft = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
})

function updateTimer() {
  const now = new Date().getTime()
  const distance = saleEndDate - now

  if (distance > 0) {
    timeLeft.value = {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    }
  } else {
    timeLeft.value = {
 days: 0,
hours: 0,
minutes: 0,
seconds: 0 
}
  }
}

function hideBanner() {
  bannerVisible.value = false
  emit('close')
}

onMounted(() => {
  updateTimer()
  setInterval(updateTimer, 1000)
})

watch(
  () => props.visible,
  (newValue) => {
    bannerVisible.value = newValue
  },
)
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-500 ease-out"
    enter-from-class="transform -translate-y-full opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform -translate-y-full opacity-0"
  >
    <div
      v-if="bannerVisible"
      class="border-primary/20 from-primary/10 via-primary/5 relative z-60 cursor-pointer overflow-hidden border-b bg-gradient-to-r to-transparent shadow-xl backdrop-blur-sm lg:block max-w-xl"
      @click="navigateTo(redirectTo + '?start=cart', {
        open: {
          target: '_blank'
        },
        external: true
      })"
    >
      <!-- Animated background pattern -->
      <div
        class="from-primary/5 absolute inset-0 bg-gradient-to-r to-transparent opacity-80"
      >
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--ui-primary-rgb),0.07),transparent_70%)]"
        />
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.07),transparent_50%)]"
        />
      </div>

      <!-- Content -->
      <div
        class="relative mx-auto flex flex-col items-center justify-center gap-2 px-4 py-1.5 lg:flex-row pr-8"
      >
        <!-- Main discount content -->
        <div class="flex items-center gap-2">
          <!-- Pulsing fire icon with glow -->
          <div class="relative">
            <span class="animate-pulse text-base opacity-80">🔥</span>
            <div class="absolute inset-0 animate-ping text-base opacity-40">
              🔥
            </div>
          </div>

          <div
            class="flex flex-wrap items-center gap-1 text-center text-sm font-medium lg:text-left dark:text-white/70"
          >
            <span>Get an extra</span>
            <span>
              {{ discountAmount }}
            </span>
            <span>with code</span>
            <span
              class="rounded-lg bg-white/90 px-2 py-0.5 text-xs font-bold text-green-700 shadow backdrop-blur-sm"
            >
              "{{ discountCode }}"
            </span>
          </div>
        </div>

        <!-- Timer with glassmorphism design -->
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1 px-2 py-0.5 backdrop-blur-sm">
            <!-- <div class="relative">
              <span class="animate-pulse text-sm opacity-80">⏰</span>
              <div class="absolute inset-0 animate-ping text-sm opacity-30">
                ⏰
              </div>
            </div> -->
            <div
              class="flex items-center gap-0.5 font-mono text-xs font-semibold dark:text-white/70"
            >
              <span>{{ timeLeft.days }}d</span>
              <span class="text-white/40">:</span>
              <span>{{ timeLeft.hours.toString().padStart(2, '0') }}h</span>
              <span class="text-white/40">:</span>
              <span>{{ timeLeft.minutes.toString().padStart(2, '0') }}m</span>
              <span class="text-white/40">:</span>
              <span>{{ timeLeft.seconds.toString().padStart(2, '0') }}s</span>
            </div>
          </div>
        </div>

        <!-- Close button with enhanced styling -->
        <button
          class="absolute top-1/2 right-2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/10"
          aria-label="Close banner"
          @click.stop="hideBanner"
        >
          <UIcon
            name="i-lucide-x"
            class="h-3 w-3 transition-colors dark:text-white/60 dark:hover:text-white"
          />
        </button>
      </div>
    </div>
  </Transition>
</template>
