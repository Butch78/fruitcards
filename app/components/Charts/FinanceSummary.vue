<script lang="ts" setup>
interface SpendingCategory {
  color: string;
  name: string;
  value: number;
}

const spendingData = ref<SpendingCategory[]>([
  {
    color: "var(--color-emerald-500)", // green
    name: "Food & Drink",
    value: 420,
  },
  {
    color: "var(--color-indigo-500)", // purple
    name: "Grocery",
    value: 320,
  },
  {
    color: "var(--color-pink-500)", // red/pink
    name: "Shopping",
    value: 210,
  },
  {
    color: "var(--color-amber-500)", // warning (amber)
    name: "Transport",
    value: 150,
  },
]);

const totalSpent = computed(() =>
  spendingData.value.reduce((sum, item) => sum + item.value, 0)
);

const categories = computed(() =>
  Object.fromEntries(
    spendingData.value.map((item) => [
      item.name,
      {
        name: item.name,
        color: item.color,
      },
    ])
  )
);

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
};

defineProps<{
  orientation?: "horizontal" | "vertical";
}>();
</script>

<template>
  <div
    class="flex"
    :class="orientation === 'horizontal' ? 'gap-8' : 'flex-col gap-4'"
  >
    <Flex class="justify-center">
      <Flex class="gap-8 space-y-4">
        <div class="relative w-46">
          <DonutChart
            :data="spendingData.map((i) => i.value)"
            :height="160"
            :arc-width="20"
            :categories="categories"
            :pad-angle="0.1"
            :hide-legend="true"
            :radius="80"
          >
            <div>
              <div class="text-xs text-muted">Total Spent</div>
              <div class="text-2xl font-bold">
                {{ formatCurrency(totalSpent) }}
              </div>
            </div>
          </DonutChart>
        </div>
      </Flex>
    </Flex>

    <div
      class="flex flex-col gap-2 max-w-xl w-full mx-auto"
      :class="orientation === 'horizontal' ? 'mt-6' : 'mt-2 max-w-sm mx-auto px-8'"
    >
      <div
        v-for="item in spendingData"
        :key="item.name"
        class="flex items-center gap-2"
      >
        <span
          :style="{ backgroundColor: item.color }"
          class="inline-block w-3 h-3 rounded-full"
        />
        <span class="text-sm font-medium">{{ item.name }}</span>
        <span class="ml-auto text-muted">{{
          formatCurrency(item.value)
        }}</span>
      </div>
    </div>
  </div>
</template>
