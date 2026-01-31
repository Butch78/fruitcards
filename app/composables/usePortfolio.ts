import type { PortfolioHolding, PortfolioSummary, AssetType } from "~/types";

export interface PortfolioFilters {
  assetType?: AssetType;
  sector?: string;
}

export interface CreateHoldingPayload {
  symbol: string;
  name: string;
  assetType: AssetType;
  quantity: number;
  averageCost: number;
  currentPrice?: number;
  currency?: string;
  sector?: string;
  exchange?: string;
  notes?: string;
}

export interface UpdateHoldingPayload {
  symbol?: string;
  name?: string;
  assetType?: AssetType;
  quantity?: number;
  averageCost?: number;
  currentPrice?: number;
  currency?: string;
  sector?: string | null;
  exchange?: string | null;
  notes?: string | null;
}

export interface PortfolioResponse {
  data: PortfolioHolding[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const usePortfolio = (filters?: Ref<PortfolioFilters>) => {
  const page = ref(1);
  const pageSize = ref(20);

  const queryParams = computed(() => ({
    page: page.value,
    pageSize: pageSize.value,
    ...(filters?.value || {}),
  }));

  const { data, status, refresh } = useFetch<PortfolioResponse>("/api/portfolio", {
    query: queryParams,
  });

  const updatePage = (newPage: number) => {
    page.value = newPage;
  };

  const createHolding = async (payload: CreateHoldingPayload) => {
    const result = await $fetch<PortfolioHolding>("/api/portfolio", {
      method: "POST",
      body: payload,
    });
    await refresh();
    return result;
  };

  const updateHolding = async (id: string, payload: UpdateHoldingPayload) => {
    const result = await $fetch<PortfolioHolding>(`/api/portfolio/${id}`, {
      method: "PUT",
      body: payload,
    });
    await refresh();
    return result;
  };

  const deleteHolding = async (id: string) => {
    await $fetch(`/api/portfolio/${id}`, {
      method: "DELETE",
    });
    await refresh();
  };

  return {
    data,
    status,
    page,
    pageSize,
    updatePage,
    refresh,
    createHolding,
    updateHolding,
    deleteHolding,
  };
};

export const usePortfolioSummary = () => {
  return useFetch<PortfolioSummary>("/api/portfolio/summary");
};
