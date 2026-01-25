<script setup lang="ts">
interface Contact {
  id: string;
  name: string;
  img: string;
  contactInfo: string;
}

const contacts: Contact[] = [
  {
    id: "1",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Sarah Chen",
    contactInfo: "sarah.chen@example.com",
  },
  {
    id: "2",
    img: "https://randomuser.me/api/portraits/men/11.jpg",
    name: "Marketing Team",
    contactInfo: "marketing@example.com",
  },
  {
    id: "3",
    img: "https://randomuser.me/api/portraits/men/12.jpg",
    name: "John Smith",
    contactInfo: "+1-555-123-4567",
  },
  {
    id: "4",
    img: "https://randomuser.me/api/portraits/women/51.jpg",
    name: "Tess Johnson",
    contactInfo: "tess.johnson@example.com",
  },
];
</script>


<template>
  <div class="space-y-4">
    <FlexBetween>
      <h2 class="text-xl font-semibold text-highlighted">Tasks</h2>
      <Flex>
        <UButton variant="link" color="neutral" icon="i-lucide-info" />
        <UButton variant="link" color="neutral" icon="i-lucide-settings" />
        <UButton variant="link" color="neutral" icon="i-lucide-trash-2" />
      </Flex>
    </FlexBetween>

    <div class="divide-y divide-default">
      <div
        v-for="contact in contacts"
        :key="contact.id"
        class="px-2 py-4 hover:bg-muted/50 transition-colors cursor-pointer group"
      >
        <div class="flex items-center gap-4">
          <div
            class="p-[1px] rounded-full bg-gradient-to-tr from-primary to-warning"
          >
            <div class="border-4 border-bg rounded-full">
              <UAvatar :alt="contact.name" :src="contact.img" size="xl">
                {{
                  contact.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                }}
              </UAvatar>
            </div>
          </div>

          <div class="w-full">
            <div class="font-semibold">{{ contact.name }}</div>
            <div class="flex items-center justify-between">
              <p class="text-sm text-default truncate mb-1 text-dimmed">
                {{ contact.contactInfo }}
              </p>
            </div>
          </div>
          <UButton
            icon="i-lucide-chevron-right"
            variant="ghost"
            size="sm"
            color="neutral"
          />
        </div>
      </div>
    </div>
  </div>
</template>