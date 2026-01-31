<script setup lang="ts">
import type { PortfolioHolding, AssetType } from "~/types";

const props = defineProps<{
  holding?: PortfolioHolding | null;
}>();

const emit = defineEmits<{
  save: [data: {
    symbol: string;
    name: string;
    assetType: AssetType;
    quantity: number;
    averageCost: number;
    currentPrice?: number;
    sector?: string;
    exchange?: string;
    notes?: string;
  }];
  cancel: [];
}>();

const isEditing = computed(() => !!props.holding);

// Form state
const formData = reactive({
  symbol: props.holding?.symbol ?? "",
  name: props.holding?.name ?? "",
  assetType: (props.holding?.assetType ?? "stock") as AssetType,
  quantity: props.holding?.quantity ?? 0,
  averageCost: props.holding?.averageCost ?? 0,
  currentPrice: props.holding?.currentPrice ?? 0,
  sector: props.holding?.sector ?? "",
  exchange: props.holding?.exchange ?? "",
  notes: props.holding?.notes ?? "",
});

// Asset type options
const assetTypeOptions = [
  { label: "Stock", value: "stock", icon: "i-lucide-trending-up" },
  { label: "ETF", value: "etf", icon: "i-lucide-pie-chart" },
  { label: "Crypto", value: "crypto", icon: "i-lucide-bitcoin" },
  { label: "Bond", value: "bond", icon: "i-lucide-landmark" },
  { label: "Cash", value: "cash", icon: "i-lucide-banknote" },
  { label: "Other", value: "other", icon: "i-lucide-circle-dot" },
];

// Common sectors
const sectorOptions = [
  "Technology",
  "Healthcare",
  "Financial",
  "Consumer Discretionary",
  "Consumer Staples",
  "Energy",
  "Industrials",
  "Materials",
  "Real Estate",
  "Utilities",
  "Communication Services",
  "Broad Market",
  "Fixed Income",
  "Cryptocurrency",
  "Other",
];

// Common exchanges
const exchangeOptions = [
  "NASDAQ",
  "NYSE",
  "AMEX",
  "LSE",
  "TSX",
  "Coinbase",
  "Binance",
  "Other",
];

const handleSubmit = () => {
  if (!formData.symbol || !formData.name || formData.quantity <= 0 || formData.averageCost <= 0) {
    return;
  }

  emit("save", {
    symbol: formData.symbol.toUpperCase(),
    name: formData.name,
    assetType: formData.assetType,
    quantity: formData.quantity,
    averageCost: formData.averageCost,
    currentPrice: formData.currentPrice || formData.averageCost,
    sector: formData.sector || undefined,
    exchange: formData.exchange || undefined,
    notes: formData.notes || undefined,
  });
};

// Calculate values
const totalCost = computed(() => formData.quantity * formData.averageCost);
const currentValue = computed(() => formData.quantity * (formData.currentPrice || formData.averageCost));
const gainLoss = computed(() => currentValue.value - totalCost.value);
const gainLossPercent = computed(() => {
  if (totalCost.value === 0) return 0;
  return (gainLoss.value / totalCost.value) * 100;
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};
</script>

<template>
  <UCard class="w-full max-w-lg">
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">
          {{ isEditing ? "Edit Holding" : "Add Holding" }}
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
      <!-- Asset Type -->
      <UFormField label="Asset Type">
        <USelectMenu
          v-model="formData.assetType"
          :items="assetTypeOptions"
          value-key="value"
        />
      </UFormField>

      <div class="grid grid-cols-2 gap-4">
        <!-- Symbol -->
        <UFormField label="Symbol" required>
          <UInput
            v-model="formData.symbol"
            placeholder="AAPL"
            class="uppercase"
          />
        </UFormField>

        <!-- Name -->
        <UFormField label="Name" required>
          <UInput
            v-model="formData.name"
            placeholder="Apple Inc."
          />
        </UFormField>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- Quantity -->
        <UFormField label="Quantity" required>
          <UInput
            v-model.number="formData.quantity"
            type="number"
            min="0"
            step="0.0001"
            placeholder="0"
          />
        </UFormField>

        <!-- Average Cost -->
        <UFormField label="Average Cost" required>
          <UInput
            v-model.number="formData.averageCost"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
          >
            <template #leading>
              <span class="text-muted">$</span>
            </template>
          </UInput>
        </UFormField>
      </div>

      <!-- Current Price -->
      <UFormField label="Current Price">
        <UInput
          v-model.number="formData.currentPrice"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
        >
          <template #leading>
            <span class="text-muted">$</span>
          </template>
        </UInput>
      </UFormField>

      <!-- Value Summary -->
      <div v-if="formData.quantity > 0 && formData.averageCost > 0" class="p-3 bg-elevated rounded-lg space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-muted">Total Cost</span>
          <span>{{ formatCurrency(totalCost) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-muted">Current Value</span>
          <span>{{ formatCurrency(currentValue) }}</span>
        </div>
        <div class="flex justify-between text-sm font-medium">
          <span class="text-muted">Gain/Loss</span>
          <span :class="gainLoss >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ gainLoss >= 0 ? '+' : '' }}{{ formatCurrency(gainLoss) }} ({{ gainLossPercent >= 0 ? '+' : '' }}{{ gainLossPercent.toFixed(2) }}%)
          </span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- Sector -->
        <UFormField label="Sector">
          <USelectMenu
            v-model="formData.sector"
            :items="sectorOptions"
            placeholder="Select sector"
          />
        </UFormField>

        <!-- Exchange -->
        <UFormField label="Exchange">
          <USelectMenu
            v-model="formData.exchange"
            :items="exchangeOptions"
            placeholder="Select exchange"
          />
        </UFormField>
      </div>

      <!-- Notes -->
      <UFormField label="Notes">
        <UTextarea
          v-model="formData.notes"
          placeholder="Add any notes..."
          :rows="2"
        />
      </UFormField>
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton label="Cancel" variant="outline" color="neutral" @click="emit('cancel')" />
        <UButton
          :label="isEditing ? 'Update' : 'Add Holding'"
          @click="handleSubmit"
        />
      </div>
    </template>
  </UCard>
</template>
