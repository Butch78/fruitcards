<script lang="ts" setup>
const buttonAction = ref<"All" | "New">("All");
const selectedOption = ref("month");
const options = ["week", "month", "year"];

const { isNotificationsSlideOverOpen } = useDashboard();
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse class="-ml-0.5" />

          <Flex class="gap-2">
            <UButton
              icon="i-lucide-box"
              variant="outline"
              label="All Projects"
              active-variant="subtle"
              :active="buttonAction === 'All'"
              @click="buttonAction = 'All'"
            />
            <UButton
              icon="i-lucide-plus"
              label="new"
              variant="ghost"
              active-variant="subtle"
              :active="buttonAction === 'New'"
              @click="buttonAction = 'New'"
            />
          </Flex>
        </template>

        <template #right>
          <Flex class="gap-2">
            <UButton variant="ghost" size="sm" icon="i-lucide-link" />
            <UButton variant="ghost" size="sm" icon="i-lucide-plus" />
            <USeparator orientation="vertical" class="h-4" />
            <UTooltip text="Notifications" :shortcuts="['N']">
              <UButton
                color="neutral"
                variant="ghost"
                square
                @click="isNotificationsSlideOverOpen = true"
              >
                <UChip color="error" inset>
                  <UIcon
                    name="i-lucide-message-circle"
                    class="size-5 shrink-0"
                  />
                </UChip>
              </UButton>
            </UTooltip>
          </Flex>
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>

    

    <div class="space-y-6">
      <FlexBetween>
        <h1 class="text-2xl font-semibold">Welcome Back</h1>

        <Flex class="gap-2">
          <UButton
            icon="i-lucide-file-down"
            variant="outline"
            label="Export"
            active-variant="subtle"
            :active="true"
            @click="buttonAction = 'All'"
          />
          <UButton
            icon="i-lucide-plus"
            label="New Sheet"
            variant="ghost"
            :ui="{ label: 'pr-1' }"
            @click="buttonAction = 'New'"
          />
        </Flex>
      </FlexBetween>

      <div class="w-full flex gap-6">
        <div class="w-1/2 grid grid-cols-2 gap-6">
          <CardsStats />
          <CardsStats />
          <CardsStats />
          <CardsStats />
        </div>

        <div class="w-1/2">
          <UCard>
            <Flex class="gap-2">
              <FlexBetween>
                <div>
                  <div class="text-muted">Revenue</div>
                  <Flex class="gap-2">
                    <div class="text-2xl font-semibold">
                      $13,600 <span class="text-dimmed">,12</span>
                    </div>
                    <UBadge icon="i-lucide-arrow-up" label="10%" />
                  </Flex>
                </div>

                <USelect v-model="selectedOption" :items="options" />
              </FlexBetween>
            </Flex>

            <ChartsRevenueLine :height="338" :hide-x-axis="false" />
          </UCard>
        </div>
      </div>

      <div class="flex gap-6">
        <UCard class="w-8/12">
          <template #default>
            <FlexBetween class="w-full">
              <h2 class="text-xl font-semibold">Current Sprint</h2>
              <USelect v-model="selectedOption" :items="options" />
            </FlexBetween>

            <div class="mt-6 divide-y divide-default">
              <TablesTransactions />
            </div>
          </template>
        </UCard>
        <UCard class="w-4/12">
          <template #default>
            <FlexBetween class="w-full">
              <h2 class="text-xl font-semibold">Traffic Channel</h2>
              <USelect v-model="selectedOption" :items="options" />
            </FlexBetween>
            <div class="mt-6 divide-y divide-default">
              <ChartsFinanceSummary orientation="vertical" />
            </div>
          </template>
        </UCard>
      </div>
    </div>
  
    </template>
  </UDashboardPanel>
</template>
