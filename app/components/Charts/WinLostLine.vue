<script lang="ts" setup>
interface DailyData {
  day: string;
  Income: number;
  Expense: number;
}

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
  <LineChart
    :data="chartData"
    :categories="chartCategories"
    :y-axis="['Income', 'Expense']"
    :x-formatter="xAxisFormatter"
    :height="220"
    :stacked="false"
    :radius="3"
    :group-padding="0.2"
    :bar-padding="0.2"
    :x-grid-line="true"
    :y-grid-line="true"
    :y-num-ticks="4"
    :legend-position="LegendPosition.BottomCenter"
  />
</template>
