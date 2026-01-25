<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import { CalendarDefault } from "./config";

const emit = defineEmits<{
  (e: 'previous' | 'next'): void
}>()

defineProps<{
  currentMonths: Dayjs[],
  size: {
    type: String,
    default: 'md',
  }
}>()
</script>

<template>
  <div class="mb-4 flex w-full items-center justify-between">
    <UButton
      icon="i-lucide-chevron-left"
      @click="emit('previous')"
    />
    <div id="month-title" class="flex gap-2">
      <span class="font-medium" :class="[CalendarDefault[size as keyof typeof CalendarDefault].heading]">
        {{
          currentMonths && currentMonths.length > 1
            ? `${currentMonths[0]?.format('MMM')} - ${currentMonths[currentMonths.length - 1]?.format('MMM YYYY')}`
            : currentMonths && currentMonths[0] ? currentMonths[0].format('MMMM YYYY') : ''
        }}
      </span>
    </div>
    <UButton
      icon="i-lucide-chevron-right"
      @click="emit('next')"
    />
  </div>
</template>
