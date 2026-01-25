<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Billing">
        <template #leading>
          <UDashboardSidebarCollapse class="-ml-0.5" />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="max-w-2xl mx-auto py-8 2xl:py-24">

      <!-- Usage Section -->
      <div class="mb-10">
        <h2 class="text-lg font-semibold mb-4">Usage</h2>
        <UCard>
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="font-medium">Seats</span>
            </div>
            <div class="w-full h-2 bg-white/5 rounded mb-2">
              <div class="h-2 bg-primary rounded" style="width: 25%" />
            </div>
            <div class="flex items-center justify-between">
              <div class="text-muted text-sm font-medium">
                5 out of 20 seats used
              </div>
              <UButton
                label="Upgrade"
                size="sm"
                trailing-icon="i-lucide-chevron-right"
                color="primary"
                variant="soft"
              />
            </div>
          </div>
        </UCard>
      </div>

      <!-- Payment Section -->
      <div class="mb-10">
        <div class="flex items-center mb-4">
          <h2 class="text-lg font-semibold flex-1">Payment</h2>
          <UButton
            label="Add"
            size="sm"
            icon="i-lucide-plus"
            color="primary"
            variant="soft"
          />
        </div>
        <UCard>
          <div class="space-y-4">
            <div class="flex items-center p-4">
              <img
                src="https://img.icons8.com/color/48/000000/mastercard-logo.png"
                class="w-8 mr-4"
                alt="Mastercard"
              >
              <div class="flex-1">
                <div class="font-medium gap-4 flex">
                  <span>Mastercard ••••0213</span>
                  <UBadge>Default</UBadge>
                </div>
                <div class="text-dimmed text-sm">Expires 09/26</div>
              </div>
              <UButton
                icon="i-lucide-ellipsis"
                size="xs"
                color="neutral"
                variant="soft"
              />
            </div>
            <div class="flex items-center p-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                class="w-12 mr-4"
                alt="Visa"
              >
              <div class="flex-1">
                <div class="font-medium">Visa ••••9483</div>
                <div class="text-dimmed text-sm">Expires 11/25</div>
              </div>
              <UButton
                icon="i-lucide-ellipsis"
                size="xs"
                color="neutral"
                variant="soft"
              />
            </div>
          </div>
        </UCard>
      </div>

      <!-- Subscription Section -->
      <div>
        <h2 class="text-lg font-semibold mb-4">Subscription</h2>
        <UCard>
          <div
            class="bg-primary/10 border border-primary rounded-lg p-4 mb-6 flex items-center gap-4"
          >
            <UIcon name="i-lucide-info"/>
            <div>
              <div class="font-medium">
                You have 21 days left in your Basic plan trial.
              </div>
              <div class="text-dimmed text-sm">
                To avoid any disruptions to your current workflow, upgrade your plan
                below.
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <div class="text-dimmed text-xs mb-1">Start date</div>
              <div class="font-semibold">March 22, 2023</div>
            </div>
            <div>
              <div class="text-dimmed text-xs mb-1">Next payment</div>
              <div class="font-semibold">Oct 22, 2023</div>
            </div>
            <div>
              <div class="text-dimmed text-xs mb-1">Billed</div>
              <div class="font-semibold">Monthly</div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="border border-default rounded-lg p-6 flex flex-col">
              <div class="font-medium text-primary mb-2">Free</div>
              <div class="text-2xl font-bold mb-1">
                $0 <span class="text-base font-normal">per month</span>
              </div>
              <div class="text-dimmed text-sm mb-4">
                The basics to get you started. Free forever.
              </div>
              <ul class="mb-6 space-y-1 text-sm">
                <li>✓ 5 team members</li>
                <li>✓ 20 event bookings</li>
                <li>✓ 10 meetings scheduled</li>
                <li>✓ Event notifications</li>
              </ul>
              <UButton
                label="Downgrade"
                size="sm"
                color="neutral"
                variant="soft"
                class="mt-auto flex justify-center"
              />
            </div>

            <div class="border-2 border-primary rounded-lg p-6 flex flex-col">
              <div class="font-medium text-primary mb-2">Professional</div>
              <div class="text-2xl font-bold mb-1">
                $29 <span class="text-base font-normal">per month</span>
              </div>
              <div class="text-dimmed text-sm mb-4">
                For small teams with calendar needs.
              </div>
              <ul class="mb-6 space-y-1 text-sm">
                <li>✓ 20 team members</li>
                <li>✓ 100 event bookings</li>
                <li>✓ 50 meetings scheduled</li>
                <li>✓ Premium support</li>
              </ul>
              <UButton
                label="Current plan"
                size="sm"
                color="primary"
                variant="solid"
                class="mt-auto flex justify-center"
              />
            </div>

            <div class="border border-default rounded-lg p-6 flex flex-col">
              <div class="font-medium text-primary mb-2">Enterprise</div>
              <div class="text-2xl font-bold mb-1">
                Contact us</div>
              <div class="text-dimmed text-sm mb-4">
                For larger teams or custom plans.
              </div>
              <ul class="mb-6 space-y-1 text-sm">
                <li>✓ SSO & user provisioning</li>
                <li>✓ SOC2 compliance</li>
                <li>✓ 24/7 support</li>
              </ul>
              <UButton
                label="Contact us"
                size="sm"
                color="primary"
                variant="soft"
                class="mt-auto flex justify-center"
              />
            </div>
          </div>
        </UCard>
      </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
