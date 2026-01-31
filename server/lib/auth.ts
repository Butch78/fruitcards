import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "../db/schema";

export function createAuth(db: DrizzleD1Database<typeof schema>) {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }),

    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      },
    },

    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // Update session every 24 hours
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5, // 5 minutes
      },
    },

    // Let Better Auth infer baseURL from request in dev, use env var in production
    baseURL: process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : (process.env.BETTER_AUTH_URL || "https://fruit.cards"),
    secret: process.env.BETTER_AUTH_SECRET!,

    trustedOrigins: [
      "https://fruit.cards",
      "http://localhost:3000",
    ],
  });
}

export type Auth = ReturnType<typeof createAuth>;
