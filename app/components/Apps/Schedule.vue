<script lang="ts" setup>
import dayjs from "dayjs";

const selectedDate = ref(new Date());

// Initialize calendar with day view
const {
  view,
  days,
  hours,
  gridRef,
  allEvents,
  currentTimeIndicator,
  showEventPanel,
  eventPanelStyle,
  getEventTop,
  getEventHeight,
  openAddEvent,
  handleGridClick,
  onResizeStart,
  onMoveStart,
  openEditEvent,
  nextPeriod,
  prevPeriod,
  goToToday,
  getPositionedEvents,
  shouldShowTimeIndicator,
  closeEventPanel,
  onSaveEnhanced,
  eventColors,
  currentEvent,
  editingEvent,
} = useCalendar(selectedDate);

// Set to day view
view.value = "day";

const eventInvites = [
  {
    id: 1,
    day: "26",
    month: "jan",
    title: "Meeting IOS integration",
    date: "Wednesday, March 25th",
    avatars: [
      { src: "https://github.com/benjamincanac.png", alt: "Benjamin Canac" },
      { src: "https://github.com/romhml.png", alt: "Romain Hamel" },
      { src: "https://github.com/noook.png", alt: "Neil Richter" },
    ],
  },
  {
    id: 2,
    day: "12",
    month: "aug",
    title: "Design Sync",
    date: "Monday, August 12th",
    avatars: [
      { src: "https://github.com/benjamincanac.png", alt: "Benjamin Canac" },
      { src: "https://github.com/romhml.png", alt: "Romain Hamel" },
    ],
  },
  {
    id: 3,
    day: "05",
    month: "sep",
    title: "Sprint Planning",
    date: "Thursday, September 5th",
    avatars: [{ src: "https://github.com/noook.png", alt: "Neil Richter" }],
  },
];

function handleSetDate(date: Date | string) {
  selectedDate.value = new Date(date);
}

const formattedDate = computed(() => {
  return selectedDate.value.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

onMounted(goToToday);
</script>
<template>
  <div class="flex gap-6">
    <div class="w-full">
      <!-- Header -->
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-semibold">Schedule</h1>
          <div class="flex gap-2 items-center">
            <p class="text-muted">{{ formattedDate }}</p>
            <UBadge v-if="shouldShowTimeIndicator(selectedDate)" class="badge">
              Today
            </UBadge>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            :aria-label="'Previous day'"
            icon="i-lucide-chevron-left"
            size="lg"
            @click="prevPeriod"
          />
          <UButton
            color="neutral"
            variant="ghost"
            :aria-label="'Next day'"
            icon="i-lucide-chevron-right"
            size="lg"
            @click="nextPeriod"
          />
          <UButton
            label="Today"
            color="primary"
            variant="soft"
            size="lg"
            @click="goToToday"
          />
          <UButton
            icon="i-lucide-plus"
            size="lg"
            label="Create Event"
            @click="openAddEvent"
          />
        </div>
      </div>

      <!-- Day View Grid -->
      <div class="border border-default rounded-lg">
        <!-- Day header -->
        <div class="flex-1 flex gap-6 ">
          <div class="w-20 flex flex-col">
            <div class="h-12" />
            <!-- Header spacer -->
            <div
              v-for="(hour, hourKey) in hours"
              :key="hourKey"
              class="h-10 sm:h-16 text-right pr-1 sm:pr-2 text-[10px] sm:text-xs"
            >
              {{
                hourKey === 0
                  ? ""
                  : dayjs()
                      .hour(0 + hour - 1)
                      .minute(0)
                      .format("hh:mm A")
              }}
            </div>
          </div>

          <!-- Day grid -->
          <div
            ref="gridRef"
            class="grid grid-rows-15 gap-px border-t border-l border-default flex-grow relative"
          >
            <div
              v-for="(day, index) in days"
              :key="day.label"
              class="col-start-1 row-span-15 border-r border-default relative cursor-pointer"
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

              <!-- Events -->
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
                    zIndex: 10 + (event._column ?? 0),
                  }"
                  @click.stop="openEditEvent(event)"
                  @mousedown="(e) => onMoveStart(event.id, e)"
                  @touchstart="(e) => onMoveStart(event.id, e)"
                >
                  <div
                    :style="{
                      background: event.backgroundDimmed,
                      borderLeft: `4px solid ${event.borderColor}`,
                      color: '#ffffff',
                      opacity: event.id === -1 ? 0.6 : 1,
                    }"
                    :class="[
                      'h-full rounded-lg p-1 sm:p-2 text-[10px] sm:text-xs relative !bg-opacity-50',
                    ]"
                  >
                    <p class="font-semibold">
                      {{ event.title }}
                    </p>
                    <p>{{ event.startTime }} - {{ event.endTime }}</p>
                    <div
                      class="mt-2 rounded-full inline-flex items-center gap-1 px-2 py-1"
                      :style="{
                        background: event.backgroundDimmed,
                        color: '#ffffff',
                      }"
                    >
                      <span
                        :style="{ background: event.background }"
                        class="w-1 h-1 rounded-full"
                      />
                      <span>{{ event.category }}</span>
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
    </div>

    <!-- Calendar sidebar -->
    <div class="w-[540px] space-y-6">
      <Calendar :initial-date="selectedDate" size="lg" @date-select="handleSetDate" />

      <div class="border-t border-default py-4">
        <UCard
          v-for="invite in eventInvites"
          :key="invite.id"
          :ui="{ body: 'p-3 sm:p-3' }"
          class="mb-4"
        >
          <div class="space-y-2">
            <div class="uppercase text-xs font-semibold">Event Invite</div>
            <FlexBetween class="items-start">
              <Flex class="gap-4">
                <div class="bg-muted rounded p-2 text-center">
                <div class="text-xl">{{ invite.day }}</div>
                <div class="uppercase text-xs">{{ invite.month }}</div>
              </div>

              <div>
                <div>{{ invite.title }}</div>
                <p class="text-xs text-muted">{{ invite.date }}</p>

                <UAvatarGroup size="2xs" class="mt-1">
                  <UAvatar
                    v-for="avatar in invite.avatars"
                    :key="avatar.src"
                    :src="avatar.src"
                    :alt="avatar.alt"
                  />
                </UAvatarGroup>
              </div>
              </Flex>

              <UButton variant="link" icon="i-lucide-ellipsis-vertical" />
            </FlexBetween>
            <div class="space-x-2 mt-2">
              <UButton color="primary" size="sm" label="Accept Invite" />
              <UButton size="sm" label="Reschedule" />
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Event Panel -->
    <UCard
      v-if="showEventPanel"
      class="absolute z-50 bg-muted"
      variant=""
      :style="eventPanelStyle"
    >
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
