import type { BudgetSummary } from "~/types";

export interface BudgetParams {
  income?: number;
}

export const useBudget = (params?: Ref<BudgetParams>) => {
  const queryParams = computed(() => ({
    ...(params?.value || {}),
  }));

  const { data, status, refresh } = useFetch<BudgetSummary>("/api/budget/summary", {
    query: queryParams,
  });

  return {
    data,
    status,
    refresh,
  };
};
