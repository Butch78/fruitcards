<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { Column } from "@tanstack/vue-table";

const UButton = resolveComponent("UButton");
const UIcon = resolveComponent("UIcon");

function sortableHeader<T>(column: Column<T>, label: string) {
  const isSorted = column.getIsSorted();
  return h(UButton, {
    color: "neutral",
    variant: "ghost",
    label,
    trailingIcon: isSorted
      ? isSorted === "asc"
        ? "i-lucide-chevron-up"
        : "i-lucide-chevron-down"
      : "i-lucide-chevrons-up-down",
    class: "-mx-2.5",
    ui: {
      trailingIcon: 'ml-1 size-4',
      leadingIcon: 'ml-1 size-4'
    },
    onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
  });
}

const data = ref([
  {
    title: "Home",
    url: "/",
    views: 1240,
    viewsGrowth: 12.5,
    activeUsers: 12,
    activeUsersGrowth: 8.3,
    avgEngagement: "2m 15s",
    conversions: 8,
  },
  {
    title: "User Management",
    url: "/users",
    views: 980,
    viewsGrowth: -5.2,
    activeUsers: 7,
    activeUsersGrowth: -2.1,
    avgEngagement: "1m 42s",
    conversions: 3,
  },
  {
    title: "Team Calendar",
    url: "/apps/calendar",
    views: 860,
    viewsGrowth: 23.1,
    activeUsers: 5,
    activeUsersGrowth: 15.0,
    avgEngagement: "3m 10s",
    conversions: 2,
  },
  {
    title: "Dashboard Overview",
    url: "/dashboards/one",
    views: 650,
    viewsGrowth: -8.7,
    activeUsers: 4,
    activeUsersGrowth: 0,
    avgEngagement: "1m 55s",
    conversions: 1,
  },
  {
    title: "Traffic Analytics",
    url: "/dashboards/traffic",
    views: 430,
    viewsGrowth: 5.4,
    activeUsers: 2,
    activeUsersGrowth: -10.5,
    avgEngagement: "1m 20s",
    conversions: 0,
  },
  {
    title: "Settings",
    url: "/settings",
    views: 390,
    viewsGrowth: -3.2,
    activeUsers: 1,
    activeUsersGrowth: -25.0,
    avgEngagement: "1m 05s",
    conversions: 0,
  },
  {
    title: "Reports",
    url: "/reports",
    views: 320,
    viewsGrowth: 18.9,
    activeUsers: 2,
    activeUsersGrowth: 33.3,
    avgEngagement: "2m 00s",
    conversions: 1,
  },
  {
    title: "Notifications",
    url: "/notifications",
    views: 210,
    viewsGrowth: -12.4,
    activeUsers: 1,
    activeUsersGrowth: -50.0,
    avgEngagement: "0m 45s",
    conversions: 0,
  },
  {
    title: "Help Center",
    url: "/help",
    views: 150,
    viewsGrowth: 7.1,
    activeUsers: 1,
    activeUsersGrowth: 0,
    avgEngagement: "1m 10s",
    conversions: 0,
  },
  {
    title: "Profile",
    url: "/profile",
    views: 95,
    viewsGrowth: -1.0,
    activeUsers: 1,
    activeUsersGrowth: 0,
    avgEngagement: "0m 55s",
    conversions: 0,
  },

  {
    title: "Pricing Page",
    url: "/pricing",
    views: 1100,
    viewsGrowth: 45.2,
    activeUsers: 9,
    activeUsersGrowth: 28.6,
    avgEngagement: "1m 50s",
    conversions: 15,
  },
  {
    title: "Contact Us",
    url: "/contact",
    views: 750,
    viewsGrowth: -6.8,
    activeUsers: 4,
    activeUsersGrowth: -11.1,
    avgEngagement: "0m 40s",
    conversions: 5,
  },
  {
    title: "About Us",
    url: "/about",
    views: 550,
    viewsGrowth: 3.8,
    activeUsers: 3,
    activeUsersGrowth: 50.0,
    avgEngagement: "2m 30s",
    conversions: 1,
  },
  {
    title: "Blog Index",
    url: "/blog",
    views: 1050,
    viewsGrowth: 15.4,
    activeUsers: 8,
    activeUsersGrowth: 14.3,
    avgEngagement: "1m 35s",
    conversions: 0,
  },
  {
    title: "Single Blog Post",
    url: "/blog/popular-post-slug",
    views: 1500,
    viewsGrowth: 67.8,
    activeUsers: 10,
    activeUsersGrowth: 42.9,
    avgEngagement: "4m 50s",
    conversions: 0,
  },
  {
    title: "New Project/Item Creation",
    url: "/projects/new",
    views: 50,
    viewsGrowth: -22.2,
    activeUsers: 6,
    activeUsersGrowth: 20.0,
    avgEngagement: "1m 00s",
    conversions: 20,
  },
  {
    title: "API Documentation",
    url: "/developers/api",
    views: 280,
    viewsGrowth: 9.4,
    activeUsers: 2,
    activeUsersGrowth: -33.3,
    avgEngagement: "3m 45s",
    conversions: 0,
  },
  {
    title: "Search Results",
    url: "/search?q=query",
    views: 400,
    viewsGrowth: -15.8,
    activeUsers: 5,
    activeUsersGrowth: 25.0,
    avgEngagement: "0m 30s",
    conversions: 0,
  },
  {
    title: "Checkout/Payment Step",
    url: "/checkout/payment",
    views: 120,
    viewsGrowth: 33.3,
    activeUsers: 3,
    activeUsersGrowth: 50.0,
    avgEngagement: "1m 15s",
    conversions: 18,
  },
  {
    title: "Product Feature Showcase",
    url: "/features/key-feature",
    views: 900,
    viewsGrowth: 11.1,
    activeUsers: 6,
    activeUsersGrowth: -14.3,
    avgEngagement: "2m 5s",
    conversions: 4,
  },
]);

const page = ref(1);
const itemsPerPage = ref(15);
const paginatedData = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  return data.value.slice(start, start + itemsPerPage.value);
});

const totalViews = computed(() =>
  paginatedData.value.reduce((acc, row) => acc + row.views, 0)
);

const totalActiveUsers = computed(() =>
  paginatedData.value.reduce((acc, row) => acc + row.activeUsers, 0)
);

const _averageConversionRate = computed(() => {
  const validPages = data.value.filter((page) => page.views > 0);
  const avgRate =
    validPages.reduce((acc, page) => {
      return acc + (page.conversions / page.views) * 100;
    }, 0) / validPages.length;
  return avgRate;
});

interface TrafficPage {
  title: string;
  url: string;
  views: number;
  viewsGrowth: number;
  activeUsers: number;
  activeUsersGrowth: number;
  avgEngagement: string;
  conversions: number;
}

const sorting = ref([
  {
    id: "views",
    desc: true,
  },
]);

const columns: TableColumn<TrafficPage>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => sortableHeader(column, "Page"),
    cell: ({ row }) =>
      h("div", { class: "flex gap-2" }, [
        h(
          "span",
          { class: "font-medium text-highlighted" },
          row.original.title
        ),
        h("span", { class: "text-muted text-sm" }, row.original.url),
      ]),
  },
  {
    accessorKey: "views",
    header: ({ column }) => sortableHeader(column, "Views"),
    cell: ({ row }) => {
      const growth = row.original.viewsGrowth;
      const isPositive = growth > 0;
      const isNeutral = growth === 0;
      
      return h("div", { class: "flex items-center gap-2" }, [
        h("span", { class: "text-toned" }, row.original.views.toLocaleString()),
        h(
          "span",
          { class: "text-dimmed text-xs" },
          `(${((row.original.views / totalViews.value) * 100).toFixed(1)}%)`
        ),
        !isNeutral && h(
          "span",
          { class: `flex items-center text-xs ${isPositive ? "text-(--ui-success)" : "text-(--ui-error)"}` },
          [
            h(UIcon, {
              name: isPositive ? "i-lucide-trending-up" : "i-lucide-trending-down",
              class: "size-4 mr-0.5",
            }),
            `${isPositive ? "+" : ""}${growth.toFixed(1)}%`,
          ]
        ),
      ]);
    },
  },
  {
    accessorKey: "activeUsers",
    header: ({ column }) => sortableHeader(column, "Active Users"),
    cell: ({ row }) => {
      const count = row.original.activeUsers;
      const percentage = ((count / totalActiveUsers.value) * 100).toFixed(1);
      const growth = row.original.activeUsersGrowth;
      const isPositive = growth > 0;
      const isNeutral = growth === 0;

      return h("div", { class: "flex items-center gap-2" }, [
        h("span", { class: "text-toned" }, count),
        h("span", { class: "text-dimmed text-xs" }, `(${percentage}%)`),
        !isNeutral && h(
          "span",
          { class: `flex items-center text-xs ${isPositive ? "text-(--ui-success)" : "text-(--ui-error)"}` },
        
        ),
      ]);
    },
  },
  {
    accessorKey: "avgEngagement",
    header: ({ column }) => sortableHeader(column, "Avg. Engagement Duration"),
    cell: ({ row }) => h("span", {}, row.original.avgEngagement),
  },
  {
    accessorKey: "conversions",
    header: ({ column }) => sortableHeader(column, "Conversions"),
    cell: ({ row }) => {
      const count = row.original.conversions;

      return h("div", { class: "flex items-center" }, [
        h("span", { class: "text-toned" }, count),
      ]);
    },
  },
];
</script>

<template>
  <UTable
    v-model:sorting="sorting"
    :data="paginatedData"
    :columns="columns"
    :ui="{ td: 'text-sm p-4', th: 'text-sm px-4 py-2' }"
  />
  <div
    class="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4"
  >
    <div class="flex items-center gap-2">
      <span class="text-muted">Show</span>
      <USelect
        v-model="itemsPerPage"
        :items="[5, 10, 20, 30, 50, 100]"
        class="w-20"
        size="sm"
      />
      <span class="text-muted">items per page</span>
      &middot;
      <div class="text-muted">{{ paginatedData.length }} results</div>
    </div>
    <UPagination
      v-model:page="page"
      :total="data.length"
      :items-per-page="itemsPerPage"
      :show-controls="true"
      :show-edges="true"
      size="md"
    />
  </div>
</template>
