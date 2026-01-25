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

const { data: ErrorTypeData, pending } = await useFetch(
  () => `/api/charts/errors?timeRange=${props.timeRange}`,
  {
    watch: [() => props.timeRange, () => props.dataType],
  }
);

const filteredData = computed(() => {
  if (!ErrorTypeData.value) return [];
  let data = ErrorTypeData.value;
  if (props.dataType === "logs") {
    return data.map((d) => ({ ...d, error4xx: d.error4xx * 0.5, error5xx: d.error5xx * 0.5  }));
  } else if (props.dataType === "server") {
    return data.map((d) => ({ ...d, error4xx: d.error4xx * 0.2, error5xx: d.error5xx * 0.2  }));
  }
  return data;
});

const ErrorTypeCategories = computed(() => ({
  error4xx: {
    name: "4xx Errors",
    color: "#f59e42", // orange-400
  },
  error5xx: {
    name: "5xx Errors",
    color: "#ef4444", // red-500
  },
}));

const xFormatter = (i: number): string => `${filteredData.value[i]?.day}`;
const yFormatter = (value: number): string => `${value}`;

const { height } = useResponsiveHeight({
  default: 120,
  sm: 200,
});
</script>

<template>
  <div v-if="pending" class="flex justify-center items-center h-full">
    <UIcon name="i-lucide-loader-2" class="animate-spin" />
  </div>
  <LineChart
    v-else
    :data="filteredData"
    :height="height"
    :categories="ErrorTypeCategories"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :curve-type="CurveType.StepAfter"
    :legend-position="LegendPosition.Bottom"
    :hide-legend="false"
    :x-grid-line="false"
    :y-grid-line="true"
    :x-domain-line="true"
    :y-domain-line="false"
    :x-tick-line="false"
    :y-tick-line="true"
    :x-num-ticks="7"
    :y-num-ticks="4"
    :hide-tooltip="false"
    x-label="Day of Week"
    y-label="Error Count"
  />
</template>
