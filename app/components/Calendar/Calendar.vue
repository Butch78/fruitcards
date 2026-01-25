<script setup lang="ts">
import dayjs, { type Dayjs } from 'dayjs'
import { type CalendarProps, CalendarSelectionMode } from './types'
import 'dayjs/locale/es'
import 'dayjs/locale/fr'
import 'dayjs/locale/de'
import 'dayjs/locale/it'

const props = withDefaults(defineProps<CalendarProps>(), {
  selectionMode: CalendarSelectionMode.Single,
  showTimePicker: false,
  timeSlots: () => [
    '09:00',
    '09:15',
    '09:30',
    '09:45',
    '10:00',
    '10:15',
    '10:30',
    '10:45',
    '11:00'
  ],
  visibleMonths: 1,
  dateFormat: 'dddd, MMMM D, YYYY',
  timeFormat: 'HH:mm',
  weekDayLabels: () => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  orientation: Orientation.Horizontal,
  locale: 'en'
})

const emit = defineEmits<{
  (e: 'date-select', date: Date | Date[]): void
  (e: 'range-select', range: { start: Date | null, end: Date | null }): void
  (e: 'time-select', time: string): void
  (e: 'month-change', month: Dayjs): void
  (e: 'year-change', year: number): void
}>()

const toast = useToast()

// Reactive state
const selectedDateRef = ref<Date | undefined>(props.initialDate)
const startDateRef = ref<Date | null>(props.initialStartDate || null)
const endDateRef = ref<Date | null>(props.initialEndDate || null)
const multipleDatesRef = ref<Date[]>(
  props.initialDate ? [props.initialDate] : []
)
const selectedTimeRef = ref<string | undefined>(props.initialTime)
const hoveredDate = ref<Dayjs | null>(null)
const currentMonth = ref(dayjs().locale(props.locale))

// Set locale on mount and when locale prop changes
onMounted(() => {
  dayjs.locale(props.locale)
  currentMonth.value = dayjs().locale(props.locale)
})

watch(
  () => props.locale,
  (newLocale) => {
    dayjs.locale(newLocale)
    currentMonth.value = currentMonth.value.locale(newLocale)
  }
)

const monthsToShow = computed(() => {
  return Array.from({ length: props.visibleMonths }, (_, i) =>
    currentMonth.value.add(i, 'month')
  )
})

const calendars = computed(() => {
  return monthsToShow.value.map((month) => {
    const start = month.startOf('month').startOf('week')
    const end = month.endOf('month').endOf('week')
    const days: Dayjs[] = []
    let day = start
    while (day.isBefore(end.add(1, 'day'))) {
      days.push(day)
      day = day.add(1, 'day')
    }
    return days
  })
})

// Date validation functions
const isDateDisabled = (date: Dayjs) => {
  if (props.disabledDates?.some(d => date.isSame(dayjs(d), 'day')))
    return true
  if (props.minDate && date.isBefore(dayjs(props.minDate), 'day')) return true
  if (props.maxDate && date.isAfter(dayjs(props.maxDate), 'day')) return true
  return false
}

// Date state checking functions
const isCurrentMonth = (date: Dayjs) => {
  return monthsToShow.value.some(
    month => date.month() === month.month() && date.year() === month.year()
  )
}

const isToday = (date: Dayjs) => date.isSame(dayjs(), 'day')

const isSelected = (date: Dayjs) => {
  if (props.selectionMode === CalendarSelectionMode.Single) {
    return (
      selectedDateRef.value && date.isSame(dayjs(selectedDateRef.value), 'day')
    )
  }
  if (props.selectionMode === CalendarSelectionMode.Multiple) {
    return multipleDatesRef.value.some(d => date.isSame(dayjs(d), 'day'))
  }
  return false
}

const isStartDate = (date: Dayjs) => {
  return (
    props.selectionMode === CalendarSelectionMode.Range
    && startDateRef.value
    && date.isSame(dayjs(startDateRef.value), 'day')
  )
}

const isEndDate = (date: Dayjs) => {
  return (
    props.selectionMode === CalendarSelectionMode.Range
    && endDateRef.value
    && date.isSame(dayjs(endDateRef.value), 'day')
  )
}

const isInRange = (date: Dayjs) => {
  if (
    props.selectionMode === CalendarSelectionMode.Range
    && startDateRef.value
    && endDateRef.value
  ) {
    const start = dayjs(startDateRef.value)
    const end = dayjs(endDateRef.value)
    return date.isAfter(start, 'day') && date.isBefore(end, 'day')
  }
  return false
}

const isInHoverRange = (date: Dayjs) => {
  if (
    props.selectionMode === CalendarSelectionMode.Range
    && startDateRef.value
    && !endDateRef.value
    && hoveredDate.value
  ) {
    const start = dayjs(startDateRef.value)
    const hovered = hoveredDate.value
    if (hovered.isBefore(start)) {
      return date.isAfter(hovered, 'day') && date.isBefore(start, 'day')
    }
    return date.isAfter(start, 'day') && date.isBefore(hovered, 'day')
  }
  return false
}

const isHoveredEndDate = (date: Dayjs) => {
  return (
    props.selectionMode === CalendarSelectionMode.Range
    && startDateRef.value
    && !endDateRef.value
    && hoveredDate.value
    && date.isSame(hoveredDate.value, 'day')
  )
}

// Event handlers
const selectDate = (date: Dayjs) => {
  if (isDateDisabled(date)) return

  if (props.selectionMode === CalendarSelectionMode.Single) {
    selectedDateRef.value = date.toDate()
    emit('date-select', selectedDateRef.value)
    toast.add({
      title: 'Date Selected',
      description: date.format(props.dateFormat),
      icon: 'i-lucide-calendar'
    })
  } else if (props.selectionMode === CalendarSelectionMode.Multiple) {
    const dateIndex = multipleDatesRef.value.findIndex(d =>
      date.isSame(dayjs(d), 'day')
    )
    if (dateIndex > -1) {
      multipleDatesRef.value.splice(dateIndex, 1)
    } else {
      multipleDatesRef.value.push(date.toDate())
    }
    emit('date-select', multipleDatesRef.value)
  } else if (props.selectionMode === CalendarSelectionMode.Range) {
    if (!startDateRef.value || (startDateRef.value && endDateRef.value)) {
      startDateRef.value = date.toDate()
      endDateRef.value = null
    } else if (!endDateRef.value) {
      if (date.isBefore(dayjs(startDateRef.value))) {
        endDateRef.value = startDateRef.value
        startDateRef.value = date.toDate()
      } else {
        endDateRef.value = date.toDate()
      }
    }
    emit('range-select', { start: startDateRef.value, end: endDateRef.value })
  }
}

const selectTime = (time: string) => {
  selectedTimeRef.value = time
  emit('time-select', time)
  toast.add({
    title: 'Time Selected',
    description: `Selected time: ${time}`,
    icon: 'i-lucide-clock'
  })
}

const previousMonth = () => {
  const newMonth = currentMonth.value.subtract(1, 'month')
  if (newMonth.year() !== currentMonth.value.year()) {
    emit('year-change', newMonth.year())
  }
  currentMonth.value = newMonth
  emit('month-change', newMonth)
}

const nextMonth = () => {
  const newMonth = currentMonth.value.add(1, 'month')
  if (newMonth.year() !== currentMonth.value.year()) {
    emit('year-change', newMonth.year())
  }
  currentMonth.value = newMonth
  emit('month-change', newMonth)
}

const setHoverDate = (date: Dayjs | null) => {
  hoveredDate.value = date
}
</script>

<template>
  <div
    :class="[
      'flex w-full',
      orientation === Orientation.Horizontal
        ? 'flex-row items-start justify-center space-x-8'
        : 'flex-col items-center space-y-8',
      classNames?.container
    ]"
  >
    <div class="flex flex-col items-start">
      <!-- Header -->
      <slot
        name="header"
        :months-to-show="monthsToShow"
        :previous-month="previousMonth"
        :next-month="nextMonth"
      >
        <div
          :class="[
            'mb-4 flex w-full items-center justify-between',
            classNames?.header
          ]"
        >
          <UButton
            icon="i-lucide-chevron-left"
            size="xl"
            @click="previousMonth"
          />
          <div class="flex gap-2">
            <span class="text-lg font-medium">
              {{
                monthsToShow.length > 1
                  ? `${monthsToShow[0]?.format("MMM")} - ${monthsToShow[monthsToShow.length - 1]?.format("MMM YYYY")}`
                  : monthsToShow[0]?.format("MMMM YYYY")
              }}
            </span>
          </div>
          <UButton
            icon="i-lucide-chevron-right"
            size="xl"
            @click="nextMonth"
          />
        </div>
      </slot>

      <div class="flex w-full flex-row gap-8">
        <div
          v-for="(month, idx) in monthsToShow"
          :key="idx"
          class="flex flex-col items-start"
        >
          <!-- Weekdays -->
          <div :class="['grid grid-cols-7 gap-1', classNames?.weekdays]">
            <div
              v-for="day in weekDayLabels"
              :key="day"
              class="text-muted p-2 text-center text-sm"
            >
              {{ day }}
            </div>
          </div>

          <!-- Calendar Grid -->
          <div class="grid w-full grid-cols-7 gap-1">
            <button
              v-for="date in calendars[idx]"
              :key="date.format()"
              :disabled="isDateDisabled(date)"
              :class="[
                'flex aspect-square items-center justify-center rounded-lg text-center transition-colors',
                {
                  'text-dimmed': !isCurrentMonth(date),
                  'text-default': isCurrentMonth(date),
                  'bg-primary font-medium text-white':
                    isSelected(date) || isStartDate(date) || isEndDate(date),
                  'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-medium':
                    isHoveredEndDate(date),
                  'bg-muted': isInRange(date) || isInHoverRange(date),
                  'text-primary':
                    isToday(date)
                    && !isSelected(date)
                    && !isStartDate(date)
                    && !isEndDate(date)
                    && !isInRange(date),
                  'hover:bg-muted':
                    !isSelected(date)
                    && !isStartDate(date)
                    && !isEndDate(date)
                    && !isInRange(date)
                    && !isToday(date),
                  'cursor-not-allowed opacity-50': isDateDisabled(date)
                },
                classNames?.day,
                isToday(date) ? classNames?.today : '',
                isSelected(date) || isStartDate(date) || isEndDate(date)
                  ? classNames?.selected
                  : '',
                isDateDisabled(date) ? classNames?.disabled : '',
                isInRange(date) ? classNames?.inRange : ''
              ]"
              @click="selectDate(date)"
              @mouseenter="setHoverDate(date)"
              @mouseleave="setHoverDate(null)"
            >
              {{ date.format("D") }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Time Picker -->
    <div
      v-if="showTimePicker && (selectedDateRef || startDateRef)"
      :class="[
        'border-default grid w-full max-w-[339px] gap-2',
        orientation === Orientation.Horizontal
          ? 'grid-cols-1 border-l pl-8'
          : 'grid-cols-3'
      ]"
    >
      <UButton
        v-for="time in timeSlots"
        :key="time"
        color="neutral"
        variant="soft"
        :class="[
          'flex items-center justify-center px-4 py-3',
          selectedTimeRef === time
            ? '!bg-primary-500 font-medium !text-white'
            : ''
        ]"
        @click="selectTime(time)"
      >
        {{ time }}
      </UButton>
    </div>
  </div>
</template>
