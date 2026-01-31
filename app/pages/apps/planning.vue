<script lang="ts" setup>
import type { SwissCanton, TaxOptimizationTip } from "~/types";

// User inputs (reactive)
const salary = ref(80000);
const canton = ref<SwissCanton>("ZH");
const monthlyExpenses = ref(4500);
const savingsRate = ref(25);
const pillar3a = ref(7056);
const age = ref(30);
const portfolioValue = ref(50000);

// Planning params
const params = computed(() => ({
  salary: salary.value,
  canton: canton.value,
  expenses: monthlyExpenses.value,
  savingsRate: savingsRate.value,
  pillar3a: pillar3a.value,
  age: age.value,
  portfolio: portfolioValue.value,
}));

const { data: planning, status } = usePlanning(params);

// Format helpers
const formatCHF = (amount: number) => {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatPercent = (percent: number) => {
  return `${percent.toFixed(1)}%`;
};

// Canton options
const cantonOptions = [
  { label: "Zürich (ZH)", value: "ZH" },
  { label: "Bern (BE)", value: "BE" },
  { label: "Zug (ZG)", value: "ZG" },
  { label: "Geneva (GE)", value: "GE" },
  { label: "Basel-Stadt (BS)", value: "BS" },
  { label: "Vaud (VD)", value: "VD" },
  { label: "Lucerne (LU)", value: "LU" },
  { label: "St. Gallen (SG)", value: "SG" },
  { label: "Aargau (AG)", value: "AG" },
  { label: "Schwyz (SZ)", value: "SZ" },
];

// Priority colors for tips
const priorityConfig = {
  high: { color: "error", icon: "i-lucide-alert-circle" },
  medium: { color: "warning", icon: "i-lucide-alert-triangle" },
  low: { color: "info", icon: "i-lucide-info" },
};

// Chart data for projections
const projectionChartData = computed(() => {
  if (!planning.value?.projections) return [];
  return planning.value.projections.filter((_, i) => i % 5 === 0).map((p) => ({
    year: p.year.toString(),
    portfolio: p.portfolioValue,
    pillar2: p.pillar2Value,
    pillar3a: p.pillar3aValue,
    netWorth: p.netWorth,
  }));
});

const projectionCategories = {
  portfolio: { name: "Investment Portfolio", color: "var(--color-primary-500)" },
  pillar2: { name: "Pillar 2 (BVG)", color: "var(--color-emerald-500)" },
  pillar3a: { name: "Pillar 3a", color: "var(--color-violet-500)" },
};

// Expand/collapse tips
const expandedTips = ref<Set<string>>(new Set());
const toggleTip = (id: string) => {
  if (expandedTips.value.has(id)) {
    expandedTips.value.delete(id);
  } else {
    expandedTips.value.add(id);
  }
};

// Tax breakdown for chart
const taxBreakdownData = computed(() => {
  if (!planning.value?.taxEstimate) return [];
  const tax = planning.value.taxEstimate;
  return [
    { name: "Federal", value: tax.federalTax, color: "#ef4444" },
    { name: "Cantonal", value: tax.cantonalTax, color: "#f97316" },
    { name: "Communal", value: tax.communalTax, color: "#eab308" },
  ].filter((t) => t.value > 0);
});

const taxCategories = computed(() => {
  return Object.fromEntries(
    taxBreakdownData.value.map((item) => [
      item.name,
      { name: item.name, color: item.color },
    ])
  );
});

// Goals progress
const goalsWithProgress = computed(() => {
  if (!planning.value?.goals) return [];
  return planning.value.goals.map((goal) => ({
    ...goal,
    progress: Math.min(100, (goal.currentAmount / goal.targetAmount) * 100),
  }));
});

const goalCategoryConfig: Record<string, { icon: string; color: string }> = {
  emergency: { icon: "i-lucide-shield", color: "warning" },
  house: { icon: "i-lucide-home", color: "primary" },
  retirement: { icon: "i-lucide-sunset", color: "success" },
  education: { icon: "i-lucide-graduation-cap", color: "info" },
  other: { icon: "i-lucide-target", color: "neutral" },
};
</script>

<template>
  <UDashboardPanel id="planning">
    <template #header>
      <UDashboardNavbar title="Financial Planning" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UBadge color="primary" variant="soft" icon="i-lucide-flag">
            Australian in Switzerland
          </UBadge>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="space-y-6">
        <!-- Input Section -->
        <UCard>
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-sliders" class="size-5 text-primary" />
              <h2 class="text-lg font-semibold">Your Financial Profile</h2>
            </div>
            <div class="grid grid-cols-4 gap-4">
              <UFormField label="Annual Salary (CHF)">
                <UInput v-model.number="salary" type="number" :step="1000" />
              </UFormField>
              <UFormField label="Canton">
                <USelectMenu
                  v-model="canton"
                  :items="cantonOptions"
                  value-key="value"
                />
              </UFormField>
              <UFormField label="Monthly Expenses (CHF)">
                <UInput v-model.number="monthlyExpenses" type="number" :step="100" />
              </UFormField>
              <UFormField label="Savings Rate (%)">
                <UInput v-model.number="savingsRate" type="number" min="0" max="100" />
              </UFormField>
              <UFormField label="Pillar 3a Contribution">
                <UInput v-model.number="pillar3a" type="number" :max="7056" />
              </UFormField>
              <UFormField label="Current Age">
                <UInput v-model.number="age" type="number" min="18" max="65" />
              </UFormField>
              <UFormField label="Current Portfolio Value">
                <UInput v-model.number="portfolioValue" type="number" :step="1000" />
              </UFormField>
            </div>
          </div>
        </UCard>

        <!-- Summary Cards -->
        <div class="grid grid-cols-4 gap-6">
          <UCard>
            <div class="space-y-2">
              <h3 class="text-sm text-muted">Monthly Net Income</h3>
              <div class="text-2xl font-semibold">
                {{ formatCHF(planning?.monthlyNetIncome ?? 0) }}
              </div>
              <div class="text-sm text-muted">
                After tax & Pillar 2
              </div>
            </div>
          </UCard>
          <UCard>
            <div class="space-y-2">
              <h3 class="text-sm text-muted">Monthly Savings</h3>
              <div class="text-2xl font-semibold text-green-600">
                {{ formatCHF(planning?.monthlySavings ?? 0) }}
              </div>
              <div class="text-sm text-muted">
                {{ savingsRate }}% savings rate
              </div>
            </div>
          </UCard>
          <UCard>
            <div class="space-y-2">
              <h3 class="text-sm text-muted">FIRE Number</h3>
              <div class="text-2xl font-semibold">
                {{ formatCHF(planning?.fireNumber ?? 0) }}
              </div>
              <div class="text-sm text-muted">
                25x annual expenses
              </div>
            </div>
          </UCard>
          <UCard>
            <div class="space-y-2">
              <h3 class="text-sm text-muted">Years to FIRE</h3>
              <div class="text-2xl font-semibold text-primary">
                {{ planning?.yearsToFire ?? 0 }} years
              </div>
              <div class="text-sm text-muted">
                Target age: {{ age + (planning?.yearsToFire ?? 0) }}
              </div>
            </div>
          </UCard>
        </div>

        <!-- Tax & Projections Row -->
        <div class="grid grid-cols-3 gap-6">
          <!-- Swiss Tax Breakdown -->
          <UCard>
            <div class="space-y-4">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-receipt-swiss-franc" class="size-5 text-primary" />
                <div>
                  <h2 class="text-lg font-semibold">Swiss Tax Estimate</h2>
                  <p class="text-sm text-muted">{{ canton }} canton, {{ new Date().getFullYear() }}</p>
                </div>
              </div>

              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-sm">Federal Tax</span>
                  <span class="font-medium">{{ formatCHF(planning?.taxEstimate.federalTax ?? 0) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm">Cantonal Tax</span>
                  <span class="font-medium">{{ formatCHF(planning?.taxEstimate.cantonalTax ?? 0) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm">Communal Tax</span>
                  <span class="font-medium">{{ formatCHF(planning?.taxEstimate.communalTax ?? 0) }}</span>
                </div>
                <USeparator />
                <div class="flex justify-between items-center">
                  <span class="font-semibold">Total Annual Tax</span>
                  <span class="font-bold text-lg">{{ formatCHF(planning?.taxEstimate.totalTax ?? 0) }}</span>
                </div>
                <div class="flex justify-between items-center text-sm text-muted">
                  <span>Effective Tax Rate</span>
                  <span>{{ formatPercent(planning?.taxEstimate.effectiveTaxRate ?? 0) }}</span>
                </div>
              </div>

              <div class="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <div class="flex items-start gap-2">
                  <UIcon name="i-lucide-check-circle" class="size-5 text-green-600 mt-0.5" />
                  <div class="text-sm">
                    <span class="font-medium text-green-700 dark:text-green-400">No Capital Gains Tax!</span>
                    <p class="text-green-600 dark:text-green-500 mt-1">
                      Switzerland doesn't tax capital gains on private investments. Your stock profits are tax-free.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Wealth Projection Chart -->
          <UCard class="col-span-2">
            <div class="space-y-4">
              <div>
                <h2 class="text-lg font-semibold">Wealth Projection</h2>
                <p class="text-sm text-muted">30-year forecast at 7% return</p>
              </div>
              <div v-if="projectionChartData.length > 0">
                <AreaChart
                  :data="projectionChartData"
                  :height="220"
                  :categories="projectionCategories"
                  :y-axis="['portfolio', 'pillar2', 'pillar3a']"
                  :x-formatter="(i: number) => projectionChartData[i]?.year || ''"
                  :y-formatter="(v: number) => `${(v / 1000000).toFixed(1)}M`"
                  :y-grid-line="true"
                  :hide-legend="false"
                  :legend-position="LegendPosition.Top"
                  :gradient="true"
                />
              </div>
              <div class="grid grid-cols-3 gap-4 pt-2">
                <div class="text-center p-2 bg-elevated rounded-lg">
                  <div class="text-xs text-muted">In 10 years</div>
                  <div class="font-semibold">{{ formatCHF(planning?.projections[10]?.netWorth ?? 0) }}</div>
                </div>
                <div class="text-center p-2 bg-elevated rounded-lg">
                  <div class="text-xs text-muted">In 20 years</div>
                  <div class="font-semibold">{{ formatCHF(planning?.projections[20]?.netWorth ?? 0) }}</div>
                </div>
                <div class="text-center p-2 bg-elevated rounded-lg">
                  <div class="text-xs text-muted">In 30 years</div>
                  <div class="font-semibold">{{ formatCHF(planning?.projections[30]?.netWorth ?? 0) }}</div>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Tax Optimization Tips -->
        <UCard>
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-lightbulb" class="size-5 text-yellow-500" />
              <h2 class="text-lg font-semibold">Tax Optimization Tips for Expats</h2>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div
                v-for="tip in planning?.optimizationTips ?? []"
                :key="tip.id"
                class="border border-default rounded-lg overflow-hidden"
              >
                <button
                  class="w-full p-4 text-left hover:bg-elevated/50 transition-colors"
                  @click="toggleTip(tip.id)"
                >
                  <div class="flex items-start gap-3">
                    <UBadge
                      :color="priorityConfig[tip.priority].color"
                      variant="soft"
                      :icon="priorityConfig[tip.priority].icon"
                      class="mt-0.5"
                    >
                      {{ tip.priority }}
                    </UBadge>
                    <div class="flex-1">
                      <div class="flex items-center justify-between">
                        <h3 class="font-medium">{{ tip.title }}</h3>
                        <div class="flex items-center gap-2">
                          <span v-if="tip.potentialSavings" class="text-sm text-green-600 font-medium">
                            Save {{ formatCHF(tip.potentialSavings) }}/yr
                          </span>
                          <UIcon
                            :name="expandedTips.has(tip.id) ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                            class="size-4 text-muted"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
                <div
                  v-if="expandedTips.has(tip.id)"
                  class="px-4 pb-4 pt-0"
                >
                  <p class="text-sm text-muted ml-[68px]">
                    {{ tip.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Financial Goals -->
        <UCard>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-target" class="size-5 text-primary" />
                <h2 class="text-lg font-semibold">Financial Goals</h2>
              </div>
              <UButton label="Add Goal" icon="i-lucide-plus" variant="outline" size="sm" />
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div
                v-for="goal in goalsWithProgress"
                :key="goal.id"
                class="p-4 border border-default rounded-lg space-y-3"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-lg flex items-center justify-center"
                    :class="`bg-${goalCategoryConfig[goal.category]?.color || 'primary'}-100 dark:bg-${goalCategoryConfig[goal.category]?.color || 'primary'}-900`"
                  >
                    <UIcon
                      :name="goalCategoryConfig[goal.category]?.icon || 'i-lucide-target'"
                      class="size-5"
                      :class="`text-${goalCategoryConfig[goal.category]?.color || 'primary'}-600`"
                    />
                  </div>
                  <div>
                    <h3 class="font-medium">{{ goal.name }}</h3>
                    <p class="text-xs text-muted">
                      Target: {{ new Date(goal.targetDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) }}
                    </p>
                  </div>
                </div>

                <div class="space-y-1">
                  <div class="flex justify-between text-sm">
                    <span>{{ formatCHF(goal.currentAmount) }}</span>
                    <span class="text-muted">{{ formatCHF(goal.targetAmount) }}</span>
                  </div>
                  <div class="h-2 bg-elevated rounded-full overflow-hidden">
                    <div
                      class="h-full bg-primary rounded-full transition-all"
                      :style="{ width: `${goal.progress}%` }"
                    />
                  </div>
                  <div class="text-xs text-muted text-right">
                    {{ goal.progress.toFixed(0) }}% complete
                  </div>
                </div>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Australian Expat Notice -->
        <UCard class="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/50">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span class="text-2xl">🇦🇺</span>
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-blue-900 dark:text-blue-100">Australian Expat Considerations</h3>
              <div class="mt-2 text-sm text-blue-800 dark:text-blue-200 space-y-2">
                <p>
                  <strong>Tax Residency:</strong> Ensure you've established non-residency with the ATO. You may still need to lodge returns if you have Australian-sourced income.
                </p>
                <p>
                  <strong>Superannuation:</strong> Your Australian super continues to grow. Consider consolidating funds and reviewing investment options. You can't access it until preservation age (60+).
                </p>
                <p>
                  <strong>Double Taxation Agreement:</strong> Australia and Switzerland have a DTA preventing double taxation. Keep records of all Swiss taxes paid for potential credits.
                </p>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
