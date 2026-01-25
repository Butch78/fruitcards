<script setup lang="ts">
import { formatTimeAgo } from '@vueuse/core'
import type { Notification } from '~/types'
import type { TabsItem } from '@nuxt/ui'

const { isNotificationsSlideOverOpen } = useDashboard()

const { data: notifications } = await useFetch<Notification[]>('/api/notifications')

const tabs: TabsItem[] = [
  {
    label: 'Today',
    value: 'today',
    icon: 'i-lucide-sun'
  },
  {
    label: 'This Week',
    value: 'week',
    icon: 'i-lucide-calendar'
  },
  {
    label: 'Earlier',
    value: 'earlier',
    icon: 'i-lucide-history'
  }
]

const now = new Date()
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

const currentFilter = ref('today')
const currentNotification = ref()

const filteredNotifications = computed(() => notifications?.value?.filter((notification) => {
  const notificationDate = new Date(notification.date)
  if (currentFilter.value === 'today') {
    return notificationDate >= today
  } else if (currentFilter.value === 'week') {
    return notificationDate >= weekAgo && notificationDate < today
  } else {
    return notificationDate < weekAgo
  }
}))

function toggleNotification(notification) {
  currentNotification.value = notification
}

function isActive(notificationId: string) {
  return currentNotification.value && currentNotification.value.id === notificationId
}
</script>

<template>
  <USlideover
    v-model:open="isNotificationsSlideOverOpen"
    title="Notifications"
    class="m-4 rounded-xl"
    :ui="{
      overlay: 'bg-black/50',
      content: 'bg-default',
      body: 'p-2 sm:p-4'
    }"
  >
    <template #body>
      <UTabs
        v-model="currentFilter"
        :items="tabs"
      >
        <template #content>
          <div class=" mt-4">
            <div
              v-for="notification in filteredNotifications"
              :key="notification.id"
              class=""
              @click="toggleNotification(notification)"
            >
              <div
                class="px-3 rounded-md hover:bg-elevated/50 flex items-start gap-5 relative block cursor-pointer"
                :class="isActive(notification.id) ? 'py-4 bg-elevated/50' : 'py-4'"
              >
                <UChip
                  color="error"
                  :show="!!notification.unread"
                  inset
                >
                  <UAvatar
                    v-bind="notification.sender.avatar"
                    :alt="notification.sender.name"
                    size="xl"
                  />
                </UChip>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center justify-start gap-2">
                      <span class="text-highlighted font-medium truncate">{{ notification.sender.name }}</span>

                      <time
                        :datetime="notification.date"
                        class="text-muted text-xs whitespace-nowrap"
                        v-text="formatTimeAgo(new Date(notification.date))"
                      />
                    </div>
                    <div>
                      <UDropdownMenu
                        :items="[
                          [
                            {
                              label: notification.sender.name,
                              type: 'label'
                            }
                          ],
                          [
                            {
                              label: 'Mark as read',
                              onSelect: () => {
                                // Handle mark as read
                              }
                            },
                            {
                              label: 'Edit',
                              onSelect: () => {
                                // Handle edit
                              }
                            }
                          ]
                        ]"
                      >
                        <UButton
                          icon="i-lucide-ellipsis-vertical"
                          variant="link"
                          size="xs"
                        />
                      </UDropdownMenu>
                    </div>
                  </div>

                  <p class="text-dimmed truncate text-sm">
                    {{ notification.body }}
                  </p>

                  <div
                    v-show="isActive(notification.id)"
                    class="flex gap-2 mt-2"
                  >
                    <UButton
                      label="Ignore"
                      variant="soft"
                      size="sm"
                    />
                    <UButton
                      label="Accept"
                      variant="solid"
                      color="primary"
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </UTabs>
    </template>
  </USlideover>
</template>
