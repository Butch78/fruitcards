<script setup lang="ts">
import type { FinancialTransaction, TransactionCategory, FinancialTransactionType, RecurringInterval } from "~/types";

const props = defineProps<{
  transaction?: FinancialTransaction | null;
  categories: TransactionCategory[];
}>();

const emit = defineEmits<{
  save: [data: {
    categoryId?: string;
    amount: number;
    type: FinancialTransactionType;
    description?: string;
    date: string;
    isRecurring?: boolean;
    recurringInterval?: RecurringInterval;
  }];
  cancel: [];
}>();

const isEditing = computed(() => !!props.transaction);

// Form state
const getInitialDate = (): string => {
  if (props.transaction?.date) {
    return new Date(props.transaction.date).toISOString().split("T")[0] as string;
  }
  return new Date().toISOString().split("T")[0] as string;
};

const formData = reactive({
  type: (props.transaction?.type ?? "expense") as FinancialTransactionType,
  amount: props.transaction?.amount ?? 0,
  description: props.transaction?.description ?? "",
  categoryId: props.transaction?.categoryId ?? "",
  date: getInitialDate(),
  isRecurring: props.transaction?.isRecurring ?? false,
  recurringInterval: (props.transaction?.recurringInterval ?? "monthly") as RecurringInterval,
});

// Filter categories by type
const filteredCategories = computed(() => {
  return props.categories.filter((c) => c.type === formData.type);
});

// Reset category when type changes
watch(
  () => formData.type,
  () => {
    formData.categoryId = "";
  }
);

// Type options
const typeOptions = [
  { label: "Expense", value: "expense" },
  { label: "Income", value: "income" },
];

// Recurring interval options
const intervalOptions = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

const handleSubmit = () => {
  if (!formData.amount || formData.amount <= 0) {
    return;
  }

  emit("save", {
    type: formData.type,
    amount: formData.amount,
    description: formData.description || undefined,
    categoryId: formData.categoryId || undefined,
    date: formData.date,
    isRecurring: formData.isRecurring,
    recurringInterval: formData.isRecurring ? formData.recurringInterval : undefined,
  });
};
</script>

<template>
  <UCard class="w-full max-w-md">
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">
          {{ isEditing ? "Edit Transaction" : "Add Transaction" }}
        </h2>
        <UButton
          icon="i-lucide-x"
          variant="ghost"
          color="neutral"
          size="sm"
          @click="emit('cancel')"
        />
      </div>
    </template>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <!-- Type Selection -->
      <UFormField label="Type">
        <UButtonGroup class="w-full">
          <UButton
            v-for="opt in typeOptions"
            :key="opt.value"
            :label="opt.label"
            :variant="formData.type === opt.value ? 'solid' : 'outline'"
            :color="opt.value === 'income' ? 'success' : 'error'"
            class="flex-1"
            @click="formData.type = opt.value as FinancialTransactionType"
          />
        </UButtonGroup>
      </UFormField>

      <!-- Amount -->
      <UFormField label="Amount" required>
        <UInput
          v-model.number="formData.amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          :ui="{ leading: 'pl-8' }"
        >
          <template #leading>
            <span class="text-muted">$</span>
          </template>
        </UInput>
      </UFormField>

      <!-- Description -->
      <UFormField label="Description">
        <UInput
          v-model="formData.description"
          placeholder="Enter description"
        />
      </UFormField>

      <!-- Category -->
      <UFormField label="Category">
        <USelectMenu
          v-model="formData.categoryId"
          :items="filteredCategories.map((c) => ({ label: c.name, value: c.id, icon: c.icon }))"
          placeholder="Select a category"
          value-key="value"
        />
      </UFormField>

      <!-- Date -->
      <UFormField label="Date" required>
        <UInput v-model="formData.date" type="date" />
      </UFormField>

      <!-- Recurring -->
      <div class="space-y-3">
        <UCheckbox v-model="formData.isRecurring" label="This is a recurring transaction" />

        <UFormField v-if="formData.isRecurring" label="Repeat">
          <USelectMenu
            v-model="formData.recurringInterval"
            :items="intervalOptions"
            value-key="value"
          />
        </UFormField>
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton label="Cancel" variant="outline" color="neutral" @click="emit('cancel')" />
        <UButton
          :label="isEditing ? 'Update' : 'Add Transaction'"
          :color="formData.type === 'income' ? 'success' : 'primary'"
          @click="handleSubmit"
        />
      </div>
    </template>
  </UCard>
</template>
