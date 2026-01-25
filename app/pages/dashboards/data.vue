<script lang="ts" setup>
const buttonAction = ref<"All" | "New">("All");

const stats = {
  logsTraces: "245 of 776 records",
  serverMetrics: "187 of 776 records",
  eventsTransactions: "312 of 776 records",
  errors: "29 of 776 records",
};

const timeRangeOptions = [
  "Last 24 Hours",
  "Last 7 Days",
  "Last 30 Days",
  "Last Year",
];
const selectedTimeRange = ref("Last 7 Days");

const dataTypeOptions = [
  { label: "All Data", value: "all" },
  { label: "Logs & Traces", value: "logs" },
  { label: "Server Metrics", value: "server" },
  { label: "Events & Transactions", value: "events" },
  { label: "Errors", value: "errors" },
];
const selectedDataType = ref("all");

const chartViewOptions = [
  { label: "All Charts", value: "all" },
  { label: "Requests Only", value: "requests" },
  { label: "Errors Only", value: "errors" },
  { label: "Users Only", value: "users" },
];
const selectedChartView = ref("all");

const showRequestsChart = computed(
  () =>
    selectedChartView.value === "all" || selectedChartView.value === "requests"
);
const showErrorsChart = computed(
  () =>
    selectedChartView.value === "all" || selectedChartView.value === "errors"
);
const showUsersChart = computed(
  () => selectedChartView.value === "all" || selectedChartView.value === "users"
);

const errorLogs = ref([
  {
    id: "ERR-2847",
    timestamp: "2025-10-03 14:32:18",

    type: "5xx",
    endpoint: "/api/v2/users/authenticate",
    message: "Database connection timeout",
    occurrences: 23,
    affectedUsers: 156,
    status: "investigating",
  },
  {
    id: "ERR-2846",
    timestamp: "2025-10-03 14:28:45",

    type: "4xx",
    endpoint: "/api/v2/payments/process",
    message: "Invalid payment token",
    occurrences: 12,
    affectedUsers: 12,
    status: "resolved",
  },
  {
    id: "ERR-2845",
    timestamp: "2025-10-03 14:15:32",

    type: "4xx",
    endpoint: "/api/v2/media/upload",
    message: "File size exceeds limit",
    occurrences: 8,
    affectedUsers: 8,
    status: "open",
  },
  {
    id: "ERR-2844",
    timestamp: "2025-10-03 13:58:12",

    type: "5xx",
    endpoint: "/api/v2/orders/create",
    message: "Service unavailable - Circuit breaker open",
    occurrences: 45,
    affectedUsers: 234,
    status: "resolved",
  },
  {
    id: "ERR-2843",
    timestamp: "2025-10-03 13:42:09",

    type: "5xx",
    endpoint: "/api/v2/analytics/track",
    message: "Redis connection failed",
    occurrences: 18,
    affectedUsers: 89,
    status: "monitoring",
  },
]);

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
      <!-- Filter Controls -->
      <div class="flex flex-col sm:flex-row gap-8">
        <div class="flex gap-4 items-center">
          <label class="text-sm font-medium whitespace-nowrap text-toned"
            >Time Range</label
          >
          <USelect
            v-model="selectedTimeRange"
            :items="timeRangeOptions"
            size="md"
            icon="i-lucide-calendar"
          />
        </div>
        <div class="flex gap-4 items-center border-x border-default px-8">
          <label class="text-sm font-medium whitespace-nowrap text-toned"
            >Data Type</label
          >
          <USelect
            v-model="selectedDataType"
            :items="dataTypeOptions"
            value-key="value"
            size="md"
            icon="i-lucide-filter"
          />
        </div>
        <div class="flex gap-4 items-center">
          <label class="text-sm font-medium whitespace-nowrap text-toned"
            >Chart View</label
          >
          <USelect
            v-model="selectedChartView"
            :items="chartViewOptions"
            value-key="value"
            size="md"
            icon="i-lucide-bar-chart"
          />
        </div>
      </div>
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h6 class="font-medium">Custom Data Ingestion</h6>
              <p class="text-dimmed">
                Data ingestion is currently in beta. Please refer to the
                documentation for more details.
              </p>
            </div>

            <UButton icon="i-lucide-external-link">Open Report</UButton>
          </div>
        </template>

        <div class="grid grid-cols-4 gap-6">
          <div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-xs bg-yellow-500 inline-block" />
              <div class="text-toned">Logs & Traces</div>
            </div>
            <div>
              <div class="ml-5 flex items-baseline gap-4">
                <div class="text-2xl font-semibold">84%</div>
                <div class="text-muted underline-after">
                  {{ stats.logsTraces }}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-xs bg-purple-500 inline-block" />
              <div class="text-toned">Server Metrics</div>
            </div>
            <div class="ml-5 flex items-baseline gap-4">
              <div class="text-2xl font-semibold">84%</div>
              <div class="text-muted underline-after">
                {{ stats.serverMetrics }}
              </div>
            </div>
          </div>

          <div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-xs bg-sky-500 inline-block" />
              <div class="text-toned">Events & Transactions</div>
            </div>
            <div>
              <div class="ml-5 flex items-baseline gap-4">
                <div class="text-2xl font-semibold">84%</div>
                <div class="text-muted underline-after">
                  {{ stats.eventsTransactions }}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-xs bg-error-500 inline-block" />
              <div class="text-toned">Errors</div>
            </div>
            <div>
              <div class="ml-5 flex items-baseline gap-4">
                <div class="text-2xl font-semibold">84%</div>
                <div class="text-muted underline-after">{{ stats.errors }}</div>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <div
        class="grid gap-6"
        :class="selectedChartView === 'all' ? 'grid-cols-3' : 'grid-cols-1'"
      >
        <UCard v-if="showRequestsChart">
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h6 class="font-medium">Requests Overview</h6>
                <p class="text-dimmed text-sm">Volume of requests over time.</p>
              </div>
              <UButton variant="subtle" class="whitespace-nowrap"
                >View Details</UButton
              >
            </div>
          </template>

          <div class="flex items-center justify-start gap-16">
            <div class="mb-8">
              <div class="text-xl">96</div>
              <div class="text-dimmed text-sm">Total Errors</div>
            </div>
            <div class="mb-8">
              <div class="text-xl">2.4K</div>
              <div class="text-dimmed text-sm">Total Requests</div>
            </div>
          </div>

          <div>
            <ChartsRequestsChart
              :time-range="selectedTimeRange"
              :data-type="selectedDataType"
            />
          </div>
        </UCard>

        <UCard v-if="showErrorsChart">
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h6 class="font-medium">Error Types</h6>
                <p class="text-dimmed text-sm">Distribution of error.</p>
              </div>
              <UButton variant="subtle" class="whitespace-nowrap"
                >View Details</UButton
              >
            </div>
          </template>
          <div class="flex items-center justify-start gap-16">
            <div class="mb-8">
              <div class="text-xl">29</div>
              <div class="text-dimmed text-sm">Critical Errors</div>
            </div>
            <div class="mb-8">
              <div class="text-xl">67</div>
              <div class="text-dimmed text-sm">Warnings</div>
            </div>
          </div>

          <div>
            <ChartsErrorType
              :time-range="selectedTimeRange"
              :data-type="selectedDataType"
            />
          </div>
        </UCard>

        <UCard v-if="showUsersChart">
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h6 class="font-medium">User Types</h6>
                <p class="text-dimmed text-sm">Users by type.</p>
              </div>
              <UButton variant="subtle" class="whitespace-nowrap"
                >View Details</UButton
              >
            </div>
          </template>
          <div class="flex items-center justify-start gap-16">
            <div class="mb-8">
              <div class="text-xl">1.2K</div>
              <div class="text-dimmed text-sm">Active Users</div>
            </div>
            <div class="mb-8">
              <div class="text-xl">350</div>
              <div class="text-dimmed text-sm">New Users</div>
            </div>
          </div>

          <div>
            <ChartsUserType
              :time-range="selectedTimeRange"
              :data-type="selectedDataType"
            />
          </div>
        </UCard>
      </div>

      <!-- Full Width Error Log Table -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h6 class="font-medium">Real-Time Error Log</h6>
              <p class="text-dimmed text-sm">
                Live monitoring of system errors and incidents
              </p>
            </div>
            <div class="flex gap-2">
              <UButton variant="subtle" icon="i-lucide-download"
                >Export</UButton
              >
            </div>
          </div>
        </template>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-default">
                <th class="text-left py-3 px-4 text-sm font-medium text-toned">
                  Error ID
                </th>
                <th class="text-left py-3 px-4 text-sm font-medium text-toned">
                  Timestamp
                </th>
                <th class="text-left py-3 px-4 text-sm font-medium text-toned">
                  Type
                </th>
                <th class="text-left py-3 px-4 text-sm font-medium text-toned">
                  Endpoint
                </th>
                <th class="text-left py-3 px-4 text-sm font-medium text-toned">
                  Error Message
                </th>
                <th class="text-left py-3 px-4 text-sm font-medium text-toned">
                  Occurrences
                </th>
                <th class="text-left py-3 px-4 text-sm font-medium text-toned">
                  Affected Users
                </th>
                <th class="text-left py-3 px-4 text-sm font-medium text-toned">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="error in errorLogs"
                :key="error.id"
                class="border-b border-default hover:bg-muted/5 transition-colors"
              >
                <td class="py-3 px-4">
                  <span class="font-mono text-sm">{{ error.id }}</span>
                </td>
                <td class="py-3 px-4">
                  <span class="text-sm text-muted">{{ error.timestamp }}</span>
                </td>
                <td class="py-3 px-4">
                  <UBadge
                    :color="error.type === '5xx' ? 'error' : 'warning'"
                    variant="outline"
                  >
                    {{ error.type }}
                  </UBadge>
                </td>
                <td class="py-3 px-4">
                  <code class="text-xs text-muted px-2 py-1 rounded">{{
                    error.endpoint
                  }}</code>
                </td>
                <td class="py-3 px-4">
                  <span class="text-sm text-muted">{{ error.message }}</span>
                </td>
                <td class="py-3 px-4">
                  <div class="flex items-center gap-2">
                    <span class="font-semibold text-muted">{{
                      error.occurrences
                    }}</span>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <span class="font-semibold text-muted">{{
                    error.affectedUsers
                  }}</span>
                </td>
                <td class="py-3 px-4">
                  <div class="flex gap-2">
                    <UButton
                      icon="i-lucide-eye"
                      size="xs"
                      variant="ghost"
                      color="gray"
                    />
                    <UButton
                      icon="i-lucide-external-link"
                      size="xs"
                      variant="ghost"
                      color="gray"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <template #footer>
          <div class="flex items-center justify-between">
            <div class="text-sm text-muted">
              Showing {{ errorLogs.length }} of 96 total errors
            </div>
            <div class="flex gap-2">
              <UButton size="xs" variant="ghost">Previous</UButton>
              <UButton size="xs" variant="ghost">Next</UButton>
            </div>
          </div>
        </template>
      </UCard>
    </div>
  
    </template>
  </UDashboardPanel>
</template>
