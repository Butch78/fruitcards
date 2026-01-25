<script lang="ts" setup>
import type { TabsItem } from "@nuxt/ui";

const props = defineProps<{
  hideText?: boolean;
}>();

const items = ref<TabsItem[]>([
  {
    label: "Year",
  },
  {
    label: "Month",
  },
  {
    label: "Week",
  },
  {
    label: "Day",
  },
]);

const win = ref(32);
const loss = ref(18);

const winLossData = computed(() => [
  {
    color: "#10b981",
    name: "Winning",
    value: win.value,
  },
  {
    color: "#ef4444",
    name: "Lost",
    value: loss.value,
  },
]);

const percentage = computed(() => {
  const total = win.value + loss.value;
  if (total === 0) return "0%";
  return Math.round((win.value / total) * 100);
});
</script>

<template>
  <div class="space-y-8">
    <Flex class="gap-8 space-y-4">
      <div class="relative w-46">
        <DonutChart
          :data="winLossData.map((i) => i.value)"
          :height="160"
          :arc-width="10"
          :categories="
            Object.fromEntries(
              winLossData.map((item) => [
                item.name,
                {
                  name: item.name,
                  color: item.color,
                  percentage: item.value,
                },
              ])
            )
          "
          :pad-angle="0.1"
          :hide-legend="true"
          :radius="4"
        >
          <div class="text-2xl font-bold">
            {{ percentage }}<span class="text-toned">%</span>
          </div>
        </DonutChart>
      </div>
      <FlexCol class="ml-6 h-[160px] w-[120px]">
        <FlexCol class="h-1/2 space-y-2">
          <div class="text-muted">Winning trades</div>
          <div class="text-3xl font-bold">{{ winLossData[0]?.value ?? 0 }}</div>
        </FlexCol>
        <FlexCol class="h-1/2 space-y-2">
          <div class="text-muted">Losing trades</div>
          <div class="text-3xl font-bold">{{ winLossData[1]?.value ?? 0 }}</div>
        </FlexCol>
      </FlexCol>
    </Flex>
    <UTabs :content="false" :items="items" color="neutral" class="w-full" />

    <p v-if="!props.hideText" class="text-center text-dimmed px-16 text-sm">
      Your win % is higher on <span class="text-primary">8%</span> compared to
      <span class="text-primary">47 winning</span> / <span>33 losing</span> past
      month
    </p>
  </div>
</template>
