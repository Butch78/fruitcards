<script setup lang="ts">
import { CalendarDefault } from "./config";

defineProps<{
  calendar: any[];
  isCurrentMonth: (date: any) => boolean;
  isSelected: (date: any) => boolean;
  isStartDate: (date: any) => boolean;
  isEndDate: (date: any) => boolean;
  isHoveredEndDate: (date: any) => boolean;
  isInRange: (date: any) => boolean;
  isInHoverRange: (date: any) => boolean;
  isToday: (date: any) => boolean;
  hoveredDate: any;
  size: {
    type: String,
    default: 'md',
  }
}>();

const emit = defineEmits<{
  (e: "select-date", date: any): void;
  (e: "set-hover-date", date: any | null): void;
}>();
</script>

<template>
  <div class="grid w-full grid-cols-7 gap-1">
    <button
      v-for="date in calendar"
      :key="date.format()"
      class="flex aspect-square items-center justify-center rounded-lg text-center transition-colors"
      :class="[
        CalendarDefault[size as keyof typeof CalendarDefault].cell,
        CalendarDefault[size as keyof typeof CalendarDefault].cellTrigger,
        {
        'text-dimmed': !isCurrentMonth(date),
        'text-default': isCurrentMonth(date),
        'bg-primary font-medium text-white':
          isSelected(date) || isStartDate(date) || isEndDate(date),
        'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-medium':
          isHoveredEndDate(date),
        'bg-muted': isInRange(date) || isInHoverRange(date),
        'text-primary':
          isToday(date) &&
          !isSelected(date) &&
          !isStartDate(date) &&
          !isEndDate(date) &&
          !isInRange(date),
        'hover:bg-muted':
          !isSelected(date) &&
          !isStartDate(date) &&
          !isEndDate(date) &&
          !isInRange(date) &&
          !(
            isToday(date) &&
            !isSelected(date) &&
            !isStartDate(date) &&
            !isEndDate(date) &&
            !isInRange(date)
          ),
      }]"
      @click="emit('select-date', date)"
      @mouseenter="emit('set-hover-date', date)"
    >
      {{ date.format("D") }}
    </button>
  </div>
</template>
