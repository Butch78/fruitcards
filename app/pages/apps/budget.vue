<script lang="ts" setup>
import type { BudgetCategory, BudgetItem, BudgetCategoryType } from "~/types";
import { typicalSwissExpenses, categoryConfig } from "~/data/budget";

// User inputs
const monthlyIncome = ref(5200);

// Budget params
const params = computed(() => ({
  income: monthlyIncome.value,
}));

const { data: budget, status } = useBudget(params);

// State
const isAddExpenseOpen = ref(false);
const selectedCategory = ref<BudgetCategory | null>(null);
const showTypicalExpenses = ref(false);

// New expense form
const newExpense = reactive({
  name: "",
  amount: 0,
  category: "other" as BudgetCategoryType,
  isRecurring: true,
  dueDate: 1,
});

// Format helpers
const formatCHF = (amount: number) => {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Category progress
const getCategoryProgress = (category: BudgetCategory) => {
  if (category.budgeted === 0) return 0;
  return Math.min(100, (category.spent / category.budgeted) * 100);
};

const getCategoryStatus = (category: BudgetCategory) => {
  const progress = getCategoryProgress(category);
  if (progress >= 100) return "error";
  if (progress >= 80) return "warning";
  return "success";
};

// Grouped items by category
const itemsByCategory = computed(() => {
  if (!budget.value?.items) return new Map<string, BudgetItem[]>();
  const map = new Map<string, BudgetItem[]>();
  budget.value.items.forEach((item) => {
    const existing = map.get(item.categoryId) || [];
    existing.push(item);
    map.set(item.categoryId, existing);
  });
  return map;
});

// Category options for form
const categoryOptions = Object.entries(categoryConfig).map(([value, config]) => ({
  label: config.label,
  value,
  icon: config.icon,
}));

// Typical expenses grouped by category
const typicalExpensesByCategory = computed(() => {
  const grouped = new Map<BudgetCategoryType, typeof typicalSwissExpenses>();
  typicalSwissExpenses.forEach((expense) => {
    const existing = grouped.get(expense.category) || [];
    existing.push(expense);
    grouped.set(expense.category, existing);
  });
  return grouped;
});

// Add typical expense
const addTypicalExpense = (expense: typeof typicalSwissExpenses[0]) => {
  newExpense.name = expense.name;
  newExpense.amount = expense.amount;
  newExpense.category = expense.category;
  newExpense.isRecurring = expense.isFixed;
  showTypicalExpenses.value = false;
  isAddExpenseOpen.value = true;
};

// Handle form submit
const handleAddExpense = () => {
  // In production, this would call the API
  console.log("Adding expense:", newExpense);
  isAddExpenseOpen.value = false;
  // Reset form
  newExpense.name = "";
  newExpense.amount = 0;
  newExpense.category = "other";
  newExpense.isRecurring = true;
  newExpense.dueDate = 1;
};

// Chart data for spending breakdown
const spendingChartData = computed(() => {
  if (!budget.value?.categories) return [];
  return budget.value.categories
    .filter((c) => c.type !== "savings" && c.spent > 0)
    .map((c) => ({
      name: c.name,
      value: c.spent,
      color: c.color,
    }));
});

const spendingCategories = computed(() => {
  return Object.fromEntries(
    spendingChartData.value.map((item) => [
      item.name,
      { name: item.name, color: item.color },
    ])
  );
});

// Fixed vs Variable breakdown
const fixedVsVariable = computed(() => {
  if (!budget.value) return [];
  return [
    { name: "Fixed", value: budget.value.fixedExpenses, color: "#3b82f6" },
    { name: "Variable", value: budget.value.variableExpenses, color: "#22c55e" },
  ];
});
</script>

<template>
  <UDashboardPanel id="budget">
    <template #header>
      <UDashboardNavbar title="Monthly Budget" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            label="Typical Swiss Expenses"
            icon="i-lucide-list-plus"
            variant="outline"
            @click="showTypicalExpenses = true"
          />
          <UButton
            label="Add Expense"
            icon="i-lucide-plus"
            @click="isAddExpenseOpen = true"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="space-y-6">
        <!-- Income Input -->
        <UCard>
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-wallet" class="size-5 text-primary" />
              <span class="font-medium">Monthly Net Income</span>
            </div>
            <UInput
              v-model.number="monthlyIncome"
              type="number"
              class="w-40"
              :step="100"
            >
              <template #leading>
                <span class="text-muted">CHF</span>
              </template>
            </UInput>
            <span class="text-sm text-muted">
              (After tax & Pillar 2 deductions)
            </span>
          </div>
        </UCard>

        <!-- Summary Cards -->
        <div class="grid grid-cols-5 gap-4">
          <UCard>
            <div class="space-y-1">
              <h3 class="text-xs text-muted uppercase">Total Budgeted</h3>
              <div class="text-xl font-semibold">
                {{ formatCHF(budget?.totalBudgeted ?? 0) }}
              </div>
            </div>
          </UCard>
          <UCard>
            <div class="space-y-1">
              <h3 class="text-xs text-muted uppercase">Total Spent</h3>
              <div class="text-xl font-semibold text-red-600">
                {{ formatCHF(budget?.totalSpent ?? 0) }}
              </div>
            </div>
          </UCard>
          <UCard>
            <div class="space-y-1">
              <h3 class="text-xs text-muted uppercase">Remaining</h3>
              <div
                class="text-xl font-semibold"
                :class="(budget?.totalRemaining ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ formatCHF(budget?.totalRemaining ?? 0) }}
              </div>
            </div>
          </UCard>
          <UCard>
            <div class="space-y-1">
              <h3 class="text-xs text-muted uppercase">Fixed Expenses</h3>
              <div class="text-xl font-semibold">
                {{ formatCHF(budget?.fixedExpenses ?? 0) }}
              </div>
            </div>
          </UCard>
          <UCard>
            <div class="space-y-1">
              <h3 class="text-xs text-muted uppercase">Savings Rate</h3>
              <div class="text-xl font-semibold text-green-600">
                {{ monthlyIncome > 0 ? ((budget?.actualSavings ?? 0) / monthlyIncome * 100).toFixed(0) : 0 }}%
              </div>
            </div>
          </UCard>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-3 gap-6">
          <!-- Spending Breakdown -->
          <UCard>
            <div class="space-y-4">
              <div>
                <h2 class="text-lg font-semibold">Spending Breakdown</h2>
                <p class="text-sm text-muted">Excluding savings</p>
              </div>
              <div v-if="spendingChartData.length > 0" class="flex flex-col items-center">
                <DonutChart
                  :data="spendingChartData.map((d) => d.value)"
                  :height="150"
                  :arc-width="25"
                  :categories="spendingCategories"
                  :pad-angle="0.03"
                  :hide-legend="true"
                  :radius="65"
                >
                  <div class="text-center">
                    <div class="text-xs text-muted">Spent</div>
                    <div class="text-lg font-bold">
                      {{ formatCHF((budget?.totalSpent ?? 0) - (budget?.actualSavings ?? 0)) }}
                    </div>
                  </div>
                </DonutChart>
              </div>
            </div>
          </UCard>

          <!-- Fixed vs Variable -->
          <UCard>
            <div class="space-y-4">
              <div>
                <h2 class="text-lg font-semibold">Fixed vs Variable</h2>
                <p class="text-sm text-muted">Expense flexibility</p>
              </div>
              <div class="space-y-4 pt-4">
                <div
                  v-for="item in fixedVsVariable"
                  :key="item.name"
                  class="space-y-2"
                >
                  <div class="flex justify-between text-sm">
                    <span class="flex items-center gap-2">
                      <span
                        class="w-3 h-3 rounded-full"
                        :style="{ backgroundColor: item.color }"
                      />
                      {{ item.name }}
                    </span>
                    <span class="font-medium">{{ formatCHF(item.value) }}</span>
                  </div>
                  <div class="h-3 bg-elevated rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all"
                      :style="{
                        width: `${(item.value / (budget?.totalBudgeted ?? 1)) * 100}%`,
                        backgroundColor: item.color,
                      }"
                    />
                  </div>
                </div>
              </div>
              <div class="pt-2 text-sm text-muted">
                <p>
                  <strong>Fixed:</strong> Rent, insurance, subscriptions
                </p>
                <p>
                  <strong>Variable:</strong> Groceries, dining, entertainment
                </p>
              </div>
            </div>
          </UCard>

          <!-- Budget Health -->
          <UCard>
            <div class="space-y-4">
              <div>
                <h2 class="text-lg font-semibold">Budget Health</h2>
                <p class="text-sm text-muted">This month's status</p>
              </div>
              <div class="space-y-3">
                <div class="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-check-circle" class="size-5 text-green-600" />
                    <span class="text-sm font-medium text-green-700 dark:text-green-400">On Track</span>
                  </div>
                  <span class="text-sm text-green-600">
                    {{ budget?.categories.filter((c) => getCategoryProgress(c) < 80).length ?? 0 }} categories
                  </span>
                </div>
                <div class="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-alert-triangle" class="size-5 text-yellow-600" />
                    <span class="text-sm font-medium text-yellow-700 dark:text-yellow-400">Near Limit</span>
                  </div>
                  <span class="text-sm text-yellow-600">
                    {{ budget?.categories.filter((c) => getCategoryProgress(c) >= 80 && getCategoryProgress(c) < 100).length ?? 0 }} categories
                  </span>
                </div>
                <div class="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-alert-circle" class="size-5 text-red-600" />
                    <span class="text-sm font-medium text-red-700 dark:text-red-400">Over Budget</span>
                  </div>
                  <span class="text-sm text-red-600">
                    {{ budget?.categories.filter((c) => getCategoryProgress(c) >= 100).length ?? 0 }} categories
                  </span>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Category Breakdown -->
        <UCard>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-semibold">Budget Categories</h2>
                <p class="text-sm text-muted">Track spending by category</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div
                v-for="category in budget?.categories ?? []"
                :key="category.id"
                class="p-4 border border-default rounded-lg hover:bg-elevated/30 transition-colors cursor-pointer"
                @click="selectedCategory = selectedCategory?.id === category.id ? null : category"
              >
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-lg flex items-center justify-center"
                      :style="{ backgroundColor: `${category.color}20` }"
                    >
                      <UIcon
                        :name="category.icon"
                        class="size-5"
                        :style="{ color: category.color }"
                      />
                    </div>
                    <div>
                      <h3 class="font-medium">{{ category.name }}</h3>
                      <div class="flex items-center gap-2">
                        <UBadge
                          v-if="category.isFixed"
                          variant="outline"
                          color="neutral"
                          size="xs"
                        >
                          Fixed
                        </UBadge>
                        <span class="text-xs text-muted">{{ category.notes }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-semibold">{{ formatCHF(category.spent) }}</div>
                    <div class="text-xs text-muted">of {{ formatCHF(category.budgeted) }}</div>
                  </div>
                </div>

                <div class="space-y-1">
                  <div class="h-2 bg-elevated rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all"
                      :class="{
                        'bg-green-500': getCategoryStatus(category) === 'success',
                        'bg-yellow-500': getCategoryStatus(category) === 'warning',
                        'bg-red-500': getCategoryStatus(category) === 'error',
                      }"
                      :style="{ width: `${getCategoryProgress(category)}%` }"
                    />
                  </div>
                  <div class="flex justify-between text-xs text-muted">
                    <span>{{ getCategoryProgress(category).toFixed(0) }}% used</span>
                    <span>{{ formatCHF(category.budgeted - category.spent) }} left</span>
                  </div>
                </div>

                <!-- Expanded items -->
                <div
                  v-if="selectedCategory?.id === category.id"
                  class="mt-4 pt-4 border-t border-default space-y-2"
                >
                  <div
                    v-for="item in itemsByCategory.get(category.id) ?? []"
                    :key="item.id"
                    class="flex items-center justify-between text-sm"
                  >
                    <div class="flex items-center gap-2">
                      <UIcon
                        v-if="item.isPaid"
                        name="i-lucide-check"
                        class="size-4 text-green-600"
                      />
                      <UIcon
                        v-else
                        name="i-lucide-clock"
                        class="size-4 text-yellow-600"
                      />
                      <span>{{ item.name }}</span>
                      <UBadge v-if="item.isRecurring" variant="soft" size="xs" color="info">
                        Recurring
                      </UBadge>
                    </div>
                    <span class="font-medium">{{ formatCHF(item.amount) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </template>

    <!-- Add Expense Modal -->
    <UModal v-model:open="isAddExpenseOpen">
      <template #content>
        <UCard class="w-full max-w-md">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold">Add Expense</h2>
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="neutral"
                size="sm"
                @click="isAddExpenseOpen = false"
              />
            </div>
          </template>

          <form class="space-y-4" @submit.prevent="handleAddExpense">
            <UFormField label="Category">
              <USelectMenu
                v-model="newExpense.category"
                :items="categoryOptions"
                value-key="value"
              />
            </UFormField>

            <UFormField label="Name" required>
              <UInput v-model="newExpense.name" placeholder="e.g., Netflix" />
            </UFormField>

            <UFormField label="Amount (CHF)" required>
              <UInput
                v-model.number="newExpense.amount"
                type="number"
                min="0"
                step="1"
              />
            </UFormField>

            <div class="flex items-center gap-4">
              <UCheckbox v-model="newExpense.isRecurring" label="Recurring monthly" />
            </div>

            <UFormField v-if="newExpense.isRecurring" label="Due Date (Day of Month)">
              <UInput
                v-model.number="newExpense.dueDate"
                type="number"
                min="1"
                max="31"
              />
            </UFormField>
          </form>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton label="Cancel" variant="outline" color="neutral" @click="isAddExpenseOpen = false" />
              <UButton label="Add Expense" @click="handleAddExpense" />
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <!-- Typical Swiss Expenses Modal -->
    <UModal v-model:open="showTypicalExpenses">
      <template #content>
        <UCard class="w-full max-w-2xl max-h-[80vh] overflow-hidden">
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-semibold">Typical Swiss Expenses</h2>
                <p class="text-sm text-muted">Click to add to your budget</p>
              </div>
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="neutral"
                size="sm"
                @click="showTypicalExpenses = false"
              />
            </div>
          </template>

          <div class="space-y-6 max-h-[60vh] overflow-y-auto">
            <div
              v-for="[categoryType, expenses] in typicalExpensesByCategory"
              :key="categoryType"
              class="space-y-2"
            >
              <h3 class="font-medium flex items-center gap-2">
                <UIcon
                  :name="categoryConfig[categoryType].icon"
                  class="size-4"
                  :style="{ color: categoryConfig[categoryType].color }"
                />
                {{ categoryConfig[categoryType].label }}
              </h3>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="expense in expenses"
                  :key="expense.name"
                  class="flex items-center justify-between p-3 border border-default rounded-lg hover:bg-elevated transition-colors text-left"
                  @click="addTypicalExpense(expense)"
                >
                  <div>
                    <span class="font-medium">{{ expense.name }}</span>
                    <div class="flex items-center gap-2">
                      <UBadge
                        v-if="expense.isFixed"
                        variant="soft"
                        size="xs"
                        color="info"
                      >
                        Fixed
                      </UBadge>
                    </div>
                  </div>
                  <span class="font-semibold">{{ formatCHF(expense.amount) }}</span>
                </button>
              </div>
            </div>
          </div>
        </UCard>
      </template>
    </UModal>
  </UDashboardPanel>
</template>
