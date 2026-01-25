<script lang="ts" setup>
import type { DropdownMenuItem } from "@nuxt/ui";

interface SwimLaneEvent {
  id: string;
  title: string;
  time?: string;
  date: Date;
  laneId: string;
  color?: string;
  status?: "scheduled" | "cancelled" | "conflicted";
}

const buttonAction = ref<"All" | "New">("All");

const tabs = ref([
  { label: "All", key: "all", icon: "i-lucide-home" },
  { label: "Meetings", key: "meetings", icon: "i-lucide-calendar" },
  { label: "Events", key: "events", icon: "i-lucide-party-popper" },
  { label: "Holidays", key: "holidays", icon: "i-lucide-umbrella" },
  { label: "Time off", key: "timeoff", icon: "i-lucide-clock" },
]);
const activeTab = ref(0);

const dateRange = ref({
  start: new Date(),
  end: new Date(),
});

const searchQuery = ref();

const filterItems = ref<DropdownMenuItem[][]>([
  [
    {
      slot: "filters",
    },
  ],
]);

const handleEventClick = (event: SwimLaneEvent) => {
  console.log("Event clicked:", event);
  // Handle event click logic here
};

const showSwimlane = ref(true);

const { isNotificationsSlideOverOpen } = useDashboard();
</script>
<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse class="-ml-0.5" />

          <Flex class="gap-2">
            <UButton
              icon="i-lucide-box"
              variant="outline"
              label="All Projects"
              active-variant="subtle"
              :active="buttonAction === 'All'"
              @click="buttonAction = 'All'"
            />
            <UButton
              icon="i-lucide-plus"
              label="new"
              variant="ghost"
              active-variant="subtle"
              :active="buttonAction === 'New'"
              @click="buttonAction = 'New'"
            />
          </Flex>
        </template>

        <template #right>
          <Flex class="gap-2">
            <UButton variant="ghost" size="sm" icon="i-lucide-link" />
            <UButton variant="ghost" size="sm" icon="i-lucide-plus" />
            <USeparator orientation="vertical" class="h-4" />
            <UTooltip text="Notifications" :shortcuts="['N']">
              <UButton
                color="neutral"
                variant="ghost"
                square
                @click="isNotificationsSlideOverOpen = true"
              >
                <UChip color="error" inset>
                  <UIcon
                    name="i-lucide-message-circle"
                    class="size-5 shrink-0"
                  />
                </UChip>
              </UButton>
            </UTooltip>
          </Flex>
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>

    

    <div class="space-y-6">
      <FlexBetween>
        <Flex class="gap-4">
          <UButton label="Today" active-variant="subtle" />
          <CalendarDropdown v-model="dateRange" :align="'left'" />
        </Flex>

        <Flex class="gap-4">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Search for events"
            class="w-96"
          />
          <UDropdownMenu
            :items="filterItems"
            :ui="{
              content: 'w-48',
            }"
          >
            <UButton
              icon="i-lucide-list-filter"
              label="Filters"
              color="neutral"
            />
            <template #filters> custom filters dropdown content </template>
          </UDropdownMenu>
          <UButton icon="i-lucide-settings" color="neutral" />
        </Flex>
      </FlexBetween>

      <FlexBetween class="relative">
        <UTabs
          :value="tabs[activeTab]"
          variant="link"
          color="neutral"
          :items="tabs"
          :content="false"
          class="w-full"
          @update:model-value="(i) => (activeTab = Number(i))"
        />
        <UButton
          :icon="showSwimlane ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
          class="absolute right-0"
          variant="link"
          @click="showSwimlane = !showSwimlane"
        />
      </FlexBetween>
      
      <CalendarSwimLane v-if="showSwimlane" @event-click="handleEventClick" />

      <AppsCalendar />
    </div>
  
    </template>
  </UDashboardPanel>
</template>
