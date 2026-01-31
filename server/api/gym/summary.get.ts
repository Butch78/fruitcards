import { getGymSummary, defaultTrainingMaxes } from "~/data/gym";
import type { MainLift } from "~/types";

export default defineEventHandler((event) => {
  const query = getQuery(event);

  // Allow overriding training maxes via query params
  const trainingMaxes = { ...defaultTrainingMaxes };

  if (query.bench) {
    trainingMaxes.bench = { ...trainingMaxes.bench, weight: Number(query.bench) };
  }
  if (query.squat) {
    trainingMaxes.squat = { ...trainingMaxes.squat, weight: Number(query.squat) };
  }
  if (query.deadlift) {
    trainingMaxes.deadlift = { ...trainingMaxes.deadlift, weight: Number(query.deadlift) };
  }
  if (query.ohp) {
    trainingMaxes.ohp = { ...trainingMaxes.ohp, weight: Number(query.ohp) };
  }

  return getGymSummary(trainingMaxes);
});
