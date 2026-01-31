import type {
  MainLift,
  NsunsDay,
  TrainingMax,
  WorkoutSet,
  WorkoutDay,
  WorkoutLog,
  GymSummary,
} from "~/types";

// Lift configuration
export const liftConfig: Record<MainLift, { name: string; icon: string; color: string }> = {
  bench: { name: "Bench Press", icon: "i-lucide-dumbbell", color: "#3b82f6" },
  squat: { name: "Squat", icon: "i-lucide-arrow-down-to-line", color: "#ef4444" },
  deadlift: { name: "Deadlift", icon: "i-lucide-arrow-up-from-line", color: "#22c55e" },
  ohp: { name: "Overhead Press", icon: "i-lucide-arrow-up", color: "#f59e0b" },
};

// nSuns 5-Day LP T1 (Main Lift) percentages and reps
export const t1Scheme = [
  { percentage: 0.75, reps: 5, isAmrap: false },
  { percentage: 0.85, reps: 3, isAmrap: false },
  { percentage: 0.95, reps: 1, isAmrap: true }, // AMRAP set!
  { percentage: 0.90, reps: 3, isAmrap: false },
  { percentage: 0.85, reps: 3, isAmrap: false },
  { percentage: 0.80, reps: 3, isAmrap: false },
  { percentage: 0.75, reps: 5, isAmrap: false },
  { percentage: 0.70, reps: 5, isAmrap: false },
  { percentage: 0.65, reps: 5, isAmrap: true }, // AMRAP set!
];

// nSuns T2 (Secondary Lift) percentages and reps
export const t2Scheme = [
  { percentage: 0.50, reps: 6, isAmrap: false },
  { percentage: 0.60, reps: 5, isAmrap: false },
  { percentage: 0.70, reps: 3, isAmrap: false },
  { percentage: 0.70, reps: 5, isAmrap: false },
  { percentage: 0.70, reps: 7, isAmrap: false },
  { percentage: 0.70, reps: 4, isAmrap: false },
  { percentage: 0.70, reps: 6, isAmrap: false },
  { percentage: 0.70, reps: 8, isAmrap: false },
];

// nSuns 5-Day LP Schedule
export const nsunsSchedule: { dayId: NsunsDay; name: string; t1: MainLift; t2: MainLift }[] = [
  { dayId: "day1", name: "Monday - Bench/OHP", t1: "bench", t2: "ohp" },
  { dayId: "day2", name: "Tuesday - Squat/Sumo DL", t1: "squat", t2: "deadlift" },
  { dayId: "day3", name: "Wednesday - OHP/Incline", t1: "ohp", t2: "bench" },
  { dayId: "day4", name: "Thursday - Deadlift/Front Squat", t1: "deadlift", t2: "squat" },
  { dayId: "day5", name: "Friday - Bench/CG Bench", t1: "bench", t2: "bench" },
];

// Accessory exercises by day
export const accessories: Record<NsunsDay, { name: string; sets: number; reps: string }[]> = {
  day1: [
    { name: "Dumbbell Rows", sets: 4, reps: "8-12" },
    { name: "Lat Pulldowns", sets: 4, reps: "8-12" },
    { name: "Face Pulls", sets: 4, reps: "15-20" },
    { name: "Tricep Pushdowns", sets: 3, reps: "10-15" },
  ],
  day2: [
    { name: "Leg Press", sets: 3, reps: "8-12" },
    { name: "Leg Curls", sets: 4, reps: "10-12" },
    { name: "Calf Raises", sets: 4, reps: "12-15" },
    { name: "Ab Wheel", sets: 3, reps: "10-15" },
  ],
  day3: [
    { name: "Pull-ups", sets: 4, reps: "AMRAP" },
    { name: "Dumbbell Lateral Raises", sets: 4, reps: "12-15" },
    { name: "Face Pulls", sets: 4, reps: "15-20" },
    { name: "Bicep Curls", sets: 3, reps: "10-12" },
  ],
  day4: [
    { name: "Barbell Rows", sets: 4, reps: "6-8" },
    { name: "Leg Curls", sets: 4, reps: "10-12" },
    { name: "Back Extensions", sets: 3, reps: "12-15" },
    { name: "Hanging Leg Raises", sets: 3, reps: "10-15" },
  ],
  day5: [
    { name: "Dumbbell Rows", sets: 4, reps: "8-12" },
    { name: "Chest Flyes", sets: 3, reps: "12-15" },
    { name: "Face Pulls", sets: 4, reps: "15-20" },
    { name: "Tricep Dips", sets: 3, reps: "8-12" },
  ],
};

// Default Training Maxes (user should update these)
export const defaultTrainingMaxes: Record<MainLift, TrainingMax> = {
  bench: { lift: "bench", weight: 60, unit: "kg", updatedAt: new Date() },
  squat: { lift: "squat", weight: 80, unit: "kg", updatedAt: new Date() },
  deadlift: { lift: "deadlift", weight: 100, unit: "kg", updatedAt: new Date() },
  ohp: { lift: "ohp", weight: 40, unit: "kg", updatedAt: new Date() },
};

// Calculate weight from percentage and TM
export function calculateWeight(tm: number, percentage: number, roundTo: number = 2.5): number {
  const weight = tm * percentage;
  return Math.round(weight / roundTo) * roundTo;
}

// Generate sets for a lift based on scheme
export function generateSets(
  tm: number,
  scheme: typeof t1Scheme,
  tier: "T1" | "T2"
): WorkoutSet[] {
  return scheme.map((set, index) => ({
    setNumber: index + 1,
    reps: set.reps,
    percentage: set.percentage,
    weight: calculateWeight(tm, set.percentage),
    isAmrap: set.isAmrap,
    completedReps: null,
    isCompleted: false,
  }));
}

// Generate workout day with calculated weights
export function generateWorkoutDay(
  dayConfig: typeof nsunsSchedule[0],
  trainingMaxes: Record<MainLift, TrainingMax>
): WorkoutDay {
  const t1TM = trainingMaxes[dayConfig.t1].weight;
  const t2TM = trainingMaxes[dayConfig.t2].weight;

  return {
    id: dayConfig.dayId,
    name: dayConfig.name,
    t1Lift: dayConfig.t1,
    t2Lift: dayConfig.t2,
    exercises: [
      {
        id: `${dayConfig.dayId}-t1`,
        name: liftConfig[dayConfig.t1].name,
        lift: dayConfig.t1,
        tier: "T1",
        sets: generateSets(t1TM, t1Scheme, "T1"),
      },
      {
        id: `${dayConfig.dayId}-t2`,
        name: liftConfig[dayConfig.t2].name + (dayConfig.t1 === dayConfig.t2 ? " (Close Grip)" : ""),
        lift: dayConfig.t2,
        tier: "T2",
        sets: generateSets(t2TM, t2Scheme, "T2"),
      },
    ],
  };
}

// Calculate TM progression based on AMRAP performance
export function calculateProgression(
  lift: MainLift,
  currentTM: number,
  amrapReps: number
): { newTM: number; increase: number } {
  let increase = 0;

  // nSuns progression rules for the +1 set (95% AMRAP)
  if (amrapReps < 2) {
    increase = -5; // Decrease TM
  } else if (amrapReps === 2) {
    increase = 0; // Keep same
  } else if (amrapReps === 3) {
    increase = 2.5;
  } else if (amrapReps === 4) {
    increase = 2.5;
  } else if (amrapReps >= 5) {
    // Upper body vs lower body progression
    if (lift === "bench" || lift === "ohp") {
      increase = 2.5;
    } else {
      increase = 5;
    }
  }

  return {
    newTM: Math.max(20, currentTM + increase),
    increase,
  };
}

// Sample workout logs
export const sampleWorkoutLogs: WorkoutLog[] = [
  {
    id: "log-1",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    dayId: "day4",
    exercises: [
      {
        exerciseId: "day4-t1",
        sets: [
          { setNumber: 1, weight: 75, targetReps: 5, completedReps: 5, isAmrap: false },
          { setNumber: 2, weight: 85, targetReps: 3, completedReps: 3, isAmrap: false },
          { setNumber: 3, weight: 95, targetReps: 1, completedReps: 4, isAmrap: true },
        ],
      },
    ],
    notes: "Felt strong today!",
    duration: 75,
  },
  {
    id: "log-2",
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    dayId: "day3",
    exercises: [],
    notes: null,
    duration: 60,
  },
];

// Get today's workout based on day of week
export function getTodaysWorkout(trainingMaxes: Record<MainLift, TrainingMax>): WorkoutDay | null {
  const dayOfWeek = new Date().getDay();

  // Map day of week to nSuns day (Mon-Fri = days 1-5)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return null; // Weekend - rest day
  }

  const nsunsDayIndex = dayOfWeek - 1;
  if (nsunsDayIndex >= nsunsSchedule.length) {
    return null;
  }

  return generateWorkoutDay(nsunsSchedule[nsunsDayIndex], trainingMaxes);
}

// Get gym summary
export function getGymSummary(trainingMaxes: Record<MainLift, TrainingMax> = defaultTrainingMaxes): GymSummary {
  const todaysWorkout = getTodaysWorkout(trainingMaxes);

  return {
    trainingMaxes,
    currentWeek: 1,
    todaysWorkout,
    recentLogs: sampleWorkoutLogs,
    personalRecords: [
      { lift: "bench", weight: 70, reps: 1, date: new Date("2025-01-15") },
      { lift: "squat", weight: 100, reps: 1, date: new Date("2025-01-10") },
      { lift: "deadlift", weight: 120, reps: 1, date: new Date("2025-01-12") },
      { lift: "ohp", weight: 50, reps: 1, date: new Date("2025-01-08") },
    ],
    totalWorkouts: 24,
    currentStreak: 3,
  };
}

// Get full week schedule
export function getWeekSchedule(trainingMaxes: Record<MainLift, TrainingMax>): WorkoutDay[] {
  return nsunsSchedule.map((day) => generateWorkoutDay(day, trainingMaxes));
}
