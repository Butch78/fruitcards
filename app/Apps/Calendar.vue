<script setup lang="ts">
import { useCalendar, type CalendarEvent } from "~/composables/useCalendar";
import { users } from "~/data/users";

const today = new Date();
const monthViewDate = ref(new Date(today.getFullYear(), today.getMonth(), 1));
const now = ref(new Date());

const {
  view,
  days,
  hours,
  gridRef,
  allEvents,
  currentTimeIndicator,
  showEventPanel,
  getEventTop,
  getEventHeight,
  handleGridClick,
  onResizeStart,
  onMoveStart,
  openEditEvent,
  nextPeriod,
  prevPeriod,
  goToToday,
  getPositionedEvents,
  shouldShowTimeIndicator,
  // Add these for the form
  closeEventPanel,
  onSaveEnhanced,
  eventColors,
  openAddEventWithNow,
  currentEvent,
  editingEvent,
  toggleDayView,
} = useCalendar(monthViewDate);


onMounted(goToToday);
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">
    <!-- Main calendar content -->
    <div class="flex-1 min-w-0">
      <main class="flex-1 flex flex-col relative space-y-4">
        <div class="flex-grow overflow-y-auto">
          <!-- Month View -->
          <div v-if="view === 'month'" class="month-view">
            <div
              class="grid grid-cols-7 gap-px border border-default overflow-x-auto min-w-[600px] sm:min-w-0"
            >
              <div
                v-for="dayName in [
                  'Mon',
                  'Tue',
                  'Wed',
                  'Thu',
                  'Fri',
                  'Sat',
                  'Sun',
                ]"
                :key="dayName"
                class="bg-elevated p-2 text-center text-sm font-medium"
              >
                {{ dayName }}
              </div>
              <div
                v-for="(day, index) in days"
                :key="index"
                :class="[
                  'min-h-[80px] sm:min-h-[120px] p-1 sm:p-2 border-b border-r border-default',
                  day.today ? 'bg-primary/10' : '',
                  'cursor-pointer hover:bg-default',
                ]"
                @click="openAddEventWithNow"
              >
                <div :class="['text-xs sm:text-sm font-medium mb-1']">
                  {{ day.date }}
                </div>
                <div class="space-y-1">
                  <div
                    v-for="event in allEvents
                      .filter(
                        (e): e is CalendarEvent =>
                          !!e.date &&
                          e.date.getFullYear() ===
                            monthViewDate.getFullYear() &&
                          e.date.getMonth() === monthViewDate.getMonth() &&
                          e.date.getDate() === day.fullDate.getDate()
                      )
                      .slice(0, 3)"
                    :key="event.id"
                    :style="{
                      background: event.backgroundDimmed,
                      borderLeft: `3px solid ${event.borderColor}`,
                      color: '#ffffff',
                    }"
                    :class="[
                      'text-[10px] sm:text-xs p-1 rounded truncate !bg-opacity-50',
                      'cursor-pointer hover:opacity-80',
                      event.id === -1 ? 'opacity-60' : '',
                    ]"
                    @click.stop="openEditEvent(event)"
                  >
                    {{ event.title }}
                  </div>
                  <div
                    v-if="
                      allEvents.filter((e) => {
                        if (!e.date) return false;
                        return (
                          e.date.getFullYear() ===
                            monthViewDate.getFullYear() &&
                          e.date.getMonth() === monthViewDate.getMonth() &&
                          e.date.getDate() === day.fullDate.getDate()
                        );
                      }).length > 3
                    "
                    class="text-xs"
                  >
                    +{{
                      allEvents.filter((e) => {
                        if (!e.date) return false;
                        return (
                          e.date.getFullYear() ===
                            monthViewDate.getFullYear() &&
                          e.date.getMonth() === monthViewDate.getMonth() &&
                          e.date.getDate() === day.fullDate.getDate()
                        );
                      }).length - 3
                    }}
                    more
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Week/Day View -->
          <div v-else class="week-day-view">
            <!-- Buttons moved to header below -->
            <div
              :class="[
                'grid text-center text-xs border-b dark:bg-elevated/50 border-default border border-b-0 rounded-tl-lg rounded-tr-lg overflow-x-auto min-w-[600px] sm:min-w-0 items-center',
                view === 'day'
                  ? 'grid-cols-[40px_1fr_40px] sm:grid-cols-[60px_1fr_60px]'
                  : 'grid-cols-[40px_repeat(7,1fr)_40px] sm:grid-cols-[60px_repeat(7,1fr)_60px]',
              ]"
            >
              <div class="flex items-center justify-center h-full">
                <UButton
                  color="neutral"
                  variant="ghost"
                  :aria-label="`Previous ${view}`"
                  icon="i-lucide-chevron-left"
                  @click="prevPeriod"
                />
              </div>
              <template v-for="(day, dayKey) in days" :key="dayKey">
                <div
                  class="flex flex-col justify-center items-center font-semibold h-full cursor-pointer"
                  @click="toggleDayView(day)"
                >
                  <div
                    class="flex items-center gap-2"
                    :class="[
                      'py-1 px-2',
                      day.highlight
                        ? 'bg-elevated rounded-xl'
                        : 'hover:bg-elevated hover:rounded-xl hover:cursor-pointer',
                    ]"
                  >
                    <span class="text-xs text-muted">{{ day.label }}</span>
                    <span class="font-bold text-xs">
                      {{ day.date }}
                    </span>
                  </div>
                </div>
              </template>
              <div class="flex items-center justify-center h-full">
                <UButton
                  color="neutral"
                  variant="ghost"
                  :aria-label="`Next ${view}`"
                  icon="i-lucide-chevron-right"
                  @click="nextPeriod"
                />
              </div>
            </div>
            <div
              ref="gridRef"
              :class="[
                'grid grid-rows-15 gap-px border-t border-l border-default flex-grow relative overflow-x-auto min-w-[600px] sm:min-w-0',
                view === 'day'
                  ? 'grid-cols-[40px_1fr] sm:grid-cols-[60px_1fr]'
                  : 'grid-cols-[40px_repeat(7,1fr)] sm:grid-cols-[60px_repeat(7,1fr)]',
              ]"
            >
              <div class="row-span-15 col-start-1 -ml-px -mt-px">
                <div
                  v-for="(hour, hourKey) in hours"
                  :key="hourKey"
                  class="h-10 sm:h-16 text-right pr-1 sm:pr-2 text-[10px] sm:text-xs border-r border-default"
                >
                  {{
                    hourKey === 0
                      ? ""
                      : hour < 12
                      ? hour + " AM"
                      : hour === 12
                      ? "12 PM"
                      : hour - 12 + " PM"
                  }}
                </div>
              </div>
              <div
                v-for="(day, index) in days"
                :key="day.label"
                :class="[
                  'col-start-' + (index + 2),
                  'row-span-15',
                  'border-r border-default relative',
                  'cursor-pointer',
                ]"
                @click="(e) => handleGridClick(index, e)"
              >
                <div
                  v-for="hour in 15"
                  :key="hour"
                  class="h-10 sm:h-16 border-b border-default"
                />
                <!-- Current time indicator -->
                <div
                  v-if="
                    currentTimeIndicator.show &&
                    shouldShowTimeIndicator(day.fullDate)
                  "
                  class="absolute left-0 right-0 z-30 pointer-events-none"
                  :style="{ top: currentTimeIndicator.top }"
                >
                  <div class="flex items-center">
                    <div
                      class="w-2 h-2 sm:w-3 sm:h-3 rounded-full -ml-1 sm:-ml-1.5 border-2 shadow-sm"
                      :style="{
                        backgroundColor: '#ef4444',
                        borderColor: '#ffffff',
                      }"
                    />
                    <div
                      class="flex-1 h-0.5 shadow-sm"
                      :style="{ backgroundColor: '#ef4444' }"
                    />
                    <div
                      class="text-[10px] sm:text-xs font-semibold px-1 sm:px-2 py-1 rounded shadow-sm ml-1 sm:ml-2"
                      :style="{
                        color: '#ef4444',
                        backgroundColor: '#ffffff',
                        borderColor: '#ef4444',
                        borderWidth: '1px',
                      }"
                    >
                      {{ currentTimeIndicator.time }}
                    </div>
                  </div>
                </div>
                <template
                  v-for="event in getPositionedEvents(
                    allEvents.filter((e): e is CalendarEvent => {
                      if (!e || !e.date) return false;
                      return (
                        e.date.toDateString() === day.fullDate.toDateString()
                      );
                    })
                  )"
                  :key="event.id"
                >
                  <div
                    class="absolute w-full overflow-hidden select-none"
                    :data-event-id="event.id"
                    :style="{
                      top: getEventTop(event.startTime),
                      height: getEventHeight(event.startTime, event.endTime),
                      width: event._columns
                        ? `calc(${100 / event._columns}% - 4px)`
                        : '100%',
                      left:
                        event._column !== undefined && event._columns
                          ? `calc(${
                              event._column * (100 / event._columns)
                            }% + 2px)`
                          : '0',
                      zIndex: 0 + (event._column ?? 0),
                    }"
                    @click.stop="openEditEvent(event)"
                    @mousedown="(e) => onMoveStart(event.id, e)"
                    @touchstart="(e) => onMoveStart(event.id, e)"
                  >
                    <div
                      :style="{
                        backgroundColor: 'var(--ui-bg-elevated)',
                        borderBottom: `3px solid ${event.borderColor}`,
                        color: 'var(--ui-text)',
                        opacity: event.id === -1 ? 0.6 : 1,
                      }"
                      :class="[
                        'h-full rounded-lg p-1 sm:p-3 relative !bg-opacity-50',
                      ]"
                    >
                      <p class="font-semibold text-sm">
                        {{ event.title }}
                      </p>
                      <p class="text-xs text-muted tracking-wide">
                        {{ event.startTime }} - {{ event.endTime }}
                      </p>
                      <div
                        class="mt-2 rounded-full inline-flex items-center text-xs gap-1 px-2 py-1"
                        :style="{
                          background: event.backgroundDimmed,
                          color: 'var(--ui-text-default)',
                        }"
                      >
                        <span
                          :style="{ background: event.background }"
                          class="w-1 h-1 rounded-full"
                        />
                        <span>{{ event.category }}</span>
                      </div>
                      <div v-if="event.users" class="mt-2 flex flex-row-reverse justify-end">
                        <UAvatarGroup>
                          <UAvatar v-for="(user, userKey) in event.users" :key="userKey" :src="user.src" :alt="user.alt" size="xs" />
                        </UAvatarGroup>
                      </div>
                      <template v-if="event.id !== -1">
                        <div
                          class="absolute left-0 bottom-0 w-full flex justify-center cursor-ns-resize z-10 rounded-full"
                          @mouseenter="
                            (e) => {
                              const target = e.currentTarget as HTMLElement;
                              if (target)
                                target.style.backgroundColor = '#00000080';
                            }
                          "
                          @mouseleave="
                            (e) => {
                              const target = e.currentTarget as HTMLElement;
                              if (target)
                                target.style.backgroundColor = 'transparent';
                            }
                          "
                          @mousedown="(e) => onResizeStart(event.id, e)"
                        >
                          <div class="w-full h-2 rounded" />
                        </div>
                      </template>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <UCard v-if="showEventPanel" class="mt-16">
      <div class="relative w-full max-w-full sm:max-w-xs">
        <div>
          <h2 class="text-base sm:text-lg font-bold mb-1">
            {{ editingEvent ? "Edit Event" : "Create Event" }}
          </h2>
          <p class="text-xs sm:text-sm mb-4 text-muted">
            A beautiful side panel to create and edit events.
          </p>
        </div>
        <UForm
          :state="currentEvent"
          class="space-y-4 mt-2"
          @submit.prevent="onSaveEnhanced()"
        >
          <UFormField label="Title" name="title">
            <UInput
              v-model="currentEvent.title"
              placeholder="Event title"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Category" name="category">
            <USelect
              v-model="currentEvent.category"
              :items="[
                { label: 'Meeting', value: 'Meeting' },
                { label: 'Presentation', value: 'Presentation' },
                { label: 'Work', value: 'Work' },
                { label: 'Personal', value: 'Personal' },
                { label: 'Other', value: 'Other' },
              ]"
              placeholder="Select category"
              class="w-full"
            />
          </UFormField>
          <div class="flex gap-4">
            <UFormField label="Start" name="startTime" class="flex-1">
              <UInput
                v-model="currentEvent.startTime"
                type="time"
                class="w-full"
              />
            </UFormField>
            <UFormField label="End" name="endTime" class="flex-1">
              <UInput
                v-model="currentEvent.endTime"
                type="time"
                class="w-full"
              />
            </UFormField>
          </div>
          <UFormField label="Meeting Link" name="meetLink">
            <UInput
              v-model="currentEvent.meetLink"
              placeholder="https://..."
              class="w-full"
            />
          </UFormField>
          <UFormField label="Users" name="users">
            <USelectMenu
              v-model="currentEvent.users"
              :options="users"
              multiple
              placeholder="Select users"
              class="w-full"
              option-attribute="name"
              by="id"
            />
          </UFormField>
          <UFormField label="Color" name="color">
            <div class="flex gap-2">
              <button
                v-for="(color, colorKey) in eventColors"
                :key="colorKey"
                type="button"
                :aria-label="color.background"
                :style="{
                  background: color.background,
                  borderColor: color.border,
                  borderWidth: '2px',
                  boxShadow:
                    currentEvent.background === color.background
                      ? '0 0 0 2px var(--color-primary)'
                      : '',
                }"
                class="w-7 h-7 rounded-full flex items-center justify-center"
                @click="
                  () => {
                    currentEvent.background = color.background;
                    currentEvent.borderColor = color.border;
                  }
                "
              >
                <span
                  v-if="currentEvent.background === color.background"
                  class="i-lucide-check text-inverted text-xs"
                />
              </button>
            </div>
          </UFormField>
          <div class="flex gap-2 justify-end pt-2">
            <UButton
              type="button"
              color="neutral"
              variant="ghost"
              label="Cancel"
              @click="closeEventPanel"
            />
            <UButton
              type="submit"
              color="primary"
              icon="i-lucide-check"
              label="Save"
            />
          </div>
        </UForm>
      </div>
    </UCard>
  </div>
</template>
