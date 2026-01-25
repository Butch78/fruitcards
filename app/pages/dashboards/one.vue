<script lang="ts" setup>
const buttonAction = ref<"All" | "New">("All");

const { queryParams, data, updateSort } = useIssues({
  pageSize: 10,
  sortBy: "createdAt",
  sortDir: "desc",
});

const attendanceCards = [
  { title: "Total Issues", value: "247", total: "of 300 planned" },
  { title: "In Progress", value: "23", total: "actively worked" },
  { title: "Completed", value: "189", total: "this sprint" },
  { title: "Bugs", value: "12", total: "need attention" },
];

const tabs = [
  { label: "Overview", value: "overview" },
  { label: "Issues", value: "issues" },
  { label: "Reports", value: "reports" },
];

const activeTab = ref("overview");

const selectedDate = ref({
  start: new Date(),
});

const status = ref("All");

const updateStatus = (newStatus: string) => {
  status.value = newStatus;
};

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
      <div class="space-y-6">
        <FlexBetween>
          <UTabs
            v-model="activeTab"
            :items="tabs"
            :content="false"
          />

          <Flex class="gap-2">
            <UButton
              icon="i-lucide-file-down"
              variant="outline"
              label="Export"
              active-variant="subtle"
              :active="true"
              @click="buttonAction = 'All'"
            />
            <UButton
              icon="i-lucide-plus"
              label="New Sheet"
              variant="ghost"
              :ui="{ label: 'pr-1' }"
              @click="buttonAction = 'New'"
            />
          </Flex>
        </FlexBetween>
      </div>

      <div class="grid grid-cols-4 gap-4">
        <UCard
          v-for="card in attendanceCards"
          :key="card.title"
        >
          <div class="space-y-2">
            <Flex class="gap-2">
            <h4 class="text-toned">{{ card.title }}</h4>
            <UBadge color="primary" size="sm" variant="subtle">+15%</UBadge>
          </Flex>
          <div class="space-y-1">
            <h3 class="text-3xl font-bold">
              {{ card.value }}
            </h3>
            <span class="text-muted">{{ card.total }}</span>
          </div>
          </div>
        </UCard>
      </div>

      <UCard variant="outline" class="relative">
        <template #default>
          <h2 class="text-lg font-medium">Type Distribution</h2>
          <ChartsIssueTypeBar />
        </template>
      </UCard>

      <UCard variant="outline">
        <FlexBetween class="pb-6">
          <Flex class="gap-4">
            <UInput icon="i-lucide-search" placeholder="Search issue" />
          </Flex>

          <Flex class="gap-4">
            <UButton label="import" icon="i-lucide-file-down" />
            <FiltersStatus :status="status" @update:status="updateStatus" />
            <CalendarDropdown v-model="selectedDate" :align="'right'" />
          </Flex>
        </FlexBetween>

        <TablesSprint
          :query-params="queryParams"
          :data="data?.data || []"
          @update:sorting="updateSort"
        />
      </UCard>
    </div>
  
    </template>
  </UDashboardPanel>
</template>
