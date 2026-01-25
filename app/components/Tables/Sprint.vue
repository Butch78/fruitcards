<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { useClipboard } from "@vueuse/core";
import type { IssueItem } from "~/data/issues";

const UIcon = resolveComponent("UIcon");
const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");
const UCheckbox = resolveComponent("UCheckbox");

const props = defineProps<{
  queryParams: any;
  data: IssueItem[];
  total: number;
  pageSize?: number;
}>();

const emits = defineEmits<{
  (event: "update:sorting", payload: { sortBy: keyof IssueItem, sortDir: "asc" | "desc" }): void;
  (event: "update:page", page: number): void;
}>();

function getHeader<TRow>(
  column: import("@tanstack/vue-table").Column<TRow>,
  label: string
) {
  const isSorted = props.queryParams?.sortBy === column.id;
  let icon = "i-lucide-chevrons-up-down";
  if (!isSorted) icon = "i-lucide-chevron-up";
  if (isSorted) icon = "i-lucide-chevron-down";
  return h(
    "button",
    {
      type: "button",
      class:
        "flex items-center gap-1 px-2 py-1 bg-transparent border-none cursor-pointer select-none",
      onClick: () => {
        emits("update:sorting", {
          sortBy: column.id as keyof IssueItem,
          sortDir: props.queryParams?.sortDir === "asc" ? "desc" : "asc",
        });
      },
      "aria-label": `Sort by ${label}`,
      style: "font: inherit;",
    },
    [label, h(UIcon, { name: icon, class: "w-4 h-4" })]
  );
}

const columns: TableColumn<IssueItem>[] = [
  {
    id: "select",
    header: ({ table }) =>
      h(
      "div",
      { class: "flex items-center pl-2 pr-4" },
      h(UCheckbox, {
        modelValue: table.getIsSomePageRowsSelected()
        ? "indeterminate"
        : table.getIsAllPageRowsSelected(),
        "onUpdate:modelValue": (value: boolean | "indeterminate") =>
        table.toggleAllPageRowsSelected(!!value),
        "aria-label": "Select all",
      })
      ),
    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        "onUpdate:modelValue": (value: boolean | "indeterminate") =>
          row.toggleSelected(!!value),
        "aria-label": "Select row",
      }),
  },
  {
    accessorKey: "title",
    header: ({ column }) => getHeader(column, "Title"),
  },
  {
    accessorKey: "status",
    header: ({ column }) => getHeader(column, "Status"),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusConfig = {
        Todo: { color: "primary", icon: "i-lucide-circle-check" },
        "In Progress": { color: "warning", icon: "i-lucide-hourglass" },
        Done: { color: "success", icon: "i-lucide-circle-check" },
      };
      const { color, icon } = statusConfig[status] || {
        color: "neutral",
        icon: "i-lucide-circle-help",
      };
      return h(
        UBadge,
        {
          ui: { leadingIcon: "size-3.5" },
          class: "capitalize",
          variant: "soft",
          color,
          icon,
        },
        () => status
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => getHeader(column, "Type"),
  },
  {
    accessorKey: "assignee",
    header: ({ column }) => getHeader(column, "Assignee"),
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => getHeader(column, "Due Date"),
    cell: ({ row }) => {
      return new Date(row.getValue("dueDate")).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  }
];
</script>

<template>
  <div class="space-y-6">
    <UTable ref="table" :data="data" :columns="columns" class="flex-1" />
    <FlexEnd>
      <UPagination
        :page="queryParams.page"
        :items-per-page="queryParams.pageSize"
        :total="props.total"
        @update:page="(p) => emits('update:page', p)"
      >
        <template #item="{ page, item }">
          <UButton
            variant="link"
            :label="String(item.value)"
            active-variant="subtle"
            :active="item.value === page"
          />
        </template>
      </UPagination>
    </FlexEnd>
  </div>
</template>
