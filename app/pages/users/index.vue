<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { useUsers } from "~/composables/useUsers";

const buttonAction = ref<"All" | "New">("All");

const tabs = [
  { label: "All Clients", count: 80 },
  { label: "Leads", count: 20 },
  { label: "Ongoing", count: 30 },
  { label: "Closed", count: 10 },
  { label: "Archived", count: 5 },
];

const selectedTab = ref();
const searchQuery = ref("");
const dateRange = ref({
  start: new Date(),
  end: new Date(),
});

const filterItems = ref<DropdownMenuItem[][]>([
  [
    {
      slot: "filters",
    },
  ],
]);

const { queryParams, data, updateSort, updatePage } = useUsers({
  pageSize: 15,
  sortBy: "lastLogin",
  sortDir: "desc",
});

const total = computed(() => data.value?.total || 0);
const items = computed(() => data.value?.data || []);

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
          <UTabs
            v-model="selectedTab"
            variant="link"
            :items="tabs"
            color="neutral"
            :content="false"
          >
            <template #trailing="{ item }">
              <UBadge color="neutral" variant="soft">
                {{ item.count }}
              </UBadge>
            </template>
          </UTabs>

          <Flex class="gap-2">
            <UButton
              icon="i-lucide-file-down"
              label="Export"
              variant="ghost"
              :ui="{ label: 'pr-1' }"
              @click="buttonAction = 'New'"
            />
            <UButton
              icon="i-lucide-plus"
              variant="outline"
              label="Add New"
              active-variant="subtle"
              :active="true"
              @click="buttonAction = 'All'"
            />
          </Flex>
        </FlexBetween>

        <FlexBetween class="gap-4">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Search for Clients"
            class="w-auto"
          />
          <Flex class="gap-4">
            <CalendarDropdown v-model="dateRange" :align="'right'" />
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
          </Flex>
        </FlexBetween>

        <TablesUsers
          :data="items"
          :query-params="queryParams"
          :total="total"
          :page-size="queryParams.pageSize"
          @update:sorting="updateSort"
          @update:page="updatePage"
        />
      </div>
    </template>
  </UDashboardPanel>
</template>
