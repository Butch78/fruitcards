import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { user } from "./auth";

export const transactionCategory = sqliteTable("transaction_category", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  icon: text("icon"),
  color: text("color"),
  type: text("type", { enum: ["income", "expense"] }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const transaction = sqliteTable("transaction", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  categoryId: text("category_id").references(() => transactionCategory.id, {
    onDelete: "set null",
  }),
  amount: real("amount").notNull(),
  type: text("type", { enum: ["income", "expense"] }).notNull(),
  description: text("description"),
  date: integer("date", { mode: "timestamp" }).notNull(),
  isRecurring: integer("is_recurring", { mode: "boolean" })
    .notNull()
    .default(false),
  recurringInterval: text("recurring_interval", {
    enum: ["daily", "weekly", "monthly", "yearly"],
  }),
  recurringEndDate: integer("recurring_end_date", { mode: "timestamp" }),
  parentTransactionId: text("parent_transaction_id"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});
