<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent, TableColumn } from "@nuxt/ui";

updateAppConfig({});

// UInput
const inputValue = ref("");
const clearableValue = ref("Click to clear");

// USelect
const selectItemsStrings = ["Backlog", "Todo", "In Progress", "Done"];
const selectedString = ref(selectItemsStrings[0]);
const selectItemsObjects = [
  { label: "Backlog", id: "backlog" },
  { label: "Todo", id: "todo" },
  { label: "In Progress", id: "in_progress" },
  { label: "Done", id: "done" },
];
const selectedObject = ref("todo");

// UForm
const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type Schema = z.output<typeof schema>;
const formState = reactive({
  email: "",
  password: "",
});
const toast = useToast();
async function onFormSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: "Success!", description: "The form was submitted." });
}

// UTable
const UBadgeComponent = resolveComponent("UBadge");
const UButtonComponent = resolveComponent("UButton");

type Payment = {
  id: string;
  date: string;
  status: "paid" | "failed" | "refunded";
  email: string;
  amount: number;
};

const tableData = ref<Payment[]>([
  {
    id: "4600",
    date: "2024-03-11T15:30:00",
    status: "paid",
    email: "james.anderson@example.com",
    amount: 594,
  },
  {
    id: "4599",
    date: "2024-03-11T10:10:00",
    status: "failed",
    email: "mia.white@example.com",
    amount: 276,
  },
  {
    id: "4598",
    date: "2024-03-11T08:50:00",
    status: "refunded",
    email: "william.brown@example.com",
    amount: 315,
  },
]);

const tableColumns: TableColumn<Payment>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) =>
      new Date(row.getValue("date")).toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const color = {
        paid: "success" as const,
        failed: "error" as const,
        refunded: "neutral" as const,
      }[row.getValue("status") as string];
      return h(
        UBadgeComponent,
        { class: "capitalize", variant: "subtle", color },
        () => row.getValue("status")
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return h(UButtonComponent, {
        color: "neutral",
        variant: "ghost",
        label: "Email",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
  },
  {
    accessorKey: "amount",
    header: () => h("div", { class: "text-right" }, "Amount"),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EUR",
      }).format(amount);
      return h("div", { class: "text-right font-medium" }, formatted);
    },
  },
];

const tableSorting = ref([{ id: "email", desc: false }]);

const colors = [
  "primary",
  "secondary",
  "success",
  "info",
  "warning",
  "error",
  "neutral",
];

const buttonVariants = ["solid", "outline", "soft", "subtle", "ghost", "link"];
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UDashboardSidebarCollapse class="-ml-0.5" />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>

  <div class="w-full max-h-screen">
    <!-- Hero -->
    <header
      class="relative overflow-hidden border-b border-default bg-gradient-to-b from-accented/50 to-transparent"
    >
      <div
        class="absolute inset-0 pointer-events-none hero-pattern"
        aria-hidden="true"
      />
      <div
        class="px-4 lg:px-8 py-10 lg:py-14 max-w-screen-2xl mx-auto text-center"
      >
        <div
          class="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full border bg-elevated text-toned text-xs mb-4"
        >
          <span class="i-lucide-sparkles" aria-hidden="true" />
          Design System
        </div>
        <h1 class="text-4xl lg:text-5xl font-bold tracking-tight mb-3">
          UI Kit & Guidelines
        </h1>
        <p class="text-base lg:text-lg text-muted max-w-2xl mx-auto">
          Explore the foundation and core components that shape the product
          experience.
        </p>
      </div>
    </header>

    <div class="p-4 lg:p-8 w-full max-w-screen-2xl mx-auto">
      <!-- Components Section -->
      <section id="components" class="scroll-mt-24 mb-16">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-semibold">Components</h2>
          <p class="text-muted mt-2">
            Interactive building blocks with variants and states.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          <!-- Badge Component -->
          <UCard>
            <template #header>
              <h3 class="text-xl font-medium">Badge</h3>
            </template>
            <div class="space-y-6">
              <div>
                <p class="text-sm font-medium text-muted mb-3">Variants</p>
                <div class="flex flex-wrap gap-2">
                  <UBadge label="Solid" variant="solid" />
                  <UBadge label="Outline" variant="outline" />
                  <UBadge label="Soft" variant="soft" />
                  <UBadge label="Subtle" variant="subtle" />
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-muted mb-3">Sizes</p>
                <div class="flex items-end flex-wrap gap-2">
                  <UBadge label="xl" size="xl" variant="solid" />
                  <UBadge label="lg" size="lg" variant="solid" />
                  <UBadge label="md" size="md" variant="solid" />
                  <UBadge label="sm" size="sm" variant="solid" />
                  <UBadge label="xs" size="xs" variant="solid" />
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-muted mb-3">Colors</p>
                <div class="space-y-2">
                  <div
                    v-for="(color, colorKey) in colors"
                    :key="colorKey"
                    class="flex items-center flex-wrap gap-2"
                  >
                    <UBadge label="Solid" variant="solid" :color="color" />
                    <UBadge label="Outline" variant="outline" :color="color" />
                    <UBadge label="Soft" variant="soft" :color="color" />
                    <UBadge label="Subtle" variant="subtle" :color="color" />
                  </div>
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-muted mb-3">
                  With Icon & Avatar
                </p>
                <div class="flex items-center flex-wrap gap-2">
                  <UBadge
                    icon="i-lucide-rocket"
                    label="Rocket"
                  />
                  <UBadge
                    :avatar="{ src: 'https://github.com/nuxt.png' }"
                    label="Nuxt"
                  />
                </div>
              </div>
            </div>
          </UCard>

          <!-- Button Component -->
          <UCard>
            <template #header>
              <h3 class="text-xl font-medium">Button</h3>
            </template>
            <div class="space-y-6">
              <div>
                <p class="text-sm font-medium text-muted mb-3">Variants</p>
                <div class="flex gap-2">
                  <UButton
                    v-for="(variant, varKey) in buttonVariants"
                    :key="varKey"
                    :variant="variant"
                    :label="variant"
                    color="primary"
                  />
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-muted mb-3">Sizes</p>
                <div class="flex items-center justify-center gap-2">
                  <UButton label="Large" size="lg" />
                  <UButton label="Medium" size="md" />
                  <UButton label="Small" size="sm" />
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-muted mb-3">
                  States & Icons
                </p>
                <div class="flex flex-wrap gap-2">
                  <UButton
                    icon="i-lucide-rocket"
                    label="With Icon"
                  />
                  <UButton
                    trailing-icon="i-lucide-arrow-right"
                    label="Trailing Icon"
                  />
                  <UButton loading label="Loading..." />

                  <UButton active label="Active" />
                  <UButton disabled label="Disabled" />
                </div>
              </div>
            </div>
          </UCard>

          <!-- Input Component -->
          <UCard>
            <template #header>
              <h3 class="text-xl font-medium">Input</h3>
            </template>
            <div class="space-y-6">
              <div>
                <p class="text-sm font-medium text-muted mb-3">Basic</p>
                <UInput
                  v-model="inputValue"
                  placeholder="Enter your email..."
                />
              </div>
              <div>
                <p class="text-sm font-medium text-muted mb-3">Variants</p>
                <div class="flex flex-col gap-3">
                  <UInput placeholder="Outline (Default)" />
                  <UInput placeholder="Subtle" color="neutral" />
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-muted mb-3">With Icons</p>
                <div class="flex flex-col gap-3">
                  <UInput icon="i-lucide-search" placeholder="Search..." />
                  <UInput
                    trailing-icon="i-lucide-at-sign"
                    placeholder="Enter email"
                  />
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-muted mb-3">Clearable</p>
                <UInput v-model="clearableValue" :ui="{ trailing: 'pe-1' }">
                  <template v-if="clearableValue?.length" #trailing>
                    <UButton
                      color="neutral"
                      variant="link"
                      size="sm"
                      icon="i-lucide-circle-x"
                      aria-label="Clear input"
                      @click="clearableValue = ''"
                    />
                  </template>
                </UInput>
              </div>
            </div>
          </UCard>

          <!-- Select Component -->
          <UCard>
            <template #header>
              <h3 class="text-xl font-medium">Select</h3>
            </template>
            <div class="space-y-6">
              <div>
                <p class="text-sm font-medium text-muted mb-3">String Array</p>
                <USelect
                  v-model="selectedString"
                  :items="selectItemsStrings"
                  class="w-full"
                />
              </div>
              <div>
                <p class="text-sm font-medium text-muted mb-3">Object Array</p>
                <USelect
                  v-model="selectedObject"
                  :items="selectItemsObjects"
                  value-key="id"
                  label-key="label"
                  class="w-full"
                />
              </div>
              <div>
                <p class="text-sm font-medium text-muted mb-3">With Icon</p>
                <USelect
                  :items="['Option 1', 'Option 2']"
                  icon="i-lucide-list-filter"
                  class="w-full"
                />
              </div>
            </div>
          </UCard>

          <!-- Form Component -->
          <UCard>
            <template #header>
              <h3 class="text-xl font-medium">Form</h3>
            </template>
            <UForm
              :schema="schema"
              :state="formState"
              class="space-y-4"
              @submit="onFormSubmit"
            >
              <UFormField label="Email" name="email">
                <UInput v-model="formState.email" />
              </UFormField>

              <UFormField label="Password" name="password">
                <UInput v-model="formState.password" type="password" />
              </UFormField>

              <UButton
                type="submit"
                color="primary"
                class="w-full flex items-center justify-center"
              >
                Submit Form
              </UButton>
            </UForm>
          </UCard>

          <UCard>
            <template #header>
              <h3 class="text-xl font-medium">Typography</h3>
            </template>
            <div class="space-y-6">
              <div class="space-y-3">
                <h1 class="text-4xl font-bold">Heading 1</h1>
                <h2 class="text-3xl font-semibold">Heading 2</h2>
                <h3 class="text-2xl font-medium">Heading 3</h3>
                <h4 class="text-xl font-medium">Heading 4</h4>
              </div>
              <div class="space-y-2 border-t pt-4">
                <p class="text-default">Default text - main content</p>
                <p class="text-dimmed">Dimmed text - slightly less prominent</p>
                <p class="text-muted">Muted text - secondary information</p>
                <p class="text-toned">Toned text - less important details</p>
                <p class="text-highlighted">
                  Highlighted text - draws attention
                </p>
              </div>
            </div>
          </UCard>
        </div>
      </section>

      <!-- Data Display Section -->
      <section id="data" class="scroll-mt-24">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-semibold">Data Display</h2>
          <p class="text-muted mt-2">
            Tabular content with sorting and formatting.
          </p>
        </div>

        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-medium">Table</h3>
              <span class="text-xs text-toned">Sortable</span>
            </div>
          </template>
          <UTable
            v-model:sorting="tableSorting"
            :data="tableData"
            :columns="tableColumns"
            class="w-full"
          />
        </UCard>
      </section>
    </div>
  </div>

    </template>
  </UDashboardPanel>
</template>
