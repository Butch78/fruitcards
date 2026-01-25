<script setup lang="ts">
const categories: Record<string, BulletLegendItemInterface> = {
  users: { name: "Users", color: "#615fff" },
};

const categories1: Record<string, BulletLegendItemInterface> = {
  users: { name: "Users", color: "#615fff" },
};

const categories2: Record<string, BulletLegendItemInterface> = {
  users: { name: "Users", color: "#615fff" },
};

const data = [
  {
    date: "Jan 23",
    users: 234,
    sessions: 1432,
    churn: 5.2,
  },
  {
    date: "Feb 23",
    users: 431,
    sessions: 1032,
    churn: 4.3,
  },
  {
    date: "Mar 23",
    users: 543,
    sessions: 1089,
    churn: 5.1,
  },
  {
    date: "Apr 23",
    users: 489,
    sessions: 988,
    churn: 5.4,
  },
  {
    date: "May 23",
    users: 391,
    sessions: 642,
    churn: 5.5,
  },
  {
    date: "Jun 23",
    users: 582,
    sessions: 786,
    churn: 4.8,
  },
  {
    date: "Jul 23",
    users: 482,
    sessions: 673,
    churn: 4.5,
  },
  {
    date: "Aug 23",
    users: 389,
    sessions: 761,
    churn: 0,
  },
  {
    date: "Sep 23",
    users: 521,
    sessions: 793,
    churn: 0,
  },
  {
    date: "Oct 23",
    users: 434,
    sessions: 543,
    churn: 0,
  },
  {
    date: "Nov 23",
    users: 332,
    sessions: 678,
    churn: 0,
  },
  {
    date: "Dec 23",
    users: 275,
    sessions: 873,
    churn: 0,
  },
];

interface VitalItem {
  name: string;
  value: number;
}

const vitals: VitalItem[] = [
  { name: "Performance", value: 91 },
  { name: "Accessibility", value: 65 },
  { name: "SEO", value: 43 },
];
</script>

<template>
  <UCard
    v-for="(vital, key) in vitals"
    :key="key"
    :name="vital.name"
    :value="vital.value"
  >
    <div class="space-y-1">
      <div class="font-medium text-sm">
        {{ vital.name }}
      </div>
      <div class="flex items-center justify-between">
        <div class="text-3xl font-semibold">
          {{ vital.value }}
          <span class="text-muted text-sm"> /100 </span>
        </div>
      </div>
    </div>
    <div class="mt-4">
      <AreaChart
        :data="data"
        :categories="key === 0 ? categories1 : key === 1 ? categories2 : categories"
        :min-max-ticks-only="true"
        :y-num-ticks="1"
        :x-formatter="(i: number) => `${i}`"
        :hide-legend="true"
        :hide-x-axis="true"
        :hide-y-axis="true"
        :height="50"
      />
      <div class="text-muted flex items-center justify-between text-xs">
        <div>
          {{ data[0]?.date }}
        </div>
        <div>
          {{ data[data.length - 1]?.date }}
        </div>
      </div>
    </div>
  </UCard>
</template>
