<script lang="ts" setup>
import { issues } from "~/data/issues";
const buttonAction = ref<"All" | "New">("All");
const { queryParams, data, updatePage, updateSort } = useIssues();

const { isNotificationsSlideOverOpen } = useDashboard();
</script>

<template>
  <UDashboardPanel id="home">
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
              @click="emit('update:action', 'All')"
            />
            <UButton
              icon="i-lucide-plus"
              label="new"
              variant="ghost"
              active-variant="subtle"
              :active="buttonAction === 'New'"
              @click="emit('update:action', 'New')"
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
      <FlexBetween>
        <div class="space-y-2">
          <Flex class="gap-4">
            <FlexInline class="bg-warning/10 p-2 rounded">
              <UIcon
                name="i-lucide-activity"
                class="text-dimmed text-warning"
                size="14"
              />
            </FlexInline>
            <h1 class="text-xl font-semibold">Distribution of Effort</h1>
          </Flex>
        </div>

        <FiltersDropdowns />
      </FlexBetween>

      <div class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <UCard class="lg:col-span-4 relative">
            <template #header>
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-xl font-bold">
                    Issue count by burn-up and status
                  </h2>
                  <p class="text-muted text-sm">
                    Overview of issue progression over time
                  </p>
                </div>
              </div>
            </template>
            <ChartsIssueBurnUp />
          </UCard>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UCard class="relative">
            <div class="space-y-6">
              <div>
                <h2 class="text-xl font-bold">Type Distribution</h2>
                <p class="text-muted text-sm">Issue distribution by category</p>
              </div>
              <ChartsIssueTypeBar />
            </div>
          </UCard>

          <UCard class="relative">
            <div class="space-y-6">
              <div>
                <h2 class="text-xl font-bold">Bugs Distribution</h2>
                <p class="text-muted text-sm">
                  Specific breakdown of bug reports
                </p>
              </div>
              <ChartsIssuesBar />
            </div>
          </UCard>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UCard>
            <div class="space-y-6">
              <div>
                <h2 class="text-xl font-bold">Current Sprint</h2>
                <p class="text-muted text-sm">
                  Tasks assigned to the active sprint
                </p>
              </div>
              <div class="divide-y divide-default">
                <TablesSprint
                  :query-params="queryParams"
                  :data="data?.data || []"
                  :total="data?.total || 0"
                  @update:page="updatePage"
                  @update:sorting="updateSort"
                />
              </div>
            </div>
          </UCard>

          <UCard>
            <div class="space-y-6">
              <div>
                <h2 class="text-xl font-bold">Recent Issues</h2>
                <p class="text-muted text-sm">Latest updates and new entries</p>
              </div>
              <div class="divide-y divide-default">
                <IssuesItem
                  v-for="(issue, issueKey) in issues"
                  :key="issueKey"
                  :item="issue"
                />
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
