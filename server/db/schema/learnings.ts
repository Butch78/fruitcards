import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { user } from "./auth";

export const learningCategory = sqliteTable("learning_category", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  icon: text("icon"),
  color: text("color"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const learning = sqliteTable("learning", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  categoryId: text("category_id").references(() => learningCategory.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  content: text("content").notNull(), // Markdown content
  source: text("source"), // URL, book title, course name, etc.
  sourceType: text("source_type", {
    enum: ["book", "article", "video", "course", "podcast", "other"],
  }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const learningTag = sqliteTable("learning_tag", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const learningToTag = sqliteTable(
  "learning_to_tag",
  {
    learningId: text("learning_id")
      .notNull()
      .references(() => learning.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => learningTag.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.learningId, table.tagId] })]
);
