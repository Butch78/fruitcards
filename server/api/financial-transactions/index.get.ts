import { financialTransactions } from "~/data/financial-transactions";
import { handleTableQuery } from "../utils/TableQuery";

export default defineEventHandler((event) => {
  const rawQuery = getQuery(event);
  const query: Record<string, string | string[] | undefined> = {};

  for (const key in rawQuery) {
    const value = rawQuery[key];
    if (typeof value === "string" || Array.isArray(value) || typeof value === "undefined") {
      query[key] = value;
    }
  }

  // Filter by type if provided
  let data = [...financialTransactions];
  if (query.type && typeof query.type === "string") {
    data = data.filter((t) => t.type === query.type);
  }

  // Filter by category if provided
  if (query.categoryId && typeof query.categoryId === "string") {
    data = data.filter((t) => t.categoryId === query.categoryId);
  }

  // Filter by date range if provided
  if (query.startDate && typeof query.startDate === "string") {
    const startDate = new Date(query.startDate);
    data = data.filter((t) => new Date(t.date) >= startDate);
  }
  if (query.endDate && typeof query.endDate === "string") {
    const endDate = new Date(query.endDate);
    data = data.filter((t) => new Date(t.date) <= endDate);
  }

  // Sort by date by default (most recent first)
  data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return handleTableQuery({
    data,
    query,
    searchableFields: ["description"],
  });
});
