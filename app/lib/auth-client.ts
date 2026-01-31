import { createAuthClient } from "better-auth/vue";

// Better Auth client - defaults to /api/auth on same origin
export const authClient = createAuthClient({
  // No need to specify baseURL - it defaults to the same origin
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
} = authClient;
