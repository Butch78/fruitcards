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

    <div class="space-y-1">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="group flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
        @click="toggleTask(task.id)"
      >
        <div class="flex-shrink-0 w-8 text-sm font-medium text-muted">
          {{ String(task.id).padStart(2, "0") }}
        </div>

        <div class="flex-shrink-0">
          <div
            class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
            :class="
              task.isCompleted
                ? 'bg-warning border-warning'
                : 'border-muted group-hover:border-default'
            "
          >
            <UIcon
              v-if="task.isCompleted"
              name="i-lucide-check"
              class="w-3 h-3 text-white"
            />
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-2">
            <span
              class="text-sm font-medium transition-colors"
              :class="
                task.isCompleted ? 'text-muted line-through' : 'text-default'
              "
            >
              {{ task.title }}
            </span>

            <div class="flex items-center justify-center gap-4">
              <div
                v-if="task.subtasks"
                class="flex items-center gap-1 text-xs text-muted"
              >
                <UIcon name="i-lucide-folder" class="w-3 h-3" />
                <span>{{ task.subtasks }}</span>
              </div>

              <div
                v-if="task.comments"
                class="flex items-center gap-1 text-xs text-muted"
              >
                <UIcon name="i-lucide-message-circle" class="w-3 h-3" />
                <span>{{ task.comments }}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="task.isInProgress"
          class="flex-shrink-0 w-2 h-2 bg-warning rounded-full"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Task {
  id: number;
  title: string;
  subtasks?: number;
  comments?: number;
  isCompleted?: boolean;
  isInProgress?: boolean;
}

const tasks = ref<Task[]>([
  {
    id: 1,
    title: "Create wireframe",
    isCompleted: false,
  },
  {
    id: 2,
    title: "Slack Logo Design",
    subtasks: 3,
    comments: 5,
    isCompleted: false,
  },
  {
    id: 3,
    title: "Dashboard Design",
    comments: 5,
    isCompleted: false,
  },
  {
    id: 4,
    title: "Create wireframe",
    isCompleted: true,
    isInProgress: true,
  },
  {
    id: 5,
    title: "Google Logo Design",
    isCompleted: true,
    isInProgress: true,
  },
  {
    id: 6,
    title: "Slack Logo Design",
    isCompleted: false,
  },
  {
    id: 7,
    title: "Dashboard Design",
    comments: 5,
    isCompleted: false,
  },
]);

const completedCount = computed(
  () => tasks.value.filter((task) => task.isCompleted).length
);

const toggleTask = (taskId: number) => {
  const task = tasks.value.find((t) => t.id === taskId);
  if (task) {
    task.isCompleted = !task.isCompleted;
  }
};
</script>

<style scoped>
.line-through {
  text-decoration: line-through;
}
</style>
