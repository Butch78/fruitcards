<script lang="ts" setup></script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UDashboardSidebarCollapse class="-ml-0.5" />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>

  <div class="p-8 w-full">
    <div class="columns-lg space-x-2">
      <UCard variant="subtle" class="break-inside-avoid mb-6">
        <div class="space-y-8">
          <FlexBetween>
            <h2 class="text-xl font-semibold text-highlighted">Donut Chart</h2>
            <Flex>
              <UButton variant="link" color="neutral" icon="i-lucide-info" />
              <UButton
                variant="link"
                color="neutral"
                icon="i-lucide-settings"
              />
              <UButton variant="link" color="neutral" icon="i-lucide-trash-2" />
            </Flex>
          </FlexBetween>

          <ChartsWinLostDonut />
        </div>
      </UCard>

      <UCard variant="subtle" class="break-inside-avoid mb-6">
        <div class="space-y-8">
          <FlexBetween>
            <h2 class="text-xl font-semibold text-highlighted">Line Chart</h2>
            <Flex>
              <UButton variant="link" color="neutral" icon="i-lucide-info" />
              <UButton
                variant="link"
                color="neutral"
                icon="i-lucide-settings"
              />
              <UButton variant="link" color="neutral" icon="i-lucide-trash-2" />
            </Flex>
          </FlexBetween>

          <div class="space-y-8">
            <ChartsWinLostLine :height="240" />
          </div>
        </div>
      </UCard>

      <UCard variant="subtle" class="break-inside-avoid mb-6">
        <WidgetTasks />
      </UCard>

      <UCard variant="subtle" class="break-inside-avoid mb-6">
        <div class="space-y-8">
          <FlexBetween>
            <h2 class="text-xl font-semibold text-highlighted">
              Grouped Bar Chart
            </h2>
            <Flex>
              <UButton variant="link" color="neutral" icon="i-lucide-info" />
              <UButton
                variant="link"
                color="neutral"
                icon="i-lucide-settings"
              />
              <UButton variant="link" color="neutral" icon="i-lucide-trash-2" />
            </Flex>
          </FlexBetween>

          <ChartsWinLostBar />
        </div>
      </UCard>

      <UCard variant="subtle" class="break-inside-avoid mb-6">
        <WidgetContacts />
      </UCard>

      <WidgetUpload class="break-inside-avoid mb-6" />
    </div>
  </div>

    </template>
  </UDashboardPanel>
</template>
