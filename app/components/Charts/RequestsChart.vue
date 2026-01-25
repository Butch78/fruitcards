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

const { data: requestsData, pending } = await useFetch(
  () => `/api/charts/requests?timeRange=${props.timeRange}`,
  {
    watch: [() => props.timeRange, () => props.dataType],
  }
);

const colorMode = useColorMode();

const filteredData = computed(() => {
  if (!requestsData.value) return [];
  const data = requestsData.value;
  if (props.dataType === "logs") {
    return data.map((d) => ({
      ...d,
      requests: d.requests * 0.5,
      errorRate: d.errorRate * 0.5,
    }));
  } else if (props.dataType === "server") {
    return data.map((d) => ({
      ...d,
      requests: d.requests * 0.2,
      errorRate: d.errorRate * 0.2,
    }));
  }
  return data;
});

const requestsCategories = computed(() => ({
  requests: {
    name: "Requests",
    color: "#22c55e",
  },
  errorRate: {
    name: "Error Rate (%)",
    color: "#ef4444",
  },
}));

const xFormatter = (tick: number): string =>
  `${filteredData.value[tick]?.time}`;
const yFormatter = (tick: number, _i?: number, _ticks?: number[]) =>
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
  <AreaChart
    v-else
    :key="colorMode.value"
    :data="filteredData"
    :height="height"
    :categories="requestsCategories"
    :y-grid-line="true"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :curve-type="CurveType.Basis"
    :y-num-ticks="4"
    :x-num-ticks="4"
    :legend-position="LegendPosition.Bottom"
    :hide-legend="false"
    :y-axis="['requests', 'errorRate']"
  />
</template>
