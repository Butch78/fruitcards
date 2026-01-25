<script setup lang="ts">
const active = ref(true);
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Integrations">
        <template #leading>
          <UDashboardSidebarCollapse class="-ml-0.5" />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="max-w-2xl w-full mx-auto py-8 2xl:py-24">
        <!-- Configure Section -->
        <div class="mb-10">
          <h2 class="text-lg font-semibold mb-4">Configure</h2>
          <UCard>
            <div class="divide-y divide-default">
              <div class="flex items-center py-6">
                <div class="flex-1">
                  <div class="font-medium">
                    Default calendar to sync
                    <span class="ml-1" title="Choose which calendar to sync"
                      >&#9432;</span
                    >
                  </div>
                </div>
                <USelect class="w-56" placeholder="Select a calendar..." />
              </div>
              <div class="flex items-center py-6">
                <div class="flex-1">
                  <div class="font-medium">Time format</div>
                </div>
                <div class="flex gap-2">
                  <UButton
                    label="12h"
                    size="sm"
                    color="neutral"
                    variant="soft"
                  />
                  <UButton
                    label="24h"
                    size="sm"
                    color="neutral"
                    variant="soft"
                  />
                </div>
              </div>
              <div class="flex items-center py-6">
                <div class="flex-1">
                  <div class="font-medium">Include non-work events</div>
                  <div class="text-dimmed text-xs">
                    Whether or not to sync events outside of your configured
                    work hours.
                  </div>
                </div>
                <USwitch v-model="active" class="ml-4" />
              </div>
            </div>
          </UCard>
        </div>

        <!-- Apps Section -->
        <div>
          <h2 class="text-lg font-semibold mb-4">Apps</h2>
          <UCard>
            <div class="divide-y divide-default">
              <div class="flex items-center py-6">
                <img
                  src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico"
                  class="w-7 h-7 mr-4"
                  alt="Gmail"
                >
                <div class="flex-1">
                  <div class="font-medium">Gmail</div>
                  <div class="text-dimmed text-sm">
                    Get email reminders whenever an event detail changes
                  </div>
                </div>
                <UButton
                  label="Disconnect"
                  size="sm"
                  color="primary"
                  variant="soft"
                />
              </div>
              <div class="flex items-center py-6">
                <img
                  src="/images/meet.png"
                  class="w-7 mr-4"
                  alt="Google Meet"
                >
                <div class="flex-1">
                  <div class="font-medium">Google Meet</div>
                  <div class="text-dimmed text-sm">
                    Automatically add a video call to your calendar events
                  </div>
                </div>
                <UButton
                  label="Disconnect"
                  size="sm"
                  color="primary"
                  variant="soft"
                />
              </div>
              <div class="flex items-center py-6">
                <img
                  src="https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png"
                  class="w-7 h-7 mr-4"
                  alt="Slack"
                >
                <div class="flex-1">
                  <div class="font-medium">Slack</div>
                  <div class="text-dimmed text-sm">
                    Create channels from Slack about upcoming events
                  </div>
                </div>
                <UButton
                  label="Connect"
                  size="sm"
                  color="primary"
                  variant="soft"
                />
              </div>
              <div class="flex items-center py-6">
                <img src="/images/zoom.png" class="w-7 h-7 mr-4" alt="Zoom" >
                <div class="flex-1">
                  <div class="font-medium">Zoom</div>
                  <div class="text-dimmed text-sm">
                    Automatically add a video call to your calendar events
                  </div>
                </div>
              <UButton
                label="Connect"
                size="sm"
                color="primary"
                variant="soft"
              />
            </div>
          </div>
        </UCard>
      </div>
    </div>
    </template>
  </UDashboardPanel>
</template>
