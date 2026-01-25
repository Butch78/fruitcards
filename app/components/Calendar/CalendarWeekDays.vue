<script setup lang="ts">
import { CalendarDefault } from "./config";
defineProps<{
  weekDayLabels: string[],
  size: {
    type: String,
    default: 'md',
  }
}>()
</script>

<template>
  <div class="grid grid-cols-7 gap-1">
    <div
      v-for="day in weekDayLabels"
      :key="day"
      class="text-muted p-2 text-center"
      :class="[CalendarDefault[size as keyof typeof CalendarDefault].headCell]"
    >
      {{ day }}
    </div>
  </div>
</template>
