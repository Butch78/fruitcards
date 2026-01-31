import { describe, expect, it, vi, beforeEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import LoginPage from "~/pages/login.vue";

// Mock the auth composable
const mockLoginWithGithub = vi.fn();
const mockIsAuthenticated = ref(false);

vi.mock("~/composables/useAuth", () => ({
  useAuth: vi.fn(() =>
    Promise.resolve({
      loginWithGithub: mockLoginWithGithub,
      isAuthenticated: mockIsAuthenticated,
      session: ref(null),
      user: ref(null),
      logout: vi.fn(),
    })
  ),
}));

// Mock navigateTo
vi.mock("#app", async (importOriginal) => {
  const original = await importOriginal<typeof import("#app")>();
  return {
    ...original,
    navigateTo: vi.fn(),
  };
});

describe("Login Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAuthenticated.value = false;
  });

  describe("Page Structure", () => {
    it("renders the login card", async () => {
      const wrapper = await mountSuspended(LoginPage);
      expect(wrapper.html()).toContain("Welcome to Fruit Cards");
    });

    it("displays the welcome heading", async () => {
      const wrapper = await mountSuspended(LoginPage);
      expect(wrapper.text()).toContain("Welcome to Fruit Cards");
    });

    it("displays the sign-in description", async () => {
      const wrapper = await mountSuspended(LoginPage);
      expect(wrapper.text()).toContain(
        "Sign in to manage your personal tracking"
      );
    });

    it("displays the terms of service notice", async () => {
      const wrapper = await mountSuspended(LoginPage);
      expect(wrapper.text()).toContain(
        "By signing in, you agree to our terms of service"
      );
    });

    it("renders the cherry icon for branding", async () => {
      const wrapper = await mountSuspended(LoginPage);
      expect(wrapper.html()).toContain("i-lucide:cherry");
    });
  });

  describe("GitHub Login Button", () => {
    it("renders the GitHub login button when not authenticated", async () => {
      mockIsAuthenticated.value = false;
      const wrapper = await mountSuspended(LoginPage);

      expect(wrapper.text()).toContain("Continue with GitHub");
    });

    it("has the GitHub icon on the login button", async () => {
      mockIsAuthenticated.value = false;
      const wrapper = await mountSuspended(LoginPage);

      expect(wrapper.html()).toContain("i-simple-icons:github");
    });

    it("calls loginWithGithub when button is clicked", async () => {
      mockIsAuthenticated.value = false;
      const wrapper = await mountSuspended(LoginPage);

      const button = wrapper.find("button");
      await button.trigger("click");

      expect(mockLoginWithGithub).toHaveBeenCalledTimes(1);
    });
  });

  describe("Authenticated State", () => {
    it("shows 'already signed in' message when authenticated", async () => {
      mockIsAuthenticated.value = true;
      const wrapper = await mountSuspended(LoginPage);

      expect(wrapper.text()).toContain("You're already signed in!");
    });

    it("shows dashboard link when authenticated", async () => {
      mockIsAuthenticated.value = true;
      const wrapper = await mountSuspended(LoginPage);

      expect(wrapper.text()).toContain("Go to Dashboard");
      expect(wrapper.html()).toContain("/dashboards/one");
    });

    it("hides GitHub login button when authenticated", async () => {
      mockIsAuthenticated.value = true;
      const wrapper = await mountSuspended(LoginPage);

      expect(wrapper.text()).not.toContain("Continue with GitHub");
    });
  });
});
