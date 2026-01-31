<script lang="ts" setup>
import type { TableColumn } from "@nuxt/ui";
import type { FinancialTransaction, TransactionCategory } from "~/types";

const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

// State
const isModalOpen = ref(false);
const editingTransaction = ref<FinancialTransaction | null>(null);
const typeFilter = ref<"income" | "expense" | undefined>(undefined);

// Filters
const filters = computed(() => ({
  type: typeFilter.value,
}));

// Composables
const {
  data: transactionsData,
  status,
  updatePage,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  refresh,
} = useFinancialTransactions(filters);

const { data: categories } = useTransactionCategories();
const { data: summary, refresh: refreshSummary } = useTransactionSummary();

// Computed
const transactions = computed(() => transactionsData.value?.data ?? []);
const totalPages = computed(() => transactionsData.value?.totalPages ?? 1);
const currentPage = computed(() => transactionsData.value?.page ?? 1);

// Format helpers
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Table columns
const columns: TableColumn<FinancialTransaction>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => formatDate(row.original.date),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) =>
      h("div", { class: "flex items-center gap-3" }, [
        row.original.category?.icon
          ? h("UIcon", {
              name: row.original.category.icon,
              class: "size-4",
              style: { color: row.original.category.color || undefined },
            })
          : null,
        h("span", {}, row.original.description || "No description"),
      ]),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) =>
      h(
        UBadge,
        {
          variant: "soft",
          color: "neutral",
          style: row.original.category?.color
            ? { backgroundColor: `${row.original.category.color}20`, color: row.original.category.color }
            : undefined,
        },
        () => row.original.category?.name || "Uncategorized"
      ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) =>
      h(
        UBadge,
        {
          variant: "soft",
          color: row.original.type === "income" ? "success" : "error",
          icon: row.original.type === "income" ? "i-lucide-arrow-up" : "i-lucide-arrow-down",
        },
        () => row.original.type.charAt(0).toUpperCase() + row.original.type.slice(1)
      ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) =>
      h(
        "span",
        {
          class: row.original.type === "income" ? "text-green-600 font-medium" : "text-red-600 font-medium",
        },
        `${row.original.type === "income" ? "+" : "-"}${formatCurrency(row.original.amount)}`
      ),
  },
  {
    accessorKey: "isRecurring",
    header: "Recurring",
    cell: ({ row }) =>
      row.original.isRecurring
        ? h(
            UBadge,
            { variant: "outline", color: "info", size: "xs" },
            () => row.original.recurringInterval
          )
        : h("span", { class: "text-muted" }, "—"),
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
const incomeExpenseChartData = computed(() => {
  if (!summary.value?.byMonth) return [];
  return summary.value.byMonth.map((m) => ({
    month: m.month,
    income: m.income,
    expenses: m.expenses,
  }));
});

const incomeExpenseCategories = {
  income: { name: "Income", color: "var(--color-emerald-500)" },
  expenses: { name: "Expenses", color: "var(--color-rose-500)" },
};

const categoryChartData = computed(() => {
  if (!summary.value?.byCategory) return [];
  return summary.value.byCategory
    .filter((c) => c.type === "expense")
    .map((c) => ({
      name: c.categoryName,
      value: c.total,
      color: c.categoryColor || "#666",
    }));
});

const categoryChartCategories = computed(() => {
  return Object.fromEntries(
    categoryChartData.value.map((item) => [
      item.name,
      { name: item.name, color: item.color },
    ])
  );
});

// Actions
const openAddModal = () => {
  editingTransaction.value = null;
  isModalOpen.value = true;
};

const openEditModal = (transaction: FinancialTransaction) => {
  editingTransaction.value = transaction;
  isModalOpen.value = true;
};

const handleDelete = async (id: string) => {
  if (confirm("Are you sure you want to delete this transaction?")) {
    await deleteTransaction(id);
    await refreshSummary();
  }
};

const handleSave = async (data: {
  categoryId?: string;
  amount: number;
  type: "income" | "expense";
  description?: string;
  date: string;
  isRecurring?: boolean;
  recurringInterval?: "daily" | "weekly" | "monthly" | "yearly";
}) => {
  if (editingTransaction.value) {
    await updateTransaction(editingTransaction.value.id, data);
  } else {
    await createTransaction(data);
  }
  await refreshSummary();
  isModalOpen.value = false;
};

// Filter options
const filterOptions = [
  { label: "All", value: undefined },
  { label: "Income", value: "income" as const },
  { label: "Expenses", value: "expense" as const },
];
</script>

<template>
  <UDashboardPanel id="transactions">
    <template #header>
      <UDashboardNavbar title="Transactions" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton label="Add Transaction" icon="i-lucide-plus" @click="openAddModal" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="space-y-6">
        <!-- Summary Cards -->
        <div class="grid grid-cols-4 gap-6">
          <UCard>
            <div class="space-y-2">
              <h3 class="text-sm text-muted">Total Income</h3>
              <div class="text-2xl font-semibold text-green-600">
                {{ formatCurrency(summary?.totalIncome ?? 0) }}
              </div>
            </div>
          </UCard>
          <UCard>
            <div class="space-y-2">
              <h3 class="text-sm text-muted">Total Expenses</h3>
              <div class="text-2xl font-semibold text-red-600">
                {{ formatCurrency(summary?.totalExpenses ?? 0) }}
              </div>
            </div>
          </UCard>
          <UCard>
            <div class="space-y-2">
              <h3 class="text-sm text-muted">Net Balance</h3>
              <div
                class="text-2xl font-semibold"
                :class="(summary?.netBalance ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ formatCurrency(summary?.netBalance ?? 0) }}
              </div>
            </div>
          </UCard>
          <UCard>
            <div class="space-y-2">
              <h3 class="text-sm text-muted">Transactions</h3>
              <div class="text-2xl font-semibold">
                {{ summary?.transactionCount ?? 0 }}
              </div>
            </div>
          </UCard>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-3 gap-6">
          <!-- Income vs Expenses Chart -->
          <UCard class="col-span-2">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-lg font-semibold">Income vs Expenses</h2>
                  <p class="text-sm text-muted">Monthly comparison</p>
                </div>
              </div>
              <div v-if="incomeExpenseChartData.length > 0">
                <BarChart
                  :data="incomeExpenseChartData"
                  :height="200"
                  :categories="incomeExpenseCategories"
                  :y-axis="['income', 'expenses']"
                  :x-formatter="(i: number) => incomeExpenseChartData[i]?.month?.slice(5) || ''"
                  :y-formatter="(v: number) => `$${(v / 1000).toFixed(1)}k`"
                  :bar-padding="0.3"
                  :radius="4"
                  :y-grid-line="true"
                  :hide-legend="false"
                  :legend-position="LegendPosition.Top"
                />
              </div>
              <div v-else class="h-[200px] flex items-center justify-center text-muted">
                No data available
              </div>
            </div>
          </UCard>

          <!-- Category Breakdown -->
          <UCard>
            <div class="space-y-4">
              <div>
                <h2 class="text-lg font-semibold">Expense Categories</h2>
                <p class="text-sm text-muted">Breakdown by category</p>
              </div>
              <div v-if="categoryChartData.length > 0" class="flex flex-col items-center">
                <DonutChart
                  :data="categoryChartData.map((d) => d.value)"
                  :height="160"
                  :arc-width="20"
                  :categories="categoryChartCategories"
                  :pad-angle="0.05"
                  :hide-legend="true"
                  :radius="70"
                >
                  <div class="text-center">
                    <div class="text-xs text-muted">Total</div>
                    <div class="text-lg font-bold">
                      {{ formatCurrency(categoryChartData.reduce((s, c) => s + c.value, 0)) }}
                    </div>
                  </div>
                </DonutChart>
                <div class="mt-4 w-full space-y-2">
                  <div
                    v-for="item in categoryChartData"
                    :key="item.name"
                    class="flex items-center gap-2 text-sm"
                  >
                    <span
                      class="w-3 h-3 rounded-full"
                      :style="{ backgroundColor: item.color }"
                    />
                    <span class="flex-1">{{ item.name }}</span>
                    <span class="text-muted">{{ formatCurrency(item.value) }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="h-[200px] flex items-center justify-center text-muted">
                No expense data
              </div>
            </div>
          </UCard>
        </div>

        <!-- Transactions Table -->
        <UCard>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-semibold">Recent Transactions</h2>
                <p class="text-sm text-muted">View and manage your transactions</p>
              </div>
              <div class="flex items-center gap-2">
                <UButtonGroup>
                  <UButton
                    v-for="opt in filterOptions"
                    :key="opt.label"
                    :label="opt.label"
                    :variant="typeFilter === opt.value ? 'solid' : 'outline'"
                    size="sm"
                    @click="typeFilter = opt.value"
                  />
                </UButtonGroup>
              </div>
            </div>

            <UTable
              :data="transactions"
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
                :total="totalPages * 10"
                :items-per-page="10"
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
        <TransactionForm
          :transaction="editingTransaction"
          :categories="categories ?? []"
          @save="handleSave"
          @cancel="isModalOpen = false"
        />
      </template>
    </UModal>
  </UDashboardPanel>
</template>
