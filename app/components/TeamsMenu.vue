<script setup lang="ts">
defineProps<{
  collapsed?: boolean
}>()
</script>

<template>
  <div class="flex justify-center items-center w-full pt-4 gap-2">
    <UButton
      v-if="!collapsed"
      variant="ghost"
      class="w-full flex justify-between"
    >
      Sébastien Chopin
    </UButton>
    <UAvatar
      size="xs"
      src="https://github.com/atinux.png"
    />
  </div>
</template>
