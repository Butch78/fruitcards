<script lang="ts" setup>
import type { DropdownMenuItem } from "@nuxt/ui";

const { isNotificationsSlideOverOpen } = useDashboard();

const items = [
  [
    {
      label: "New mail",
      icon: "i-lucide-send",
      to: "/inbox",
    },
    {
      label: "New customer",
      icon: "i-lucide-user-plus",
      to: "/customers",
    },
  ],
] satisfies DropdownMenuItem[][];

const portfolioCards = [
  {
    title: "Portfolio value",
    value: "$10,284",
    badgeIcon: "i-lucide-arrow-up",
    badgeLabel: "26%",
    compared: "$8,1333",
  },
  {
    title: "Portfolio growth",
    value: "$2,500",
    badgeIcon: "i-lucide-arrow-up",
    badgeLabel: "12%",
    compared: "$2,230",
  },
  {
    title: "Dividends",
    value: "$1,200",
    badgeIcon: "i-lucide-arrow-down",
    badgeLabel: "5%",
    compared: "$1,260",
  },
  {
    title: "Net deposits",
    value: "$3,000",
    badgeIcon: "i-lucide-arrow-up",
    badgeLabel: "8%",
    compared: "$2,780",
  },
];
</script>
<template>
  <UDashboardPanel id="finance">
    <template #header>
      <UDashboardNavbar title="Finance Dashboard" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
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
        <div class="col-span-3 grid grid-cols-4 gap-6">
            <UCard v-for="item in portfolioCards" :key="item.title">
              <div class="space-y-4">
                <div class="space-y-2">
                  <h2 class="dark:text-muted">
                    {{ item.title }}
                  </h2>
                  <div class="flex items-baseline gap-4">
                    <div class="text-2xl font-semibold">
                      {{ item.value }}
                    </div>
                    <div>
                      <UBadge
                        :icon="item.badgeIcon"
                        variant="soft"
                        :label="item.badgeLabel"
                      />
                    </div>
                  </div>
                  <div class="text-muted dark:text-dimmed text-sm">
                    Compared to
                    <span class="text-muted">{{ item.compared }}</span> past month
                  </div>
                </div>
              </div>
            </UCard>
        </div>

        <div class="grid grid-cols-3 gap-6">
          <UCard>
            <div class="space-y-6">
              <div class="w-full flex items-start justify-between">
                <div class="space-y-1">
                  <h2 class="text-xl font-semibold">Total Revenue</h2>
                  <p class="text-muted">Data from 1-12 Apr, 2025</p>
                </div>
                <UButton label="View Report" variant="outline" />
              </div>
              <div>
                <ChartsRevenueLine />
              </div>
            </div>
          </UCard>

          <UCard>
            <div class="space-y-6">
              <div class="w-full flex items-start justify-between">
                <div class="space-y-1">
                  <h2 class="text-xl font-semibold">Daily Expenses</h2>
                  <p class="text-muted">Data from 1-12 Apr, 2025</p>
                </div>
                <UButton label="View Report" variant="outline" />
              </div>
              <div>
                <ChartsExpensesBar />
              </div>
            </div>
          </UCard>

          <UCard>
            <div class="space-y-6">
              <div class="w-full flex items-start justify-between">
                <div class="space-y-1">
                  <h2 class="text-xl font-semibold">Summary</h2>
                  <p class="text-muted">Data from 1-12 Apr, 2025</p>
                </div>
                <UButton label="View Report" variant="outline" />
              </div>

              <ChartsFinanceSummary orientation="horizontal" />
            </div>
          </UCard>

          <UCard class="col-span-2">
            <div class="space-y-6">
              <div class="w-full flex items-start justify-between">
                <div class="space-y-1">
                  <h2 class="text-xl font-semibold">Daily Expenses</h2>
                  <p class="text-muted">Data from 1-12 Apr, 2025</p>
                </div>
                <UButton label="View Report" variant="outline" />
              </div>
              <div class="border-t border-default">
                <TablesTransactions />
              </div>
            </div>
          </UCard>

          <div class="flex flex-col justify-center space-y-6">
            <UCard class="flex-1">
              <div class="space-y-6">
                <div class="w-full flex items-start justify-between">
                  <div class="space-y-1">
                    <h2 class="text-xl font-semibold">Daily Expenses</h2>
                    <p class="text-muted">Data from 1-12 Apr, 2025</p>
                  </div>
                  <UButton label="View Report" variant="outline" />
                </div>
                <ChartsWinLostLine />
              </div>
            </UCard>

            <UCard>
              <div class="space-y-2">
                <StatusCategoryList />
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
