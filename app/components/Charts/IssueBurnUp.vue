<script setup lang="ts">

interface IssueBurnUpItem {
  date: string;
  open: number;
  inProgress: number;
  done: number;
}

const categories = computed(() => ({
  open: {
    name: "Open",
    color: "#51a2ff", 
  },
  inProgress: {
    name: "In Progress",
    color: "#2b7fff", 
  },
  done: {
    name: "Done",
    color: "#7c86ff", 
  },
}));

const AreaChartData: IssueBurnUpItem[] = [
  { date: "2023-01-01", open: 8, inProgress: 7, done: 2 },
  { date: "2023-01-31", open: 14, inProgress: 7, done: 9 },
  { date: "2023-03-02", open: 9, inProgress: 12, done: 21 },
  { date: "2023-04-01", open: 8, inProgress: 14, done: 34 },
  { date: "2023-05-01", open: 5, inProgress: 14, done: 46 },
  { date: "2023-05-31", open: 10, inProgress: 20, done: 57 },
  { date: "2023-06-30", open: 9, inProgress: 24, done: 61 },
  { date: "2023-07-30", open: 6, inProgress: 24, done: 73 },
  { date: "2023-08-29", open: 11, inProgress: 27, done: 76 },
  { date: "2023-09-28", open: 6, inProgress: 32, done: 90 },
  { date: "2023-10-28", open: 15, inProgress: 33, done: 99 },
  { date: "2023-11-27", open: 13, inProgress: 41, done: 106 },
  { date: "2023-12-27", open: 17, inProgress: 49, done: 113 },
  { date: "2024-01-26", open: 24, inProgress: 57, done: 115 },
  { date: "2024-02-25", open: 23, inProgress: 54, done: 124 },
  { date: "2024-03-26", open: 19, inProgress: 60, done: 127 },
  { date: "2024-04-25", open: 27, inProgress: 59, done: 136 },
  { date: "2024-05-25", open: 24, inProgress: 59, done: 136 },
  { date: "2024-06-24", open: 19, inProgress: 58, done: 144 },
  { date: "2024-07-24", open: 29, inProgress: 57, done: 145 },
  { date: "2024-08-23", open: 34, inProgress: 58, done: 148 },
  { date: "2024-09-22", open: 37, inProgress: 60, done: 153 },
  { date: "2024-10-22", open: 46, inProgress: 60, done: 166 },
  { date: "2024-11-21", open: 55, inProgress: 65, done: 178 },
];

const xFormatter = (tick: number, _i?: number, _ticks?: number[]): string => {
  let dateStr = '';
  if (typeof tick === "number" && AreaChartData[tick]?.date) {
    dateStr = AreaChartData[tick].date;
  } else if (typeof tick === "string") {
    dateStr = tick;
  }
  if (dateStr) {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleString('default', { month: 'short' });
    }
    return dateStr;
  }
  return String(tick);
};

const { height } = useResponsiveHeight({
  default: 120,
  sm: 240,
});
</script>

<template>
  <AreaChart
    :data="AreaChartData"
    :height="height"
    :categories="categories"
    :y-grid-line="true"
    :x-formatter="xFormatter"
    :curve-type="CurveType.Basis"
    :y-num-ticks="4"
    :legend-position="LegendPosition.Top"
  />
</template>
