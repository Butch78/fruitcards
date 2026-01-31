import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { user } from "./auth";

export const event = sqliteTable("event", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }),
  isAllDay: integer("is_all_day", { mode: "boolean" }).notNull().default(false),
  location: text("location"),
  color: text("color"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const eventReminder = sqliteTable("event_reminder", {
  id: text("id").primaryKey(),
  eventId: text("event_id")
    .notNull()
    .references(() => event.id, { onDelete: "cascade" }),
  reminderTime: integer("reminder_time", { mode: "timestamp" }).notNull(),
  type: text("type", { enum: ["email", "push", "both"] })
    .notNull()
    .default("push"),
  isSent: integer("is_sent", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
