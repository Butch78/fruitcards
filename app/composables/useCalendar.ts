import { debounce } from "perfect-debounce";

import { events as staticEvents } from '~/data/events'

export interface CalendarEvent {
  id: number;
  title: string;
  day: number;
  startTime: string;
  endTime: string;
  background: string;
  backgroundDimmed: string;
  borderColor: string;
  date: Date;
  meetLink?: string;
  category?: string;
  users?: { src: string; alt: string }[];
  _column?: number;
  _columns?: number;
}

export function useCalendar(monthViewDate?: Ref<Date>) {
  const search = ref("");
  const view = ref("week");
  const showEventPanel = ref(false);
  const eventPanelStyle = ref({});
  const clickedDay = ref<number | null>(null);
  const previewEvent = ref<CalendarEvent | null>(null);
  const events = ref<CalendarEvent[]>([]);
  const hours = Array.from({ length: 15 }, (_, i) => 7 + i);
  const gridRef = ref<HTMLElement | null>(null);
  const selectedDate = ref<Date>(new Date());

  // Current event being created/edited
  const currentEvent = ref<Partial<CalendarEvent>>({
    title: "",
    startTime: "",
    endTime: "",
    meetLink: "",
    category: "",
    background: "",
    borderColor: "",
    date: new Date(),
    users: [],
  });

  const editingEvent = ref<CalendarEvent | null>(null);

  // Use provided monthViewDate or fallback to current month
  const _monthViewDate =
    monthViewDate ??
    ref(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  const currentWeekStart = computed(() => {
    const base =
      view.value === "day" ? selectedDate.value : _monthViewDate.value;
    const dayOfWeek = base.getDay() === 0 ? 6 : base.getDay() - 1; // Monday=0
    const monday = new Date(base);
    monday.setDate(base.getDate() - dayOfWeek);
    return monday;
  });

  function nextPeriod() {
    if (view.value === "month") {
      _monthViewDate.value = new Date(
        _monthViewDate.value.getFullYear(),
        _monthViewDate.value.getMonth() + 1,
        1
      );
    } else if (view.value === "week") {
      const nextWeek = new Date(currentWeekStart.value);
      nextWeek.setDate(nextWeek.getDate() + 7);
      _monthViewDate.value = nextWeek;
    } else if (view.value === "day") {
      const nextDay = new Date(selectedDate.value);
      nextDay.setDate(nextDay.getDate() + 1);
      selectedDate.value = nextDay;
    }
  }

  function prevPeriod() {
    if (view.value === "month") {
      _monthViewDate.value = new Date(
        _monthViewDate.value.getFullYear(),
        _monthViewDate.value.getMonth() - 1,
        1
      );
    } else if (view.value === "week") {
      const prevWeek = new Date(currentWeekStart.value);
      prevWeek.setDate(prevWeek.getDate() - 7);
      _monthViewDate.value = prevWeek;
    } else if (view.value === "day") {
      const prevDay = new Date(selectedDate.value);
      prevDay.setDate(prevDay.getDate() - 1);
      selectedDate.value = prevDay;
    }
  }

  function goToToday() {
    const today = new Date();
    selectedDate.value = today;
    _monthViewDate.value = today;
  }

  const periodLabel = computed(() => {
    if (view.value === "month") {
      return _monthViewDate.value.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
    } else if (view.value === "week") {
      const weekEnd = new Date(currentWeekStart.value);
      weekEnd.setDate(weekEnd.getDate() + 6);
      if (currentWeekStart.value.getMonth() === weekEnd.getMonth()) {
        return `${currentWeekStart.value.toLocaleString("default", { month: "long" })} ${currentWeekStart.value.getDate()}-${weekEnd.getDate()}, ${currentWeekStart.value.getFullYear()}`;
      } else {
        return `${currentWeekStart.value.toLocaleString("default", { month: "short", day: "numeric" })} - ${weekEnd.toLocaleString("default", { month: "short", day: "numeric" })}, ${weekEnd.getFullYear()}`;
      }
    } else {
      return selectedDate.value.toLocaleString("default", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  });

  // Replace static days with computed days based on view and date
  const days = computed(() => {
    const today = new Date();
    const weekLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

    if (view.value === "day") {
      // Day view: show just the selected day
      return [
        {
          label:
            weekLabels[
              selectedDate.value.getDay() === 0
                ? 6
                : selectedDate.value.getDay() - 1
            ],
          date: selectedDate.value.getDate(),
          current: true,
          today:
            selectedDate.value.getFullYear() === today.getFullYear() &&
            selectedDate.value.getMonth() === today.getMonth() &&
            selectedDate.value.getDate() === today.getDate(),
          highlight:
            selectedDate.value.getFullYear() === today.getFullYear() &&
            selectedDate.value.getMonth() === today.getMonth() &&
            selectedDate.value.getDate() === today.getDate(),
          fullDate: selectedDate.value,
        },
      ];
    }

    if (view.value === "week") {
      // Week view: show 7 days starting from Monday
      const monday = currentWeekStart.value;
      return Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return {
          label: weekLabels[i],
          date: d.getDate(),
          current: true,
          today:
            d.getFullYear() === today.getFullYear() &&
            d.getMonth() === today.getMonth() &&
            d.getDate() === today.getDate(),
          highlight:
            d.getFullYear() === today.getFullYear() &&
            d.getMonth() === today.getMonth() &&
            d.getDate() === today.getDate(),
          fullDate: d,
        };
      });
    }

    // Month view: show full month grid with proper date calculations
    // Fixed to correctly handle:
    // - Previous month days (edge of calendar)
    // - Current month days (main content)
    // - Next month days (fill remaining grid)
    // - Proper day labels for each day of the week
    // - Correct today highlighting across month boundaries
    const year = _monthViewDate.value.getFullYear();
    const month = _monthViewDate.value.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Monday as first day
    const result: Array<{
      label: string;
      date: number;
      highlight?: boolean;
      current: boolean;
      today: boolean;
      fullDate: Date;
    }> = [];

    // Previous month's days
    for (let i = 0; i < startDay; i++) {
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const prevMonthLastDay = new Date(prevYear, prevMonth + 1, 0).getDate();
      const dayNumber = prevMonthLastDay - startDay + i + 1;
      const d = new Date(prevYear, prevMonth, dayNumber);

      result.push({
        label: weekLabels[i] ?? "",
        date: d.getDate(),
        current: false,
        today:
          d.getFullYear() === today.getFullYear() &&
          d.getMonth() === today.getMonth() &&
          d.getDate() === today.getDate(),
        fullDate: d,
      });
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      const dayIndex = (startDay + i - 1) % 7;

      result.push({
        label: weekLabels[dayIndex] ?? "",
        date: d.getDate(),
        current: true,
        today:
          d.getFullYear() === today.getFullYear() &&
          d.getMonth() === today.getMonth() &&
          d.getDate() === today.getDate(),
        highlight:
          d.getFullYear() === today.getFullYear() &&
          d.getMonth() === today.getMonth() &&
          d.getDate() === today.getDate(),
        fullDate: d,
      });
    }

    // Next month's days to fill grid (ensure we have complete weeks)
    const totalDaysShown = result.length;
    const remainingDays =
      totalDaysShown % 7 === 0 ? 0 : 7 - (totalDaysShown % 7);

    for (let i = 1; i <= remainingDays; i++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const d = new Date(nextYear, nextMonth, i);
      const dayIndex = (totalDaysShown + i - 1) % 7;

      result.push({
        label: weekLabels[dayIndex] ?? "",
        date: d.getDate(),
        current: false,
        today:
          d.getFullYear() === today.getFullYear() &&
          d.getMonth() === today.getMonth() &&
          d.getDate() === today.getDate(),
        fullDate: d,
      });
    }
    return result;
  });

  function getEventTop(startTime: string) {
    const [hour = 0, minute = 0] = startTime.split(":").map(Number);
    const totalMinutes = (hour - 7) * 60 + minute;
    return `${(totalMinutes / 60) * 4}rem`;
  }

  function getEventHeight(startTime: string, endTime: string) {
    const [startHour = 0, startMinute = 0] = startTime.split(":").map(Number);
    const [endHour = 0, endMinute = 0] = endTime.split(":").map(Number);
    const durationMinutes =
      (endHour - startHour) * 60 + (endMinute - startMinute);
    return `${(durationMinutes / 60) * 4}rem`;
  }

  function closeEventPanel() {
    showEventPanel.value = false;
    clickedDay.value = null;
    previewEvent.value = null;
    // Reset current event
    currentEvent.value = {
      title: "",
      startTime: "",
      endTime: "",
      meetLink: "",
      category: "",
      background: "",
      borderColor: "",
      date: new Date(),
      users: [],
    };
    editingEvent.value = null;
  }

  function openAddEvent() {
    eventPanelStyle.value = {};
    showEventPanel.value = true;
    // Default to today if not set by grid click
    currentEvent.value.date = new Date();
    editingEvent.value = null;
  }

  function onSave() {
    if (
      clickedDay.value !== null &&
      currentEvent.value.background &&
      currentEvent.value.borderColor
    ) {
      // Get the date for the clicked day
      const dayObj = days.value[clickedDay.value];
      const eventDate = dayObj?.fullDate || selectedDate.value;

      const backgroundDimmed = currentEvent.value.background === "#34d399" ? "#34d39920" : 
                               currentEvent.value.background === "#818cf8" ? "#818cf820" : 
                               currentEvent.value.background === "#fb923c" ? "#fb923c20" : "#34d39920";
      
      events.value.push({
        id: Date.now(),
        title: currentEvent.value.title || "(No title)",
        day: clickedDay.value,
        startTime: currentEvent.value.startTime || "",
        endTime: currentEvent.value.endTime || "",
        background: currentEvent.value.background,
        backgroundDimmed: backgroundDimmed,
        borderColor: currentEvent.value.borderColor,
        date: new Date(eventDate),
        meetLink: currentEvent.value.meetLink,
        category: currentEvent.value.category || "Other",
        users: currentEvent.value.users,
      });
    }
    previewEvent.value = null; // Clear preview
    closeEventPanel();
  }

  const isPerformingDragOrResize = ref(false); // New flag

  function handleGridClick(day: number, event: MouseEvent) {
    if (isPerformingDragOrResize.value) {
      return;
    }

    const target = event.target as HTMLElement;
    if (target.closest(".absolute.w-full.p-1")) {
      return;
    }
    const container = event.currentTarget as HTMLElement;
    const hourHeight = 64;
    const rect = container.getBoundingClientRect();
    const clickY = event.clientY - rect.top;
    const totalMinutes = (clickY / hourHeight) * 60;
    let hour = Math.floor(totalMinutes / 60) + 7;
    let minute = Math.floor(totalMinutes % 60);
    const roundedMinute = Math.round(minute / 30) * 30;
    if (roundedMinute === 60) {
      hour += 1;
      minute = 0;
    } else {
      minute = roundedMinute;
    }
    if (hour < 7) hour = 7;
    if (hour > 21 || (hour === 21 && minute > 0)) {
      hour = 21;
      minute = 0;
    }
    const formattedStartTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    let endHour = hour;
    let endMinute = minute + 60; // 1 hour duration by default
    if (endMinute >= 60) {
      endHour += Math.floor(endMinute / 60);
      endMinute = endMinute % 60;
    }
    if (endHour > 21 || (endHour === 21 && endMinute > 30)) {
      endHour = 21;
      endMinute = 30;
    }
    const formattedEndTime = `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;

    // Set current event data
    currentEvent.value.title = "";
    currentEvent.value.startTime = formattedStartTime;
    currentEvent.value.endTime = formattedEndTime;
    currentEvent.value.category = "Meeting";
    currentEvent.value.background = eventColors![0]!.background;
    currentEvent.value.borderColor = eventColors![0]!.border;
    currentEvent.value.users = [];

    clickedDay.value = day;
    // Set selectedDate based on clicked day
    const dayObj = days.value[day];
    if (dayObj) {
      selectedDate.value = new Date(dayObj.fullDate);
      currentEvent.value.date = new Date(dayObj.fullDate);
    }

    // Create preview event
    const selectedBackground = currentEvent.value.background || "#34d399";
    const backgroundDimmed = selectedBackground === "#34d399" ? "#34d39920" : 
                             selectedBackground === "#818cf8" ? "#818cf820" : 
                             selectedBackground === "#fb923c" ? "#fb923c20" : "#34d39920";
    
    previewEvent.value = {
      id: -1, // Temporary ID for preview
      title: currentEvent.value.title || "New Event",
      day,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      background: selectedBackground,
      backgroundDimmed: backgroundDimmed,
      borderColor: currentEvent.value.borderColor || "#059669",
      date: dayObj?.fullDate || selectedDate.value,
      users: [],
    };
    const panelWidth = 384;
    const gridContainer = container.parentElement?.parentElement;
    if (!gridContainer) return;
    const gridRect = gridContainer.getBoundingClientRect();
    const targetRect = (
      event.currentTarget as HTMLElement
    ).getBoundingClientRect();
    let left = targetRect.left - gridRect.left + event.offsetX;
    const top = targetRect.top - gridRect.top + event.offsetY;
    if (left + panelWidth > gridContainer.clientWidth) {
      left = left - panelWidth - 20;
    } else {
      left = left + 20;
    }
    eventPanelStyle.value = {
      position: "absolute",
      left: `${left}px`,
      top: `${top}px`,
      zIndex: 50,
    };
    showEventPanel.value = true;
    editingEvent.value = null;
  }

  // Open event panel for editing
  function openEditEvent(event: CalendarEvent) {
    if (
      currentEvent.value.startTime !== event.startTime ||
      isPerformingDragOrResize.value
    ) {
      return;
    }

    editingEvent.value = event;
    currentEvent.value = {
      title: event.title,
      startTime: event.startTime,
      endTime: event.endTime,
      meetLink: event.meetLink || "",
      category: event.category || "Other",
      background: event.background,
      borderColor: event.borderColor,
      date: event.date,
      users: event.users,
    };
    selectedDate.value = event.date;

    // Set event panel style to match the event position
    if (gridRef.value) {
      const gridRect = gridRef.value.getBoundingClientRect();
      const eventEl = gridRef.value.querySelector(
        `[data-event-id='${event.id}']`
      ) as HTMLElement | null;
      if (eventEl) {
        const rect = eventEl.getBoundingClientRect();
        eventPanelStyle.value = {
          position: "absolute",
          top: `${rect.top - gridRect.top}px`,
          left: `${rect.right - gridRect.left + 16}px`, // 16px gap
          zIndex: 50,
        };
      } else {
        eventPanelStyle.value = {};
      }
    } else {
      eventPanelStyle.value = {};
    }
    showEventPanel.value = true;
  }

  // Enhanced save handler: update if editing, else add new
  function onSaveEnhanced() {
    if (editingEvent.value) {
      // Update existing event
      const idx = events.value.findIndex(
        (ev) => ev.id === editingEvent.value!.id
      );
      if (idx !== -1) {
        events.value[idx] = {
          ...events.value[idx],
          title: currentEvent.value.title || "",
          startTime: currentEvent.value.startTime || "",
          endTime: currentEvent.value.endTime || "",
          date: currentEvent.value.date || new Date(),
          background: currentEvent.value.background,
          borderColor: currentEvent.value.borderColor,
          meetLink: currentEvent.value.meetLink || "",
          category: currentEvent.value.category || "Other",
          users: currentEvent.value.users,
        } as CalendarEvent;
      }
      editingEvent.value = null;
      showEventPanel.value = false;
    } else {
      onSave();
    }
  }

  // Drag/resize state
  const resizingEvent = ref<{
    id: number;
    startY: number;
    initialEnd: string;
  } | null>(null);
  const movingEvent = ref<{
    id: number;
    startY: number;
    startX: number;
    initialStart: string;
    initialEnd: string;
    duration: number;
    initialDay: number;
  } | null>(null);
  const resizingTopEvent = ref<{
    id: number;
    startY: number;
    initialStart: string;
    initialEnd: string;
  } | null>(null);

  function onResizeStart(eventId: number, e: MouseEvent | TouchEvent) {
    e.stopPropagation();

    isPerformingDragOrResize.value = true; // Block clicks
    let clientY: number = 0;
    if ("touches" in e && e.touches && e.touches[0]) {
      clientY = e.touches[0].clientY;
    } else if ("clientY" in e) {
      clientY = e.clientY;
    }
    const eventObj = events.value.find((ev) => ev.id === eventId);
    if (!eventObj) return;
    resizingEvent.value = {
      id: eventId,
      startY: clientY,
      initialEnd: eventObj.endTime,
    };
    window.addEventListener("mousemove", onResizing);
    window.addEventListener("touchmove", onResizing, { passive: false });
    window.addEventListener("mouseup", onResizeEnd);
    window.addEventListener("touchend", onResizeEnd);
  }

  function onResizing(e: MouseEvent | TouchEvent) {
    if (!resizingEvent.value) return;
    e.preventDefault?.(); // Prevent default touch scrolling
    let clientY: number = 0;
    if ("touches" in e && e.touches && e.touches[0]) {
      clientY = e.touches[0].clientY;
    } else if ("clientY" in e) {
      clientY = e.clientY;
    }
    const deltaY = clientY - resizingEvent.value.startY;
    const minutesDelta = Math.round(deltaY / 32) * 30;
    const eventObj = events.value.find(
      (ev) => ev.id === resizingEvent.value?.id
    );
    if (!eventObj) return;
    const [startHourRaw, startMinuteRaw] = eventObj.startTime
      .split(":")
      .map(Number);
    const [endHourRaw, endMinuteRaw] = resizingEvent.value.initialEnd
      .split(":")
      .map(Number);
    const startHour = startHourRaw ?? 0;
    const startMinute = startMinuteRaw ?? 0;
    let endHour = endHourRaw ?? 0;
    let endMinute = endMinuteRaw ?? 0;
    let totalEndMinutes = endHour * 60 + endMinute + minutesDelta;
    const minEnd = startHour * 60 + startMinute + 30;
    const maxEnd = 21 * 60 + 30;
    totalEndMinutes = Math.max(minEnd, Math.min(maxEnd, totalEndMinutes));
    endHour = Math.floor(totalEndMinutes / 60);
    endMinute = totalEndMinutes % 60;
    eventObj.endTime = `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;
  }

  function onResizeEnd() {
    resizingEvent.value = null;
    window.removeEventListener("mousemove", onResizing);
    window.removeEventListener("touchmove", onResizing);
    window.removeEventListener("mouseup", onResizeEnd);
    window.removeEventListener("touchend", onResizeEnd);
    // Crucially, reset this flag only after the mouse/touch is released
    debounceEnd();
  }

  const debounceEnd = debounce(() => {
    isPerformingDragOrResize.value = false;
  }, 1000);

  function onMoveStart(eventId: number, e: MouseEvent | TouchEvent) {
    e.stopPropagation();
    isPerformingDragOrResize.value = true;
    let clientY = 0;
    let clientX = 0;
    if ("touches" in e && e.touches && e.touches[0]) {
      clientY = e.touches[0].clientY;
      clientX = e.touches[0].clientX;
    } else if ("clientY" in e && "clientX" in e) {
      clientY = e.clientY;
      clientX = e.clientX;
    }
    const eventObj = events.value.find((ev) => ev.id === eventId);
    if (!eventObj) return;

    // Ensure the event has the correct day index for the current view
    const correctDayIndex = days.value.findIndex((day) => {
      if (!day.fullDate || !eventObj.date) return false;
      return (
        day.fullDate.getFullYear() === eventObj.date.getFullYear() &&
        day.fullDate.getMonth() === eventObj.date.getMonth() &&
        day.fullDate.getDate() === eventObj.date.getDate()
      );
    });

    if (correctDayIndex >= 0) {
      eventObj.day = correctDayIndex;
    }

    const [startHourRaw, startMinuteRaw] = eventObj.startTime
      .split(":")
      .map(Number);
    const [endHourRaw, endMinuteRaw] = eventObj.endTime.split(":").map(Number);
    const startHour = startHourRaw ?? 0;
    const startMinute = startMinuteRaw ?? 0;
    const endHour = endHourRaw ?? 0;
    const endMinute = endMinuteRaw ?? 0;
    const duration = (endHour - startHour) * 60 + (endMinute - startMinute);
    movingEvent.value = {
      id: eventId,
      startY: clientY,
      startX: clientX,
      initialStart: eventObj.startTime,
      initialEnd: eventObj.endTime,
      duration,
      initialDay: eventObj.day,
    };
    window.addEventListener("mousemove", onMoving);
    window.addEventListener("touchmove", onMoving, { passive: false });
    window.addEventListener("mouseup", onMoveEnd);
    window.addEventListener("touchend", onMoveEnd);
  }

  function onMoving(e: MouseEvent | TouchEvent) {
    if (!movingEvent.value) return;
    e.preventDefault?.(); // Prevent default touch scrolling
    let clientY = 0;
    let clientX = 0;
    if ("touches" in e && e.touches && e.touches[0]) {
      clientY = e.touches[0].clientY;
      clientX = e.touches[0].clientX;
    } else if ("clientY" in e && "clientX" in e) {
      clientY = e.clientY;
      clientX = e.clientX;
    }
    const deltaY = clientY - movingEvent.value.startY;
    const deltaX = clientX - movingEvent.value.startX;
    const minutesDelta = Math.round(deltaY / 32) * 30;
    const eventObj = events.value.find((ev) => ev.id === movingEvent.value?.id);
    if (!eventObj) return;

    // Update time
    const [startHourRaw, startMinuteRaw] = movingEvent.value.initialStart
      .split(":")
      .map(Number);
    let startMinutes =
      (startHourRaw ?? 0) * 60 + (startMinuteRaw ?? 0) + minutesDelta;
    const minStart = 7 * 60;
    const maxStart = 21 * 60 + 30 - movingEvent.value.duration;
    startMinutes = Math.max(minStart, Math.min(maxStart, startMinutes));
    const endMinutes = startMinutes + movingEvent.value.duration;
    const startHour = Math.floor(startMinutes / 60);
    const startMinute = startMinutes % 60;
    const endHour = Math.floor(endMinutes / 60);
    const endMinute = endMinutes % 60;
    eventObj.startTime = `${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`;
    eventObj.endTime = `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;

    // Update day and date
    if (gridRef.value && view.value !== "day") {
      const gridRect = gridRef.value.getBoundingClientRect();
      // Calculate column width based on actual grid columns
      const dayColumns =
        view.value === "week" ? 7 : view.value === "month" ? 7 : 1;
      const colWidth = gridRect.width / (dayColumns + 1); // +1 for time column in week view, or just divide by days in month view
      const initialDay = movingEvent.value.initialDay ?? eventObj.day;
      let newDay = initialDay + Math.round(deltaX / colWidth);

      // Clamp to valid range based on current view
      const maxDay =
        view.value === "month" ? days.value.length - 1 : dayColumns - 1;
      newDay = Math.max(0, Math.min(maxDay, newDay));

      // Update day index
      eventObj.day = newDay;

      // Update the actual date based on the new day
      const targetDay = days.value[newDay];
      if (targetDay && targetDay.fullDate) {
        eventObj.date = new Date(targetDay.fullDate);
      }
    }
  }

  function onMoveEnd() {
    movingEvent.value = null;
    window.removeEventListener("mousemove", onMoving);
    window.removeEventListener("touchmove", onMoving);
    window.removeEventListener("mouseup", onMoveEnd);
    window.removeEventListener("touchend", onMoveEnd);
    isPerformingDragOrResize.value = false;
  }

  // Utility to process overlapping events for horizontal arrangement
  function getPositionedEvents(dayEvents: CalendarEvent[]) {
    const validEvents = dayEvents.filter(
      (e): e is CalendarEvent => !!e && !!e.date
    );
    const sorted = [...validEvents].sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
    const groups: CalendarEvent[][] = [];
    let group: CalendarEvent[] = [];

    function toMinutes(time: string) {
      const [hStr, mStr] = time.split(":");
      const h = Number(hStr);
      const m = Number(mStr);
      if (isNaN(h) || isNaN(m)) return 0;
      return h * 60 + m;
    }

    for (let i = 0; i < sorted.length; i++) {
      const event = sorted[i];
      if (!event) continue;
      if (group.length === 0) {
        group.push(event);
        continue;
      }
      const last = group[group.length - 1];
      if (last && toMinutes(event.startTime) < toMinutes(last.endTime)) {
        group.push(event);
      } else {
        groups.push(group);
        group = [event];
      }
    }
    if (group.length) groups.push(group);

    const positioned: CalendarEvent[] = [];
    for (const group of groups) {
      const columns: (CalendarEvent | undefined)[] = [];
      for (const event of group) {
        let col = 0;
        while (
          columns[col] &&
          toMinutes(event.startTime) < toMinutes(columns[col]!.endTime)
        ) {
          col++;
        }
        event._column = col;
        columns[col] = event;
      }
      for (const event of group) {
        event._columns = columns.length;
        positioned.push(event);
      }
    }
    return positioned;
  }

  // Computed property to combine events with preview event (with correct day indices)
  const allEvents = computed(() => {
    const correctlyIndexedEvents = eventsWithCorrectIndices.value;
    const result = [...correctlyIndexedEvents];
    if (previewEvent.value) {
      result.push(previewEvent.value);
    }
    return result;
  });

  // Computed property to ensure all events have correct day indices for current view
  // This fixes the issue where dummy events had incorrect day indices on first drag
  const eventsWithCorrectIndices = computed(() => {
    return events.value.map((event) => {
      // Find the correct day index for this event's date in the current view
      const dayIndex = days.value.findIndex((day) => {
        if (!day.fullDate || !event.date) return false;
        return (
          day.fullDate.getFullYear() === event.date.getFullYear() &&
          day.fullDate.getMonth() === event.date.getMonth() &&
          day.fullDate.getDate() === event.date.getDate()
        );
      });

      return {
        ...event,
        day: dayIndex >= 0 ? dayIndex : event.day, // Use found index or fallback to current
      };
    });
  });

  // Current time indicator logic
  const currentTime = ref(new Date());
  const currentTimeIndicator = computed(() => {
    const now = currentTime.value;
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    const startMinutes = 7 * 60; // 7 AM
    const endMinutes = 22 * 60; // 10 PM

    if (totalMinutes < startMinutes || totalMinutes > endMinutes) {
      return { show: false, top: "0px" };
    }

    const relativeMinutes = totalMinutes - startMinutes;
    const totalGridMinutes = 15 * 60; // 15 hours
    const percentage = (relativeMinutes / totalGridMinutes) * 100;

    return {
      show: true,
      top: `${percentage}%`,
      time: now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
  });

  // Check if current time indicator should show for a specific day
  const shouldShowTimeIndicator = (dayDate: Date) => {
    const today = new Date();
    return dayDate.toDateString() === today.toDateString();
  };

  // Replace eventColors with hex color values
  const eventColors = [
    { background: "#34d399", border: "#059669" }, // emerald
    { background: "#818cf8", border: "#3730a3" }, // indigo
    { background: "#fb923c", border: "#ea580c" }, // orange
  ];

  // Track interval for cleanup
  let timeInterval: ReturnType<typeof setInterval> | null = null;

  // Initialize events - runs on client only
  if (import.meta.client) {
    // Set static events, but rewrite their dates to match the current week
    const today = new Date();
    const currentMonday = new Date(today);
    const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1; // Monday=0
    currentMonday.setDate(today.getDate() - dayOfWeek);
    events.value = staticEvents.map((e) => ({
      ...e,
      date: new Date(
        currentMonday.getFullYear(),
        currentMonday.getMonth(),
        currentMonday.getDate() + e.day
      ),
    }));
    
    // Update current time every minute
    const updateTime = () => {
      currentTime.value = new Date();
    };
    updateTime();
    timeInterval = setInterval(updateTime, 60000);
  }

  // Cleanup interval on unmount
  onUnmounted(() => {
    if (timeInterval) {
      clearInterval(timeInterval);
    }
  });

  // Helper function to get events for a specific day in the current view
  function getEventsForDay(dayIndex: number): CalendarEvent[] {
    const dayObj = days.value[dayIndex];
    if (!dayObj) return [];

    return eventsWithCorrectIndices.value
      .filter((event) => {
        if (!event.date) return false;

        // Compare dates
        return (
          event.date.getFullYear() === dayObj.fullDate.getFullYear() &&
          event.date.getMonth() === dayObj.fullDate.getMonth() &&
          event.date.getDate() === dayObj.fullDate.getDate()
        );
      })
      .map((event) => ({
        ...event,
        day: dayIndex, // Update day index to match current view
      }));
  }

  function openAddEventWithNow() {
    // Set default date and time to now
    const now = new Date();
    const defaultColor = eventColors![0]!;

    currentEvent.value = {
      title: "",
      startTime: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
      endTime: (() => {
        let endHour = now.getHours() + 1;
        let endMinute = now.getMinutes();
        if (endHour > 21) {
          endHour = 21;
          endMinute = 0;
        }
        return `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;
      })(),
      meetLink: "",
      category: "Meeting",
      background: defaultColor.background,
      borderColor: defaultColor.border,
      date: new Date(now),
      users: [],
    };

    // Set selectedDate to today
    selectedDate.value = new Date(now);
    editingEvent.value = null;
    showEventPanel.value = true;
  }

  function toggleDayView(day: { fullDate: Date }) {
    if (!day) return;
    view.value = "day";
    selectedDate.value = new Date(day.fullDate);
  }

  return {
    search,
    view,
    currentEvent,
    showEventPanel,
    eventPanelStyle,
    clickedDay,
    eventColors,
    events,
    previewEvent,
    days,
    hours,
    gridRef,
    editingEvent,
    resizingEvent,
    movingEvent,
    resizingTopEvent,
    periodLabel,
    currentWeekStart,
    selectedDate,
    allEvents,
    eventsWithCorrectIndices,
    currentTime,
    currentTimeIndicator,
    toggleDayView,
    openAddEventWithNow,
    getEventTop,
    getEventHeight,
    closeEventPanel,
    openAddEvent,
    onSave,
    onSaveEnhanced,
    handleGridClick,
    openEditEvent,
    onResizeStart,
    onResizing,
    onResizeEnd,
    onMoveStart,
    onMoving,
    onMoveEnd,
    nextPeriod,
    prevPeriod,
    goToToday,
    getPositionedEvents,
    getEventsForDay,
    shouldShowTimeIndicator,
  };
}
