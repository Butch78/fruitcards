<script setup lang="ts">
import { twMerge } from 'tailwind-merge'

const props = defineProps<{ class?: string }>()
const mergedClass = computed(() => twMerge('flex flex-col justify-center', props.class))
</script>

<template>
  <div :class="mergedClass">
    <slot/>
  </div>
</template>