<script lang="ts" setup>
import type { TableColumn } from "@nuxt/ui";
import type { PortfolioHolding, AssetType } from "~/types";

const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

// State
const isModalOpen = ref(false);
const editingHolding = ref<PortfolioHolding | null>(null);
const assetTypeFilter = ref<AssetType | undefined>(undefined);

// Filters
const filters = computed(() => ({
  assetType: assetTypeFilter.value,
}));

// Composables
const {
  data: portfolioData,
  status,
  updatePage,
  createHolding,
  updateHolding,
  deleteHolding,
  refresh,
} = usePortfolio(filters);

const { data: summary, refresh: refreshSummary } = usePortfolioSummary();

// Computed
const holdings = computed(() => portfolioData.value?.data ?? []);
const totalPages = computed(() => portfolioData.value?.totalPages ?? 1);
const currentPage = computed(() => portfolioData.value?.page ?? 1);

// Format helpers
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatPercent = (percent: number) => {
  const sign = percent >= 0 ? "+" : "";
  return `${sign}${percent.toFixed(2)}%`;
};

const formatQuantity = (quantity: number) => {
  if (quantity < 1) {
    return quantity.toFixed(4);
  }
  return quantity.toFixed(2);
};

// Asset type config
const assetTypeConfig: Record<AssetType, { color: string; icon: string }> = {
  stock: { color: "primary", icon: "i-lucide-trending-up" },
  etf: { color: "secondary", icon: "i-lucide-pie-chart" },
  crypto: { color: "warning", icon: "i-lucide-bitcoin" },
  bond: { color: "success", icon: "i-lucide-landmark" },
  cash: { color: "neutral", icon: "i-lucide-banknote" },
  other: { color: "error", icon: "i-lucide-circle-dot" },
};

// Table columns
const columns: TableColumn<PortfolioHolding>[] = [
  {
    accessorKey: "symbol",
    header: "Asset",
    cell: ({ row }) =>
      h("div", { class: "flex items-center gap-3" }, [
        h(
          "div",
          {
            class: "w-10 h-10 rounded-lg flex items-center justify-center bg-elevated",
          },
          [
            h("span", { class: "font-bold text-sm" }, row.original.symbol.slice(0, 3)),
          ]
        ),
        h("div", {}, [
          h("div", { class: "font-semibold" }, row.original.symbol),
          h("div", { class: "text-xs text-muted truncate max-w-[150px]" }, row.original.name),
        ]),
      ]),
  },
  {
    accessorKey: "assetType",
    header: "Type",
    cell: ({ row }) => {
      const config = assetTypeConfig[row.original.assetType];
      return h(
        UBadge,
        {
          variant: "soft",
          color: config.color,
          icon: config.icon,
          class: "capitalize",
        },
        () => row.original.assetType
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => formatQuantity(row.original.quantity),
  },
  {
    accessorKey: "averageCost",
    header: "Avg Cost",
    cell: ({ row }) => formatCurrency(row.original.averageCost),
  },
  {
    accessorKey: "currentPrice",
    header: "Price",
    cell: ({ row }) => formatCurrency(row.original.currentPrice),
  },
  {
    id: "value",
    header: "Value",
    cell: ({ row }) => {
      const value = row.original.quantity * row.original.currentPrice;
      return h("span", { class: "font-medium" }, formatCurrency(value));
    },
  },
  {
    id: "gain",
    header: "Gain/Loss",
    cell: ({ row }) => {
      const cost = row.original.quantity * row.original.averageCost;
      const value = row.original.quantity * row.original.currentPrice;
      const gain = value - cost;
      const gainPercent = cost > 0 ? (gain / cost) * 100 : 0;
      const isPositive = gain >= 0;

      return h("div", { class: "text-right" }, [
        h(
          "div",
          { class: isPositive ? "text-green-600 font-medium" : "text-red-600 font-medium" },
          `${isPositive ? "+" : ""}${formatCurrency(gain)}`
        ),
        h(
          "div",
          { class: `text-xs ${isPositive ? "text-green-600" : "text-red-600"}` },
          formatPercent(gainPercent)
        ),
      ]);
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) =>
      h(
        UDropdownMenu,
        {
          items: [
            [
              {
                label: "Edit",
                icon: "i-lucide-pencil",
                onSelect: () => openEditModal(row.original),
              },
              {
                label: "Delete",
                icon: "i-lucide-trash-2",
                color: "error",
                onSelect: () => handleDelete(row.original.id),
              },
            ],
          ],
        },
        {
          default: () =>
            h(UButton, {
              icon: "i-lucide-ellipsis-vertical",
              variant: "ghost",
              color: "neutral",
              size: "xs",
            }),
        }
      ),
  },
];

// Chart data
const allocationChartData = computed(() => {
  if (!summary.value?.byAssetType) return [];
  return summary.value.byAssetType.map((a) => ({
    name: a.assetType,
    value: a.value,
    color: a.color,
  }));
});

const allocationCategories = computed(() => {
  return Object.fromEntries(
    allocationChartData.value.map((item) => [
      item.name,
      { name: item.name.charAt(0).toUpperCase() + item.name.slice(1), color: item.color },
    ])
  );
});

const sectorChartData = computed(() => {
  if (!summary.value?.bySector) return [];
  return summary.value.bySector.slice(0, 6);
});

// Actions
const openAddModal = () => {
  editingHolding.value = null;
  isModalOpen.value = true;
};

const openEditModal = (holding: PortfolioHolding) => {
  editingHolding.value = holding;
  isModalOpen.value = true;
};

const handleDelete = async (id: string) => {
  if (confirm("Are you sure you want to delete this holding?")) {
    await deleteHolding(id);
    await refreshSummary();
  }
};

const handleSave = async (data: {
  symbol: string;
  name: string;
  assetType: AssetType;
  quantity: number;
  averageCost: number;
  currentPrice?: number;
  sector?: string;
  exchange?: string;
  notes?: string;
}) => {
  if (editingHolding.value) {
    await updateHolding(editingHolding.value.id, data);
  } else {
    await createHolding(data);
  }
  await refreshSummary();
  isModalOpen.value = false;
};

// Filter options
const assetTypeOptions: { label: string; value: AssetType | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Stocks", value: "stock" },
  { label: "ETFs", value: "etf" },
  { label: "Crypto", value: "crypto" },
  { label: "Bonds", value: "bond" },
];
</script>

<template>
  <UDashboardPanel id="portfolio">
    <template #header>
      <UDashboardNavbar title="Portfolio" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton label="Add Holding" icon="i-lucide-plus" @click="openAddModal" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="space-y-6">
        <!-- Summary Cards -->
        <div class="grid grid-cols-4 gap-6">
          <UCard>
            <div class="space-y-2">
              <h3 class="text-sm text-muted">Portfolio Value</h3>
              <div class="text-2xl font-semibold">
                {{ formatCurrency(summary?.totalValue ?? 0) }}
              </div>
              <div
                class="text-sm"
                :class="(summary?.dayChangePercent ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ formatPercent(summary?.dayChangePercent ?? 0) }} today
              </div>
            </div>
          </UCard>
          <UCard>
            <div class="space-y-2">
              <h3 class="text-sm text-muted">Total Cost Basis</h3>
              <div class="text-2xl font-semibold">
                {{ formatCurrency(summary?.totalCost ?? 0) }}
              </div>
              <div class="text-sm text-muted">
                {{ summary?.holdingsCount ?? 0 }} holdings
              </div>
            </div>
          </UCard>
          <UCard>
            <div class="space-y-2">
              <h3 class="text-sm text-muted">Total Gain/Loss</h3>
              <div
                class="text-2xl font-semibold"
                :class="(summary?.totalGain ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ (summary?.totalGain ?? 0) >= 0 ? '+' : '' }}{{ formatCurrency(summary?.totalGain ?? 0) }}
              </div>
              <div
                class="text-sm"
                :class="(summary?.totalGainPercent ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ formatPercent(summary?.totalGainPercent ?? 0) }} all time
              </div>
            </div>
          </UCard>
          <UCard>
            <div class="space-y-2">
              <h3 class="text-sm text-muted">Day Change</h3>
              <div
                class="text-2xl font-semibold"
                :class="(summary?.dayChange ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ (summary?.dayChange ?? 0) >= 0 ? '+' : '' }}{{ formatCurrency(summary?.dayChange ?? 0) }}
              </div>
              <div
                class="text-sm"
                :class="(summary?.dayChangePercent ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ formatPercent(summary?.dayChangePercent ?? 0) }}
              </div>
            </div>
          </UCard>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-3 gap-6">
          <!-- Allocation by Asset Type -->
          <UCard>
            <div class="space-y-4">
              <div>
                <h2 class="text-lg font-semibold">Asset Allocation</h2>
                <p class="text-sm text-muted">By asset type</p>
              </div>
              <div v-if="allocationChartData.length > 0" class="flex flex-col items-center">
                <DonutChart
                  :data="allocationChartData.map((d) => d.value)"
                  :height="160"
                  :arc-width="20"
                  :categories="allocationCategories"
                  :pad-angle="0.05"
                  :hide-legend="true"
                  :radius="70"
                >
                  <div class="text-center">
                    <div class="text-xs text-muted">Total</div>
                    <div class="text-lg font-bold">
                      {{ formatCurrency(summary?.totalValue ?? 0) }}
                    </div>
                  </div>
                </DonutChart>
                <div class="mt-4 w-full space-y-2">
                  <div
                    v-for="item in allocationChartData"
                    :key="item.name"
                    class="flex items-center gap-2 text-sm"
                  >
                    <span
                      class="w-3 h-3 rounded-full"
                      :style="{ backgroundColor: item.color }"
                    />
                    <span class="flex-1 capitalize">{{ item.name }}</span>
                    <span class="text-muted">{{ formatCurrency(item.value) }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="h-[200px] flex items-center justify-center text-muted">
                No holdings
              </div>
            </div>
          </UCard>

          <!-- Sector Breakdown -->
          <UCard>
            <div class="space-y-4">
              <div>
                <h2 class="text-lg font-semibold">Sector Breakdown</h2>
                <p class="text-sm text-muted">Portfolio by sector</p>
              </div>
              <div v-if="sectorChartData.length > 0" class="space-y-3">
                <div
                  v-for="sector in sectorChartData"
                  :key="sector.sector"
                  class="space-y-1"
                >
                  <div class="flex justify-between text-sm">
                    <span>{{ sector.sector }}</span>
                    <span class="text-muted">{{ sector.percentage.toFixed(1) }}%</span>
                  </div>
                  <div class="h-2 bg-elevated rounded-full overflow-hidden">
                    <div
                      class="h-full bg-primary rounded-full transition-all"
                      :style="{ width: `${sector.percentage}%` }"
                    />
                  </div>
                </div>
              </div>
              <div v-else class="h-[200px] flex items-center justify-center text-muted">
                No sector data
              </div>
            </div>
          </UCard>

          <!-- Top Movers -->
          <UCard>
            <div class="space-y-4">
              <div>
                <h2 class="text-lg font-semibold">Top Performers</h2>
                <p class="text-sm text-muted">Best & worst performers</p>
              </div>
              <div class="space-y-4">
                <div>
                  <h3 class="text-xs font-medium text-muted uppercase mb-2">Top Gainers</h3>
                  <div class="space-y-2">
                    <div
                      v-for="gainer in summary?.topGainers ?? []"
                      :key="gainer.symbol"
                      class="flex items-center justify-between"
                    >
                      <div>
                        <span class="font-medium">{{ gainer.symbol }}</span>
                      </div>
                      <span class="text-green-600 font-medium">
                        {{ formatPercent(gainer.gainPercent) }}
                      </span>
                    </div>
                  </div>
                </div>
                <USeparator />
                <div>
                  <h3 class="text-xs font-medium text-muted uppercase mb-2">Top Losers</h3>
                  <div class="space-y-2">
                    <div
                      v-for="loser in summary?.topLosers ?? []"
                      :key="loser.symbol"
                      class="flex items-center justify-between"
                    >
                      <div>
                        <span class="font-medium">{{ loser.symbol }}</span>
                      </div>
                      <span class="text-red-600 font-medium">
                        {{ formatPercent(loser.gainPercent) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Holdings Table -->
        <UCard>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-semibold">Holdings</h2>
                <p class="text-sm text-muted">Your investment portfolio</p>
              </div>
              <div class="flex items-center gap-2">
                <UButtonGroup>
                  <UButton
                    v-for="opt in assetTypeOptions"
                    :key="opt.label"
                    :label="opt.label"
                    :variant="assetTypeFilter === opt.value ? 'solid' : 'outline'"
                    size="sm"
                    @click="assetTypeFilter = opt.value"
                  />
                </UButtonGroup>
              </div>
            </div>

            <UTable
              :data="holdings"
              :columns="columns"
              :loading="status === 'pending'"
              :ui="{
                td: 'text-sm py-3 px-4',
                th: 'py-3 px-4 font-semibold text-highlighted bg-elevated/50',
              }"
            />

            <div v-if="totalPages > 1" class="flex justify-center">
              <UPagination
                :model-value="currentPage"
                :total="totalPages * 20"
                :items-per-page="20"
                @update:model-value="updatePage"
              />
            </div>
          </div>
        </UCard>
      </div>
    </template>

    <!-- Add/Edit Modal -->
    <UModal v-model:open="isModalOpen">
      <template #content>
        <HoldingForm
          :holding="editingHolding"
          @save="handleSave"
          @cancel="isModalOpen = false"
        />
      </template>
    </UModal>
  </UDashboardPanel>
</template>
