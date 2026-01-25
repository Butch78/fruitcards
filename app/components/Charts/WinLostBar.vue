<script lang="ts" setup>
import type { TabsItem } from "@nuxt/ui";

interface DailyData {
  day: string;
  Income: number;
  Expense: number;
}

const items = ref<TabsItem[]>([
  {
    label: "Year",
  },
  {
    label: "Month",
  },
  {
    label: "Week",
  },
  {
    label: "Day",
  },
]);

const chartData = ref<DailyData[]>([
  { day: "Jan", Income: 8500, Expense: 4000 },
  { day: "Feb", Income: 6500, Expense: 9000 },
  { day: "Mar", Income: 7500, Expense: 3500 },
  { day: "Apr", Income: 5800, Expense: 7000 },
  { day: "May", Income: 9200, Expense: 6500 },
  { day: "Jun", Income: 9800, Expense: 4500 },
  { day: "Jul", Income: 5000, Expense: 8500 },
]);

const chartCategories: Record<string, BulletLegendItemInterface> = {
  Income: {
    name: "Income",
    color: "#10b981",
  },
  Expense: {
    name: "Expense",
    color: "#f59e0b",
  },
};

const xAxisFormatter = (tick: number): string => {
  // tick is the index of the data point
  const months = chartData.value.map((item) => item.day);
  return months[tick] || "";
};
</script>

<template>
  <div class="space-y-8">
    <BarChart
      :data="chartData"
      :categories="chartCategories"
      :y-axis="['Income', 'Expense']"
      :x-formatter="xAxisFormatter"
      :height="240"
      :stacked="false"
      :radius="3"
      :group-padding="0.2"
      :bar-padding="0.2"
      :hide-legend="true"
      :x-grid-line="true"
      :y-grid-line="true"
      :y-num-ticks="4"
    />
    <p class="text-center text-dimmed px-16 text-sm">
      Your win % is higher on <span class="text-primary">8%</span> compared to
      <span class="text-primary">47 winning</span> / <span>33 losing</span> past
      month
    </p>
  </div>
</template>
