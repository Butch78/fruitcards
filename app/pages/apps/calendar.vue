<script lang="ts" setup>
import type { CalendarEvent } from "nuxt-calendar";

const { selectedDate, currentView, events } = useCalendarEvents();

const { isNotificationsSlideOverOpen } = useDashboard();

// Event handlers
function handleEventClick(event: CalendarEvent) {
  console.log("Event clicked:", event);
}

function handleEventChange(event: CalendarEvent) {
  console.log("Event changed:", event);
}

// Filter state
const showGym = ref(true);
const showBudget = ref(true);
const showSalary = ref(true);

const filteredEvents = computed(() => {
  return events.value.filter((event) => {
    if (event.category === "gym" && !showGym.value) return false;
    if (event.category === "budget" && !showBudget.value) return false;
    if (event.category === "transaction" && !showSalary.value) return false;
    return true;
  });
});

// Stats
const stats = computed(() => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthEvents = events.value.filter((e) => {
    const eventDate = new Date(e.start);
    return (
      eventDate.getMonth() === currentMonth &&
      eventDate.getFullYear() === currentYear
    );
  });

  return {
    workouts: monthEvents.filter((e) => e.category === "gym").length,
    bills: monthEvents.filter((e) => e.category === "budget").length,
    income: monthEvents.filter((e) => e.category === "transaction").length,
  };
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse class="-ml-0.5" />
          <h1 class="text-lg font-semibold">Calendar</h1>
        </template>

        <template #right>
          <Flex class="gap-2">
            <UButton variant="ghost" size="sm" icon="i-lucide-download" label="Export ICS" />
            <USeparator orientation="vertical" class="h-4" />
            <UTooltip text="Notifications" :shortcuts="['N']">
              <UButton
                color="neutral"
                variant="ghost"
                square
                @click="isNotificationsSlideOverOpen = true"
              >
                <UChip color="error" inset>
                  <UIcon name="i-lucide-message-circle" class="size-5 shrink-0" />
                </UChip>
              </UButton>
            </UTooltip>
          </Flex>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="p-6 space-y-6">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UCard>
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-emerald-500/10">
                <UIcon name="i-lucide-dumbbell" class="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Workouts This Month</p>
                <p class="text-2xl font-bold">{{ stats.workouts }}</p>
              </div>
            </div>
          </UCard>

          <UCard>
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-amber-500/10">
                <UIcon name="i-lucide-receipt" class="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Bills Due</p>
                <p class="text-2xl font-bold">{{ stats.bills }}</p>
              </div>
            </div>
          </UCard>

          <UCard>
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-blue-500/10">
                <UIcon name="i-lucide-banknote" class="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Income Events</p>
                <p class="text-2xl font-bold">{{ stats.income }}</p>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Filters -->
        <UCard>
          <div class="flex flex-wrap items-center gap-4">
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Show:</span>
            <UCheckbox v-model="showGym" label="Gym Workouts" color="success" />
            <UCheckbox v-model="showBudget" label="Budget Due Dates" color="warning" />
            <UCheckbox v-model="showSalary" label="Salary/Income" color="info" />
          </div>
        </UCard>

        <!-- Legend -->
        <div class="flex flex-wrap gap-4 text-sm">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded bg-emerald-500"></div>
            <span class="text-gray-600 dark:text-gray-400">Gym (nSuns)</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded bg-amber-500"></div>
            <span class="text-gray-600 dark:text-gray-400">Budget Due</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded bg-blue-500"></div>
            <span class="text-gray-600 dark:text-gray-400">Income</span>
          </div>
        </div>

        <!-- NuxtCalendar Component -->
        <div class="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <NuxtCalendar
            v-model:selected-date="selectedDate"
            v-model:view="currentView"
            :events="filteredEvents"
            :slot-height="48"
            @event-click="handleEventClick"
            @event-change="handleEventChange"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
