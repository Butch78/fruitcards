<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Notifications">
        <template #leading>
          <UDashboardSidebarCollapse class="-ml-0.5" />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="max-w-2xl mx-auto py-8 2xl:py-24">
      <!-- Slack Connect Banner -->
      <UCard class="mb-8">
        <div class="flex items-center">
          <img
            src="https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png"
            alt="Slack"
            class="w-8 h-8 mr-3"
          >
          <div class="flex-1">
            <div class="font-medium">You have not connected to Slack</div>
            <div class="text-dimmed text-sm">
              Get notified in your most important channels
            </div>
          </div>
          <UButton label="Connect" />
        </div>
      </UCard>

      <!-- Alerts Section -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold mb-4">Alerts</h2>
        <UCard>
          <div class="divide-y divide-default">
            <div class="flex items-center justify-between py-4">
              <div>
                <div class="font-medium">Email alert</div>
                <div class="text-dimmed text-sm">
                  Get an email alert for upcoming and changed events. Alerts are
                  grouped by their proximity.
                </div>
              </div>
              <input type="checkbox" >
            </div>
            <div class="flex items-center justify-between py-4">
              <div>
                <div class="font-medium">SMS digest</div>
                <div class="text-dimmed text-sm">
                  Get a reminder via text for imminent events.
                </div>
              </div>
              <input type="checkbox" >
            </div>
            <div class="flex items-center justify-between py-4">
              <div>
                <div class="font-medium">Slack digest</div>
                <div class="text-dimmed text-sm">
                  Stay informed through Slack for events that are around the
                  corner.
                </div>
              </div>
              <input type="checkbox" >
            </div>
          </div>
        </UCard>
      </div>

      <!-- Preferences Section -->
      <div>
        <h2 class="text-lg font-semibold mb-4">Preferences</h2>
        <UCard>
          <div class="overflow-x-auto">
            <table class="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th class="text-left"/>
                  <th class="px-4 font-medium text-dimmed">Email</th>
                  <th class="px-4 font-medium text-dimmed">SMS</th>
                  <th class="px-4 font-medium text-dimmed">Slack</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-t">
                  <td class="font-semibold pb-2" colspan="4">General</td>
                </tr>
                <tr>
                  <td class="pl-0">You receive an event invitation</td>
                  <td class="text-center"><input type="checkbox" ></td>
                  <td class="text-center"><input type="checkbox" ></td>
                  <td class="text-center"><input type="checkbox" ></td>
                </tr>
                <tr>
                  <td class="pl-0">
                    You receive a reminder for an event you're attending
                  </td>
                  <td class="text-center"><input type="checkbox" ></td>
                  <td class="text-center"><input type="checkbox" ></td>
                  <td class="text-center"><input type="checkbox" ></td>
                </tr>
                <tr>
                  <td class="pl-0">
                    You receive updated event details like location, time
                  </td>
                  <td class="text-center"><input type="checkbox" ></td>
                  <td class="text-center"><input type="checkbox" ></td>
                  <td class="text-center"><input type="checkbox" ></td>
                </tr>
                <tr class="border-t">
                  <td class="font-semibold pt-4 pb-2" colspan="4">Events</td>
                </tr>
                <tr>
                  <td class="pl-0">Participant accepted your event</td>
                  <td class="text-center"><input type="checkbox" ></td>
                  <td class="text-center"><input type="checkbox" ></td>
                  <td class="text-center"><input type="checkbox" ></td>
                </tr>
                <tr>
                  <td class="pl-0">Participant declined your event</td>
                  <td class="text-center"><input type="checkbox" ></td>
                  <td class="text-center"><input type="checkbox" ></td>
                  <td class="text-center"><input type="checkbox" ></td>
                </tr>
                <tr>
                  <td class="pl-0">
                    Participant added a comment to your event
                  </td>
                  <td class="text-center"><input type="checkbox" ></td>
                  <td class="text-center"><input type="checkbox" ></td>
                  <td class="text-center"><input type="checkbox" ></td>
                </tr>
                <tr>
                  <td class="pl-0">Participant modifies your event</td>
                  <td class="text-center"><input type="checkbox" ></td>
                  <td class="text-center"><input type="checkbox" ></td>
                  <td class="text-center"><input type="checkbox" ></td>
                </tr>
              </tbody>
            </table>
          </div>
        </UCard>
      </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
