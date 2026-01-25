<script setup lang="ts">
const chartData = ref([
  { date: "1", current: 1100, last_year: 1050 },
  { date: "2", current: 1150, last_year: 1080 },
  { date: "3", current: 1120, last_year: 1100 },
  { date: "4", current: 1180, last_year: 1120 },
  { date: "5", current: 1200, last_year: 1150 },
  { date: "6", current: 1170, last_year: 1130 },
  { date: "7", current: 1210, last_year: 1160 },
  { date: "8", current: 1230, last_year: 1180 },
  { date: "9", current: 1250, last_year: 1200 },
  { date: "10", current: 1220, last_year: 1190 },
  { date: "11", current: 1280, last_year: 1210 },
  { date: "12", current: 1300, last_year: 1230 },
  { date: "13", current: 1270, last_year: 1220 },
  { date: "14", current: 1320, last_year: 1250 },
]);

const categories: Record<string, BulletLegendItemInterface> = {
  current: { name: "June 2025", color: "var(--ui-primary)" },
  last_year: { name: "June 2024", color: "var(--color-warning-500)" },
};

const xFormatter = (i: number): string => `${chartData.value[i]?.date}`;
const yFormatter = (value: number): string => `$${(value / 1000).toFixed(1)}k`;
</script>
<template>
  <LineChart
    :data="chartData"
    :height="180"
    :x-num-ticks="4"
    :y-num-ticks="3.5"
    :categories="categories"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :curve-type="CurveType.Linear"
    :legend-position="LegendPosition.Top"
    :y-grid-line="true"
    :hide-x-axis="true"
    :hide-legend="true"
  />
</template>