<script lang="ts" setup>
const buttonAction = ref<"All" | "New">("All");

const tabs = [
  { label: "All", value: "all" },
  { label: "Mobile", value: "mobile" },
  { label: "Desktop", value: "desktop" },
  { label: "Tablet", value: "tablet" },
];

const activeTab = ref("all");

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

    

    <div class="space-y-8">
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

      <div class="grid grid-cols-3 gap-8">
        <CardsAreaCharts />
      </div>

      <TablesTraffic/>
    </div>
  
    </template>
  </UDashboardPanel>
</template>
