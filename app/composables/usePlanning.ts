import type { PlanningSummary, SwissCanton } from "~/types";

export interface PlanningParams {
  salary?: number;
  canton?: SwissCanton;
  expenses?: number;
  savingsRate?: number;
  pillar3a?: number;
  age?: number;
  portfolio?: number;
}

export const usePlanning = (params?: Ref<PlanningParams>) => {
  const queryParams = computed(() => ({
    ...(params?.value || {}),
  }));

  const { data, status, refresh } = useFetch<PlanningSummary>("/api/planning/summary", {
    query: queryParams,
  });

  return {
    data,
    status,
    refresh,
  };
};
