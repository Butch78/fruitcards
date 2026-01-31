import type { H3Event } from "h3";
import { drizzle } from "drizzle-orm/d1";
import { createAuth } from "../lib/auth";
import * as schema from "../db/schema";

export function useServerAuth(event: H3Event) {
  const { cloudflare } = event.context;

  if (!cloudflare?.env?.DB) {
    throw createError({
      statusCode: 500,
      message: "Database not available",
    });
  }

  const db = drizzle(cloudflare.env.DB, { schema });
  return createAuth(db);
}

export async function getServerSession(event: H3Event) {
  const auth = useServerAuth(event);
  const session = await auth.api.getSession({
    headers: event.headers,
  });
  return session;
}

export async function requireAuth(event: H3Event) {
  const session = await getServerSession(event);

  if (!session) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  return session;
}
