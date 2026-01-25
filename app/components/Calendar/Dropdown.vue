<script lang="ts" setup>
interface DropdownProps {
  align?: "center" | "left" | "right";
  modelValue: { start: Date; end?: Date };
}

const props = defineProps<DropdownProps>();

const emit = defineEmits(["update:modelValue"]);

const internalValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    internalValue.value = newValue;
  }
);

function formatDate() {
  const start = internalValue.value.start.toLocaleDateString("nl-NL");
  const end = internalValue.value.end?.toLocaleDateString("nl-NL");
  return end ? `${start} - ${end}` : start;
}

const calendarVisible = ref(false);

function toggleDropdown() {
  calendarVisible.value = !calendarVisible.value;
}

function applyDateChange() {
  emit("update:modelValue", internalValue.value);
  toggleDropdown();
}

const quickRanges = [
  "Today",
  "Yesterday",
  "This week (Sun–Today)",
  "Last week (Sun–Sat)",
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
];

const duration = ref("Yesterday");
</script>

<template>
  <div
    class="relative flex items-start"
    :class="{
      'justify-center': props.align === 'center',
      'justify-start': props.align === 'left',
      'justify-end': props.align === 'right',
    }"
  >
    <UButton ref="trigger" @click="toggleDropdown">
      <template #leading>
        <UIcon name="i-lucide-calendar" />
        <span class="border-inverted/10 mr-1 ml-1 border-l-1 pl-2 font-normal">{{
          formatDate()
        }}</span>
      </template>
      <UIcon name="i-lucide-chevron-down" class="text-dimmed" size="20" />
    </UButton>
    <div
      v-if="calendarVisible"
      :class="[
        'absolute z-10 mt-10 flex items-stretch shadow-lg',
        props.align === 'center' ? 'left-1/2 -translate-x-1/2' : '',
        props.align === 'left' ? 'left-0' : '',
        props.align === 'right' ? 'right-0' : '',
      ]"
    >
      <UCard class="!bg-default">
        <div class="flex gap-4">
          <div class="space-y-2">
            <UButton
              v-for="(label, labelKey) in quickRanges"
              :key="labelKey"
              variant="link"
              color="neutral"
              :active="duration === label"
              active-color="primary"
              class="block whitespace-nowrap"
              @click="duration = label"
            >
              {{ label }}
            </UButton>
          </div>

          <div class="w-80">
            <Calendar v-model="internalValue" />
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              variant="link"
              color="primary"
              size="xl"
              @click="toggleDropdown"
              >Cancel</UButton
            >
            <UButton
              variant="link"
              color="primary"
              size="xl"
              @click="applyDateChange"
              >Apply</UButton
            >
          </div>
        </template>
      </UCard>
    </div>
    <div
      v-if="calendarVisible"
      class="dark:bg-default/50 fixed inset-0 z-5 size-full"
      @click="toggleDropdown"
    />
  </div>
</template>
