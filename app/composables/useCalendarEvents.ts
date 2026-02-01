import type { CalendarEvent } from "nuxt-calendar";
import { nsunsSchedule, liftConfig } from "~/data/gym";

// Color schemes for different event types
const eventColors = {
  gym: {
    background: "#22c55e",
    backgroundDimmed: "#16a34a",
    borderColor: "#15803d",
  },
  budget: {
    background: "#f59e0b",
    backgroundDimmed: "#d97706",
    borderColor: "#b45309",
  },
  transaction: {
    background: "#3b82f6",
    backgroundDimmed: "#2563eb",
    borderColor: "#1d4ed8",
  },
};

// Generate gym workout events for a given month
export function generateGymEvents(year: number, month: number): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();

    // Monday-Friday (1-5) are workout days
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      const nsunsDayIndex = dayOfWeek - 1;
      const schedule = nsunsSchedule[nsunsDayIndex];

      if (schedule) {
        const t1Name = liftConfig[schedule.t1].name;
        const t2Name = liftConfig[schedule.t2].name;

        const startTime = "06:00";
        const endTime = "07:30";

        events.push({
          id: `gym-${year}-${month}-${day}`,
          title: `${t1Name} / ${t2Name}`,
          description: `nSuns Day ${nsunsDayIndex + 1}: ${schedule.name}`,
          start: new Date(year, month, day, 6, 0),
          end: new Date(year, month, day, 7, 30),
          startTime,
          endTime,
          date: new Date(year, month, day),
          allDay: false,
          category: "gym",
          location: "Gym",
          ...eventColors.gym,
          teamMemberIds: [],
        });
      }
    }
  }

  return events;
}

// Generate budget due date events for a given month
export function generateBudgetEvents(year: number, month: number): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  // Rent - 1st of month
  events.push({
    id: `rent-${year}-${month}`,
    title: "Rent Due - CHF 1,000",
    description: "Monthly rent payment",
    start: new Date(year, month, 1, 9, 0),
    end: new Date(year, month, 1, 9, 30),
    startTime: "09:00",
    endTime: "09:30",
    date: new Date(year, month, 1),
    allDay: false,
    category: "budget",
    ...eventColors.budget,
    teamMemberIds: [],
  });

  // Health Insurance - 1st of month
  events.push({
    id: `health-insurance-${year}-${month}`,
    title: "Health Insurance - CHF 350",
    description: "Swiss mandatory health insurance (Krankenkasse)",
    start: new Date(year, month, 1, 9, 30),
    end: new Date(year, month, 1, 10, 0),
    startTime: "09:30",
    endTime: "10:00",
    date: new Date(year, month, 1),
    allDay: false,
    category: "budget",
    ...eventColors.budget,
    teamMemberIds: [],
  });

  // Serafe (TV/Radio) - 15th of month (quarterly, but show monthly reminder)
  events.push({
    id: `serafe-${year}-${month}`,
    title: "Serafe TV/Radio - CHF 28",
    description: "Swiss broadcasting fee (monthly portion)",
    start: new Date(year, month, 15, 9, 0),
    end: new Date(year, month, 15, 9, 30),
    startTime: "09:00",
    endTime: "09:30",
    date: new Date(year, month, 15),
    allDay: false,
    category: "budget",
    ...eventColors.budget,
    teamMemberIds: [],
  });

  // Mobile - 20th of month
  events.push({
    id: `mobile-${year}-${month}`,
    title: "Mobile Plan - CHF 25",
    description: "Monthly mobile phone plan",
    start: new Date(year, month, 20, 9, 0),
    end: new Date(year, month, 20, 9, 30),
    startTime: "09:00",
    endTime: "09:30",
    date: new Date(year, month, 20),
    allDay: false,
    category: "budget",
    ...eventColors.budget,
    teamMemberIds: [],
  });

  // Salary - 25th of month
  events.push({
    id: `salary-${year}-${month}`,
    title: "Salary - CHF 5,200",
    description: "Monthly net salary (after deductions)",
    start: new Date(year, month, 25, 9, 0),
    end: new Date(year, month, 25, 9, 30),
    startTime: "09:00",
    endTime: "09:30",
    date: new Date(year, month, 25),
    allDay: false,
    category: "transaction",
    ...eventColors.transaction,
    teamMemberIds: [],
  });

  return events;
}

// Main composable
export function useCalendarEvents() {
  const selectedDate = ref(new Date());
  const currentView = ref<"day" | "week" | "month">("week");

  const events = computed(() => {
    const year = selectedDate.value.getFullYear();
    const month = selectedDate.value.getMonth();

    // Get events for current month and adjacent months for smooth navigation
    const allEvents: CalendarEvent[] = [];

    for (let m = month - 1; m <= month + 1; m++) {
      const adjustedYear = m < 0 ? year - 1 : m > 11 ? year + 1 : year;
      const adjustedMonth = m < 0 ? 11 : m > 11 ? 0 : m;

      allEvents.push(...generateGymEvents(adjustedYear, adjustedMonth));
      allEvents.push(...generateBudgetEvents(adjustedYear, adjustedMonth));
    }

    return allEvents;
  });

  const gymEvents = computed(() =>
    events.value.filter((e) => e.category === "gym")
  );

  const budgetEvents = computed(() =>
    events.value.filter((e) => e.category === "budget")
  );

  const transactionEvents = computed(() =>
    events.value.filter((e) => e.category === "transaction")
  );

  return {
    selectedDate,
    currentView,
    events,
    gymEvents,
    budgetEvents,
    transactionEvents,
  };
}
