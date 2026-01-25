import type { UseFetchOptions } from "nuxt/app";

import {
  useTableQuery,
  type QueryParams,
  type UpdateSortPayload,
} from "./useTableQuery";

export interface ResourceResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export { type UpdateSortPayload };

export const useResource = <T>(
  endpoint: string,
  initialParams?: Partial<QueryParams<T>>,
  options?: UseFetchOptions<ResourceResponse<T>>
) => {
  const { 
    queryParams, 
    updateSort, 
    updatePage, 
    updatePageSize, 
    resetFilters 
  } =
    useTableQuery<T>({ pageSize: 5, ...initialParams });

  const { data, status, error, refresh } = useFetch<ResourceResponse<T>>(
    endpoint,
    {
      params: queryParams,
      ...options,
    }
  );

  return {
    queryParams,
    data,
    status,
    error,
    updateSort,
    updatePage,
    updatePageSize,
    resetFilters,
    refresh,
  };
};
