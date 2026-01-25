<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Row } from "@tanstack/vue-table";
import { useClipboard } from "@vueuse/core";
import type { UserItem } from "~/data/users";

const UIcon = resolveComponent("UIcon");
const UAvatar = resolveComponent("UAvatar");
const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");
const UCheckbox = resolveComponent("UCheckbox");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const props = defineProps<{
  queryParams: any;
  data: UserItem[];
  total: number;
  pageSize?: number;
}>();

const emits = defineEmits<{
  (event: "update:sorting", payload: { sortBy: keyof UserItem; sortDir: "asc" | "desc" }): void;
  (event: "update:page", page: number): void;
}>();

const toast = useToast();
const { copy } = useClipboard();

function getHeader<TRow>(
  column: import("@tanstack/vue-table").Column<TRow>,
  label: string
) {
  const isSorted = props.queryParams?.sortBy === column.id;
  let icon = "i-lucide-chevrons-up-down";
  if (isSorted) {
    icon = props.queryParams?.sortDir === "asc" ? "i-lucide-chevron-up" : "i-lucide-chevron-down";
  }
  return h(
    "button",
    {
      type: "button",
      class:
        "flex items-center gap-1 px-2 py-1 bg-transparent border-none cursor-pointer select-none",
      onClick: () => {
        emits("update:sorting", {
          sortBy: column.id as keyof UserItem,
          sortDir: props.queryParams?.sortDir === "asc" ? "desc" : "asc",
        });
      },
      "aria-label": `Sort by ${label}`,
      style: "font: inherit;",
    },
    [label, h(UIcon, { name: icon, class: "w-4 h-4" })]
  );
}

const columns: TableColumn<UserItem>[] = [
  {
    id: "select",
    header: ({ table }) =>
      h(
      "div",
      { class: "flex items-center pl-2" },
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
    accessorKey: "name",
    header: ({ column }) => getHeader(column, "User"),
    cell: ({ row }) => {
        const user = row.original;
        return h('div', { class: 'flex items-center gap-2' }, [
            h(UAvatar, { src: user.avatar, alt: user.name, size: 'sm' }),
            h('span', user.name)
        ])
    }
  },
  {
    accessorKey: "email",
    header: ({ column }) => getHeader(column, "Email"),
  },
  {
    accessorKey: "role",
    header: ({ column }) => getHeader(column, "Role"),
  },
  {
    accessorKey: "status",
    header: ({ column }) => getHeader(column, "Status"),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusConfig: Record<string, { color: string, icon: string }> = {
        Active: { color: "success", icon: "i-lucide-circle-check" },
        Invited: { color: "warning", icon: "i-lucide-mail" },
        Inactive: { color: "gray", icon: "i-lucide-circle-off" },
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
    accessorKey: "lastLogin",
    header: ({ column }) => getHeader(column, "Last Login"),
    cell: ({ row }) => {
      return new Date(row.getValue("lastLogin")).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: '2-digit',
        minute: '2-digit'
      });
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return h(
        "div",
        { class: "text-right" },
        h(
          UDropdownMenu,
          {
            content: { align: "end" },
            items: getRowItems(row),
            "aria-label": "Actions dropdown",
          },
          () =>
            h(UButton, {
              icon: "i-lucide-ellipsis-vertical",
              color: "neutral",
              variant: "ghost",
              class: "ml-auto",
              "aria-label": "Actions dropdown",
            })
        )
      );
    },
  },
];

function getRowItems(row: Row<UserItem>) {
  return [
    {
      type: "label",
      label: "Actions",
    },
    {
      label: "Copy email",
      icon: "i-lucide-copy",
      onSelect() {
        copy(row.original.email);

        toast.add({
          title: "User email copied to clipboard!",
          color: "success",
          icon: "i-lucide-circle-check",
        });
      },
    },
    {
        label: "Edit user",
        icon: "i-lucide-pencil",
        onSelect() {
            // Placeholder for edit action
            toast.add({ title: "Editing user..." });
        }
    },
    {
        label: "Delete user",
        icon: "i-lucide-trash-2",
        onSelect() {
            // Placeholder for delete action
            toast.add({ title: "Deleting user...", color: "error" });
        }
    }
  ];
}
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
