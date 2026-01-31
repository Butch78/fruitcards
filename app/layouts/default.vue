<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();

const dashboardsItems = computed(() => [
  {
    label: "Overview",
    icon: "i-lucide-home",
    to: "/",
    active: route.path === "/",
    onSelect: () => {
      open.value = false;
    },
  },
  {
    label: "Issues",
    icon: "i-lucide-bug",
    to: "/dashboards/one",
    active: route.path === "/dashboards/one",
    onSelect: () => {
      open.value = false;
    },
  },
  {
    label: "Sales",
    icon: "i-lucide-shopping-bag",
    to: "/dashboards/two",
    active: route.path === "/dashboards/two",
    onSelect: () => {
      open.value = false;
    },
  },
  {
    label: "Traffic",
    icon: "i-lucide-activity",
    to: "/dashboards/traffic",
    active: route.path === "/dashboards/traffic",
    onSelect: () => {
      open.value = false;
    },
  },
  {
    label: "Uptime",
    icon: "i-lucide-database",
    to: "/dashboards/uptime",
    active: route.path === "/dashboards/uptime",
    onSelect: () => {
      open.value = false;
    },
  },
  {
    label: "Data",
    icon: "i-lucide-clock",
    to: "/dashboards/data",
    active: route.path === "/dashboards/data",
    onSelect: () => {
      open.value = false;
    },
  },
  {
    label: "Finance",
    icon: "i-lucide-badge-euro",
    to: "/dashboards/finance",
    active: route.path === "/dashboards/finance",
    onSelect: () => {
      open.value = false;
    },
  },
]);

const appsItems = computed(() => [
  {
    label: "Transactions",
    icon: "i-lucide-wallet",
    to: "/apps/transactions",
    active: route.path === "/apps/transactions",
    onSelect: () => {
      open.value = false;
    },
  },
  {
    label: "Portfolio",
    icon: "i-lucide-briefcase",
    to: "/apps/portfolio",
    active: route.path === "/apps/portfolio",
    onSelect: () => {
      open.value = false;
    },
  },
  {
    label: "Calendar",
    icon: "i-lucide-calendar",
    to: "/apps/calendar",
    active: route.path === "/apps/calendar",
    onSelect: () => {
      open.value = false;
    },
  },
  {
    label: "Widgets",
    icon: "i-lucide-box",
    to: "/apps/widgets",
    active: route.path === "/apps/widgets",
    onSelect: () => {
      open.value = false;
    },
  },
  {
    label: "Timeline",
    icon: "i-lucide-history",
    to: "/apps/timeline",
    active: route.path === "/apps/timeline",
    onSelect: () => {
      open.value = false;
    },
  },
]);

const usersItems = computed(() => [
  {
    label: "Users",
    icon: "i-lucide-user",
    to: "/users",
    active: route.path === "/users",
    onSelect: () => {
      open.value = false;
    },
  },
]);

const settingsItems = computed(() => [
  {
    label: "Profile",
    icon: "i-lucide-user",
    to: "/users/profile",
    active: route.path === "/users/profile",
    onSelect: () => {
      open.value = false;
    },
  },
  {
    label: "Integrations",
    icon: "i-lucide-unplug",
    to: "/settings",
    active: route.path === "/settings",
    onSelect: () => {
      open.value = false;
    },
  },
  {
    label: "API Keys",
    icon: "i-lucide-key",
    to: "/settings/api-keys",
    active: route.path === "/settings/api-keys",
    onSelect: () => {
      open.value = false;
    },
  },
  {
    label: "Notifications",
    icon: "i-lucide-bell",
    to: "/settings/notifications",
    active: route.path === "/settings/notifications",
    onSelect: () => {
      open.value = false;
    },
  },
  {
    label: "Billing",
    icon: "i-lucide-credit-card",
    to: "/settings/billing",
    active: route.path === "/settings/billing",
    onSelect: () => {
      open.value = false;
    },
  },
]);

const links = computed(
  () =>
    [
      [{ label: "Dashboards", type: "label" }, ...dashboardsItems.value],
      [{ label: "Apps", type: "label" }, ...appsItems.value],
      [{ label: "Users", type: "label" }, ...usersItems.value],
      [{ label: "Settings", type: "label" }, ...settingsItems.value],
    ] satisfies NavigationMenuItem[][]
);

const groups = computed(() => [
  {
    id: "links",
    label: "Go to",
    items: links.value.flat().filter((item) => item.type !== "label"),
  },
]);

const open = ref(false);
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
    >
      <template #header="{ collapsed }">
        <TeamsMenu :collapsed="collapsed" />
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="links"
          highlight-color="primary"
          orientation="vertical"
          :highlighted="false"
          tooltip
          popover
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />

    <slot />

    <NotificationsSlideOver />
  </UDashboardGroup>
</template>
