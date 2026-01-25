<script setup>
const props = defineProps({
  legendPosition: {
    type: String,
    default: "bottomLeft",
    validator: (value) =>
      ["topLeft", "topRight", "bottomLeft", "bottomRight"].includes(value),
  },
});

const channelPercentages = ref({
  organic: 78,
  referral: 15,
  direct: 7,
});

const getLegendClass = computed(() => {
  switch (props.legendPosition) {
    case "topLeft":
      return "justify-start";
    case "topRight":
      return "justify-end";
    case "bottomRight":
      return "justify-end";
    default:
      return "justify-start";
  }
});
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-baseline gap-2">
      <span class="text-2xl font-bold text-default">78%</span>
      <span class="text-sm text-error">-0.4%</span>
    </div>

    <div class="flex w-full h-2 mb-4 rounded-full overflow-hidden">
      <div
        :style="{ width: `${channelPercentages.organic}%` }"
        class="bg-primary"
      />
      <div
        :style="{ width: `${channelPercentages.referral}%` }"
        class="bg-info"
      />
      <div
        :style="{ width: `${channelPercentages.direct}%` }"
        class="bg-warning"
      />
    </div>

    <div :class="getLegendClass" class="flex gap-4 text-sm text-muted">
      <div class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-primary" />
        <span>Organic</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-info" />
        <span>Referral</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-warning" />
        <span>Direct</span>
      </div>
    </div>
  </div>
</template>
