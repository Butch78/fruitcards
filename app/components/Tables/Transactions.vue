<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Transaction, TransactionStatus } from "~/types";
import { transactions } from "~/data/transactions";

const UAvatar = resolveComponent("UAvatar");
const UBadge = resolveComponent("UBadge");

const props = defineProps<{
  data?: Transaction[];
}>();

const data = computed(() => props.data ?? transactions);

const statusConfig: Record<
  TransactionStatus,
  { color: string; icon: string; variant: "solid" | "outline" | "soft" | "subtle" }
> = {
  Active: {
    color: "primary",
    icon: "i-lucide-circle-check",
    variant: "soft",
  },
  Inactive: {
    color: "error",
    icon: "i-lucide-circle-x",
    variant: "soft",
  },
  Pending: {
    color: "info",
    icon: "i-lucide-rotate-ccw",
    variant: "soft",
  },
  Refunded: {
    color: "warning",
    icon: "i-lucide-hourglass",
    variant: "soft",
  },
};

const columns: TableColumn<Transaction>[] = [
  {
    accessorKey: "contact",
    header: "Name",
    cell: ({ row }) => {
      const contact = row.original.contact;
      return h("div", { class: "flex items-center gap-4" }, [
        h(UAvatar, {
          src: contact.avatar,
          size: "sm",
          alt: contact.name,
        }),
        h("div", { class: "flex flex-col" }, [
          h(
            "p",
            { class: "font-medium text-highlighted leading-none" },
            contact.name
          ),
          h("p", { class: "text-xs text-muted mt-1" }, contact.email),
        ]),
      ]);
    },
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "domain",
    header: "Domain",
    cell: ({ row }) =>
      h("span", { class: "capitalize" }, row.original.domain),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as TransactionStatus;
      const config = statusConfig[status] || {
        color: "neutral",
        icon: "i-lucide-circle-help",
        variant: "soft",
      };

      return h(
        UBadge,
        {
          ui: { leadingIcon: "size-3.5" },
          class: "capitalize",
          variant: config.variant,
          color: config.color,
          icon: config.icon,
        },
        () => status
      );
    },
  },
];
</script>

<template>
  <UTable
    :data="data"
    :columns="columns"
    class="flex-1"
    :ui="{
      td: 'text-sm p-4',
      th: 'bg-transparent py-4 font-semibold text-highlighted',
      tr: 'divide-x-0',
      root: 'ring-0',
    }"
  />
</template>
