<script setup lang="ts">
const showUsage = ref(true);
const usage = ref(50);

const items = [
  {
    label: "Logout",
    icon: "i-lucide-log-out",
    to: "/logout",
  },
];

defineProps<{
  collapsed?: boolean
}>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <div v-if="showUsage && !collapsed">
      <UCard variant="subtle" :ui="{ body: 'p-0 sm:p-4' }">
        <div>
          <h4 class="font-semibold mb-2">Used space</h4>
          <p class="text-muted text-sm">
            Your team has used 80% of your available space.
          </p>
          <div class="my-4">
            <UProgress v-model="usage" />
          </div>
          <div class="space-x-3">
            <UButton
              variant="link"
              color="neutral"
              class="px-0"
              @click="showUsage = false"
            >
              Dismiss
            </UButton>
            <UButton variant="link" color="primary" class="px-0">
              Upgrade
            </UButton>
          </div>
        </div>
      </UCard>
    </div>

    <UNavigationMenu
      :collapsed="collapsed"
      orientation="vertical"
      :items="items"
    />
  </div>
</template>
