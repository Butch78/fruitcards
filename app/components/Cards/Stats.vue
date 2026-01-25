<template>
  <UCard>
    <div class="space-y-2">
      <FlexBetween>
        <Flex class="gap-2">
          <Flex class="bg-indigo-500/20 p-1.5 rounded-full">
            <UIcon name="i-lucide-dollar-sign" class="text-indigo-500" />
          </Flex>
          <div class="text-sm text-toned">Total Sales</div>
        </Flex>
        <UButton variant="link" icon="i-lucide-more-vertical" />
      </FlexBetween>

      <div class="space-y-1 mt-4">
        <div class="text-xl font-semibold">$120.784.02</div>
        <div>
          <Flex class="text-sm gap-2">
            <Flex class="gap-1">
              <UIcon
                name="i-lucide-arrow-up-right"
                size="16"
                class="text-success"
              />
              <span class="text-success-400">12.3%</span>
            </Flex>
            <span class="text-dimmed">+$1.453.89 today</span>
          </Flex>
        </div>
      </div>
    </div>
    <template #footer>
      <UButton
        variant="ghost"
        class="text-default"
        trailing-icon="i-lucide-arrow-right"
        label="View Report"
      />
    </template>
  </UCard>
</template>
