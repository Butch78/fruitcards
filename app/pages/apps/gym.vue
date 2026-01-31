<script lang="ts" setup>
import type { MainLift, WorkoutDay, WorkoutSet, NsunsDay } from "~/types";
import { liftConfig, accessories, nsunsSchedule, calculateProgression } from "~/data/gym";

// Training Max inputs
const benchTM = ref(60);
const squatTM = ref(80);
const deadliftTM = ref(100);
const ohpTM = ref(40);

// Gym params
const params = computed(() => ({
  bench: benchTM.value,
  squat: squatTM.value,
  deadlift: deadliftTM.value,
  ohp: ohpTM.value,
}));

const { data: gym, weekSchedule, getProgression } = useGym(params);

// State
const selectedDay = ref<NsunsDay | null>(null);
const completedSets = ref<Map<string, number>>(new Map());
const showTMEditor = ref(false);

// Get today's day index (0 = Monday for nSuns)
const todayIndex = computed(() => {
  const day = new Date().getDay();
  if (day === 0 || day === 6) return -1; // Weekend
  return day - 1;
});

// Current workout
const currentWorkout = computed(() => {
  if (selectedDay.value) {
    return weekSchedule.value.find((w) => w.id === selectedDay.value) || null;
  }
  if (todayIndex.value >= 0 && todayIndex.value < weekSchedule.value.length) {
    return weekSchedule.value[todayIndex.value];
  }
  return null;
});

// Format helpers
const formatWeight = (weight: number) => `${weight}kg`;

// Set completion tracking
const getSetKey = (exerciseId: string, setNumber: number) => `${exerciseId}-${setNumber}`;

const isSetCompleted = (exerciseId: string, setNumber: number) => {
  return completedSets.value.has(getSetKey(exerciseId, setNumber));
};

const getCompletedReps = (exerciseId: string, setNumber: number) => {
  return completedSets.value.get(getSetKey(exerciseId, setNumber));
};

const toggleSet = (exerciseId: string, set: WorkoutSet, reps?: number) => {
  const key = getSetKey(exerciseId, set.setNumber);
  if (completedSets.value.has(key)) {
    completedSets.value.delete(key);
  } else {
    completedSets.value.set(key, reps ?? set.reps);
  }
};

// AMRAP input modal
const showAmrapModal = ref(false);
const currentAmrapSet = ref<{ exerciseId: string; set: WorkoutSet; lift: MainLift } | null>(null);
const amrapReps = ref(0);

const openAmrapModal = (exerciseId: string, set: WorkoutSet, lift: MainLift) => {
  currentAmrapSet.value = { exerciseId, set, lift };
  amrapReps.value = set.reps;
  showAmrapModal.value = true;
};

const submitAmrap = () => {
  if (currentAmrapSet.value) {
    toggleSet(currentAmrapSet.value.exerciseId, currentAmrapSet.value.set, amrapReps.value);
  }
  showAmrapModal.value = false;
};

// Calculate progression preview
const progressionPreview = computed(() => {
  if (!currentAmrapSet.value) return null;
  const { lift } = currentAmrapSet.value;
  const currentTM = params.value[lift];
  return calculateProgression(lift, currentTM, amrapReps.value);
});

// Day selection
const selectDay = (dayId: NsunsDay) => {
  selectedDay.value = selectedDay.value === dayId ? null : dayId;
  completedSets.value.clear();
};

// Workout progress
const workoutProgress = computed(() => {
  if (!currentWorkout.value) return 0;
  const totalSets = currentWorkout.value.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  if (totalSets === 0) return 0;
  return (completedSets.value.size / totalSets) * 100;
});

// Personal records display
const prDisplay = computed(() => {
  if (!gym.value?.personalRecords) return [];
  return gym.value.personalRecords.map((pr) => ({
    ...pr,
    config: liftConfig[pr.lift],
  }));
});
</script>

<template>
  <UDashboardPanel id="gym">
    <template #header>
      <UDashboardNavbar title="Gym - nSuns 5/3/1 LP" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            label="Edit Training Maxes"
            icon="i-lucide-settings"
            variant="outline"
            @click="showTMEditor = true"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="space-y-6">
        <!-- Stats Cards -->
        <div class="grid grid-cols-6 gap-4">
          <!-- Training Maxes -->
          <UCard
            v-for="[lift, config] in Object.entries(liftConfig)"
            :key="lift"
            class="cursor-pointer hover:bg-elevated/50 transition-colors"
            @click="showTMEditor = true"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center"
                :style="{ backgroundColor: `${config.color}20` }"
              >
                <UIcon :name="config.icon" class="size-5" :style="{ color: config.color }" />
              </div>
              <div>
                <div class="text-xs text-muted uppercase">{{ config.name }}</div>
                <div class="text-xl font-bold">
                  {{ formatWeight(params[lift as MainLift]) }}
                </div>
              </div>
            </div>
          </UCard>

          <!-- Streak -->
          <UCard>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-orange-100 dark:bg-orange-900">
                <UIcon name="i-lucide-flame" class="size-5 text-orange-500" />
              </div>
              <div>
                <div class="text-xs text-muted uppercase">Streak</div>
                <div class="text-xl font-bold">{{ gym?.currentStreak ?? 0 }} days</div>
              </div>
            </div>
          </UCard>

          <!-- Total Workouts -->
          <UCard>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-green-100 dark:bg-green-900">
                <UIcon name="i-lucide-trophy" class="size-5 text-green-500" />
              </div>
              <div>
                <div class="text-xs text-muted uppercase">Workouts</div>
                <div class="text-xl font-bold">{{ gym?.totalWorkouts ?? 0 }}</div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Week Schedule -->
        <UCard>
          <div class="space-y-4">
            <div>
              <h2 class="text-lg font-semibold">Weekly Schedule</h2>
              <p class="text-sm text-muted">nSuns 5-Day Linear Progression</p>
            </div>

            <div class="grid grid-cols-5 gap-3">
              <button
                v-for="(day, index) in nsunsSchedule"
                :key="day.dayId"
                class="p-4 border rounded-lg text-left transition-all"
                :class="{
                  'border-primary bg-primary/10': selectedDay === day.dayId || (selectedDay === null && index === todayIndex),
                  'border-default hover:bg-elevated/50': selectedDay !== day.dayId && index !== todayIndex,
                  'ring-2 ring-primary ring-offset-2': index === todayIndex && selectedDay === null,
                }"
                @click="selectDay(day.dayId)"
              >
                <div class="font-medium">{{ day.name.split(' - ')[0] }}</div>
                <div class="text-sm text-muted mt-1">{{ day.name.split(' - ')[1] }}</div>
                <div class="flex gap-2 mt-2">
                  <UBadge
                    variant="soft"
                    size="xs"
                    :style="{ backgroundColor: `${liftConfig[day.t1].color}20`, color: liftConfig[day.t1].color }"
                  >
                    T1: {{ liftConfig[day.t1].name.split(' ')[0] }}
                  </UBadge>
                </div>
              </button>
            </div>
          </div>
        </UCard>

        <!-- Today's Workout -->
        <div class="grid grid-cols-3 gap-6">
          <UCard class="col-span-2">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-lg font-semibold">
                    {{ currentWorkout?.name || "Rest Day" }}
                  </h2>
                  <p class="text-sm text-muted">
                    {{ currentWorkout ? `T1: ${liftConfig[currentWorkout.t1Lift].name} • T2: ${liftConfig[currentWorkout.t2Lift].name}` : "No workout scheduled" }}
                  </p>
                </div>
                <div v-if="currentWorkout" class="text-right">
                  <div class="text-sm text-muted">Progress</div>
                  <div class="text-lg font-semibold">{{ workoutProgress.toFixed(0) }}%</div>
                </div>
              </div>

              <!-- Progress bar -->
              <div v-if="currentWorkout" class="h-2 bg-elevated rounded-full overflow-hidden">
                <div
                  class="h-full bg-primary rounded-full transition-all duration-300"
                  :style="{ width: `${workoutProgress}%` }"
                />
              </div>

              <!-- Exercises -->
              <div v-if="currentWorkout" class="space-y-6">
                <div
                  v-for="exercise in currentWorkout.exercises"
                  :key="exercise.id"
                  class="space-y-3"
                >
                  <div class="flex items-center gap-3">
                    <UBadge
                      :color="exercise.tier === 'T1' ? 'primary' : 'secondary'"
                      variant="solid"
                    >
                      {{ exercise.tier }}
                    </UBadge>
                    <h3 class="font-semibold">{{ exercise.name }}</h3>
                  </div>

                  <!-- Sets Table -->
                  <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                      <thead>
                        <tr class="text-left text-muted">
                          <th class="py-2 pr-4 w-16">Set</th>
                          <th class="py-2 pr-4">Weight</th>
                          <th class="py-2 pr-4">Reps</th>
                          <th class="py-2 pr-4 w-24">%TM</th>
                          <th class="py-2 w-24">Done</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="set in exercise.sets"
                          :key="set.setNumber"
                          class="border-t border-default"
                          :class="{ 'bg-green-50 dark:bg-green-950/30': isSetCompleted(exercise.id, set.setNumber) }"
                        >
                          <td class="py-3 pr-4 font-medium">{{ set.setNumber }}</td>
                          <td class="py-3 pr-4 font-semibold">{{ formatWeight(set.weight) }}</td>
                          <td class="py-3 pr-4">
                            <div class="flex items-center gap-2">
                              <span>{{ set.reps }}</span>
                              <UBadge v-if="set.isAmrap" color="warning" variant="soft" size="xs">
                                AMRAP
                              </UBadge>
                            </div>
                          </td>
                          <td class="py-3 pr-4 text-muted">{{ (set.percentage * 100).toFixed(0) }}%</td>
                          <td class="py-3">
                            <div class="flex items-center gap-2">
                              <UButton
                                v-if="set.isAmrap && !isSetCompleted(exercise.id, set.setNumber)"
                                size="xs"
                                color="warning"
                                variant="soft"
                                @click="openAmrapModal(exercise.id, set, exercise.lift as MainLift)"
                              >
                                Log AMRAP
                              </UButton>
                              <UButton
                                v-else
                                :icon="isSetCompleted(exercise.id, set.setNumber) ? 'i-lucide-check' : 'i-lucide-circle'"
                                :color="isSetCompleted(exercise.id, set.setNumber) ? 'success' : 'neutral'"
                                :variant="isSetCompleted(exercise.id, set.setNumber) ? 'solid' : 'outline'"
                                size="xs"
                                @click="toggleSet(exercise.id, set)"
                              >
                                {{ isSetCompleted(exercise.id, set.setNumber) ? getCompletedReps(exercise.id, set.setNumber) : '' }}
                              </UButton>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <!-- Rest Day Message -->
              <div v-else class="text-center py-12">
                <UIcon name="i-lucide-bed" class="size-12 text-muted mx-auto mb-4" />
                <h3 class="text-lg font-medium">Rest Day</h3>
                <p class="text-muted mt-2">
                  Recovery is just as important as training. See you tomorrow!
                </p>
              </div>
            </div>
          </UCard>

          <!-- Accessories & PRs -->
          <div class="space-y-6">
            <!-- Accessories -->
            <UCard v-if="currentWorkout">
              <div class="space-y-4">
                <h3 class="font-semibold">Accessories</h3>
                <div class="space-y-2">
                  <div
                    v-for="(accessory, index) in accessories[currentWorkout.id]"
                    :key="index"
                    class="flex items-center justify-between py-2 border-b border-default last:border-0"
                  >
                    <span>{{ accessory.name }}</span>
                    <span class="text-sm text-muted">
                      {{ accessory.sets }}×{{ accessory.reps }}
                    </span>
                  </div>
                </div>
              </div>
            </UCard>

            <!-- Personal Records -->
            <UCard>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <h3 class="font-semibold">Personal Records</h3>
                  <UIcon name="i-lucide-trophy" class="size-5 text-yellow-500" />
                </div>
                <div class="space-y-3">
                  <div
                    v-for="pr in prDisplay"
                    :key="pr.lift"
                    class="flex items-center justify-between"
                  >
                    <div class="flex items-center gap-2">
                      <div
                        class="w-8 h-8 rounded flex items-center justify-center"
                        :style="{ backgroundColor: `${pr.config.color}20` }"
                      >
                        <UIcon :name="pr.config.icon" class="size-4" :style="{ color: pr.config.color }" />
                      </div>
                      <span class="text-sm">{{ pr.config.name }}</span>
                    </div>
                    <span class="font-semibold">{{ formatWeight(pr.weight) }}</span>
                  </div>
                </div>
              </div>
            </UCard>

            <!-- Program Info -->
            <UCard class="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800">
              <div class="space-y-2">
                <h3 class="font-semibold text-blue-900 dark:text-blue-100">About nSuns 5/3/1</h3>
                <ul class="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• High volume linear progression</li>
                  <li>• AMRAP sets drive progression</li>
                  <li>• 17 working sets for main lifts</li>
                  <li>• Auto-regulates based on performance</li>
                </ul>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </template>

    <!-- AMRAP Modal -->
    <UModal v-model:open="showAmrapModal">
      <template #content>
        <UCard class="w-full max-w-sm">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold">Log AMRAP Set</h2>
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="neutral"
                size="sm"
                @click="showAmrapModal = false"
              />
            </div>
          </template>

          <div class="space-y-4">
            <div class="text-center">
              <div class="text-sm text-muted">Weight</div>
              <div class="text-2xl font-bold">
                {{ currentAmrapSet ? formatWeight(currentAmrapSet.set.weight) : '' }}
              </div>
              <div class="text-sm text-muted mt-1">
                Target: {{ currentAmrapSet?.set.reps }}+ reps
              </div>
            </div>

            <UFormField label="Reps Completed">
              <UInput
                v-model.number="amrapReps"
                type="number"
                min="0"
                max="30"
                class="text-center text-xl"
              />
            </UFormField>

            <!-- Progression Preview -->
            <div
              v-if="progressionPreview"
              class="p-3 rounded-lg"
              :class="{
                'bg-green-50 dark:bg-green-950': progressionPreview.increase > 0,
                'bg-yellow-50 dark:bg-yellow-950': progressionPreview.increase === 0,
                'bg-red-50 dark:bg-red-950': progressionPreview.increase < 0,
              }"
            >
              <div class="text-sm font-medium">
                TM Progression
              </div>
              <div class="flex items-center gap-2 mt-1">
                <span>{{ formatWeight(params[currentAmrapSet!.lift]) }}</span>
                <UIcon name="i-lucide-arrow-right" class="size-4" />
                <span class="font-semibold">{{ formatWeight(progressionPreview.newTM) }}</span>
                <UBadge
                  :color="progressionPreview.increase > 0 ? 'success' : progressionPreview.increase < 0 ? 'error' : 'warning'"
                  variant="soft"
                  size="xs"
                >
                  {{ progressionPreview.increase > 0 ? '+' : '' }}{{ progressionPreview.increase }}kg
                </UBadge>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton label="Cancel" variant="outline" color="neutral" @click="showAmrapModal = false" />
              <UButton label="Log Set" color="success" @click="submitAmrap" />
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <!-- Training Max Editor Modal -->
    <UModal v-model:open="showTMEditor">
      <template #content>
        <UCard class="w-full max-w-md">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold">Edit Training Maxes</h2>
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="neutral"
                size="sm"
                @click="showTMEditor = false"
              />
            </div>
          </template>

          <div class="space-y-4">
            <p class="text-sm text-muted">
              Training Max (TM) should be ~90% of your true 1RM. All working sets are calculated from your TM.
            </p>

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Bench Press (kg)">
                <UInput v-model.number="benchTM" type="number" min="20" step="2.5" />
              </UFormField>
              <UFormField label="Squat (kg)">
                <UInput v-model.number="squatTM" type="number" min="20" step="2.5" />
              </UFormField>
              <UFormField label="Deadlift (kg)">
                <UInput v-model.number="deadliftTM" type="number" min="20" step="2.5" />
              </UFormField>
              <UFormField label="Overhead Press (kg)">
                <UInput v-model.number="ohpTM" type="number" min="20" step="2.5" />
              </UFormField>
            </div>

            <div class="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
              <div class="flex items-start gap-2">
                <UIcon name="i-lucide-lightbulb" class="size-5 text-yellow-600 mt-0.5" />
                <div class="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Tip:</strong> If unsure, start conservative. It's better to progress up than to fail sets.
                </div>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end">
              <UButton label="Save" @click="showTMEditor = false" />
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </UDashboardPanel>
</template>
