import type { UseFetchOptions } from "nuxt/app";
import type { IssueItem } from "~/data/issues";
import { useResource, type ResourceResponse } from "./useResource";
import type { QueryParams } from "./useTableQuery";

export { type UpdateSortPayload } from "./useResource";

export const useIssues = (
  initialParams?: Partial<QueryParams<IssueItem>>,
  options?: UseFetchOptions<ResourceResponse<IssueItem>>
) => {
  return useResource("/api/issues", {
    ...initialParams, pageSize: 7,
  }, options);
};

