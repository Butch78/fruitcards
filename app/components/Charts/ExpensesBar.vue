<script setup lang="ts">
interface SalesDataItem {
  product: string;
  sales: number;
  counter: number;
}

const SalesData: SalesDataItem[] = [
  { product: "Widgets", sales: 2400, counter: -600 },
  { product: "Gadgets", sales: 1800, counter: -350 },
  { product: "Tools", sales: 3200, counter: -800 },
  { product: "Parts", sales: 2000, counter: -25 },
  { product: "Kits", sales: 2800, counter: -700 },
  { product: "Accessories", sales: 1500, counter: -200 },
  { product: "Supplies", sales: 1700, counter: -300 },
  { product: "Components", sales: 2600, counter: -500 },
  { product: "Devices", sales: 2100, counter: -400 },
  { product: "Modules", sales: 2300, counter: -450 },
];

const SalesCategories = computed(() => ({
  sales: {
    name: "Sales Revenue",
    color: "var(--ui-primary)",
  },
  counter: {
    name: "Counter Revenue",
    color: "var(--color-warning-500)",
  },
}));

const xFormatter = (i: number): string => `${SalesData[i]?.product}`;
const yFormatter = (value: number): string => `$${(value / 1000).toFixed(1)}k`;
</script>

<template>
  <BarChart
    :data="SalesData"
    :height="140"
    :stacked="true"
    :categories="SalesCategories"
    :hide-x-axis="true"
    :y-num-ticks="4"
    :y-axis="['sales' ,'counter']"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="true"
    :x-grid-line="false"
    :y-domain-line="false"
    :x-domain-line="false"
    :y-tick-line="false"
    :x-tick-line="false"
    :radius="8"
    :bar-padding="0.6"
  />
</template>
