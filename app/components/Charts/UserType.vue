<script setup lang="ts">
const props = defineProps({
  timeRange: {
    type: String,
    default: "Last 7 Days",
  },
  dataType: {
    type: String,
    default: "all",
  },
});

const { data: UserTypeData, pending } = await useFetch(
  () => `/api/charts/users?timeRange=${props.timeRange}`,
  {
    watch: [() => props.timeRange, () => props.dataType],
  }
);

const filteredData = computed(() => {
  if (!UserTypeData.value) return [];
  let data = UserTypeData.value;
  if (props.dataType === "logs") {
    return data.map((d) => ({ ...d, newUsers: d.newUsers * 0.5, returningUsers: d.returningUsers * 0.5  }));
  } else if (props.dataType === "server") {
    return data.map((d) => ({ ...d, newUsers: d.newUsers * 0.2, returningUsers: d.returningUsers * 0.2  }));
  }
  return data;
});

const UserTypeCategories = {
  newUsers: { name: "New Users", color: "var(--color-teal-500)" },
  returningUsers: { name: "Returning Users", color: "var(--color-yellow-500)" },
};
const xFormatter = (i: number): string => `${filteredData.value[i]?.hour}`;
const yFormatter = (tick: number, i?: number, ticks?: number[]): string =>
  tick.toString();

const { height } = useResponsiveHeight({
  default: 120,
  sm: 200,
});
</script>
<template>
  <div v-if="pending" class="flex justify-center items-center h-full">
    <UIcon name="i-lucide-loader-2" class="animate-spin" />
  </div>
  <BarChart
    v-else
    :data="filteredData"
    :stacked="true"
    :height="height"
    :categories="UserTypeCategories"
    :y-axis="['newUsers', 'returningUsers']"
    :group-padding="0"
    :bar-padding="0.2"
    :x-num-ticks="6"
    :y-num-ticks="4"
    :radius="4"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :legend-position="LegendPosition.Bottom"
    :hide-legend="false"
    :y-grid-line="true"
  />
</template>
