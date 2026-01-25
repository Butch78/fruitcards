<script lang="ts" setup>
const props = defineProps<{
  status: string;
}>();

const emit = defineEmits<{
  (e: "update:status", status: string): void;
}>();

const teams = ref([
  "All",
  "Received",
  "Pending",
  "Processed",
  "Failed",
]);
</script>

<template>
  <USelect
    :model-value="props.status"
    :items="teams"
    class="min-w-24"
    @update:model-value="(status) => emit('update:status', status)"
  />
</template>
