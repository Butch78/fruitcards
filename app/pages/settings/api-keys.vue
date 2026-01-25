<script setup lang="ts">
const clientId = "d34bad52-8595-4a1e-aa70-656d27dfd65f";
const clientSecret = "••••••••••";

const tabs = [{ label: "Production" }, { label: "Staging" }];

const active = ref(0);
</script>
<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="API Keys">
        <template #leading>
          <UDashboardSidebarCollapse class="-ml-0.5" />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="max-w-2xl mx-auto py-8 2xl:py-24">

      <!-- Client Section -->
      <div class="mb-10">
        <h2 class="text-lg font-semibold mb-4">Client</h2>
        <UCard>
          <div class="flex items-center mb-4 gap-4">
            <UTabs
              :value="tabs[active]"
              :items="tabs"
              variant="link"
              :content="false"
              class="w-full"
            />
            <UButton label="Go to docs" class="ml-auto" size="sm" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 px-2">
            <UFormField label="Client ID">
              <UInput
                :model-value="clientId"
                readonly
                :ui="{ trailing: 'pe-1' }"
              >
                <template #trailing>
                  <UButton
                    icon="i-lucide-clipboard"
                    size="xs"
                    color="neutral"
                    variant="link"
                  />
                </template>
              </UInput>
            </UFormField>
            <UFormField label="Client Secret">
              <UInput
                :model-value="clientSecret"
                type="password"
                readonly
                :ui="{ trailing: 'pe-1' }"
              >
                <template #trailing>
                  <UButton
                    icon="i-lucide-clipboard"
                    size="xs"
                    color="neutral"
                    variant="link"
                  />
                </template>
              </UInput>
            </UFormField>
          </div>
        </UCard>
      </div>

      <!-- API Keys Section -->
      <div>
        <div class="flex items-center mb-4">
          <h2 class="text-lg font-semibold flex-1">API keys</h2>
          <UButton label="Create key" size="sm" icon="i-lucide-plus" />
        </div>

        <UCard>
          <div class="bg-muted rounded-lg p-4 mb-4 flex items-center">
            <span class="i-lucide-lock-closed mr-3 text-xl text-primary" />
            <span class="text-dimmed text-sm">
              Your API keys are highly sensitive and secret. Never share your
              API keys with others or expose them in client-side code
            </span>
          </div>
          <div class="overflow-x-auto">
            <!-- Flex header (visible on md+) -->
            <div
              class="hidden md:flex items-center text-sm text-dimmed px-2 mb-2"
            >
              <div class="flex-[2]">Key</div>
              <div class="flex-1">Created</div>
              <div class="flex-1">Last used</div>
              <div class="w-10" />
            </div>

            <!-- Rows as flex containers -->
            <div class="space-y-2">
              <!-- Row 1 -->
              <div
                class="flex flex-col gap-3 rounded-lg border border-default p-3 md:flex-row md:items-center"
              >
                <div class="flex items-center gap-2 md:flex-[2]">
                  <input
                    readonly
                    type="text"
                    class="bg-muted rounded px-2 py-1 font-mono text-sm w-64"
                    value="sk-••••••••ICHD"
                  >
                  <UButton icon="i-lucide-clipboard" size="xs" />
                </div>
                <div class="flex items-center text-sm text-default md:flex-1">
                  <span class="md:hidden mr-2 text-dimmed">Created:</span>
                  Feb 28, 2023
                </div>
                <div class="flex items-center text-sm text-default md:flex-1">
                  <span class="md:hidden mr-2 text-dimmed">Last used:</span>
                  Mar 16, 2023
                </div>
                <div class="md:ml-auto self-end md:self-auto">
                  <UButton icon="i-lucide-ellipsis" size="xs" />
                </div>
              </div>

              <!-- Row 2 -->
              <div
                class="flex flex-col gap-3 rounded-lg border border-default p-3 md:flex-row md:items-center"
              >
                <div class="flex items-center gap-2 md:flex-[2]">
                  <input
                    readonly
                    type="text"
                    class="bg-muted rounded px-2 py-1 font-mono text-sm w-64"
                    value="sk-••••••••yzUA"
                  >
                  <UButton icon="i-lucide-clipboard" size="xs" />
                </div>
                <div class="flex items-center text-sm text-default md:flex-1">
                  <span class="md:hidden mr-2 text-dimmed">Created:</span>
                  Feb 21, 2023
                </div>
                <div class="flex items-center text-sm text-default md:flex-1">
                  <span class="md:hidden mr-2 text-dimmed">Last used:</span>
                  Sept 3, 2023
                </div>
                <div class="md:ml-auto self-end md:self-auto">
                  <UButton icon="i-lucide-ellipsis" size="xs" />
                </div>
              </div>

              <!-- Row 3 -->
              <div
                class="flex flex-col gap-3 rounded-lg border border-default p-3 md:flex-row md:items-center"
              >
                <div class="flex items-center gap-2 md:flex-[2]">
                  <input
                    readonly
                    type="text"
                    class="bg-muted rounded px-2 py-1 font-mono text-sm w-64"
                    value="sk-••••••••pFdM"
                  >
                  <UButton icon="i-lucide-clipboard" size="xs" />
                </div>
                <div class="flex items-center text-sm text-default md:flex-1">
                  <span class="md:hidden mr-2 text-dimmed">Created:</span>
                  Jan 11, 2023
                </div>
                <div class="flex items-center text-sm text-default md:flex-1">
                  <span class="md:hidden mr-2 text-dimmed">Last used:</span>
                  Never
                </div>
                <div class="md:ml-auto self-end md:self-auto">
                  <UButton icon="i-lucide-ellipsis" size="xs" />
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
