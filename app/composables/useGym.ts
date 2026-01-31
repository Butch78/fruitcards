import type { GymSummary, MainLift, WorkoutDay } from "~/types";
import { getWeekSchedule, calculateProgression } from "~/data/gym";

export interface GymParams {
  bench?: number;
  squat?: number;
  deadlift?: number;
  ohp?: number;
}

export const useGym = (params?: Ref<GymParams>) => {
  const queryParams = computed(() => ({
    ...(params?.value || {}),
  }));

  const { data, status, refresh } = useFetch<GymSummary>("/api/gym/summary", {
    query: queryParams,
  });

  // Get full week schedule based on current TMs
  const weekSchedule = computed(() => {
    if (!data.value?.trainingMaxes) return [];
    return getWeekSchedule(data.value.trainingMaxes);
  });

  // Calculate progression after AMRAP
  const getProgression = (lift: MainLift, amrapReps: number) => {
    if (!data.value?.trainingMaxes) return null;
    const currentTM = data.value.trainingMaxes[lift].weight;
    return calculateProgression(lift, currentTM, amrapReps);
  };

  return {
    data,
    status,
    refresh,
    weekSchedule,
    getProgression,
  };
};
