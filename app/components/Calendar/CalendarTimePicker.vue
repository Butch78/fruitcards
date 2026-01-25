<script setup lang="ts">
import { Orientation } from "./types";

defineProps<{
  orientation: Orientation;
  timeSlots: string[];
  selectedTime: string | undefined;
  selectTime: (time: string) => void;
}>();

const orientationEnum = Orientation;
</script>

<template>
  <div
    class="border-default w-full max-w-[339px]"
    :class="[
      'grid gap-2',
      orientation === orientationEnum.Horizontal
        ? 'grid-cols-1 border-l pl-8'
        : 'border-default grid-cols-3',
    ]"
  >
    <UButton
      v-for="time in timeSlots"
      :key="time"
      color="neutral"
      variant="soft"
      :class="[
        'flex items-center justify-center px-4 py-3',
        selectedTime === time ? '!bg-primary-500 font-medium !text-white' : '',
      ]"
      @click="selectTime(time)"
    >
      {{ time }}
    </UButton>
  </div>
</template>
