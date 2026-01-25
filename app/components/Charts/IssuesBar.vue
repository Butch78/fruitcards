<script setup lang="ts">
interface LinearTaskData {
  month: string;
  bugs: number;
}

const chartData = ref<LinearTaskData[]>([
  { month: formatDate(new Date("2025-01-01")), bugs: 42 },
  { month: formatDate(new Date("2025-02-01")), bugs: 37 },
  { month: formatDate(new Date("2025-03-01")), bugs: 55 },
  { month: formatDate(new Date("2025-04-01")), bugs: 61 },
  { month: formatDate(new Date("2025-05-01")), bugs: 48 },
  { month: formatDate(new Date("2025-06-01")), bugs: 53 },
  { month: formatDate(new Date("2025-07-01")), bugs: 67 },
  { month: formatDate(new Date("2025-08-01")), bugs: 59 },
  { month: formatDate(new Date("2025-09-01")), bugs: 44 },
  { month: formatDate(new Date("2025-10-01")), bugs: 62 },
  { month: formatDate(new Date("2025-11-01")), bugs: 50 },
  { month: formatDate(new Date("2025-12-01")), bugs: 39 },
]);

const categories: Record<string, BulletLegendItemInterface> = {
  bugs: { name: "Bugs", color: "var(--ui-color-error-500)" },
};

const formatTasks = (tick: number) => {
  return `${tick} tasks`;
};

const { height } = useResponsiveHeight({
  default: 120,
  sm: 340,
});

function formatDate(dateString: Date) {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
  };
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", options).format(date);
}
</script>

<template>
  <BarChart
    :data="chartData"
    :height="height"
    :categories="categories"
    :y-axis="['bugs']"
    :y-num-ticks="2"
    :curve-type="CurveType.Basis"
    :legend-position="LegendPosition.Top"
    :x-formatter="(i: number) => `${chartData[i]?.month}`"
    :group-padding="0.9"
    :y-formatter="formatTasks"
  />
</template>
