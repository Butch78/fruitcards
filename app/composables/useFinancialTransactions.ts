import type {
  FinancialTransaction,
  TransactionCategory,
  TransactionSummary,
  FinancialTransactionType,
  RecurringInterval,
} from "~/types";

export interface TransactionFilters {
  type?: FinancialTransactionType;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateTransactionPayload {
  categoryId?: string;
  amount: number;
  type: FinancialTransactionType;
  description?: string;
  date: string;
  isRecurring?: boolean;
  recurringInterval?: RecurringInterval;
  recurringEndDate?: string;
}

export interface UpdateTransactionPayload {
  categoryId?: string | null;
  amount?: number;
  type?: FinancialTransactionType;
  description?: string | null;
  date?: string;
  isRecurring?: boolean;
  recurringInterval?: RecurringInterval | null;
  recurringEndDate?: string | null;
}

export interface TransactionsResponse {
  data: FinancialTransaction[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const useFinancialTransactions = (filters?: Ref<TransactionFilters>) => {
  const page = ref(1);
  const pageSize = ref(10);

  const queryParams = computed(() => ({
    page: page.value,
    pageSize: pageSize.value,
    ...(filters?.value || {}),
  }));

  const { data, status, refresh } = useFetch<TransactionsResponse>(
    "/api/financial-transactions",
    {
      query: queryParams,
    }
  );

  const updatePage = (newPage: number) => {
    page.value = newPage;
  };

  const createTransaction = async (payload: CreateTransactionPayload) => {
    const result = await $fetch<FinancialTransaction>("/api/financial-transactions", {
      method: "POST",
      body: payload,
    });
    await refresh();
    return result;
  };

  const updateTransaction = async (id: string, payload: UpdateTransactionPayload) => {
    const result = await $fetch<FinancialTransaction>(`/api/financial-transactions/${id}`, {
      method: "PUT",
      body: payload,
    });
    await refresh();
    return result;
  };

  const deleteTransaction = async (id: string) => {
    await $fetch(`/api/financial-transactions/${id}`, {
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
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
};

export const useTransactionCategories = (type?: FinancialTransactionType) => {
  return useFetch<TransactionCategory[]>("/api/financial-transactions/categories", {
    query: computed(() => (type ? { type } : {})),
  });
};

export const useTransactionSummary = (filters?: {
  startDate?: string;
  endDate?: string;
}) => {
  return useFetch<TransactionSummary>("/api/financial-transactions/summary", {
    query: computed(() => filters || {}),
  });
};
