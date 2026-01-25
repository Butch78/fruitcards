<script setup lang="ts">

type IssueTypeDataItem = {
  week: string;
  bug: number;
  feature: number;
  chore: number;
  error: number;
};

const IssueTypeData: IssueTypeDataItem[] = [
  { week: "Week 1", bug: 10, feature: 5, chore: 2, error: 1 },
  { week: "Week 2", bug: 12, feature: 7, chore: 3, error: 2 },
  { week: "Week 3", bug: 8, feature: 6, chore: 4, error: 0 },
  { week: "Week 4", bug: 15, feature: 8, chore: 5, error: 3 },
  { week: "Week 5", bug: 9, feature: 10, chore: 3, error: 1 },
  { week: "Week 6", bug: 14, feature: 9, chore: 6, error: 2 },
  { week: "Week 7", bug: 11, feature: 12, chore: 4, error: 1 },
  { week: "Week 8", bug: 13, feature: 11, chore: 5, error: 2 },
  { week: "Week 9", bug: 10, feature: 13, chore: 6, error: 0 },
  { week: "Week 10", bug: 12, feature: 14, chore: 7, error: 3 },
];

const IssueTypeCategories = {
  bug: { name: "Bug", color: "var(--color-sky-500)" },
  feature: { name: "Feature", color: "var(--color-indigo-500)" },
  chore: { name: "Chore", color: "var(--color-green-500)" },
  error: { name: "Error", color: "var(--color-red-500)" },
};

const xFormatter = (i: number): string => IssueTypeData[i]?.week ?? '';
const yFormatter = (i: number) => i.toString();

const { height } = useResponsiveHeight({
  default: 120,
  sm: 340,
});
</script>
<template>
  <BarChart
    :data="IssueTypeData"
    :stacked="true"
    :height="height"
    :categories="IssueTypeCategories"
    :y-axis="['bug', 'feature', 'chore', 'error']"
    :group-padding="0"
    :bar-padding="0.9"
    :radius="4"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :legend-position="LegendPosition.Top"
    :y-num-ticks="5"
    :hide-legend="false"
    :y-grid-line="true"
  />
</template>
