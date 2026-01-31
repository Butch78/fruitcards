import { drizzle } from "drizzle-orm/d1";
import type { H3Event } from "h3";
import * as schema from "./schema";

export function useDb(event: H3Event) {
  const { cloudflare } = event.context;

  if (!cloudflare?.env?.DB) {
    throw createError({
      statusCode: 500,
      message: "Database not available",
    });
  }

  return drizzle(cloudflare.env.DB, { schema });
}

export type Database = ReturnType<typeof useDb>;
export { schema };
