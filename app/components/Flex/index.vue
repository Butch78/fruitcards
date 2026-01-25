<script setup lang="ts">
import { twMerge } from 'tailwind-merge'

const props = defineProps<{ class?: string }>()
const mergedClass = computed(() => twMerge('flex items-center', props.class))
</script>

<template>
  <div :class="mergedClass">
    <slot/>
  </div>
</template>