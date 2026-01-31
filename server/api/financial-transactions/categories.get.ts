import { transactionCategories } from "~/data/financial-transactions";

export default defineEventHandler((event) => {
  const query = getQuery(event);

  let categories = [...transactionCategories];

  // Filter by type if provided
  if (query.type && typeof query.type === "string") {
    categories = categories.filter((c) => c.type === query.type);
  }

  return categories;
});
