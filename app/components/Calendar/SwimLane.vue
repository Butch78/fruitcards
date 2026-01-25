<script setup lang="ts">
import { useHorizontalDragScroll } from "~/composables/useHorizontalDragScroll";
import { events as staticEvents } from "~/data/events";

const {
  container: scrollContainer,
  onDragStart,
  onDragMove,
  onDragEnd,
  onTouchStart,
  onTouchMove,
} = useHorizontalDragScroll();

const demoEvents = staticEvents.map((event, idx) => {
  if (idx === 2) {
    return { ...event, category: "Conflict" };
  }
  if (idx === 4) {
    return { ...event, category: "Canceled" };
  }
  return event;
});




type NuxtUIColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral';
type BadgeMeta = {
  icon: string;
  color: NuxtUIColor;
  text: string;
  action: string;
};

const badgeMetaMap: Record<string, BadgeMeta> = {
  Meeting: {
    icon: 'i-lucide-circle-check',
    color: 'success',
    text: 'Meeting',
    action: 'Join Meeting',
  },
  Conflict: {
    icon: 'i-lucide-alert-triangle',
    color: 'warning',
    text: 'Conflict',
    action: 'See Conflicts',
  },
  Canceled: {
    icon: 'i-lucide-x-octagon',
    color: 'error',
    text: 'Canceled',
    action: '',
  },
};

const cards = demoEvents.map((event) => {
  const badge = event.category;
  const meta: BadgeMeta = badge && badgeMetaMap[badge]
    ? badgeMetaMap[badge]
    : {
        icon: 'i-lucide-info',
        color: 'info',
        text: badge || '',
        action: '',
      };
  return {
    id: event.id,
    title: event.title,
    time: `${event.startTime} - ${event.endTime}`,
    badge,
    badgeMeta: meta,
    action: meta.action,
    meetLink: event.meetLink,
    date: event.date ? new Date(event.date).toLocaleDateString() : "",
    background: event.background,
    backgroundDimmed: event.backgroundDimmed,
    borderColor: event.borderColor,
  };
});
</script>

<template>
  <div
    ref="scrollContainer"
    class="flex gap-4 w-full overflow-x-auto scrollbar-hide"
    style="cursor: grab"
    @mousedown="onDragStart"
    @mousemove="onDragMove"
    @mouseup="onDragEnd"
    @mouseleave="onDragEnd"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onDragEnd"
  >
    <UCard
      v-for="card in cards"
      :key="card.id"
      :ui="{ body: 'p-4 sm:p-4' }"
      class="border border-default flex-shrink-0"
      :style="{
        width: '20%',
      }"
    >
      <FlexBetween class="items-start">
        <div>
          <div class="font-semibold text-sm">
            {{ card.title }}
          </div>
          <p class="text-xs text-muted tracking-wide">
            {{ card.time }}
          </p>
        </div>
        <UIcon name="i-lucide-chevron-down" />
      </FlexBetween>

      <UBadge
        class="w-full mt-4 border-0 ring-0 p-2"
        :icon="card.badgeMeta.icon"
        :color="card.badgeMeta.color"
      >
        <FlexBetween class="text-default">
          <div>{{ card.badgeMeta.text }}</div>
          <div>
            <template v-if="card.badge === 'Meeting'">
              <a :href="card.meetLink" target="_blank" class="underline">{{ card.badgeMeta.action }}</a>
            </template>
            <template v-else-if="card.badge === 'Conflict'">
              <a href="#" class="underline">{{ card.badgeMeta.action }}</a>
            </template>
            <template v-else-if="card.badge === 'Canceled'">
              <span class="text-xs text-muted">{{ card.date }}</span>
            </template>
            <template v-else>
              <span class="text-xs text-muted">{{ card.action }}</span>
            </template>
          </div>
        </FlexBetween>
      </UBadge>
    </UCard>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
</style>
