<script lang="ts" setup>
import type { TableColumn } from "@nuxt/ui";
const buttonAction = ref<"All" | "New">("All");

// Error monitoring line chart (4xx vs 5xx)
const colorMode = useColorMode();

interface ErrorDataItem {
  day: string;
  errors4xx: number;
  errors5xx: number;
}

const ErrorData: ErrorDataItem[] = [
  { day: "Mon", errors4xx: 180, errors5xx: 22 },
  { day: "Tue", errors4xx: 165, errors5xx: 18 },
  { day: "Wed", errors4xx: 210, errors5xx: 35 },
  { day: "Thu", errors4xx: 190, errors5xx: 28 },
  { day: "Fri", errors4xx: 225, errors5xx: 42 },
  { day: "Sat", errors4xx: 140, errors5xx: 15 },
  { day: "Sun", errors4xx: 155, errors5xx: 17 },
];

const ErrorCategories = computed(() => ({
  errors4xx: {
    name: "4xx Errors",
    color: "var(--color-warning-500)",
  },
  errors5xx: {
    name: "5xx Errors",
    color: "var(--color-error-500)",
  },
}));

const xFormatter = (i: number): string => `${ErrorData[i]?.day}`;
const yFormatter = (value: number): string => `${value}`;

const { height } = useResponsiveHeight({
  default: 120,
  sm: 360,
});

const UBadge = resolveComponent("UBadge");

interface ErrorDetailRow {
  time: string;
  code: number; 
  type: "4xx" | "5xx";
  message: string;
  path: string;
  service: string;
  env: "prod" | "staging" | "dev";
  count: number; 
}

const errorRows = ref<ErrorDetailRow[]>([
  {
    time: "2025-09-01 12:22:13",
    code: 500,
    type: "5xx",
    message: "Internal Server Error",
    path: "GET /api/orders",
    service: "orders-api",
    env: "prod",
    count: 12,
  },
  {
    time: "2025-09-01 12:20:55",
    code: 404,
    type: "4xx",
    message: "Not Found",
    path: "GET /api/users/987",
    service: "users-api",
    env: "prod",
    count: 34,
  },
  {
    time: "2025-09-01 12:18:10",
    code: 502,
    type: "5xx",
    message: "Bad Gateway",
    path: "POST /api/auth/login",
    service: "edge-gateway",
    env: "prod",
    count: 5,
  },
  {
    time: "2025-09-01 12:15:02",
    code: 429,
    type: "4xx",
    message: "Too Many Requests",
    path: "GET /api/search?q=report",
    service: "search-api",
    env: "prod",
    count: 48,
  },
  {
    time: "2025-09-01 12:12:41",
    code: 503,
    type: "5xx",
    message: "Service Unavailable",
    path: "GET /api/payments/summary",
    service: "payments-api",
    env: "prod",
    count: 8,
  },
]);

const errorColumns: TableColumn<ErrorDetailRow>[] = [
  { accessorKey: "time", header: "Time" },
  {
    accessorKey: "code",
    header: "Status",
    cell: ({ row }) => {
      const code = row.getValue("code") as number;
      const color = code >= 500 ? "error" : "warning";
      return h(
        UBadge,
        { variant: "soft", color, class: "font-mono" },
        () => String(code)
      );
    },
  },
  { accessorKey: "message", header: "Message" },
  { accessorKey: "path", header: "Path" },
  { accessorKey: "service", header: "Service" },
  { accessorKey: "env", header: "Env" },
  { accessorKey: "count", header: "Count" },
];

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

    

    <div class="grid grid-cols-3 gap-6">
      <UCard variant="outline">
        <div class="space-y-1">
          <div class="text-muted text-sm">Current uptime</div>
          <div class="text-lg font-semibold">4 hours 20 mins</div>
        </div>
      </UCard>
      <UCard variant="outline">
        <div class="space-y-1">
          <div class="text-muted text-sm">Last checked</div>
          <div class="text-lg font-semibold">48 seconds ago</div>
        </div>
      </UCard>
      <UCard variant="outline">
        <div class="space-y-1">
          <div class="text-muted text-sm">Warnings</div>
          <div class="text-lg font-semibold">0</div>
        </div>
      </UCard>
    </div>

    <div class="mt-6">
      <UCard variant="outline">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="font-medium">Error Monitoring (Last 7 days)</div>
            <div class="text-muted text-sm">4xx vs 5xx</div>
          </div>
        </template>

        <LineChart
          :key="colorMode.value"
          :data="ErrorData"
          :height="height"
          :categories="ErrorCategories"
          :x-formatter="xFormatter"
          :y-formatter="yFormatter"
          :curve-type="CurveType.StepAfter"
          :legend-position="LegendPosition.Top"
          :hide-legend="false"
          :x-grid-line="false"
          :y-grid-line="true"
          :x-domain-line="true"
          :y-domain-line="false"
          :x-tick-line="false"
          :y-tick-line="true"
          :x-num-ticks="7"
          :y-num-ticks="4"
          :hide-tooltip="false"
          x-label="Day of Week"
          y-label="Error Count"
        />
      </UCard>
    </div>

    <div class="mt-6">
      <UCard variant="outline">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="font-medium">Error Details</div>
            <div class="text-muted text-sm">Most recent incidents</div>
          </div>
        </template>

        <UTable
          :data="errorRows"
          :columns="errorColumns"
          class="flex-1"
          :ui="{ td: 'text-sm p-4', th: 'bg-transparent py-4', tr: 'divide-x-0', root: 'ring-0'}"
        />
      </UCard>
    </div>
  
    </template>
  </UDashboardPanel>
</template>
