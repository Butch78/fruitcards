<script setup lang="ts">
import type { SelectItem } from "@nuxt/ui";

const activeItemIndex = ref(0);

const items = ref([
  {
    label: "Backlog",
    value: "backlog",
    icon: "i-lucide-list-start",
    onSelect: () => {
      activeItemIndex.value = 0;
    },
  },
  {
    label: "Todo",
    value: "todo",
    icon: "i-lucide-plus",
    onSelect: () => {
      activeItemIndex.value = 1;
    },
  },
  {
    label: "In Progress",
    value: "in_progress",
    icon: "i-lucide-arrow-up",
    onSelect: () => {
      activeItemIndex.value = 2;
    },
  },
  {
    label: "Done",
    value: "done",
    icon: "i-lucide-check",
    onSelect: () => {
      activeItemIndex.value = 3;
    },
  },
] satisfies SelectItem[]);

const activeItem = computed(() => items.value[activeItemIndex.value]);

const teams = ref(["Frontend", "Backend", "Design", "QA", "Mobile"]);
const team = ref("Frontend");
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <UDropdownMenu
      :items="items"
      :content="{
        align: 'start',
        side: 'bottom',
        sideOffset: 8,
      }"
      :ui="{
        content: 'w-48',
      }"
    >
      <UButton
        :label="activeItem?.label"
        color="neutral"
        variant="subtle"
        trailing-icon="i-lucide-chevron-down"
        class="flex justify-between"
      />
    </UDropdownMenu>
    <USelect
      v-model="team"
      label="Filter by initiative"
      :items="teams"
      class="w-32"
    />
  </div>
</template>
