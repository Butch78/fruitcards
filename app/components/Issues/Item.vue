<script lang="ts" setup>
import type { IssueItem } from "~/data/issues";

const props = defineProps<{
  item: IssueItem;
}>();

const typeColorMap = {
  Feature: "bg-indigo-500",
  Bug: "bg-error-500",
  Improvement: "bg-sky-500",
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};
</script>

<template>
  <FlexBetween class="py-2 hover:bg-muted/20">
    <Flex class="gap-4">
      <UCheckbox  size="sm" :model-value="item.checked" />
      <span class="text-sm">{{ item.title }}</span>
    </Flex>
    <Flex class="gap-4">
      <div class="w-2 h-2 rounded-full" :class="typeColorMap[item.type]" />
      <UIcon name="i-lucide-circle-user" class="text-dimmed" />
      <div class="text-xs text-dimmed">{{ formatDate(item.createdAt) }}</div>
    </Flex>
  </FlexBetween>
</template>
