import { authClient } from "../lib/auth-client";

export async function useAuth() {
  // For SSR support, pass useFetch and await the result
  const { data: session } = await authClient.useSession(useFetch);

  const user = computed(() => session.value?.user);
  const isAuthenticated = computed(() => !!session.value?.user);

  async function loginWithGithub() {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboards/one",
    });
  }

  async function logout() {
    await authClient.signOut();
    await navigateTo("/");
  }

  return {
    session,
    user,
    isAuthenticated,
    loginWithGithub,
    logout,
  };
}
