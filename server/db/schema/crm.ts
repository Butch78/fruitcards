import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { user } from "./auth";

export const contact = sqliteTable("contact", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  company: text("company"),
  jobTitle: text("job_title"),
  notes: text("notes"),
  avatarUrl: text("avatar_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const contactTag = sqliteTable("contact_tag", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  color: text("color"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const contactToTag = sqliteTable(
  "contact_to_tag",
  {
    contactId: text("contact_id")
      .notNull()
      .references(() => contact.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => contactTag.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.contactId, table.tagId] })]
);

export const interaction = sqliteTable("interaction", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  contactId: text("contact_id")
    .notNull()
    .references(() => contact.id, { onDelete: "cascade" }),
  type: text("type", {
    enum: ["call", "email", "meeting", "message", "note", "other"],
  }).notNull(),
  notes: text("notes"),
  date: integer("date", { mode: "timestamp" }).notNull(),
  duration: integer("duration"), // in minutes, for calls/meetings
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});
