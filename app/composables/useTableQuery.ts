import type { UnwrapRef } from "vue";

export interface QueryParams<T> {
  sortBy?: keyof T;
  sortDir: "asc" | "desc";
  page: number;
  pageSize: number;
}

export type UpdateSortPayload<T> = {
    sortBy: keyof T,
    sortDir: "asc" | "desc"
}

export const useTableQuery = <T>(
  initialParams?: Partial<QueryParams<T>>,
) => {
  const queryParams = reactive<QueryParams<T>>({
    sortBy: undefined,
    sortDir: "asc",
    page: 1,
    pageSize: 5,
    ...initialParams,
  });

  const updateSort = (payload: UpdateSortPayload<T>) => {
    queryParams.sortBy = payload.sortBy as UnwrapRef<keyof T>;
    queryParams.sortDir = payload.sortDir;
  };

  const updatePage = (page: number) => {
    queryParams.page = page;
  };

  const updatePageSize = (pageSize: number) => {
    queryParams.pageSize = pageSize;
    queryParams.page = 1; 
  };

  const resetFilters = () => {
    queryParams.sortBy = undefined;
    queryParams.sortDir = "asc";
    queryParams.page = 1;
  };

  return {
    queryParams: readonly(queryParams),
    updateSort,
    updatePage,
    updatePageSize,
    resetFilters,
  };
};
