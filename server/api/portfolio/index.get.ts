import { portfolioHoldings } from "~/data/portfolio";
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

  let data = [...portfolioHoldings];

  // Filter by asset type if provided
  if (query.assetType && typeof query.assetType === "string") {
    data = data.filter((h) => h.assetType === query.assetType);
  }

  // Filter by sector if provided
  if (query.sector && typeof query.sector === "string") {
    data = data.filter((h) => h.sector === query.sector);
  }

  // Sort by value by default (highest first)
  data.sort((a, b) => {
    const aValue = a.quantity * a.currentPrice;
    const bValue = b.quantity * b.currentPrice;
    return bValue - aValue;
  });

  return handleTableQuery({
    data,
    query,
    searchableFields: ["symbol", "name"],
  });
});
